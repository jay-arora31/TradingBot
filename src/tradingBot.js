const logger = require('./utils/logger');
const { getMockPrice } = require('./mockAPI');

class TradingBot {
    constructor(config) {
        this.balance = config.initialBalance;
        this.buyThreshold = config.buyThreshold;
        this.sellThreshold = config.sellThreshold;
        this.stockSymbol = config.stockSymbol;
        this.positions = []; // Positions held
        this.trades = []; // Trade history
        this.lastPrice = null; // Last price of the stock
        this.lastBuyPrice = null; // Last buy price
        this.movingAverages = {
            short: [],
            long: []
        };
        this.prices = [];
        this.isTrading = true; // To track if bot is currently trading
    }

    async startTrading() {
        logger.info('Trading bot started');
        this.tradingInterval = setInterval(async () => {
            if (this.isTrading) {
                try {
                    await this.executeTradeLogic();
                } catch (error) {
                    logger.error('Error in trading logic:', error);
                }
            }
        }, 1000); // Check every second
    }

    async executeTradeLogic() {
        const currentPrice = await getMockPrice(this.stockSymbol);

        if (!this.lastPrice) {
            this.lastPrice = currentPrice;
            return;
        }

        // Track prices for moving averages and VWAP calculations
        this.prices.push(currentPrice);
        if (this.prices.length > 100) {
            this.prices.shift();
        }

        // Update moving averages
        this.updateMovingAverages(currentPrice);

        // Check strategies
        const shouldBuyMA = this.checkMovingAverageCrossover();
        const shouldBuyMomentum = this.checkMomentumTrading();
        const shouldBuyThreshold = this.checkThresholdBuy(currentPrice);
        const shouldBuyVWAP = this.checkVWAPBuy(currentPrice);

        const shouldSellThreshold = this.checkThresholdSell(currentPrice);
        const shouldSellVWAP = this.checkVWAPSell(currentPrice);

        // Count buy and sell signals
        const buySignals = [shouldBuyMA, shouldBuyMomentum, shouldBuyThreshold, shouldBuyVWAP].filter(Boolean);
        const sellSignals = [shouldSellThreshold, shouldSellVWAP].filter(Boolean);

        // Execute buy if sufficient buy signals and can afford
        if (buySignals.length >= 2 && this.canBuy(currentPrice)) {
            this.executeBuy(currentPrice);
        } 
        // Execute sell if sufficient sell signals and have positions
        else if (sellSignals.length >= 1 && this.positions.length > 0) {
            this.executeSell(currentPrice);
        }

        this.lastPrice = currentPrice;
    }

    updateMovingAverages(price) {
        this.movingAverages.short.push(price);
        this.movingAverages.long.push(price);

        if (this.movingAverages.short.length > 10) {
            this.movingAverages.short.shift();
        }
        if (this.movingAverages.long.length > 20) {
            this.movingAverages.long.shift();
        }
    }

    checkMovingAverageCrossover() {
        if (this.movingAverages.short.length < 10 || this.movingAverages.long.length < 20) {
            return false;
        }

        const shortMA = this.calculateAverage(this.movingAverages.short);
        const longMA = this.calculateAverage(this.movingAverages.long);

        // Check for crossover
        return (shortMA > longMA && !this.wasLastTradeBuy()) || (shortMA < longMA && this.wasLastTradeBuy());
    }

    checkMomentumTrading() {
        if (this.prices.length < 20) {
            return false;
        }

        const avgPrice = this.calculateAverage(this.prices.slice(-20));

        // Check for momentum signals
        return (this.lastPrice > avgPrice && !this.wasLastTradeBuy()) || (this.lastPrice < avgPrice && this.wasLastTradeBuy());
    }

    checkThresholdBuy(currentPrice) {
        if (!this.lastBuyPrice) {
            this.lastBuyPrice = currentPrice;
            return false;
        }

        const priceChange = (currentPrice - this.lastBuyPrice) / this.lastBuyPrice;
        return priceChange <= this.buyThreshold;
    }

    checkThresholdSell(currentPrice) {
        if (!this.lastBuyPrice) {
            return false;
        }

        const priceChange = (currentPrice - this.lastBuyPrice) / this.lastBuyPrice;
        return priceChange >= this.sellThreshold;
    }

    checkVWAPBuy(currentPrice) {
        const vwap = this.calculateVWAP();
        return currentPrice < vwap && !this.wasLastTradeBuy();
    }

    checkVWAPSell(currentPrice) {
        const vwap = this.calculateVWAP();
        return currentPrice > vwap && this.wasLastTradeBuy();
    }

    calculateAverage(prices) {
        return prices.reduce((a, b) => a + b, 0) / prices.length;
    }

    calculateVWAP() {
        const volumes = this.prices.map(() => 1); // Simplified to equal volumes
        const totalVolume = volumes.reduce((a, b) => a + b, 0);
        const vwap = this.prices.reduce((sum, price, index) => sum + price * volumes[index], 0) / totalVolume;
        return vwap;
    }

    canBuy(currentPrice) {
        return this.balance >= currentPrice;
    }

    executeBuy(price) {
        const quantity = 1; // Simplified: buy 1 share at a time
        const cost = price * quantity;

        this.balance -= cost;
        this.positions.push({
            quantity,
            buyPrice: price,
            timestamp: new Date()
        });

        this.trades.push({
            type: 'BUY',
            price,
            quantity,
            timestamp: new Date()
        });

        this.lastBuyPrice = price;
        logger.info(`Bought ${quantity} shares at $${price}`);
    }

    executeSell(price) {
        const position = this.positions.shift();
        const revenue = price * position.quantity;
        this.balance += revenue;

        this.trades.push({
            type: 'SELL',
            price,
            quantity: position.quantity,
            profit: revenue - (position.buyPrice * position.quantity),
            timestamp: new Date()
        });

        logger.info(`Sold ${position.quantity} shares at $${price}`);
    }

    wasLastTradeBuy() {
        return this.trades.length > 0 && this.trades[this.trades.length - 1].type === 'BUY';
    }

    getStatus() {
        const totalProfitLoss = this.trades
            .filter(trade => trade.type === 'SELL')
            .reduce((sum, trade) => sum + trade.profit, 0);

        return {
            balance: this.balance,
            positions: this.positions,
            lastPrice: this.lastPrice,
            totalTrades: this.trades.length,
            isTrading: this.isTrading,
            totalProfitLoss // Include overall profit and loss
        };
    }

    getPerformanceReport() {
        const totalProfitLoss = this.trades
            .filter(trade => trade.type === 'SELL')
            .reduce((sum, trade) => sum + trade.profit, 0);

        return {
            initialBalance: 10000, // Use the starting balance
            currentBalance: this.balance,
            totalTrades: this.trades.length,
            totalProfitLoss,
            trades: this.trades // Include the detailed trade history
        };
    }

    stopTrading() {
        this.isTrading = false; // Stop the trading bot
        clearInterval(this.tradingInterval);
        logger.info('Trading bot stopped');
    }

    startTrading() {
        this.isTrading = true; // Start the trading bot
        this.tradingInterval = setInterval(async () => {
            try {
                await this.executeTradeLogic();
            } catch (error) {
                logger.error('Error in trading logic:', error);
            }
        }, 1000);
        logger.info('Trading bot started');
    }
}

module.exports = TradingBot;
