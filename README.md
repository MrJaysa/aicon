# Vue Genkit Chat Application

A lightweight, real-time AI chat application built with Vue 3, Genkit for AI orchestration, Tailwind CSS for styling, and shadcn-vue for UI components.

The application runs as a single Node.js application, integrating the Vue frontend, backend logic, and Genkit AI functionality without requiring separate servers or services.

## Features

- AI-powered conversations using Genkit.
- Real-time chat interface.
- Single integrated Node.js server for frontend and backend.
- Session-based conversations with no database or persistent message storage.
- New Chat functionality to clear the current conversation and start a fresh one.
- Modern, responsive UI built with Tailwind CSS and shadcn-vue.
- Type-safe development using TypeScript.
- Support for configurable AI models and providers.

## Tech Stack

- **Frontend:** Vue 3
- **Backend:** Node.js
- **AI Framework:** Genkit (Node.js)
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **UI Components:** shadcn-vue
- **Icons:** Lucide Vue Next
- **Communication:** HTTP / WebSockets, where required
- **Storage:** In-memory session state (no database)

## Prerequisites

Before getting started, ensure you have the following installed:

- Node.js (v20 or higher recommended)
- npm, pnpm, or yarn
- An LLM provider API key (e.g., Gemini API key or OpenAI API key)

## Project Setup

Create the Vue 3 project:

```bash
npm create vue@latest
```

Navigate into the project directory and install dependencies:

```bash
cd your-project
npm install
```

## Tailwind CSS & shadcn-vue Setup

Install Tailwind CSS and its dependencies:

```bash
npm install tailwindcss @tailwindcss/cli
```

Add the plugin to your vite.config.ts (or .js) file:

```bash
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
})

```

Initialize shadcn-vue:

```bash
npx shadcn-vue@latest init
```

Initialize shadcn-vue:

```bash
npx shadcn-vue@latest init
```

## Genkit Setup

Install Genkit and the required model provider integration.

For example, using Google Gemini:

```bash
npm install genkit @genkit-ai/googleai
```

Configure Genkit in the Node.js backend and define AI flows for handling chat requests.

## Environment Variables

Create a `.env` file in the project root and configure your AI provider credentials:

```env
GEMINI_API_KEY=your_api_key_here
```

Keep API keys on the server. Never expose them in the Vue frontend.

## Development

Start the integrated application in development mode:

```bash
npm run dev
```

The development setup should support both the Vue frontend and the Node.js backend.

## Production Build

Compile and optimize the application:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

## Genkit Developer UI

To inspect and test Genkit flows during development, you can run the Genkit Developer UI separately:

```bash
npx genkit start
```

This is an optional development tool and does not require a separate production server.

## Conversation Management

Conversations are maintained in memory and are not stored in a database.

- Starting a new chat clears the current conversation.
- Messages are not persisted across page reloads.
- No conversation history is retained after the application session ends.

## License

This project is open-source and available under the MIT License.

# ai-chat-app
