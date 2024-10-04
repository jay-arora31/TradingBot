require('dotenv').config();
const express = require('express');
const TradingBot = require('./src/tradingBot');
const { setupMockAPI } = require('./src/mockAPI');
const logger = require('./src/utils/logger');

const app = express();
const PORT = 3000;

// Initialize trading bot
const tradingBot = new TradingBot({
    initialBalance: 10000,
    buyThreshold: -0.02, // 2% drop
    sellThreshold: 0.03, // 3% rise
    stockSymbol: 'AAPL'
});

// Start the server
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
    setupMockAPI();
});

// Endpoints for monitoring
app.get('/status', (req, res) => {
    res.json(tradingBot.getStatus());
});

app.get('/performance', (req, res) => {
    res.json(tradingBot.getPerformanceReport());
});

// endpoints to start and stop the trading bot
app.post('/start', async (req, res) => {
    await tradingBot.startTrading();
    res.json({ message: 'Trading bot started' });
});

app.post('/stop', async (req, res) => {
    await tradingBot.stopTrading();
    res.json({ message: 'Trading bot stopped' });
});
