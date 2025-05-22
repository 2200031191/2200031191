import React, { useState } from 'react';
import StockPage from './pages/StockPage';
import CorrelationHeatmap from './pages/CorrelationHeatmap';
import ErrorBoundary from './components/ErrorBoundary';
import { Button } from '@mui/material';
import './App.css';

function App() {
  const [view, setView] = useState('stock');

  return (
    <ErrorBoundary>
      <div className="App">
        <h1>Stock Price Aggregator</h1>
        <div>
          <Button onClick={() => setView('stock')} variant="contained" style={{ margin: '10px' }}>
            Stock Page
          </Button>
          <Button onClick={() => setView('heatmap')} variant="contained" style={{ margin: '10px' }}>
            Correlation Heatmap
          </Button>
        </div>
        {view === 'stock' ? <StockPage /> : <CorrelationHeatmap />}
      </div>
    </ErrorBoundary>
  );
}

export default App;