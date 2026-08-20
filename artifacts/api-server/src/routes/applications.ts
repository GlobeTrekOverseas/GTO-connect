import { Router, type IRouter } from "express";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { CreateApplicationBody, ApplicationSchema, GetApplicationsResponse } from "@workspace/api-zod";
import { db, applicationsTable } from "@workspace/db";

const router: IRouter = Router();

const JWT_SECRET = process.env.SESSION_SECRET ?? "dev-secret-change-me";

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

function requireAuth(
  req: Parameters<typeof extractToken>[0],
  res: { status: (n: number) => { json: (o: object) => void } },
  next: () => void,
): number | null {
  const token = extractToken(req);
  if (!token) {
    res.status(401).json({ error: "Not authenticated" });
    return null;
  }
  const userId = verifyToken(token);
  if (!userId) {
    res.status(401).json({ error: "Invalid or expired token" });
    return null;
  }
  return userId;
}

// GET /api/applications — list authenticated user's applications
router.get("/applications", async (req, res): Promise<void> => {
  const token = extractToken(req);
  if (!token) { res.status(401).json({ error: "Not authenticated" }); return; }
  const userId = verifyToken(token);
  if (!userId) { res.status(401).json({ error: "Invalid or expired token" }); return; }

  const rows = await db
    .select()
    .from(applicationsTable)
    .where(eq(applicationsTable.userId, userId))
    .orderBy(applicationsTable.createdAt);

  const parsed = GetApplicationsResponse.parse(
    rows.map((r) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    })),
  );

  res.json(parsed);
});

// POST /api/applications — create a new application
router.post("/applications", async (req, res): Promise<void> => {
  const token = extractToken(req);
  if (!token) { res.status(401).json({ error: "Not authenticated" }); return; }
  const userId = verifyToken(token);
  if (!userId) { res.status(401).json({ error: "Invalid or expired token" }); return; }

  const parsed = CreateApplicationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { universityName, country } = parsed.data;

  // Prevent duplicate active applications for the same university
  const existing = await db
    .select()
    .from(applicationsTable)
    .where(eq(applicationsTable.userId, userId))
    .then((rows) =>
      rows.find(
        (r) =>
          r.universityName === universityName &&
          r.status !== "rejected",
      ),
    );

  if (existing) {
    res.status(409).json({ error: "You already have an active application for this university" });
    return;
  }

  const [application] = await db
    .insert(applicationsTable)
    .values({ userId, universityName, country, status: "submitted" })
    .returning();

  req.log.info({ userId, applicationId: application.id }, "Application created");

  res.status(201).json(
    ApplicationSchema.parse({
      ...application,
      createdAt: application.createdAt.toISOString(),
      updatedAt: application.updatedAt.toISOString(),
    }),
  );
});

export default router;
