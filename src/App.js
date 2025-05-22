import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const authPayload = {
  email: "2200031191cseh@gmail.com",
  name: "sanivarapu kavya sree",
  rollNo: "2200031191",
  accessCode: "beTJjJ",
  clientID: "aa3c0870-6e04-453b-9ca1-68a55f70e180",
  clientSecret: "mPNRaYekuuRwnpPu"
};

function ApiCaller({ apiUrl, title, token }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const callApi = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setData(response.data);
    } catch (err) {
      console.error('API call error:', err);
      setError('Error fetching data');
    }
    setLoading(false);
  };

  return (
    <div className="api-card" onClick={callApi} tabIndex={0} role="button" onKeyPress={(e) => { if (e.key === 'Enter') callApi(); }}>
      <h3>{title}</h3>
      <button className="api-button">Call API</button>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {data && <pre className="api-data">{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}

function Calculator() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);

  const handleClick = (value) => {
    setInput((prev) => prev + value);
  };

  const handleClear = () => {
    setInput('');
    setResult(null);
  };

  const handleCalculate = () => {
    try {
      // eslint-disable-next-line no-eval
      const evalResult = eval(input);
      setResult(evalResult);
    } catch {
      setResult('Error');
    }
  };

  return (
    <div className="calculator">
      <input type="text" value={input} readOnly className="calc-input" />
      <div className="calc-buttons">
        {'1234567890+-*/.'.split('').map((char) => (
          <button key={char} onClick={() => handleClick(char)} className="calc-button">
            {char}
          </button>
        ))}
        <button onClick={handleClear} className="calc-button clear-button">C</button>
        <button onClick={handleCalculate} className="calc-button equals-button">=</button>
      </div>
      {result !== null && <div className="calc-result">Result: {result}</div>}
    </div>
  );
}

function App() {
  const [token, setToken] = useState(null);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await axios.post('http://20.244.56.144/evaluation-service/auth', authPayload);
        setToken(response.data.access_token);
      } catch (err) {
        console.error('Auth error:', err);
        setAuthError('Failed to authenticate');
      }
    };
    fetchToken();
  }, []);

  if (authError) {
    return <div className="App"><h1>{authError}</h1></div>;
  }

  if (!token) {
    return <div className="App"><h1>Authenticating...</h1></div>;
  }

  return (
    <div className="App">
      <h1>Number APIs Frontend</h1>
      <div className="api-container">
        <ApiCaller apiUrl="http://20.244.56.144/evaluation-service/primes" title="Get Primes" token={token} />
        <ApiCaller apiUrl="http://20.244.56.144/evaluation-service/even" title="Get Even Numbers" token={token} />
      </div>
      <h2>Calculator</h2>
      <Calculator />
    </div>
  );
}

export default App;
