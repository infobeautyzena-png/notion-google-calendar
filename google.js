import { google } from "googleapis";

function oauth() {
  const {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI,
    GOOGLE_REFRESH_TOKEN
  } = process.env;

  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REDIRECT_URI) {
    throw new Error("Chybí Google OAuth proměnné.");
  }

  const auth = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI
  );

  if (GOOGLE_REFRESH_TOKEN) {
    auth.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN });
  }

  return auth;
}

function calendar() {
  if (!process.env.GOOGLE_REFRESH_TOKEN) {
    throw new Error("Chybí GOOGLE_REFRESH_TOKEN.");
  }
  return google.calendar({ version: "v3", auth: oauth() });
}

function calendarId() {
  return process.env.GOOGLE_CALENDAR_ID || "primary";
}

export function getOAuthClient() {
  return oauth();
}

export async function findByNotionPageId(pageId) {
  const result = await calendar().events.list({
    calendarId: calendarId(),
    privateExtendedProperty: [`notionPageId=${pageId}`],
    singleEvents: true,
    maxResults: 5
  });

  return result.data.items?.[0] || null;
}

export async function upsertEvent(item) {
  const api = calendar();
  const id = calendarId();
  const existing = await findByNotionPageId(item.pageId);

  const requestBody = {
    summary: item.title,
    description: [
      "Synchronizováno z Notion.",
      item.notionUrl ? `Notion: ${item.notionUrl}` : ""
    ].filter(Boolean).join("\n"),
    start: { dateTime: item.start },
    end: { dateTime: item.end },
    extendedProperties: {
      private: { notionPageId: item.pageId }
    }
  };

  if (existing?.id) {
    await api.events.patch({
      calendarId: id,
      eventId: existing.id,
      requestBody
    });
    return { action: "updated", eventId: existing.id };
  }

  const created = await api.events.insert({
    calendarId: id,
    requestBody
  });

  return { action: "created", eventId: created.data.id };
}

export async function deleteEvent(pageId) {
  const api = calendar();
  const existing = await findByNotionPageId(pageId);

  if (!existing?.id) return { action: "not_found" };

  await api.events.delete({
    calendarId: calendarId(),
    eventId: existing.id
  });

  return { action: "deleted", eventId: existing.id };
}
