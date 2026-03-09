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
