import React, { useState, useEffect } from 'react';
import { getStocks, getStockPriceHistory } from '../services/api';
import { getCachedData, setCachedData } from '../utils/cache';
import { pearsonCorrelation } from '../utils/math';
import { TextField, Button } from '@mui/material';
import { debounce } from 'lodash';

const CorrelationHeatmap = () => {
  const [stocks, setStocks] = useState([]);
  const [minutes, setMinutes] = useState(10);
  const [correlationMatrix, setCorrelationMatrix] = useState([]);
  const [stockData, setStockData] = useState({});

  useEffect(() => {
    const fetchStocks = async () => {
      const cachedStocks = getCachedData('stocks');
      if (cachedStocks) {
        setStocks(cachedStocks);
      } else {
        const data = await getStocks();
        setStocks(data);
        setCachedData('stocks', data);
      }
    };
    fetchStocks();
  }, []);

  const fetchAllStockData = debounce(async () => {
    const stockTickers = Object.values(stocks);
    const stockPrices = {};
    for (const ticker of stockTickers) {
      const cacheKey = `${ticker}-${minutes}`;
      let data = getCachedData(cacheKey);
      if (!data) {
        data = await getStockPriceHistory(ticker, minutes);
        setCachedData(cacheKey, data);
      }
      stockPrices[ticker] = data.map((entry) => parseFloat(entry.price));
    }
    setStockData(stockPrices);
    calculateCorrelationMatrix(stockPrices, stockTickers);
  }, 500);

  const calculateCorrelationMatrix = (stockPrices, tickers) => {
    const matrix = tickers.map((tickerX) =>
      tickers.map((tickerY) => {
        if (tickerX === tickerY) return 1;
        const pricesX = stockPrices[tickerX];
        const pricesY = stockPrices[tickerY];
        if (!pricesX || !pricesY || pricesX.length !== pricesY.length) return 0;
        return pearsonCorrelation(pricesX, pricesY);
      })
    );
    setCorrelationMatrix(matrix);
  };

  const getColor = (value) => {
    if (value === 1) return '#ffffff';
    const r = Math.floor(255 * (1 - value));
    const g = Math.floor(255 * value);
    return `rgb(${r}, ${g}, 0)`;
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Correlation Heatmap</h2>
      <TextField
        label="Minutes"
        type="number"
        value={minutes}
        onChange={(e) => setMinutes(e.target.value)}
        style={{ margin: '10px' }}
      />
      <Button variant="contained" onClick={fetchAllStockData} style={{ margin: '10px' }}>
        Generate Heatmap
      </Button>
      {correlationMatrix.length > 0 && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', margin: '20px 0' }}>
            <thead>
              <tr>
                <th></th>
                {Object.values(stocks).map((ticker) => (
                  <th key={ticker} style={{ padding: '10px', border: '1px solid #ccc' }}>
                    {ticker}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {correlationMatrix.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                    {Object.values(stocks)[rowIndex]}
                  </td>
                  {row.map((value, colIndex) => (
                    <td
                      key={colIndex}
                      style={{
                        padding: '10px',
                        border: '1px solid #ccc',
                        backgroundColor: getColor(value),
                        color: value === 1 ? '#000' : '#fff',
                        textAlign: 'center',
                      }}
                    >
                      {value.toFixed(2)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CorrelationHeatmap;