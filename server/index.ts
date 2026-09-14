import 'dotenv/config';
import express, { type Express, type Request, type Response } from 'express';
import { Pool } from "pg";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";
import { authMiddleware } from './middleware';

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



// Todos
app.post('/todos', authMiddleware, async (req, res) => {
  const userId = req.userId;
  const { title, description } = req.body;

  const newTodo = await pool.query('INSERT INTO todos (userid, title, description) VALUES ($1, $2, $3) RETURNING *', [userId, title, description]);

  res.status(201).json({
    message: 'Todo created successfully',
    todo: newTodo.rows[0]
  });
});

app.get('/todos', authMiddleware, async (req, res) => {
  const userId = req.userId;
  const todos = await pool.query('SELECT * FROM todos WHERE userid = $1', [userId]);

  res.status(200).json({
    message: 'Todos retrieved successfully',
    todos: todos.rows
  });
  return;
});

app.get('/todos/:id',authMiddleware, async (req, res) => {
  const userId = req.userId;
  const { id } = req.params;

  const todo = await pool.query('SELECT * FROM todos WHERE id = $1 AND userid = $2', [id, userId]);

  if (todo.rows.length === 0) {
    res.status(404).json({
      message: 'Todo not found'
    });
    return;
  }

  res.status(200).json({
    message: 'Todo retrieved successfully',
    todo: todo.rows[0]
  });
});

app.put('/todos/:id', authMiddleware, async (req, res) => {
  const userId = req.userId;
  const { id } = req.params;
  const { title, description } = req.body;

  const todo = await pool.query('SELECT * FROM todos WHERE id = $1 AND userid = $2', [id, userId]);

  if (todo.rows.length === 0) {
    res.status(404).json({
      message: 'Todo not found'
    });
    return;
  }

  const updatedTodo = await pool.query('UPDATE todos SET title = $1, description = $2 WHERE id = $3 AND userid = $4 RETURNING *', [title, description, id, userId]);

  res.status(200).json({
    message: 'Todo updated successfully',
    updatedTodo: updatedTodo.rows[0]
});
});

app.delete('/todos/:id', authMiddleware, async (req, res) => {
  const userId = req.userId;
  const { id } = req.params;

  const todo = await pool.query('SELECT * FROM todos WHERE id = $1 AND userid = $2', [id, userId]);

  if (todo.rows.length === 0) {
    res.status(404).json({
      message: 'Todo not found'
    });
    return;
  }

  await pool.query('DELETE FROM todos WHERE id = $1 AND userid = $2', [id, userId]);

  res.status(200).json({
    message: 'Todo deleted successfully'
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});