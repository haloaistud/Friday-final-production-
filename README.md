# Friday AI Mobile

A React Native mobile app powered by Gemini AI, built with Expo. This is a migration of the original web app to a native mobile experience.

## Features

- **💬 Chat Interface**: Text-based conversations with Gemini AI
- **⚡ Live Mode**: Audio-based interactions (coming soon)
- **💾 Memory Core**: Store and retrieve conversation history
- **🔍 Web Search**: Grounding with live web search results
- **📱 Cross-Platform**: iOS, Android, and Web support

## Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- Gemini API Key from [Google AI Studio](https://aistudio.google.com)

## Installation

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd friday-repo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.local.example .env.local
   ```
   Edit `.env.local` and add your Gemini API key:
   ```
   EXPO_PUBLIC_GEMINI_API_KEY=your_api_key_here
   ```

## Running the App

### Web
```bash
npm run dev
```

### iOS
```bash
npm run ios
```

### Android
```bash
npm run android
```

## Project Structure

```
app/
  _layout.tsx           ← Root layout
  (tabs)/
    _layout.tsx         ← Tab navigation
    chat.tsx            ← Chat screen
    live.tsx            ← Live mode screen
    memory.tsx          ← Memory/history screen
components/             ← Reusable components (legacy)
services/               ← API services
utils/                  ← Utilities
global.css              ← Tailwind directives
tailwind.config.js      ← Tailwind configuration
app.config.ts           ← Expo configuration
```

## Building

### Web
```bash
npm run build
```

### Native (requires EAS)
```bash
eas build --platform ios
eas build --platform android
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `EXPO_PUBLIC_GEMINI_API_KEY` | Gemini API key for mobile/web |
| `API_KEY` | Fallback API key for web |

## Tech Stack

- **React Native** 0.81
- **Expo** 54
- **TypeScript** 5
- **Tailwind CSS** (via NativeWind)
- **Google GenAI SDK**
- **React Navigation**

## Migration Notes

This app was migrated from a web-based React + Vite application to React Native. Key changes:

- Web components converted to React Native components
- Tailwind CSS adapted for mobile via NativeWind
- Gemini API integration preserved
- Tab-based navigation for mobile UX
- Local storage via AsyncStorage

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m "feat: add your feature"`
3. Push to branch: `git push origin feature/your-feature`
4. Open a Pull Request

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
