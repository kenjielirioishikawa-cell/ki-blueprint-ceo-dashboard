-- Database schema for KI BLUEPRINT CEO Dashboard

CREATE TABLE IF NOT EXISTS goals (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  target_amount DECIMAL(12, 2),
  current_amount DECIMAL(12, 2),
  percentage DECIMAL(5, 2),
  status VARCHAR(50),
  trend VARCHAR(20),
  notes TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS kpis (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  on_target INT,
  total INT,
  status VARCHAR(50),
  trend VARCHAR(20),
  notes TEXT,
  period DATE DEFAULT CURRENT_DATE,
  order_index INT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS risks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'open',
  severity VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS priorities (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  progress INT DEFAULT 0,
  notes TEXT,
  date DATE DEFAULT CURRENT_DATE,
  order_index INT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_agents (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  kpi VARCHAR(255),
  last_updated TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bottlenecks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  severity VARCHAR(50),
  resolved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS improvements (
  id SERIAL PRIMARY KEY,
  tag VARCHAR(50),
  description TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS operating_loop (
  id SERIAL PRIMARY KEY,
  step_number INT,
  name VARCHAR(100) NOT NULL,
  is_current BOOLEAN DEFAULT false,
  order_index INT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_goals_active ON goals(active);
CREATE INDEX idx_kpis_period ON kpis(period);
CREATE INDEX idx_risks_status ON risks(status);
CREATE INDEX idx_priorities_date ON priorities(date);
CREATE INDEX idx_bottlenecks_resolved ON bottlenecks(resolved_at);