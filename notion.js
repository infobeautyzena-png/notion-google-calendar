import { Client } from "@notionhq/client";

function client() {
  if (!process.env.NOTION_TOKEN) {
    throw new Error("Chybí NOTION_TOKEN.");
  }
  return new Client({ auth: process.env.NOTION_TOKEN });
}

function plain(items = []) {
  return items.map((x) => x.plain_text || "").join("").trim();
}

function titleValue(page, name) {
  const p = page.properties?.[name];
  if (!p) return "";
  if (p.type === "title") return plain(p.title);
  if (p.type === "rich_text") return plain(p.rich_text);
  return "";
}

function dateStart(page, name) {
  const p = page.properties?.[name];
  if (!p || p.type !== "date") return "";
  return p.date?.start || "";
}

export async function readCalendarItem(pageId) {
  const page = await client().pages.retrieve({ page_id: pageId });

  const titleName = process.env.NOTION_TITLE_PROPERTY || "Událost";
  const startName = process.env.NOTION_START_PROPERTY || "Datum a čas start";
  const endName = process.env.NOTION_END_PROPERTY || "Datum a čas end";

  return {
    pageId: page.id,
    title: titleValue(page, titleName),
    start: dateStart(page, startName),
    end: dateStart(page, endName),
    notionUrl: page.url || "",
    deleted: Boolean(page.in_trash || page.archived)
  };
}
