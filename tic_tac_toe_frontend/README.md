# Tic Tac Toe React Frontend

This project is a modern React application for playing Tic Tac Toe in your browser.

## Features

- **Interactive 3x3 Grid:** Play Tic Tac Toe with clear, clickable squares.
- **Player vs Player or Computer:** Choose to play against another person or a simple AI.
- **Win/Loss/Draw Detection:** Instantly shows who wins, loses, or if the game ends in a draw, with visual highlight.
- **Score Tracking:** Session-based score and draw count for both players.
- **Restart Game:** One-click restart without page refresh.
- **Responsive Layout:** Works beautifully on desktop and mobile, always centered, with a clean modern light theme.
- **Accessible:** Keyboard/tab support, semantic markup, status updates.

## Color Theme

- **Primary:** #1976d2 (Blue, for X/Player 1)
- **Secondary:** #424242 (Dark grey, for O/Player 2/Computer)
- **Accent:** #ffd600 (Yellow, for highlights such as win/draw)

All styling uses only vanilla CSS for maximum performance and clarity.

## Running Locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the local development server:

   ```bash
   npm start
   ```

   Then open [http://localhost:3000](http://localhost:3000) in your browser.

3. Run tests (optional):

   ```bash
   npm test
   ```

## File Overview

- `src/App.js`: Main app logic and UI for the Tic Tac Toe game
- `src/App.css`: Custom styles, layout, and responsive design for the game
- `src/index.js`: React entry point

## Customization

You can tweak colors in `src/App.css` at the top, or adjust layout and margins as needed for your own use case!

## License

MIT
