// pages/callback.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const CallbackPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const { code } = router.query;
    const exchangeCodeForToken = async () => {
      try {
        console.log("Código recebido:", code);

        const response = await fetch(`/api/exchange-code?code=${code}`);
        const data = await response.json();
        console.log("Token de acesso recebido:", data.accessToken);
        setAccessToken(data.accessToken);
        router.push("/");
      } catch (error) {
        console.error("Erro ao trocar código por token:", error);
      } finally {
        setLoading(false);
      }
    };

    if (code) {
      exchangeCodeForToken();
    }
  }, [router.query]);

  return (
    <div>
      {loading ? (
        <p>Redirecionando...</p>
      ) : (
        <p>
          O processo de autenticação foi concluído. Você pode fechar esta
          janela.
        </p>
      )}
    </div>
  );
};

export default CallbackPage;
