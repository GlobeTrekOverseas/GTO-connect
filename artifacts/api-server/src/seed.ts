/**
 * Idempotent seed: ensures a demo user exists for quick onboarding/testing.
 * Safe to call on every startup — does nothing if the user already exists.
 */
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";
import type { Logger } from "pino";

const DEMO_EMAIL = "demo@gtoconnect.com";
const DEMO_PASSWORD = "Demo@1234";
const DEMO_NAME = "Demo User";

export async function seedDemoUser(logger: Logger): Promise<void> {
  try {
    const existing = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.email, DEMO_EMAIL))
      .limit(1);

    if (existing.length > 0) {
      logger.debug({ email: DEMO_EMAIL }, "Demo user already exists — skipping seed");
      return;
    }

    const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
    await db.insert(usersTable).values({
      name: DEMO_NAME,
      email: DEMO_EMAIL,
      mobile: null,
      passwordHash,
    });

    logger.info({ email: DEMO_EMAIL }, "Demo user created");
  } catch (err) {
    // Non-fatal: log and continue even if seeding fails
    logger.error({ err }, "Failed to seed demo user");
  }
}
