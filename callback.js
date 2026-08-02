import { getOAuthClient } from "../../../lib/google";

export default async function handler(req, res) {
  try {
    const code = req.query.code;
    if (!code) return res.status(400).send("Chybí autorizační kód.");

    const auth = getOAuthClient();
    const { tokens } = await auth.getToken(code);

    if (!tokens.refresh_token) {
      return res.status(400).send(
        "Google nevrátil refresh token. Odeber aplikaci z oprávnění Google účtu a autorizuj znovu."
      );
    }

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(200).send(`
      <h1>Hotovo</h1>
      <p>Ve Vercelu vytvoř proměnnou <b>GOOGLE_REFRESH_TOKEN</b> s touto hodnotou:</p>
      <pre style="white-space:pre-wrap;word-break:break-all">${tokens.refresh_token}</pre>
      <p>Token nikomu neposílej.</p>
    `);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
