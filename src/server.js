require("dotenv").config();
const express = require("express");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { query } = require("./db");
const { requireAuth } = require("./auth");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/healthz", (req, res) => res.status(200).send("ok"));

/**
 * Admin reset endpoint (test-data strategy)
 * Header: x-reset-token: <ADMIN_RESET_TOKEN>
 */
app.post("/api/admin/reset", async (req, res) => {
  const token = req.headers["x-reset-token"];
  if (!process.env.ADMIN_RESET_TOKEN || token !== process.env.ADMIN_RESET_TOKEN) {
    return res.status(403).json({ error: "Forbidden" });
  }

  // deterministic seed
  await query("TRUNCATE TABLE todos RESTART IDENTITY CASCADE;");
  await query("TRUNCATE TABLE users RESTART IDENTITY CASCADE;");

  const passwordHash = await bcrypt.hash("password123", 10);
  const user = await query(
    "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email",
    ["sdet@example.com", passwordHash]
  );

  await query(
    "INSERT INTO todos (user_id, title, completed) VALUES ($1, $2, $3), ($1, $4, $5)",
    [user.rows[0].id, "Buy milk", false, "Write tests", true]
  );

  res.json({ ok: true });
});

// Auth
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "Missing fields" });

  const result = await query("SELECT id, email, password_hash FROM users WHERE email=$1", [email]);
  const user = result.rows[0];
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.json({ token });
});

// Todos
app.get("/api/todos", requireAuth, async (req, res) => {
  const result = await query("SELECT id, title, completed FROM todos WHERE user_id=$1 ORDER BY id", [
    req.user.id,
  ]);
  res.json(result.rows);
});

app.post("/api/todos", requireAuth, async (req, res) => {
  const { title } = req.body || {};
  if (!title) return res.status(400).json({ error: "Missing title" });

  const result = await query(
    "INSERT INTO todos (user_id, title, completed) VALUES ($1, $2, false) RETURNING id, title, completed",
    [req.user.id, title]
  );
  res.status(201).json(result.rows[0]);
});

app.patch("/api/todos/:id", requireAuth, async (req, res) => {
  const { completed } = req.body || {};
  const id = Number(req.params.id);

  const result = await query(
    "UPDATE todos SET completed=$1 WHERE id=$2 AND user_id=$3 RETURNING id, title, completed",
    [!!completed, id, req.user.id]
  );

  if (!result.rows[0]) return res.status(404).json({ error: "Not found" });
  res.json(result.rows[0]);
});

app.delete("/api/todos/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  const result = await query("DELETE FROM todos WHERE id=$1 AND user_id=$2 RETURNING id", [
    id,
    req.user.id,
  ]);
  if (!result.rows[0]) return res.status(404).json({ error: "Not found" });
  res.status(204).send();
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App listening on http://localhost:${port}`));