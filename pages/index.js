import Head from "next/head";
import {
  Box,
  Button,
  Input,
  Text,
  ChakraProvider,
  Center,
  Image,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchData, setSearchData] = useState(null);
  const [searchError, setSearchError] = useState("");
  const [searchReciveToken, setSearchReciveToken] = useState("");

  const router = useRouter();
  const accessToken = router.query.accessToken;
  

  useEffect(() => {
    if (accessToken) {
      console.log("Token de acesso disponível:", accessToken);
      setSearchReciveToken(accessToken)
    }
  }, [accessToken]);

  const handleSpotifyLogin = () => {
    const clientId = "00f3230c60b14a2e9cdd4bb680becfb3";
    const redirectUri = "http://localhost:3000/callback";
    const scope =
      "playlist-modify-public playlist-modify-private playlist-read-private";
    const authorizationUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=${encodeURIComponent(scope)}`;

    // eslint-disable-next-line
    console.log("URL de Autorização:", authorizationUrl);

    window.location.href = authorizationUrl;
  };

  const handleSearch = async () => {
    const accessToken =
      //"BQDTaN0ATMTSKo5VV2P8tmAq3S03xkorx4r6O-a0tlfaigXS0NhFrxcafGTJkPKfswQWvNSBkkQzV9mD_snkESjNOTuT1SAhrpKVkaJNF2TI7-wuU4zdNbCmXjF_r7b76yJ6_bBz0SOikCpa67egDYTM-rA6JOKnciIKx9zsi2B4K-in2ADJ2Ih_6gUs5GujI1OU3DRYI6Yr9pyHZQQApTYzrfZ9afkX5iu7WepCYJFh-JmhHQSWaUl9-LR2Ew5J5qRClaXSnzxYPQ"
      searchReciveToken
    const apiUrl = "https://api.spotify.com/v1/search";

    const queryParams = new URLSearchParams({
      q: searchQuery,
      type: "album",
      market: "BR",
    });

    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const finalUrl = `${apiUrl}?${queryParams.toString()}`;

    try {
      const response = await fetch(finalUrl, requestOptions);
      const data = await response.json();

      console.log("Dados da resposta:", data);
      setSearchData(data);
    } catch (error) {
      console.error("Erro na requisição:", error);
      setSearchError("Erro ao realizar a pesquisa.");
    }
  };

  return (
    <>
      <Head>
        <title>Alegria</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ChakraProvider>
        <Center>
          <Box as="main">
            <Box className="description" />

            <Box className="grid">
              <Center>
                <Button onClick={handleSpotifyLogin} className="card">
                  Entrar na Alegria
                </Button>
              </Center>
              <Box className="searchForm">
                <Input
                  type="text"
                  placeholder="Digite sua pesquisa"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Center>
                  <Button onClick={handleSearch}>Pesquisar</Button>
                </Center>

                {searchData && searchData.albums && searchData.albums.items && (
                  <Box>
                    <Text>
                      Nome do álbum: {searchData.albums.items[0].name}
                    </Text>
                    <Text>
                      Artista: {searchData.albums.items[0].artists[0].name}
                    </Text>
                    <Image src={searchData.albums.items[0].images[0].url} />
                  </Box>
                )}
                {searchError && <Text color="red.500">{searchError}</Text>}
              </Box>
            </Box>
          </Box>
        </Center>
      </ChakraProvider>
    </>
  );
}
