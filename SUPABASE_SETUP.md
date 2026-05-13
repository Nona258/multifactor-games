# Supabase Database Setup Guide

This guide will help you set up the database schema for the FruitSweeper leaderboard.

## 1. Create Scores Table

In your Supabase project, go to **SQL Editor** and run the following SQL:

```sql
-- Create scores table for FruitSweeper leaderboard
CREATE TABLE IF NOT EXISTS scores (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  username TEXT NOT NULL,
  game_id TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  completion_time INT NOT NULL CHECK (completion_time > 0),
  result TEXT NOT NULL CHECK (result IN ('win', 'loss')),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT score_valid CHECK (completion_time > 0)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_scores_game_difficulty ON scores(game_id, difficulty);
CREATE INDEX IF NOT EXISTS idx_scores_username ON scores(username);
CREATE INDEX IF NOT EXISTS idx_scores_created_at ON scores(created_at DESC);
```

## 2. Enable Row Level Security (RLS)

For public leaderboard (recommended):

```sql
-- Enable RLS on scores table
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read scores
CREATE POLICY "Anyone can read scores" ON scores
  FOR SELECT USING (true);

-- Allow anyone to insert scores
CREATE POLICY "Anyone can insert scores" ON scores
  FOR INSERT WITH CHECK (true);

-- Nobody can delete/update
CREATE POLICY "No updates" ON scores
  FOR UPDATE USING (false);

CREATE POLICY "No deletes" ON scores
  FOR DELETE USING (false);
```

## 3. Enable Realtime (Optional, for live leaderboard updates)

In Supabase dashboard:
1. Go to **Realtime** → **Replication**
2. Enable replication for the `scores` table
3. Mark the table as available for realtime subscriptions

## 4. Verify Setup

Test your setup by going to the **SQL Editor** and running:

```sql
SELECT * FROM scores LIMIT 10;
```

You should get an empty table result.

## 5. Test Score Submission

Try playing a game and submitting a score. Check:
1. The score appears in Supabase
2. The modal shows success message
3. Scores are properly formatted

## Troubleshooting

**Issue**: "relation 'scores' does not exist"
- **Solution**: Run the CREATE TABLE statement again

**Issue**: "new row violates row level security policy"
- **Solution**: Check RLS policies are enabled for INSERT

**Issue**: Cannot see scores in dashboard
- **Solution**: Make sure you're looking at the correct table in the correct schema (should be `public`)

## Sample Data Structure

```json
{
  "id": 1,
  "username": "Farmer1234",
  "game_id": "fruitsweeper",
  "difficulty": "medium",
  "completion_time": 125,
  "result": "win",
  "created_at": "2026-05-07T14:30:00+00:00"
}
```

---

**Next Steps**:
1. Set up the database schema using the SQL above
2. Test in-game score submission
3. View leaderboard page (Phase 3B)
