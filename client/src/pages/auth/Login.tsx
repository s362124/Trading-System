
import {
  Box,
  Button,
  Flex,
  Text,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Link,
  Heading,
  useToast
} from "@chakra-ui/react";
import { LoginDTO } from "../../types/Auth";
import { useCallback , useState} from "react";
import { AuthService } from "../../services/AuthService";
import { useAppDispatch, useAppSelector } from "../../states/hooks";
import {
  selectAuth,
  setAuthData,
  setErrorAuth,
  setIsLoadingAuth,
} from "../../states/slices/authSlice";
import { useNavigate } from "react-router-dom";

export default function Login() {
 // Initialize necessary services, dispatch, and state
 const authService = new AuthService();
 const dispatch = useAppDispatch();
 const authState = useAppSelector(selectAuth);
 const navigate = useNavigate();
 const [formData, setFormData] = useState<LoginDTO>({
   email: "",
   password: "",
 });
 const toast = useToast();

 // Function to handle input changes
 const inputSetter = (value: string, type: "email" | "password") => {
   setFormData((prev) => ({
     ...prev,
     [type]: value,
   }));
 };

 // Function to handle form submission
 const submitHandler = useCallback(
   async (e: React.FormEvent, data: LoginDTO) => {
     e.preventDefault();
     try {
       dispatch(setIsLoadingAuth(true));
       const res = await authService.login(data);
       dispatch(setAuthData(res));
       dispatch(setIsLoadingAuth(false));
       // Show success toast and navigate to the home page upon successful login
       toast({
         status: "success",
         title: "Logged In successfully!",
         description: "Welcome back to our platform ",
         isClosable: true,
         duration: 5000,
       });
       navigate("/");
     } catch (error) {
       // Show error toast and update state upon failed login attempt
       dispatch(setErrorAuth("Error logging in, please try again later!"));
       dispatch(setIsLoadingAuth(false));
       toast({
         status: "error",
         title: "Failed to login!",
         description:
           "Please check your credentials, or try again later.",
         isClosable: true,
         duration: 5000,
       });
     }
   },
   []
 );

  return (
    <Flex
      bg="white"
      align="center"
      justify="center"
      minH="100vh"
      px={{ base: 4, md: 0 }}
    >
      <Box
        borderWidth={2}
        borderColor={"blue.300"}
        w={{ base: "100%", md: "30vw" }}
        maxW="500px"
        p={6}
        rounded="md"
      >
        <Heading color={"blue.400"} my={5} textAlign="center">
          Signup
        </Heading>
        <form
          onSubmit={(e) =>
            submitHandler(e, formData)
          }
        >
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel color="gray.400" htmlFor="email">
                Email Address
              </FormLabel>
              <Input
              color={"blue.400"}
                bg={"gray.50"}
                id="email"
                _placeholder={{color:"blue.100"}}
                name="email"
                type="email"
                variant="filled"
                placeholder="your-email@example.com"
                onChange={e=>inputSetter(e.target.value,"email")}
                value={formData.email}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel color="gray.400" htmlFor="password">
                Password
              </FormLabel>
              <Input
                color={"blue.400"}
                bg={"gray.50"}
                id="password"
                _placeholder={{color:"blue.100"}}
                placeholder="********"
                name="password"
                type="password"
                variant="filled"
                onChange={e=>inputSetter(e.target.value,"password")}
                value={formData.password}
              />
            </FormControl>
            
            <Button mt={10} type="submit" _focus={{border:"none"}} variant={"solid"} isLoading={authState.isLoadingAuth} colorScheme="blue">
              Login
            </Button>
            <Text color="gray.300">
              I don't have an account! <Link color="blue.300" href="/auth/signup">Signup now.</Link>
            </Text>
          </VStack>
        </form>
      </Box>
    </Flex>
  );
}
