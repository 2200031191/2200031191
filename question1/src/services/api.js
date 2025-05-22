import axios from 'axios';

const ACCESS_CODE = 'beTJjJ';

const mockStocks = {
  "stocks": {
    "Advanced Micro Devices, Inc.": "AMD",
    "Alphabet Inc. Class A": "GOOGL",
    "Alphabet Inc. Class C": "GOOG",
    "Amazon.com, Inc.": "AMZN",
    "Amgen Inc.": "AMGN",
    "Apple Inc.": "AAPL",
    "Berkshire Hathaway Inc.": "BRKB",
    "Booking Holdings Inc.": "BKNG",
    "Broadcom Inc.": "AVGO",
    "CSX Corporation": "CSX",
    "Eli Lilly and Company": "LLY",
    "Marriott International, Inc.": "MAR",
    "Marvell Technology, Inc.": "MRVL",
    "Meta Platforms, Inc.": "META",
    "Microsoft Corporation": "MSFT",
    "NVIDIA Corporation": "NVDA",
    "PayPal Holdings, Inc.": "PYPL",
    "TSMC": "2330TW",
    "Tesla, Inc.": "TSLA"
  }
};

const mockPriceHistory = [
  { "price": "666.66595", "lastUpdatedAt": "2025-05-22T06:00:00.465760306Z" },
  { "price": "212.94439", "lastUpdatedAt": "2025-05-22T06:01:00.465210105Z" },
  { "price": "163.42203", "lastUpdatedAt": "2025-05-22T06:02:00.465542126Z" },
  { "price": "231.95296", "lastUpdatedAt": "2025-05-22T06:03:00.46584912Z" },
  { "price": "124.95156", "lastUpdatedAt": "2025-05-22T06:04:00.465940341Z" },
  { "price": "459.09558", "lastUpdatedAt": "2025-05-22T06:05:00.464887447Z" },
  { "price": "998.27924", "lastUpdatedAt": "2025-05-22T06:06:00.464903660Z" }
];

export const getStocks = async () => {
  try {
    const url = `/stocks/list?accessCode=${ACCESS_CODE}`;
    console.log('Fetching stocks from URL:', url);
    const response = await axios.get(url);
    console.log('Stocks API response:', response.data);
    return response.data.stocks;
  } catch (error) {
    console.error('Error fetching stocks:', error.message);
    if (error.response) {
      console.log('Response status:', error.response.status);
      console.log('Response data:', error.response.data);
      console.log('Response headers:', error.response.headers);
    }
    return mockStocks.stocks;
  }
};

export const getStockPriceHistory = async (ticker, minutes) => {
  try {
    const url = `/stocks/price/${ticker}?minutes=${minutes}&accessCode=${ACCESS_CODE}`;
    console.log(`Fetching price history from URL: ${url}`);
    const response = await axios.get(url);
    console.log(`Price history API response for ${ticker}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching price history for ${ticker}:`, error.message);
    if (error.response) {
      console.log('Response status:', error.response.status);
      console.log('Response data:', error.response.data);
      console.log('Response headers:', error.response.headers);
    }
    return mockPriceHistory;
  }
};