import { Router, type IRouter } from "express";
import healthRouter from "./health";
import { getAuth } from "@clerk/express";

const router: IRouter = Router();

router.use(healthRouter);
router.get("/session", (req, res) => {
  const auth = getAuth(req);
  const userId = auth?.sessionClaims?.userId || auth?.userId;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const claims = auth.sessionClaims as Record<string, unknown> | undefined;
  const metadata = (claims?.metadata ??
    claims?.publicMetadata ??
    claims?.public_metadata) as { role?: unknown } | undefined;
  const role =
    metadata?.role === "counselor" || metadata?.role === "administrator"
      ? metadata.role
      : "student";

  return res.json({ userId, role });
});

export default router;
