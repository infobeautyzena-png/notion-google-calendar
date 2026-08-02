# Notion → Google Calendar

Hotová aplikace pro Vercel.

## Co umí

- vytvořit událost při vytvoření položky v Notion,
- aktualizovat název a časy,
- odstranit událost při smazání položky,
- odstranit událost, pokud položce chybí název, začátek nebo konec.

## 1. Bezpečnost

Token zveřejněný v chatu v Notion okamžitě obnov. Používej pouze nový token.

## 2. GitHub

1. Rozbal ZIP.
2. Vytvoř nový soukromý GitHub repozitář.
3. Nahraj do něj všechny soubory z rozbalené složky.

## 3. Google Cloud

1. Vytvoř projekt.
2. Zapni Google Calendar API.
3. V Google Auth Platform nastav aplikaci jako External / Testing.
4. Přidej svůj Gmail mezi Test users.
5. Vytvoř OAuth Client typu Web application.
6. Zkopíruj Client ID a Client Secret.

## 4. Vercel

Importuj GitHub repozitář a nastav:

NOTION_TOKEN
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
GOOGLE_CALENDAR_ID=primary
GOOGLE_REDIRECT_URI=https://TVUJ-PROJEKT.vercel.app/api/google/callback
NOTION_TITLE_PROPERTY=Událost
NOTION_START_PROPERTY=Datum a čas start
NOTION_END_PROPERTY=Datum a čas end

Nasaď projekt.

## 5. Google autorizace

Přidej do Google OAuth klienta přesný redirect:

https://TVUJ-PROJEKT.vercel.app/api/google/callback

Otevři:

https://TVUJ-PROJEKT.vercel.app/api/google/start

Po autorizaci se zobrazí refresh token. Ve Vercelu ho ulož jako:

GOOGLE_REFRESH_TOKEN

Pak projekt znovu nasaď.

## 6. Notion webhook

V Notion Developer Portalu otevři:

Notion Google Calendar → Webhooks → Create subscription

URL:

https://TVUJ-PROJEKT.vercel.app/api/notion-webhook

Vyber:

page.created
page.properties_updated
page.content_updated
page.deleted
page.undeleted

Po prvním ověření najdeš ve Vercel Logs řádek:

NOTION VERIFICATION TOKEN: ...

Ulož tuto hodnotu jako:

NOTION_WEBHOOK_VERIFICATION_TOKEN

Pak znovu nasaď projekt a dokonči ověření webhooku.

## 7. Kontrola

Otevři:

https://TVUJ-PROJEKT.vercel.app/api/health

Všechny položky musí být true.
