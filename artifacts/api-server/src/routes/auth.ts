import { Router, type IRouter } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { eq, or } from "drizzle-orm";
import {
  RegisterBody,
  RegisterResponse,
  LoginBody,
  LoginResponse,
  GetMeResponse,
  LogoutResponse,
} from "@workspace/api-zod";
import { db, usersTable } from "@workspace/db";

const router: IRouter = Router();

const JWT_SECRET = process.env.SESSION_SECRET ?? "dev-secret-change-me";
const SALT_ROUNDS = 10;

function makeToken(userId: number): string {
  return jwt.sign({ sub: String(userId) }, JWT_SECRET, { expiresIn: "7d" });
}

function verifyToken(token: string): number | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as unknown as { sub: string };
    const id = parseInt(payload.sub, 10);
    return isNaN(id) ? null : id;
  } catch {
    return null;
  }
}

function extractToken(req: { headers: { authorization?: string } }): string | null {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) return null;
  return auth.slice(7);
}

// POST /auth/register
router.post("/auth/register", async (req, res): Promise<void> => {
  const parsed = RegisterBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { name, email, password, mobile } = parsed.data;

  const existing = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email.toLowerCase()))
    .limit(1);

  if (existing.length > 0) {
    res.status(400).json({ error: "Email is already registered" });
    return;
  }

  if (mobile) {
    const existingMobile = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.mobile, mobile))
      .limit(1);
    if (existingMobile.length > 0) {
      res.status(400).json({ error: "Mobile number is already registered" });
      return;
    }
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const [user] = await db
    .insert(usersTable)
    .values({
      name,
      email: email.toLowerCase(),
      mobile: mobile ?? null,
      passwordHash,
    })
    .returning();

  const token = makeToken(user.id);

  req.log.info({ userId: user.id }, "User registered");

  res.status(201).json(
    RegisterResponse.parse({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile ?? null,
        createdAt: user.createdAt.toISOString(),
      },
    })
  );
});

// POST /auth/login
router.post("/auth/login", async (req, res): Promise<void> => {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { identifier, password } = parsed.data;

  const [user] = await db
    .select()
    .from(usersTable)
    .where(
      or(
        eq(usersTable.email, identifier.toLowerCase()),
        eq(usersTable.mobile, identifier)
      )
    )
    .limit(1);

  if (!user) {
    res.status(401).json({ error: "Invalid email/mobile or password" });
    return;
  }

  const passwordMatch = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatch) {
    res.status(401).json({ error: "Invalid email/mobile or password" });
    return;
  }

  const token = makeToken(user.id);

  req.log.info({ userId: user.id }, "User logged in");

  res.json(
    LoginResponse.parse({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile ?? null,
        createdAt: user.createdAt.toISOString(),
      },
    })
  );
});

// GET /auth/me
router.get("/auth/me", async (req, res): Promise<void> => {
  const token = extractToken(req);
  if (!token) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const userId = verifyToken(token);
  if (!userId) {
    res.status(401).json({ error: "Invalid or expired token" });
    return;
  }

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, userId))
    .limit(1);

  if (!user) {
    res.status(401).json({ error: "User not found" });
    return;
  }

  res.json(
    GetMeResponse.parse({
      id: user.id,
      name: user.name,
      email: user.email,
      mobile: user.mobile ?? null,
      createdAt: user.createdAt.toISOString(),
    })
  );
});

// POST /auth/logout
router.post("/auth/logout", async (_req, res): Promise<void> => {
  res.json(LogoutResponse.parse({ message: "Logged out successfully" }));
});

export default router;
