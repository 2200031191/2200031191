import React, { useState, useEffect } from 'react';
import { getStocks, getStockPriceHistory } from '../services/api';
import { getCachedData, setCachedData } from '../utils/cache';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { TextField, Button, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { debounce } from 'lodash';

const StockPage = () => {
  const [stocks, setStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState('');
  const [minutes, setMinutes] = useState(10);
  const [priceData, setPriceData] = useState([]);
  const [averagePrice, setAveragePrice] = useState(null);

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

  const fetchPriceHistory = debounce(async () => {
    if (!selectedStock) return;
    const cacheKey = `${selectedStock}-${minutes}`;
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      setPriceData(cachedData);
      calculateAverage(cachedData);
    } else {
      const data = await getStockPriceHistory(selectedStock, minutes);
      setPriceData(data);
      setCachedData(cacheKey, data);
      calculateAverage(data);
    }
  }, 500);

  const calculateAverage = (data) => {
    if (data.length === 0) return;
    const total = data.reduce((sum, entry) => sum + parseFloat(entry.price), 0);
    const avg = total / data.length;
    setAveragePrice(avg);
  };

  const chartData = priceData.map((entry) => ({
    time: new Date(entry.lastUpdatedAt).toLocaleTimeString(),
    price: parseFloat(entry.price),
  }));

  const averageLineData = chartData.map((entry) => ({
    time: entry.time,
    average: averagePrice,
  }));

  return (
    <div style={{ padding: '20px' }}>
      <h2>Stock Price Chart</h2>
      <FormControl style={{ margin: '10px', minWidth: 200 }}>
        <InputLabel>Select Stock</InputLabel>
        <Select
          value={selectedStock}
          onChange={(e) => setSelectedStock(e.target.value)}
          label="Select Stock"
        >
          {Object.entries(stocks).map(([name, ticker]) => (
            <MenuItem key={ticker} value={ticker}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        label="Minutes"
        type="number"
        value={minutes}
        onChange={(e) => setMinutes(e.target.value)}
        style={{ margin: '10px' }}
      />
      <Button variant="contained" onClick={fetchPriceHistory} style={{ margin: '10px' }}>
        Fetch Price History
      </Button>
      {chartData.length > 0 && (
        <>
          <LineChart width={800} height={400} data={chartData} style={{ margin: '20px 0' }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="price" stroke="#8884d8" name="Price" />
            {averagePrice && (
              <Line
                type="monotone"
                data={averageLineData}
                dataKey="average"
                stroke="#ff7300"
                name="Average Price"
                dot={false}
              />
            )}
          </LineChart>
          <p>Average Price: {averagePrice?.toFixed(2)}</p>
        </>
      )}
    </div>
  );
};

export default StockPage;