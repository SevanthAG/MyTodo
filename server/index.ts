import 'dotenv/config';
import express, { type Express, type Request, type Response } from 'express';
import { Pool } from "pg";
import bcrypt from "bcrypt";

const app: Express = express();
const port = 3000;
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

//Auth
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  const userAlreadyExists = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

  if (userAlreadyExists.rows.length > 0) {
    res.status(400).json({
      message: 'User already exists'
    });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await pool.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username', [username, hashedPassword]);

  res.status(201).json({
    message: 'User created successfully',
    user: newUser.rows[0]
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});