import 'dotenv/config';
import express, { type Express, type Request, type Response } from 'express';
import { Pool } from "pg";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

export { };

const app: Express = express();
const port = 3000;
app.use(express.json());
app.use(cors());

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

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const userExists = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

  if (userExists.rows.length === 0) {
    res.status(400).json({
      message: 'User does not exist'
    });
    return;
  }

  const user = userExists.rows[0];

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    res.status(400).json({
      message: 'Invalid password'
    });
    return;
  }

  const token = jwt.sign({
    id: user.id
  },
    process.env.JWT_SECRET!
  );

  res.status(200).json({
    message: 'User logged in successfully',
    token
  });
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});