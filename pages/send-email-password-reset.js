import { useState } from "react";
import { supabase } from "../utils/supabaseClient";
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  ChakraProvider,
  Center,
  Alert,
  AlertIcon,
  Link,
  Divider,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import Head from "next/head";

export default function PasswordResetPage() {
  const [email, setEmail] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  console.log(email);

  const handlePasswordLinkReset = async () => {
    setAlertMessage("");
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo:
          "https://spotify-alegria.vercel.app/send-email-password-reset",
      });
      if (error) {
        throw error;
      }
      setAlertMessage("Reset link sent to your e-mail");
    } catch (e) {
      console.log(e); // Add this line to log any errors to the console
      setAlertMessage(e.message);
    }
  };

  return (
    <ChakraProvider>
      <Head>
        <title>Reset Password</title>
        <meta name="keywords" content="tvshow,watch,review"></meta>
        <meta name="description" content="filmes, series,"></meta>
      </Head>
      <></>
      <Center height="50vh">
        <Box
          p={4}
          borderWidth="1px"
          maxW="400px"
          width="100%"
          position="relative"
        >
          <Heading as="h1" size="xl" textAlign="center" mb={4}>
            Password Reset{" "}
          </Heading>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </FormControl>

          <br />
          <Center>
            <Button
              onClick={() => handlePasswordLinkReset()}
              colorScheme="green"
              size="sm"
            >
              Send a Link
            </Button>
          </Center>

          <Center>
            <Image src="/alegria.jpeg" />
          </Center>
          <br />
          {alertMessage && (
            <ChakraProvider>
              <Alert status="info">
                <AlertIcon />
                {alertMessage === "Email not confirmed"
                  ? "E-mail Não Confirmado"
                  : alertMessage}
              </Alert>
            </ChakraProvider>
          )}
          <br />

          <Divider my={4} />

          <br />
        </Box>
      </Center>
    </ChakraProvider>
  );
}
