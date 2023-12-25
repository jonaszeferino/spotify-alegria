import Head from "next/head";
import {
  Box,
  Button,
  Input,
  Text,
  ChakraProvider,
  Center,
  Image,
  Flex,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchData, setSearchData] = useState(null);
  const [searchDataAlbuns, setSearchDataAlbuns] = useState(null);
  const [searchError, setSearchError] = useState("");
  const [searchReciveToken, setSearchReciveToken] = useState("");
  const [artistIdRecive, setArtistIdRecive] = useState("");
  const [colorSelect, setColorSelect] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState(null);

  const router = useRouter();
  const accessToken = router.query.accessToken;

  useEffect(() => {
    if (accessToken) {
      console.log("Token de acesso disponível:", accessToken);
      setSearchReciveToken(accessToken);
    }
  }, [accessToken]);

  const handleSpotifyLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_CLIENTID;
    //const redirectUri = "https://spotify-alegria.vercel.app/callback";
    const redirectUri = "http://localhost:3000/callback";
    const scope =
      "playlist-modify-public playlist-modify-private playlist-read-private";
    const authorizationUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=${encodeURIComponent(scope)}`;

    console.log("URL de Autorização:", authorizationUrl);
    window.location.href = authorizationUrl;
  };

  const handleSearch = async () => {
    const accessToken = searchReciveToken;
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

  useEffect(() => {
    if (artistIdRecive) {
      handleSearchById();
    }
  }, [artistIdRecive, searchReciveToken]);

  const handleImageClick = (artistId) => {
    setArtistIdRecive(artistId);
    setSelectedCardId(artistId);
  };

  const handleSearchById = async () => {
    console.log("Chamou handleSearchById");
    const albumId = artistIdRecive;
    console.log("Album ID:", albumId);

    const country = "BR";

    const accessToken = searchReciveToken;
    const apiUrl = `https://api.spotify.com/v1/albums/${albumId}/tracks`;
    console.log("API URL:", apiUrl);

    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    try {
      const response = await fetch(apiUrl, requestOptions);
      const data = await response.json();

      console.log("Dados da resposta:", data);
      setSearchDataAlbuns(data);
    } catch (error) {
      console.error("Erro na requisição:", error);
      setSearchError("Erro ao realizar a pesquisa.");
    }
  };

  const handleCardColor = () => {
    setColorSelect(true);
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
            <Center>
              <Image src="/alegria.jpeg" />
            </Center>

            <Box className="grid">
              <Center>
                <Button onClick={handleSpotifyLogin} className="card">
                  Entrar na Alegria
                </Button>
              </Center>
              <br />
              <Box className="searchForm">
                <Center>
                  <Input
                    type="text"
                    placeholder="Digite sua pesquisa"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    mx="auto" // Adiciona margem à esquerda e à direita automaticamente
                    width="600px" // Define uma largura fixa para o Input (ajuste conforme necessário)
                  />
                </Center>

                <Center>
                  <Button onClick={handleSearch}>Pesquisar</Button>
                </Center>
                <br />

                {searchData && searchData.albums && searchData.albums.items && (
                  <Flex flexWrap="wrap" justifyContent="space-around">
                    {searchData.albums.items.map((album) => (
                      <Box
                        key={album.id}
                        m={4}
                        width="300px"
                        borderWidth="1px"
                        borderRadius="lg"
                        overflow="hidden"
                        bg={selectedCardId === album.id ? "green" : "white"} // Adicionado aqui
                      >
                        <Image
                          src={album.images[0].url}
                          alt={album.name}
                          onClick={() => handleImageClick(album.id)}
                          cursor="pointer"
                        />

                        <Box p="6">
                          <Text fontWeight="bold" fontSize="20px" mb="2">
                            {album.name}
                          </Text>
                          <Text color="gray.500">{album.artists[0].name}</Text>
                        </Box>
                      </Box>
                    ))}
                  </Flex>
                )}

                {searchError && <Text color="red.500">{searchError}</Text>}
                {searchDataAlbuns &&
                  searchDataAlbuns.items &&
                  searchDataAlbuns.items.length > 0 && (
                    <Flex flexWrap="wrap" justifyContent="space-around">
                      {searchDataAlbuns.items.map((track) => (
                        <Box key={track.id} m={4}>
                          <iframe
                            src={`https://open.spotify.com/embed/track/${track.id}`}
                            width="300"
                            height="380"
                            allowtransparency="true"
                            allow="encrypted-media"
                          ></iframe>
                          <p>{track.name}</p>
                        </Box>
                      ))}
                    </Flex>
                  )}
              </Box>
            </Box>
          </Box>
        </Center>
      </ChakraProvider>
    </>
  );
}
