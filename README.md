# Phantom Wallet Chrome Extension

A Chrome extension built with TypeScript that allows users to connect with their Phantom wallet.

## Features

- Connect to Phantom wallet
- View wallet connection status
- Display wallet address
- Disconnect from wallet
- Error handling and user feedback

## Installation

1. Clone this repository
2. Install dependencies:
```bash
npm install
```
3. Build the extension:
```bash
npm run build
```
4. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder from this project

## Development

To start development with hot-reload:
```bash
npm run dev
```

## Technologies Used

- TypeScript
- Webpack
- Chrome Extensions API
- Phantom Wallet SDK

## License

MIT
