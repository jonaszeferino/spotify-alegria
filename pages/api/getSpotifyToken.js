export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  try {
    const authorizationUrl = new URL("https://accounts.spotify.com/authorize");
    authorizationUrl.searchParams.append("response_type", "code");
    authorizationUrl.searchParams.append("client_id","00f3230c60b14a2e9cdd4bb680becfb3");
    authorizationUrl.searchParams.append("redirect_uri","https://spotify-alegria.vercel.app/callback");
    authorizationUrl.searchParams.append("scope","playlist-modify-public playlist-modify-private playlist-read-private");

    res.writeHead(302, { Location: authorizationUrl.toString() });
    res.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
