# KI BLUEPRINT™ CEO Manager — Operating Dashboard

A modern, real-time operating dashboard for tracking business goals, KPIs, AI agents, bottlenecks, and continuous improvement cycles.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kenjielirioishikawa-cell/ki-blueprint-ceo-dashboard.git
   cd ki-blueprint-ceo-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up PostgreSQL database**
   ```bash
   createdb ki_blueprint
   psql ki_blueprint < server/schema.sql
   ```

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

5. **Seed the database**
   ```bash
   npm run seed
   ```

6. **Start development servers**
   ```bash
   npm run dev
   ```
   - Backend: http://localhost:5000
   - Frontend: http://localhost:5173

## 📁 Project Structure

```
├── server/
│   ├── index.js          # Express API server
│   ├── schema.sql        # PostgreSQL schema
│   └── seed.js           # Database seeding script
├── client/               # Frontend (React/Vite)
├── public/               # Static assets
└── package.json
```

## 🔌 API Endpoints

### Dashboard
- `GET /api/dashboard` — Overall dashboard metrics
- `GET /api/priorities` — Today's priorities
- `GET /api/agents` — AI agent status
- `GET /api/bottlenecks` — Current bottlenecks
- `GET /api/improvements` — Recent improvements
- `GET /api/loop` — Operating loop steps

### Actions
- `POST /api/priorities/:id` — Update priority progress
- `POST /api/agents/:id/status` — Update agent status
- `POST /api/bottlenecks/:id/resolve` — Resolve a bottleneck
- `POST /api/improvements` — Log an improvement

## 🛠️ Development

### Available Scripts

```bash
# Run both server and client in development mode
npm run dev

# Run only server
npm run server:dev

# Run only client
npm run client:dev

# Build client for production
npm run build

# Start production server
npm start

# Seed database with sample data
npm run seed
```

## 🗄️ Database Schema

### Core Tables
- **goals** — Business targets and goals
- **kpis** — Key performance indicators
- **risks** — Open risks and issues
- **priorities** — Daily/weekly priorities
- **ai_agents** — Agent status and performance
- **bottlenecks** — Current bottlenecks and blockers
- **improvements** — Improvement log entries
- **operating_loop** — Operating loop cycle steps

## 📊 Features

✅ Real-time dashboard metrics  
✅ AI agent status tracking  
✅ Bottleneck management  
✅ Improvement logging  
✅ Priority tracking with progress bars  
✅ Operating loop visualization  
✅ RESTful API for all operations  
✅ PostgreSQL for persistent storage  

## 🚀 Deployment

### Deploy to Render (Recommended)

1. Create a Render account and new PostgreSQL database
2. Push to GitHub
3. Create new Web Service on Render
4. Set environment variables
5. Deploy!

### Deploy to Heroku

```bash
heroku create ki-blueprint-dashboard
heroku addons:create heroku-postgresql:standard-0
git push heroku main
heroku run npm run seed
```

## 📝 License

MIT — Feel free to use and modify

## 🤝 Contributing

Pull requests welcome! For major changes, please open an issue first.
