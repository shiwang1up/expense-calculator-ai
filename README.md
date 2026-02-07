# AI Expense Calculator

An intelligent expense tracking application that uses AI to parse natural language inputs into structured expense data. Built with React Native (Expo) and Node.js.

**🚀 Backend Deployed on Vercel:** [https://expense-calculator-ai.vercel.app](https://expense-calculator-ai.vercel.app)

## 🚀 Features

- **Natural Language Entry**: Just type "Spent 500 on lunch at subway" and let AI handle the rest.
- **AI-Powered Parsing**: Uses Groq (LLaMA 3) to extract amount, currency, category, and merchant.
- **Smart Merchant Inference**: Automatically identifies merchant names even if not explicitly stated.
- **Dynamic Expense Listing**: Grouped by date with smart relative time headers.
- **Swipe Actions**: Smooth swipe-to-delete animations.
- **Cross-Platform**: Runs on Android and iOS.

## 🛠 Tech Stack

- **Frontend**:
  - **React Native & Expo**: For cross-platform mobile development.
  - **Unistyles**: For type-safe, performance-oriented styling (supercharging React Native styles), auto switch between dark mode and light mode based on device UI.
  - **Reanimated**: For buttery smooth 60fps animations.
- **Backend**:
  - **Node.js & Express**: API server.
  - **MongoDB (Mongoose)**: Database.
  - **Groq SDK**: AI model integration (LLaMA 3.3).
- **Deployment**: Vercel (Backend).

## 📦 Setup & Installation

### Prerequisites

- Node.js (v18+)
- npm or yarn
- Expo Go app on your phone

### 1. Backend (Node.js)

The backend is already deployed on Vercel, but to run it locally:

1.  **Navigate to folder**:
    ```bash
    cd expenses-be
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Configure Environment**:
    Create `.env` based on `.env.example`.
4.  **Start Server**:
    ```bash
    npm start
    ```
    _Runs on http://localhost:3000_

### 2. Frontend (Expo)

1.  **Navigate to folder**:
    ```bash
    cd expenses
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Start App**:
    ```bash
    npx expo start
    ```
4.  **Run**:
    - Scan QR code with **Expo Go** (Android) or Camera (iOS).
    - Press `a` for Android Emulator.
    - Press `i` for iOS Simulator.

## 📱 How to Use

1.  Open the app.
2.  Type an expense: _"Taxi to airport 450"_.
3.  Tap the **Send** button.
4.  See it appear instantly in your list, categorized and formatted!
