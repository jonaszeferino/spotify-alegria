import { useEffect } from "react";
import { useRouter } from "next/router";

const CallbackPage = () => {
  const router = useRouter();

  useEffect(() => {
    const { code } = router.query;

    if (code) {
      fetch(`/api/exchange-code?code=${code}`)
        .then((response) => response.json())
        .then((data) => {
          console.log("Token de acesso:", data.accessToken);
        })
        .catch((error) => {
          console.error("Erro ao trocar código por token:", error);
        });
    }
  }, [router.query]);

  return <div>Redirecionando...</div>;
};

export default CallbackPage;
