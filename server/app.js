import { Hono } from "@hono/hono";
import { cors } from "@hono/hono/cors";
import { logger } from "@hono/hono/logger";
import postgres from "postgres";

import { getCookie, setCookie } from "jsr:@hono/hono@4.6.5/cookie";
import { hash, verify } from "jsr:@denorg/scrypt@4.4.4";
import * as jwt from "jsr:@hono/hono@4.6.5/jwt";

import { coursesValidator, questionsValidator } from "./controllers/validators.js";
import { zValidator } from "zValidator";

import * as coursesController from "./controllers/coursesController.js";
import * as questionsController from "./controllers/questionsController.js";
import * as answersController from "./controllers/answersController.js";

const app = new Hono();
const sql = postgres();

const COOKIE_KEY = "token";
const JWT_SECRET = "wsd-project-secret";

app.use( "/*",
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use("/*", logger());

const BANNED_WORDS = [
  "delete", "update", "insert", "drop", "alter", "create",
  "truncate", "replace", "merge", "grant", "revoke",
  "transaction", "commit", "rollback", "savepoint", "lock",
  "execute", "call", "do", "set", "comment"
];

const query = async (query) => {
  // check that the query does not do data manipulation
  for (const word of BANNED_WORDS) {
    if (query.toLowerCase().includes(word)) {
      throw new Error(`You cannot ${word} data`);
    }
  }

  const sql = postgres();

  return await sql.unsafe(query); // Perform the query
};

app.get("/", (c) => {
  return c.html(`
    <html>
      <head>
        <title>Hello, world!</title>
      </head>
      <body>
        <h1>Hello, world!</h1>
        <p>To use this, make a POST with a JSON document in the request body. The query property of the JSON document will be used to query a database.</p>
        <p>There are no tables though, so you can only do simple queries like "SELECT 1 + 1".</p>
      </body>
    </html>
  `);
});

app.post("/", async (c) => {
  const body = await c.req.json();
  const result = await query(body.query);
  
  // Wrap the query result inside a 'result' key
  return c.json({ result: result });
});

app.get("/api/courses", coursesController.getCourses);
app.get("/api/courses/:id", coursesController.getCourse);
app.post("/api/courses", zValidator("json", coursesValidator), coursesController.createCourse);
app.delete ("/api/courses/:id", coursesController.deleteCourse);

app.get("/api/courses/:id/questions", questionsController.getQuestions);
app.post("/api/courses/:id/questions", zValidator("json", questionsValidator), questionsController.createQuestion);
app.post("/api/courses/:id/questions/:qId/upvote", questionsController.upvoteQuestion);
app.delete("/api/courses/:id/questions/:qId", questionsController.deleteQuestion);

const userMiddleware = async (c, next) => {
  try {
    const token = getCookie(c, COOKIE_KEY);
    const { payload } = jwt.decode(token, JWT_SECRET);
    
    if (!token || !payload || !payload.email) {
      return c.json({ message: "Unauthorized" }, 401);
    }
    
    c.user = payload;
    await next();
  } catch (error) {
    return c.json({ message: "Unauthorized" }, 401);
  }
};

app.get("/api/courses/:id/questions/:qId", answersController.getQuestion);
app.get("/api/courses/:id/questions/:qId/answers", answersController.getAnswers);
app.post("/api/courses/:id/questions/:qId/answers", 
  jwt.jwt({ cookie: COOKIE_KEY, secret: JWT_SECRET, }),
  userMiddleware,
  answersController.createAnswer);
app.post("/api/courses/:id/questions/:qId/answers/:aId/upvote", 
  jwt.jwt({ cookie: COOKIE_KEY, secret: JWT_SECRET, }),
  answersController.upvoteAnswer);

const clean = (data) => {
  data.email = data.email.trim().toLowerCase();
  data.password = data.password.trim();
};

app.post("/api/auth/register", async (c) => {
  const data = await c.req.json();
  clean(data);

  const result = await sql`INSERT INTO users (email, password_hash)
    VALUES (${data.email},
    ${hash(data.password)}) RETURNING *`;

  return c.json({ "message": `Registered with email ${result[0].email}.` });
});

app.post("/api/auth/login", async (c) => {
  const data = await c.req.json();
  clean(data);

  const result = await sql`SELECT * FROM users
    WHERE email = ${data.email}`;

  if (result.length === 0) {
    return c.json({
      "message": "Incorrect email or password.",
    });
  }

  const user = result[0];

  const passwordValid = await verify(data.password, user.password_hash);
  if (passwordValid) {
    const payload = {
      email: user.email,
    };

    const token = await jwt.sign(payload, JWT_SECRET);

    setCookie(c, COOKIE_KEY, token, {
      path: "/",
      domain: "localhost",
      httpOnly: true,
      sameSite: "lax",
    });

    return c.json({
      "message": "Welcome!",
    });
  } else {
    return c.json({
      "message": "Incorrect email or password.",
    });
  }
});

app.use(
  "/api/verify",
  jwt.jwt({
    cookie: COOKIE_KEY,
    secret: JWT_SECRET,
  }),
);

app.post("/api/verify", async (c) => {
  const cookieValue = getCookie(c, COOKIE_KEY);
  const payload = await jwt.verify(cookieValue, JWT_SECRET);
  return c.json(payload);
});

app.use(
  "/api/users",
  jwt.jwt({
    cookie: COOKIE_KEY,
    secret: JWT_SECRET,
  }),
);

app.get("/api/users", async(c) => {
  const result = await sql`SELECT username FROM users` 
  return c.json(result);
})

app.use(
  "/api/notes/*",
  jwt.jwt({
    cookie: COOKIE_KEY,
    secret: JWT_SECRET,
  }),
);

app.use("/api/notes", userMiddleware);
app.use("/api/notes/*", userMiddleware);

app.get("/api/notes", async (c) => {
  const notes = await sql`SELECT * FROM notes WHERE user_id = ${c.user.id}`;
  return c.json(notes);
});

app.post("/api/notes", async (c) => {
  const { text } = await c.req.json();
  const result = await sql`INSERT INTO notes (user_id, text)
    VALUES (${c.user.id}, ${text}) RETURNING *`;
  return c.json(result[0]);
});

app.get("/api/notes/:id", async (c) => {
  const notes = await sql`SELECT * FROM notes
    WHERE id = ${c.req.param("id")} AND user_id = ${c.user.id}`;
  if (notes.length <= 0) {
    c.status(404);
    return c.json({ error: "Note not found" });
  }
  return c.json(notes[0]);
});

export default app;