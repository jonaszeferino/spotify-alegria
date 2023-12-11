export default async function handler(req, res) {
    if (req.method !== 'GET') {
      res.status(405).json({ error: 'Method Not Allowed' });
      return;
    }
  
    try {
      // Construa a URL de autorização
      const authorizationUrl = new URL('https://accounts.spotify.com/authorize');
      authorizationUrl.searchParams.append('response_type', 'code');
      authorizationUrl.searchParams.append('client_id', '00f3230c60b14a2e9cdd4bb680becfb3');
      authorizationUrl.searchParams.append('redirect_uri', 'http://localhost:3000/callback');
      authorizationUrl.searchParams.append('scope', 'playlist-modify-public playlist-modify-private playlist-read-private');
  
      // Redirecione o cliente para a URL de autorização
      res.writeHead(302, { Location: authorizationUrl.toString() });
      res.end();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  