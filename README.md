# Trading Bot

A simple trading bot built with Node.js that uses mock stock prices to demonstrate trading strategies, including moving averages, momentum trading, and VWAP. The bot can buy and sell shares of a specified stock and tracks its performance over time.


## Trading Strategies Used

### 1. Moving Average Crossover
- **Description**: This strategy uses two different moving averages (short-term and long-term) to determine potential buy or sell signals. When the short-term moving average crosses above the long-term moving average, it indicates a potential buy signal, suggesting that the stock's price may continue to rise. Conversely, when the short-term moving average crosses below the long-term moving average, it signals a potential sell opportunity.
- **Why I Used It**: The moving average crossover strategy is a widely recognized method for identifying trends. It helps filter out noise from price fluctuations and provides clear signals for entering or exiting trades. This strategy is particularly effective in trending markets, allowing the bot to capitalize on upward or downward movements.

### 2. Momentum Trading
- **Description**: Momentum trading involves analyzing the speed of price movements to determine whether to buy or sell. The strategy looks at recent price changes and compares them to a longer-term average price. If the current price is significantly above the average, it suggests strong upward momentum, while a price below the average indicates downward momentum.
- **Why I Used It**: Momentum trading can capture quick price movements and is beneficial in volatile markets. It allows the bot to react swiftly to price changes, maximizing profits during strong trends. This strategy complements the moving average approach by providing additional confirmation of trade signals.

### 3. Threshold Buy/Sell
- **Description**: This strategy sets specific percentage thresholds for buying and selling. A buy occurs when the current price drops by a specified percentage (buy threshold) from the last buy price, while a sell is triggered when the price rises by a certain percentage (sell threshold) above the last buy price.
- **Why I Used It**: The threshold strategy provides clear, quantifiable criteria for making trades, reducing emotional decision-making. It helps the bot capitalize on short-term price corrections, enabling it to buy low and sell high. This strategy is particularly effective for swing trading.

### 4. Volume-Weighted Average Price (VWAP)
- **Description**: VWAP is a trading benchmark that considers the average price a stock has traded throughout the day, based on both volume and price. The bot compares the current price to the VWAP to determine potential buy or sell signals. Buying occurs when the current price is below the VWAP, and selling happens when it is above.
- **Why I Used It**: VWAP is a crucial indicator for traders, as it provides insight into the market's average price, considering trade volume. Using VWAP helps the bot make informed trading decisions, as it aligns trades with the overall market trend. It enhances the bot's ability to identify undervalued or overvalued positions.

### Conclusion
The combination of these strategies allows the trading bot to make informed decisions based on a comprehensive analysis of market conditions. By leveraging multiple technical indicators, the bot can effectively navigate various market scenarios, improving the likelihood of successful trades. These strategies collectively enhance the bot's ability to adapt to changing market dynamics, thereby optimizing its performance and profitability.


## Features

- **Real-time Price Fetching**: Uses a mock API to simulate real-time price fetching for stock trading.
- **Multiple Trading Strategies**: Implements various strategies, including:
  - Moving Average Crossover
  - Momentum Trading
  - Threshold-based Buying and Selling
  - VWAP (Volume Weighted Average Price) analysis
- **Trade Logging**: Keeps track of all trades and their details.
- **Balance Management**: Automatically manages user balance based on trades made.

## Technologies Used

- Node.js
- Express.js
- dotenv
- [Mock API](#mock-api) for simulating stock prices
- Logger for monitoring the bot's actions

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- npm (Node package manager)

### Installation

1. Clone the repository:

 ```bash
 git clone https://github.com/jay-arora31/TradingBot/.git
 cd TradingBot
 ```
2.To install the necessary dependencies, run the following command:

  ```bash
  npm install
  ```
3.Running the Application


  ```bash
  node index.js  or npm start
  ```


## API Endpoints

### Start Trading Endpoint
**POST** `/start`

- **Description:** Starts the trading bot.
- **Response:** JSON object confirming that the trading bot has started.
![Screenshot from 2024-10-04 23-21-02](https://github.com/user-attachments/assets/cf001554-7a63-4646-857d-f262ccff0d95)


### Status Endpoint
**GET** `/status`

- **Description:** Returns the current status of the trading bot, including balance and active positions.
- **Response:** JSON object with the bot's current status.
![Screenshot from 2024-10-04 23-25-49](https://github.com/user-attachments/assets/76f770e6-1145-4475-a109-cfcd26b5dfc6)
![Screenshot from 2024-10-04 23-26-13](https://github.com/user-attachments/assets/ffca18e0-0d32-42ba-b8f6-c517b0e6f684)

### Performance Endpoint
**GET** `/performance`

- **Description:** Provides a detailed performance report of the trading bot, including trades made and total profit/loss.
- **Response:** JSON object with performance metrics.
![Screenshot from 2024-10-04 23-21-45](https://github.com/user-attachments/assets/08cadca4-8b11-4222-80b5-4b6e6878a841)


### Stop Trading Endpoint
**POST** `/stop`

- **Description:** Stops the trading bot.
- **Response:** JSON object confirming that the trading bot has stopped.
  ![Screenshot from 2024-10-04 23-27-32](https://github.com/user-attachments/assets/0cf3f067-2024-457a-8661-ac4a6d09b0e1)





