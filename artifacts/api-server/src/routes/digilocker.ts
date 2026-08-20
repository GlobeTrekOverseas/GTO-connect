/**
 * DigiLocker OAuth 2.0 integration.
 *
 * Flow:
 *  1. Frontend POSTs /api/digilocker/init (Bearer token) → receives {authorizationUrl}.
 *  2. Frontend navigates browser to authorizationUrl (DigiLocker's consent page).
 *  3. DigiLocker redirects to GET /api/digilocker/callback with {code, state}.
 *  4. Backend exchanges code → access token → document list; stores result in DB.
 *  5. Backend redirects browser to frontend /documents?digilocker=success&key=<key>.
 *  6. Frontend GETs /api/digilocker/documents/:key (Bearer token) → document list.
 *     Ownership is verified; result is consumed once and deleted.
 */
import { Router } from "express";
import crypto from "crypto";
import { eq, lt } from "drizzle-orm";
import { db, digilockerStateTable, digilockerResultTable } from "@workspace/db";
import { requireAuth } from "../lib/auth-middleware";

const router: Router = Router();

const DIGILOCKER_CLIENT_ID = process.env.DIGILOCKER_CLIENT_ID;
const DIGILOCKER_CLIENT_SECRET = process.env.DIGILOCKER_CLIENT_SECRET;

/**
 * Returns the stable, env-configured API origin used for the DigiLocker
 * callback URI.  Never derived from request headers to prevent host-header
 * injection.  Must match the URI registered in the DigiLocker Partner Portal.
 */
function getApiOrigin(): string {
  if (process.env.DIGILOCKER_PUBLIC_ORIGIN) {
    return process.env.DIGILOCKER_PUBLIC_ORIGIN.replace(/\/+$/, "");
  }
  if (process.env.API_PUBLIC_ORIGIN) {
    return process.env.API_PUBLIC_ORIGIN.replace(/\/+$/, "");
  }
  return "http://localhost:8080";
}

/**
 * The DigiLocker-registered callback URI.  Must be identical to what is
 * configured in the DigiLocker Partner Portal for this client ID.
 */
function getCallbackUri(): string {
  return (
    process.env.DIGILOCKER_REDIRECT_URI ??
    `${getApiOrigin()}/api/digilocker/callback`
  );
}

/**
 * Where to send the user after a successful/failed OAuth dance.
 * The browser app receives the user on its documents route.
 */
function getFrontendDocsUrl(): string {
  return (
    process.env.DIGILOCKER_FRONTEND_URL ??
    `${getApiOrigin()}/documents`
  );
}

const DIGILOCKER_AUTH_URL =
  "https://api.digitallocker.gov.in/public/oauth2/1/authorize";
const DIGILOCKER_TOKEN_URL =
  "https://api.digitallocker.gov.in/public/oauth2/1/token";
const DIGILOCKER_FILES_URL =
  "https://api.digitallocker.gov.in/public/oauth2/1/files";

const STATE_TTL_MIN = 10;
const RESULT_TTL_MIN = 10;

// Periodically purge expired rows — best-effort background cleanup
setInterval(async () => {
  const now = new Date();
  try {
    await db.delete(digilockerStateTable).where(lt(digilockerStateTable.expiresAt, now));
    await db.delete(digilockerResultTable).where(lt(digilockerResultTable.expiresAt, now));
  } catch {
    // non-critical
  }
}, 10 * 60 * 1000);

// ────────────────────────────────────────────────────────────────────────────
// POST /api/digilocker/init   (authenticated)
//
// Creates an OAuth state entry bound to the requesting user and returns the
// DigiLocker authorization URL.  The frontend navigates the browser there.
// The JWT never appears in a URL — it travels only in the Authorization header.
// ────────────────────────────────────────────────────────────────────────────
router.post("/digilocker/init", requireAuth, async (req, res): Promise<void> => {
  const userId = res.locals.userId as number;
  const frontendDocs = getFrontendDocsUrl();

  if (!DIGILOCKER_CLIENT_ID) {
    res.status(503).json({
      error: "DigiLocker is not configured. Contact support.",
      frontendDocs,
    });
    return;
  }

  const state = crypto.randomBytes(16).toString("hex");
  const expiresAt = new Date(Date.now() + STATE_TTL_MIN * 60 * 1000);

  await db.insert(digilockerStateTable).values({ state, userId, expiresAt });

  const params = new URLSearchParams({
    response_type: "code",
    client_id: DIGILOCKER_CLIENT_ID,
    redirect_uri: getCallbackUri(),
    state,
    scope: "files.read",
  });

  res.json({ authorizationUrl: `${DIGILOCKER_AUTH_URL}?${params}` });
});

// ────────────────────────────────────────────────────────────────────────────
// GET /api/digilocker/callback
//
// DigiLocker sends the user's browser here after consent.
// Exchanges the code for an access token, fetches the document list,
// stores the result bound to the initiating user, and redirects the browser
// back to the frontend documents page.
// ────────────────────────────────────────────────────────────────────────────
router.get("/digilocker/callback", async (req, res): Promise<void> => {
  const frontendDocs = getFrontendDocsUrl();

  const { code, state, error } = req.query as Record<string, string | undefined>;

  if (error) {
    res.redirect(`${frontendDocs}?digilocker=error&reason=${encodeURIComponent(error)}`);
    return;
  }

  if (!state) {
    res.redirect(`${frontendDocs}?digilocker=error&reason=invalid_state`);
    return;
  }

  // Validate state against DB — cryptographically random and expiring
  const [stateRow] = await db
    .select()
    .from(digilockerStateTable)
    .where(eq(digilockerStateTable.state, state))
    .limit(1);

  if (!stateRow || stateRow.expiresAt < new Date()) {
    res.redirect(`${frontendDocs}?digilocker=error&reason=invalid_state`);
    return;
  }

  const { userId } = stateRow;

  // Consume state (one-time use)
  await db.delete(digilockerStateTable).where(eq(digilockerStateTable.state, state));

  if (!code) {
    res.redirect(`${frontendDocs}?digilocker=error&reason=missing_code`);
    return;
  }

  if (!DIGILOCKER_CLIENT_ID || !DIGILOCKER_CLIENT_SECRET) {
    res.redirect(`${frontendDocs}?digilocker=error&reason=not_configured`);
    return;
  }

  try {
    // Exchange authorization code for access token
    const tokenRes = await fetch(DIGILOCKER_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        grant_type: "authorization_code",
        client_id: DIGILOCKER_CLIENT_ID,
        client_secret: DIGILOCKER_CLIENT_SECRET,
        redirect_uri: getCallbackUri(),
      }).toString(),
    });

    if (!tokenRes.ok) {
      req.log.warn({ status: tokenRes.status }, "DigiLocker token exchange failed");
      res.redirect(`${frontendDocs}?digilocker=error&reason=token_exchange_failed`);
      return;
    }

    const tokenData = (await tokenRes.json()) as { access_token: string };

    // Fetch the user's document list
    let docs: Record<string, unknown>[] = [];
    const filesRes = await fetch(DIGILOCKER_FILES_URL, {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    if (filesRes.ok) {
      const filesData = (await filesRes.json()) as {
        items?: Record<string, unknown>[];
      };
      docs = filesData.items ?? [];
    } else {
      req.log.warn({ status: filesRes.status }, "DigiLocker files fetch failed");
    }

    // Store result bound to the authenticated user
    const resultKey = crypto.randomBytes(16).toString("hex");
    const expiresAt = new Date(Date.now() + RESULT_TTL_MIN * 60 * 1000);

    await db.insert(digilockerResultTable).values({
      key: resultKey,
      userId,
      documents: docs,
      expiresAt,
    });

    req.log.info({ docCount: docs.length, userId }, "DigiLocker documents fetched");
    res.redirect(`${frontendDocs}?digilocker=success&key=${resultKey}`);
  } catch (err) {
    req.log.error({ err }, "DigiLocker callback error");
    res.redirect(`${frontendDocs}?digilocker=error&reason=server_error`);
  }
});

// ────────────────────────────────────────────────────────────────────────────
// GET /api/digilocker/documents/:key   (authenticated)
//
// One-time retrieval of the fetched document list.  Ownership is verified
// before returning; the row is deleted after a successful read.
// ────────────────────────────────────────────────────────────────────────────
router.get("/digilocker/documents/:key", requireAuth, async (req, res): Promise<void> => {
  const requestingUserId = res.locals.userId as number;
  const key = String(req.params.key);

  const [row] = await db
    .select()
    .from(digilockerResultTable)
    .where(eq(digilockerResultTable.key, key))
    .limit(1);

  if (!row || row.expiresAt < new Date()) {
    res.status(404).json({ error: "Result not found or expired" });
    return;
  }

  if (row.userId !== requestingUserId) {
    res.status(403).json({ error: "Access denied" });
    return;
  }

  // Consume once
  await db.delete(digilockerResultTable).where(eq(digilockerResultTable.key, key));

  res.json({ documents: row.documents });
});

export default router;
