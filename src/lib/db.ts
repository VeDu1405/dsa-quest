import { sql } from '@vercel/postgres';
import { Question, User, Achievement } from '@/types';

// Initialize tables
export async function initDB() {
  await sql`
    CREATE TABLE IF NOT EXISTS questions (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      link TEXT NOT NULL,
      topic TEXT NOT NULL,
      difficulty TEXT NOT NULL,
      solved BOOLEAN DEFAULT FALSE,
      notes TEXT,
      solved_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY DEFAULT 1,
      xp INTEGER DEFAULT 0,
      level INTEGER DEFAULT 0,
      streak INTEGER DEFAULT 0,
      last_solved_date DATE,
      total_solved INTEGER DEFAULT 0
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS achievements (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      icon TEXT NOT NULL,
      unlocked_at TIMESTAMP,
      requirement TEXT NOT NULL
    )
  `;

  // Insert default user if not exists
  await sql`
    INSERT INTO users (id) VALUES (1)
    ON CONFLICT (id) DO NOTHING
  `;
}

// Questions
export async function getQuestions(): Promise<Question[]> {
  const { rows } = await sql`SELECT * FROM questions ORDER BY created_at DESC`;
  return rows.map(row => ({
    id: row.id,
    title: row.title,
    link: row.link,
    topic: row.topic,
    difficulty: row.difficulty,
    solved: row.solved,
    notes: row.notes || '',
    solvedAt: row.solved_at?.toISOString(),
    createdAt: row.created_at.toISOString(),
  }));
}

export async function addQuestion(q: Omit<Question, 'id' | 'createdAt'>): Promise<Question> {
  const id = Date.now().toString();
  await sql`
    INSERT INTO questions (id, title, link, topic, difficulty, notes, solved)
    VALUES (${id}, ${q.title}, ${q.link}, ${q.topic}, ${q.difficulty}, ${q.notes}, ${q.solved})
  `;
  return { ...q, id, createdAt: new Date().toISOString() };
}

// User
export async function getUser(): Promise<User> {
  const { rows } = await sql`SELECT * FROM users WHERE id = 1`;
  const row = rows[0];
  return {
    xp: row.xp,
    level: row.level,
    streak: row.streak,
    lastSolvedDate: row.last_solved_date?.toISOString().split('T')[0] || null,
    totalSolved: row.total_solved,
  };
}