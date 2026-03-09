# AI Prediction Project

This is a Python-based AI prediction project for building and deploying machine learning models for prediction market analysis.

## Project Structure

```
AmazonNovaMarket/
├── src/                    # Source code directory
│   ├── api.py             # Flask API service
│   ├── polymarket_api.py  # Polymarket data fetcher and AI predictor
│   ├── volcengine_ai.py   # Amazon Nova AI client
│   └── contract_interaction.py  # Smart contract interaction
├── agents_config.ini      # AI agent configurations
├── config.ini             # API keys and configurations
├── requirements.txt       # Project dependencies
└── README.md              # Project documentation
```

## Features

- **Prediction Market Data Fetching**: Automatically fetches event data from Polymarket
- **AI Agent Predictions**: Multiple AI agents with different specialties (Geopolitics, Tech, Finance, ESG)
- **Blockchain Integration**: Stores predictions on-chain via smart contracts
- **REST API**: Provides API endpoints for querying event data
- **News Integration**: Fetches relevant news for AI analysis

## Installation

1. Clone the project to your local machine
2. Install dependencies

```bash
pip install -r requirements.txt
```

3. Configure your API keys in `config.ini`:
   - Ethereum RPC URL and private key
   - Amazon Nova API key
   - Pinata API key (for IPFS)
   - NewsAPI key

## Usage

### Start the API Server

```bash
python src/api.py
```

The API will be available at `http://localhost:8000`

### Start the Data Fetcher and Predictor

```bash
python src/polymarket_api.py
```

This will:
1. Fetch events from Polymarket
2. Generate AI predictions for each event
3. Store predictions on the blockchain

### Query Events via API

```bash
# Get all events
curl http://localhost:8000/api/events

# Get specific event
curl http://localhost:8000/api/events?id=<event_id>

# Filter by domain
curl http://localhost:8000/api/events?domain=Geopolitics

# Filter by status (1: active, 2: closed)
curl http://localhost:8000/api/events?status=1
```

### Add AI Agents to Smart Contract

```bash
python add_ai_agent.py
```

## AI Agents

The system includes 4 specialized AI agents:

1. **Yang Yongqi** - Political Economy Expert (Geopolitics, International Relations)
2. **Zhang Ziyue** - Tech Trend Analyst (AI, Machine Learning, Tech Trends)
3. **Zhao Xin** - Financial Market Analyst (Stock Market, Investment Strategy)
4. **Han Jiarui** - Environmental & Sustainability Expert (Climate Change, ESG)

## Development

Use the following tools for code quality:

```bash
# Code formatting
black src tests

# Import sorting
isort src tests

# Code linting
flake8 src tests
```

## Contributing

Pull Requests and Issues are welcome!

## License

MIT License
