import react, { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient"; // Importe o 'supabase' desta forma
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
  Image,
} from "@chakra-ui/react";
import { FaGoogle, FaEyeSlash, FaEye } from "react-icons/fa";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alertMessage, setAlertMessage] = useState(""); // Estado para a mensagem do Alert
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  //teste
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSignUp = async () => {
    setAlertMessage("");
    try {
      const { user, error, status } = await supabase.auth.signUp({
        email: email,
        password: password,
      });
      console.log("User:", user);
      console.log("Session:", session);
      console.log("Error:", error);
      setAlertMessage("Verifique seu E-mail");
      if (user) {
        console.log("Usuário cadastrado com sucesso:", user);
        setAlertMessage("Verifique seu E-mail");
      } else if (error) {
        if (status === 429) {
          console.log("Status 429 - Muitas solicitações recentes");
          setAlertMessage(
            "Você fez muitas solicitações recentemente. Aguarde um momento."
          );
        } else {
          console.error("Erro durante o cadastro:", error);
          setAlertMessage(error.message);
        }
      }
    } catch (e) {
      console.error("Erro completo:", e);
      setAlertMessage(e.message);
    }
  };

  const handleSignIn = async () => {
    setAlertMessage("");
    try {
      const { user, session, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      console.log("User:", user);
      console.log("Session:", session);
      console.log("Error:", error);
      if (error) {
        throw error;
      }
      setAlertMessage("Usuário Logando");
      console.log(user);
      console.log(session);
    } catch (e) {
      setAlertMessage(e.message);
    }
  };
  const changeForm = () => {
    setIsSignUp((value) => !value);
  };

  const handleGoogleSignIn = async () => {
    setAlertMessage("");
    try {
      const { user, session, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });
      console.log("User:", user);
      console.log("Session:", session);
      console.log("Error:", error);
      if (error) {
        throw error;
      }
      setAlertMessage("Usuário Logando");
      console.log(user);
      console.log(session);
    } catch (e) {
      setAlertMessage(e.message);
    }
  };

  useEffect(() => {
    let mounted = true;
    async function getInitialSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (mounted) {
        if (session) {
          setSession(session);
        }
        setIsLoading(false);
      }
    }
    getInitialSession();
    const { subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );
    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  return (
    <ChakraProvider>
      <>
        <ChakraProvider>
          <Center>
            {session ? (
              <p>
                Usuário: {session.user.email} <br />
                <Center>
                  <Button
                    onClick={() => supabase.auth.signOut()}
                    colorScheme="red"
                    size="sm"
                  >
                    Sair
                  </Button>
                </Center>
              </p>
            ) : null}
          </Center>
        </ChakraProvider>
      </>
      <Center height="80vh">
        <Box
          p={2}
          borderWidth="1px"
          maxW="400px"
          width="100%"
          position="relative"
          marginTop={10}
          margin={5}

        >
          <Heading as="h1" size="xl" textAlign="center" mb={4}>
            {isSignUp ? "Cadastre-se" : "Login"}
          </Heading>

          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Senha</FormLabel>
            <InputGroup>
              <Input
                type={showPassword ? "text" : "password"}
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
              <InputRightElement width="3rem">
                <Button
                  h="1.5rem"
                  size="sm"
                  onClick={togglePasswordVisibility}
                  tabIndex="-1"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <Link
            color="teal.500"
            href="https://spotify-alegria.vercel.app/send-email-password-reset"
          >
            Esqueci minha senha
          </Link>

          <Center>
            {!isSignUp && (
              <Button
                mt={4}
                colorScheme="teal"
                size="md"
                onClick={handleSignIn}
              >
                Login
              </Button>
            )}
            <br />
          </Center>
          <Center>
            <Image src="/alegria.jpeg" />
          </Center>
        </Box>
      </Center>
    </ChakraProvider>
  );
}
