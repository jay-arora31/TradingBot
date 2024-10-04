const logger = require('./utils/logger');

let mockPrice = 150; // Starting price
let mockPrices = {};

function setupMockAPI() {
    // Update prices every second
    setInterval(() => {
        // Simulate random price movements
        const change = (Math.random() - 0.5) * 0.02 * mockPrice; // Change up to +/- 2% of the current price
        mockPrice = Math.max(0, mockPrice + change);
        mockPrices['AAPL'] = mockPrice;
        
        logger.debug(`New mock price: $${mockPrice.toFixed(2)}`);
    }, 1000); // Update every second
}

async function getMockPrice(symbol) {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockPrices[symbol] || mockPrice;
}

module.exports = {
    setupMockAPI,
    getMockPrice
};
