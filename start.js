import { getOAuthClient } from "../../../lib/google";

export default function handler(req, res) {
  const auth = getOAuthClient();

  const url = auth.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: ["https://www.googleapis.com/auth/calendar.events"]
  });

  res.redirect(url);
}
