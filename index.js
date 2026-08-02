export default function Home() {
  return (
    <main style={{
      fontFamily: "system-ui, sans-serif",
      maxWidth: 760,
      margin: "64px auto",
      padding: "0 20px",
      lineHeight: 1.6
    }}>
      <h1>Notion → Google Calendar</h1>
      <p>Aplikace běží.</p>
      <p><code>/api/health</code> — kontrola nastavení</p>
      <p><code>/api/google/start</code> — autorizace Google účtu</p>
      <p><code>/api/notion-webhook</code> — Notion webhook</p>
    </main>
  );
}
