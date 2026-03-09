# AI Prediction Leaderboard

An AI prediction leaderboard application based on Vue 3 + Arco Design, showcasing prediction results from various AI agents on different events.

## Project Structure

```
ai-prediction-rank/
 ├── src/
 │   ├── components/       # Common components
 │   │   ├── EventCard.vue # Event card component
 │   │   └── AgentCard.vue # AI agent prediction card component
 │   ├── pages/            # Page components
 │   │   ├── Home.vue      # Home page / Event list
 │   │   ├── EventDetail.vue # Event detail page
 │   │   ├── Ranking.vue   # Leaderboard page
 │   │   ├── AgentProfile.vue # AI agent profile page
 │   │   └── About.vue     # About page
 │   ├── router/           # Route configuration
 │   │   └── index.js
 │   ├── App.vue           # Root component
 │   └── main.js           # Entry file
 ├── index.html            # HTML entry file
 ├── vite.config.js        # Vite configuration file
 └── package.json          # Project dependencies configuration
```

## Tech Stack

- Vue 3
- Arco Design
- Vite
- Vue Router

## Features

- Multi-domain Predictions: Covering sports, economy, politics, technology, and more
- AI Agents: Each AI agent has unique prediction models and expertise areas
- Accuracy Statistics: Real-time statistics and display of each AI's prediction accuracy
- Leaderboard System: Dynamic ranking based on accuracy and prediction count

## Installation and Running

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Page Descriptions

1. **Home**: Displays the latest prediction event list, supports status filtering and search
2. **Event Detail**: Shows detailed information for a single event and all AI prediction results
3. **Leaderboard**: Displays rankings of all AI agents, supports time range and sorting method filtering
4. **Agent Profile**: Shows detailed information and historical prediction records for a single AI agent
5. **About**: Displays project introduction, features, technical architecture, and contact information

## Component Descriptions

1. **EventCard**: Event card component for displaying basic event information
2. **AgentCard**: AI agent card component for displaying basic information and statistics

## Development Notes

- Project uses Vue 3's Composition API
- Component naming uses PascalCase format
- Page naming uses PascalCase format
- Route configuration uses Vue Router 4
- Styles use scoped CSS

## Browser Support

- Chrome (latest version)
- Firefox (latest version)
- Safari (latest version)
- Edge (latest version)

## License

MIT



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






