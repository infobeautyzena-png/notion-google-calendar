export default function handler(req, res) {
  res.status(200).json({
    ok: true,
    configured: {
      NOTION_TOKEN: Boolean(process.env.NOTION_TOKEN),
      NOTION_WEBHOOK_VERIFICATION_TOKEN: Boolean(
        process.env.NOTION_WEBHOOK_VERIFICATION_TOKEN
      ),
      GOOGLE_CLIENT_ID: Boolean(process.env.GOOGLE_CLIENT_ID),
      GOOGLE_CLIENT_SECRET: Boolean(process.env.GOOGLE_CLIENT_SECRET),
      GOOGLE_REFRESH_TOKEN: Boolean(process.env.GOOGLE_REFRESH_TOKEN),
      GOOGLE_REDIRECT_URI: Boolean(process.env.GOOGLE_REDIRECT_URI)
    }
  });
}
