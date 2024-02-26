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
  useToast,
  HStack,
  RadioGroup,
  Radio,
  Stack,
} from "@chakra-ui/react";
import { SignupDTO } from "../../types/Auth";
import { useCallback, useState } from "react";
import { AuthService } from "../../services/AuthService";
import { useAppDispatch, useAppSelector } from "../../states/hooks";
import {
  selectAuth,
  setAuthData,
  setErrorAuth,
  setIsLoadingAuth,
} from "../../states/slices/authSlice";
import { useNavigate } from "react-router-dom";


const ErrorMessage = ({message})=>{
  return <Text color={"red.400"}>{message}</Text>
}
export default function Signup() {
  //auth service to handle signup request
  const authService = new AuthService();
  //acion dispatcher
  const dispatch = useAppDispatch();
  //auth state from app selector
  const authState = useAppSelector(selectAuth);
  //navigator hook used to navigate between routes
  const navigate = useNavigate();
  //form data local state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    gender: "",
    name: "",
    phone: "",
    surname: "",
    address:""
  });
  //toast to show notifications about register process
  const toast = useToast();

//form validation errors
  
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    gender: "",
    name: "",
    phone: "",
    surname: "",
    address: ""
  });
  //a function to validate form
  const validateForm = () => {
    let valid = true;
    const newErrors = {
      email: "",
      password: "",
      gender: "",
      name: "",
      phone: "",
      surname: "",
      address: ""
    };
    //name verification
    if (!formData.name) {
      newErrors.name = "Name is required";
      valid = false;
    }
    //surname verification
    if (!formData.surname) {
      newErrors.surname = "Surname is required";
      valid = false;
    }
    //name verification
    if (!formData.address) {
      newErrors.address = "Address is required";
      valid = false;
    }
    //gender verification
    if (!formData.gender) {
      newErrors.gender = "Gender is required";
      valid = false;
    }
    // Email validation
  if (!formData.email) {
    newErrors.email = "Email is required";
    valid = false;
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    newErrors.email = "Email is invalid";
    valid = false;
  }

  // Password validation
  if (!formData.password) {
    newErrors.password = "Password is required";
    valid = false;
  } else if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(formData.password)) {
    newErrors.password = "Password must contain at least 8 characters, including 1 uppercase letter, 1 lowercase letter, and 1 number";
    valid = false;
  }
  // Phone number validation
  if (!formData.phone) {
    newErrors.phone = "Phone number is required";
    valid = false;
  } else if (!/^\d{8}$/.test(formData.phone)) {
    newErrors.phone = "Phone number must be 8 digits";
    valid = false;
  }

    // You can add more validation rules for other fields


    return {valid,newErrors};
  };
  //a function that sets the inpu value given the value and the input filed currently used 
  //eg : user is enetring data in the email field, it will set the email with the given value 
  const inputSetter = (
    value: string,
    type: "email" | "password" | "name" | "surname" | "phone" | "gender" | "address"
  ) => {
    switch (type) {
      case "email":
        setFormData((prev) => {
          return {
            ...prev,
            email: value,
          };
        });
        break;
      case "password":
        setFormData((prev) => {
          return {
            ...prev,
            password: value,
          };
        });
        break;
      case "name":
        setFormData((prev) => {
          return {
            ...prev,
            name: value,
          };
        });
        break;
      case "surname":
        setFormData((prev) => {
          return {
            ...prev,
            surname: value,
          };
        });
        break;
      case "gender":
        setFormData((prev) => {
          return {
            ...prev,
            gender: value,
          };
        });
        break;
      case "phone":
        setFormData((prev) => {
          return {
            ...prev,
            phone: value,
          };
        });
        break;
        case "address":
        setFormData((prev) => {
          return {
            ...prev,
            address: value,
          };
        });
        break;
    }
  };
  //a  handler function that handles the form submission
  const submitHandler = useCallback(
    async (e: React.FormEvent, data: SignupDTO) => {
      console.log(errors)
      e.preventDefault();
      if(validateForm().valid){
        try {
          dispatch(setIsLoadingAuth(true));
          const res = await authService.signup(data);
          dispatch(setAuthData(res));
          dispatch(setIsLoadingAuth(false));
          //toast if register is successfull
          toast({
            status: "success",
            title: "Signed up successfully!",
            description: "Welcome to our platform ",
            isClosable: true,
            duration: 5000,
          });
          //navigate to login if register is successfull
          navigate("/auth/login")
  
        } catch (error) {
          dispatch(setErrorAuth("Error Signing in, please try again later!"));
          dispatch(setIsLoadingAuth(false));
          //toast if register is failed
          toast({
            status: "error",
            title: "Failed to Signup!",
            description: "Please try again later.",
            isClosable: true,
            duration: 5000,
          });
        }
      }else{
        setErrors(validateForm().newErrors)
      }
    },
    [formData]
  );

  return ( <Flex
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
          submitHandler(e, {
            phoneNumber: parseInt(formData.phone),
            role: 1,
            ...formData,
          })
        }
      >
        <VStack spacing={4} align="stretch">
            <FormControl >
              
              <FormLabel color="gray.400" htmlFor="email">
                Full name
              </FormLabel>
              <HStack spacing={2}>
                <Input
                  color={"blue.400"}
                  bg={"gray.50"}
                  id="name"
                  _placeholder={{ color: "blue.100" }}
                  name="name"
                  type="text"
                  variant="filled"
                  placeholder="First name"
                  onChange={(e) => inputSetter(e.target.value, "name")}
                  value={formData.name}
                />
                
                <Input
                  color={"blue.400"}
                  bg={"gray.50"}
                  id="surname"
                  _placeholder={{ color: "blue.100" }}
                  name="surname"
                  type="surname"
                  variant="filled"
                  placeholder="Family name"
                  onChange={(e) => inputSetter(e.target.value, "surname")}
                  value={formData.surname}
                />
                
              </HStack>
              <Flex justifyContent={"space-between"}>
              {errors.name && <ErrorMessage message ={errors.name}></ErrorMessage>}
              {errors.surname && <ErrorMessage message ={errors.surname}></ErrorMessage>}
              </Flex>
            </FormControl>
            <FormControl >
              <FormLabel color="gray.400" htmlFor="email">
                Email Address
              </FormLabel>
              <Input
                color={"blue.400"}
                bg={"gray.50"}
                id="email"
                _placeholder={{ color: "blue.100" }}
                name="email"
                type="email"
                variant="filled"
                placeholder="your-email@example.com"
                onChange={(e) => inputSetter(e.target.value, "email")}
                value={formData.email}
              />
              {errors.email && <ErrorMessage message ={errors.email}></ErrorMessage>}
            </FormControl>
            <FormControl >
              <FormLabel color="gray.400" htmlFor="email">
                Phone number
              </FormLabel>
              <Input
                color={"blue.400"}
                bg={"gray.50"}
                id="phone"
                _placeholder={{ color: "blue.100" }}
                name="phone"
                type="phone"
                variant="filled"
                placeholder="+216 99 999 999"
                onChange={(e) => inputSetter(e.target.value, "phone")}
                value={formData.phone}
              />
              {errors.phone && <ErrorMessage message ={errors.phone}></ErrorMessage>}
            </FormControl>
            <FormControl >
              <FormLabel color="gray.400" htmlFor="password">
                Password
              </FormLabel>
              <Input
                color={"blue.400"}
                bg={"gray.50"}
                id="password"
                _placeholder={{ color: "blue.100" }}
                placeholder="********"
                name="password"
                type="password"
                variant="filled"
                onChange={(e) => inputSetter(e.target.value, "password")}
                value={formData.password}
              />
              {errors.password && <ErrorMessage message ={errors.password}></ErrorMessage>}
            </FormControl>
            <FormControl >
              <FormLabel color="gray.400" htmlFor="email">
                Address
              </FormLabel>
              <Input
                color={"blue.400"}
                bg={"gray.50"}
                _placeholder={{ color: "blue.100" }}
                type="text"
                variant="filled"
                placeholder="Street, Rity, Region - Postal code"
                onChange={(e) => inputSetter(e.target.value, "address")}
                value={formData.address}
              />
              {errors.address && <ErrorMessage message ={errors.address}></ErrorMessage>}
            </FormControl>
            <FormControl >
              <FormLabel color="gray.400" htmlFor="email">
                Gender
              </FormLabel>
              <RadioGroup
                onChange={(value) => inputSetter(value, "gender")}
                value={formData.gender}
                defaultValue="1"
              >
                <Stack spacing={4} direction="row">
                  <Radio color="blue.400" value="male">
                    <Text color="blue.400">Male</Text>
                  </Radio>
                  <Radio color="blue.400" value="female">
                    <Text color="blue.400">Female</Text>
                  </Radio>
                </Stack>
              </RadioGroup>
              {errors.gender && <ErrorMessage message ={errors.gender}></ErrorMessage>}
            </FormControl>
            <Button
              mt={10}
              type="submit"
              _focus={{ border: "none" }}
              variant={"solid"}
              isLoading={authState.isLoadingAuth}
              colorScheme="blue"
            >
              Signup
            </Button>
            <Text color="gray.300">
              I already have an account!{" "}
              <Link color="blue.300" href="/auth/login">
                Login now.
              </Link>
            </Text>
          </VStack>
        </form>
      </Box>
    </Flex>
  );
}
