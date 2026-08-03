import crypto from "crypto";
import { readCalendarItem } from "../../lib/notion";
import { upsertEvent, deleteEvent } from "../../lib/google";

export const config = {
  api: { bodyParser: false }
};

async function rawBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString("utf8");
}

function validSignature(body, signature, token) {
  if (!signature || !token) return false;
  const expected = "sha256=" + crypto
    .createHmac("sha256", token)
    .update(body)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expected)
    );
  } catch {
    return false;
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Použij POST." });
  }

  try {
    const body = await rawBody(req);
    const payload = JSON.parse(body || "{}");

    if (payload.verification_token) {
      console.log("NOTION VERIFICATION TOKEN:", payload.verification_token);
      return res.status(200).json({ received: true });
    }

    const verificationToken = process.env.NOTION_WEBHOOK_VERIFICATION_TOKEN;
    const signature = req.headers["x-notion-signature"];

    if (!verificationToken) {
      return res.status(503).json({
        error: "Chybí NOTION_WEBHOOK_VERIFICATION_TOKEN."
      });
    }

    if (!validSignature(body, signature, verificationToken)) {
      return res.status(401).json({ error: "Neplatný podpis webhooku." });
    }

    const type = payload.type || "";
    const pageId = payload.entity?.id;

    if (!pageId) {
      return res.status(200).json({ ignored: true, reason: "Chybí page ID." });
    }

    if (type === "page.deleted") {
      return res.status(200).json(await deleteEvent(pageId));
    }

    const supported = new Set([
      "page.created",
      "page.properties_updated",
      "page.content_updated",
      "page.undeleted"
    ]);

    if (!supported.has(type)) {
      return res.status(200).json({ ignored: true, type });
    }

    const item = await readCalendarItem(pageId);

    if (item.deleted || !item.title || !item.start || !item.end) {
      return res.status(200).json(await deleteEvent(pageId));
    }

    if (Date.parse(item.end) <= Date.parse(item.start)) {
      return res.status(200).json({
        ignored: true,
        reason: "Konec musí být později než začátek."
      });
    }

    return res.status(200).json(await upsertEvent(item));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
