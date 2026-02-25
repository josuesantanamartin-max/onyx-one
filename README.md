<div align="center">
  <img width="1200" alt="Onyx One Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

  # Onyx One
  *>_ The Ultimate Personal Operating System for the Modern Era.*

  [![Vercel Deployment](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://onyx-one.vercel.app)
  [![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
  [![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
</div>

---

## 💎 The Vision

**Onyx One** is not just another dashboard; it is a **Personal Operating System** designed to centralize and elevate every aspect of your digital and physical life. Built with a "Privacy First" and "Aesthetics Matter" philosophy, it combines cutting-edge AI with a premium user interface to provide clarity in finance, home management, and personal growth.

## 🚀 Key Modules

### 🏦 Onyx Finance
Master your economy with elite-level tools:
- **Timeline Evolution**: Visualize your net worth growth over years.
- **Smart Budgets**: Granular control over spending with automated category distribution.
- **Finance Projections**: Advanced algorithms to predict your balance 12+ months ahead.
- **Accounts Hub**: A unified view of all your physical and digital assets.

### 🏠 Onyx Life
Harmonize your household operations:
- **Intelligent Meal Planner**: Weekly organization with favorite recipe integration.
- **Pantry Intelligence**: Inventory tracking for essential items.
- **Family Agenda**: Synchronized schedule for the whole household.
- **Upcoming Trips**: Planning and countdowns for your next adventures.

### 🧠 Onyx Insights (AI)
Powered by **Google Gemini Pro**, the suite provides proactive analysis:
- **Predictive Savings**: Tells you exactly when you'll hit your financial goals.
- **Spending Alerts**: Identifies anomalies in your monthly flow.
- **contextual Tips**: Personalized suggestions based on your Life and Finance data.

## 🎨 Premium UX Features

- **Customizable Dashboard**: Drag-and-drop widget gallery with 60FPS animations powered by `framer-motion`.
- **Quick-Resize System**: Contextual controls to instantly toggle between KPI, Half, Wide, and Full layouts.
- **Adaptive Glassmorphism**: A design system that feels alive, featuring sub-pixel blurring and micro-interactions.
- **Multi-Language Elite**: Native support for **Español**, **English**, and **Français**.

## 🛠 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 19, TypeScript 5.8, Vite |
| **State** | Zustand (Global Persistent State) |
| **Animation** | Framer Motion |
| **Backend** | Supabase (PostgreSQL, Auth, Edge Functions) |
| **AI Engine** | Google Gemini 1.5 Pro |
| **Payments** | Stripe Integration (Billing & Subscriptions) |
| **Monitoring** | Sentry, Vercel Analytics |

## 📦 Getting Started

### Prerequisites
- Node.js 20+
- A Supabase Project
- A Google AI (Gemini) API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/josuesantanamartin-max/onyx-one.git
   cd onyx-one
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root:
   ```env
   VITE_SUPABASE_URL=your_url
   VITE_SUPABASE_ANON_KEY=your_key
   VITE_GEMINI_API_KEY=your_gemini_key
   ```

4. **Launch Development Server**
   ```bash
   npm run dev
   ```

## 🛡 Security & Performance

- **End-to-End Type Safety** with TypeScript and Zod.
- **GDPR Compliant** cookie management and data export.
- **Optimized Core Web Vitals** via Vercel Edge performance.
- **Automated Testing** with Vitest and Playwright.

---

<p align="center">
  Built with ❤️ for a more organized future. <br/>
  <b>Onyx One © 2026</b>
</p>
