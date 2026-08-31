import pkg from 'pg';
import dotenv from 'dotenv';

const { Pool } = pkg;
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/ki_blueprint'
});

async function seed() {
  try {
    console.log('🌱 Seeding database...');

    // Clear existing data
    await pool.query('DELETE FROM operating_loop');
    await pool.query('DELETE FROM improvements');
    await pool.query('DELETE FROM bottlenecks');
    await pool.query('DELETE FROM ai_agents');
    await pool.query('DELETE FROM priorities');
    await pool.query('DELETE FROM kpis');
    await pool.query('DELETE FROM risks');
    await pool.query('DELETE FROM goals');

    // Seed Goals
    await pool.query(
      `INSERT INTO goals (title, target_amount, current_amount, percentage, status, trend, notes, active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      ['Q3 Revenue Target', 1200000, 816000, 68, 'on_pace', 'up', '4 weeks left in quarter', true]
    );

    // Seed KPIs
    const kpiData = [
      ['Lead Response Time', 3, 5, 'slipping', 'down', 'Average first-response time up to 6 hours', 1],
      ['Customer Satisfaction', 4, 5, 'on_target', 'up', 'NPS score at 72', 2],
      ['Deal Closure Rate', 3, 5, 'on_target', 'flat', 'Holding steady at 45%', 3],
      ['Team Capacity', 2, 5, 'below_target', 'down', 'Onboarding backlog growing', 4],
      ['Content Output', 2, 5, 'below_target', 'flat', '55% of weekly calendar published', 5]
    ];

    for (const [name, on_target, total, status, trend, notes, idx] of kpiData) {
      await pool.query(
        `INSERT INTO kpis (name, on_target, total, status, trend, notes, order_index)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [name, on_target, total, status, trend, notes, idx]
      );
    }

    // Seed Risks
    const riskData = [
      ['Onboarding Backlog Growing', 'Customer acquisition outpacing team capacity for onboarding', 'open', 'high'],
      ['Lead Response Delay', 'Response time SLA at risk due to understaffing', 'open', 'high'],
      ['Data Quality Issue', 'Missing verification fields in customer records', 'open', 'medium']
    ];

    for (const [title, description, status, severity] of riskData) {
      await pool.query(
        `INSERT INTO risks (title, description, status, severity) VALUES ($1, $2, $3, $4)`,
        [title, description, status, severity]
      );
    }

    // Seed Priorities
    const priorityData = [
      ['Sales', 82, 'Deep Deal Analysis: 6 opportunities in active review.', 1],
      ['Operations', 64, 'Freedom/Buyback: 2 processes queued for automation.', 2],
      ['Marketing', 55, 'Everyday Content: this week\'s calendar 55% published.', 3],
      ['People', 38, '2 team members pending Level 3 (Verify) certification.', 4]
    ];

    for (const [name, progress, notes, idx] of priorityData) {
      await pool.query(
        `INSERT INTO priorities (name, progress, notes, order_index) VALUES ($1, $2, $3, $4)`,
        [name, progress, notes, idx]
      );
    }

    // Seed AI Agents
    const agentData = [
      ['SEO Analysis Agent', 'active', 'Audit accuracy 94%'],
      ['Lead Follow-up Agent', 'active', 'Response time 6m'],
      ['Content Draft Agent', 'waiting', 'Awaiting approval'],
      ['Onboarding Checklist Agent', 'failed', 'Missing data — escalated'],
      ['Customer Success Bot', 'active', 'Satisfaction score 87%'],
      ['Revenue Forecaster', 'active', 'Accuracy 91%']
    ];

    for (const [name, status, kpi] of agentData) {
      await pool.query(
        `INSERT INTO ai_agents (name, status, kpi) VALUES ($1, $2, $3)`,
        [name, status, kpi]
      );
    }

    // Seed Bottlenecks
    const bottleneckData = [
      ['Lead response delay', 'Average first-response time up to 6 hours this week.', 'high'],
      ['Content approval backlog', '9 drafts waiting on human sign-off.', 'medium'],
      ['Customer onboarding exception', '1 account stuck on missing verification data.', 'medium']
    ];

    for (const [title, description, severity] of bottleneckData) {
      await pool.query(
        `INSERT INTO bottlenecks (title, description, severity) VALUES ($1, $2, $3)`,
        [title, description, severity]
      );
    }

    // Seed Improvements
    const improvementData = [
      ['SOP', 'Updated lead-qualification SOP after repeat miscategorization.'],
      ['AUTOMATE', 'Buyback: automated weekly reporting, saving ~3 hrs/week.'],
      ['5 WHYS', 'Root-caused onboarding delay to a missing intake field.'],
      ['PROCESS', 'Streamlined content approval workflow reducing review time by 40%.'],
      ['TOOL', 'Deployed new CRM integration eliminating manual data entry.']
    ];

    for (const [tag, description] of improvementData) {
      await pool.query(
        `INSERT INTO improvements (tag, description) VALUES ($1, $2)`,
        [tag, description]
      );
    }

    // Seed Operating Loop
    const loopSteps = ['GOAL', 'PLAN', 'AGENT', 'TOOL', 'PERMISSION', 'ACTION', 'VERIFY', 'MEASURE', 'LEARN', 'IMPROVE', 'SOP', 'SCALE'];
    for (let i = 0; i < loopSteps.length; i++) {
      await pool.query(
        `INSERT INTO operating_loop (step_number, name, is_current, order_index) VALUES ($1, $2, $3, $4)`,
        [i + 1, loopSteps[i], i === 5, i]
      );
    }

    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding database:', err);
    process.exit(1);
  }
}

seed();