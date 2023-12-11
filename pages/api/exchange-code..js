// Pseudo-código para exchange-code.js
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const { code } = req.query;

  // Substitua 'SEU_CLIENT_ID' e 'SEU_CLIENT_SECRET' pelas credenciais reais do seu aplicativo no Spotify
  const clientId = '00f3230c60b14a2e9cdd4bb680becfb3';
  const clientSecret = '236e22efc57345d0a819fd548c238b14';

  // Trocar código por token de acesso
  const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: 'http://localhost:3000/callback',
    }),
  });

  const tokenData = await tokenResponse.json();

  // Retornar o token de acesso na resposta
  res.status(200).json({ accessToken: tokenData.access_token });
}


//testar