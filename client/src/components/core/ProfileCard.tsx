import {
  Heading,
  Avatar,
  Box,
  Center,
  Image,
  Flex,
  Text,
  Stack,
  Button,
  useColorModeValue,
  FormControl,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  FormLabel,
  FormHelperText,
  Input,
  useToast,
  FormErrorMessage,
} from "@chakra-ui/react";
import { UserService } from "../../services/UserService";
import { useNavigate } from "react-router-dom";
import {
  selectUser,
  setErrorUser,
  setIsLoadingUser,
} from "../../states/slices/userSlice";
import { useAppDispatch, useAppSelector } from "../../states/hooks";
import { useState } from "react";
import male from "../../assets/male.png";
import female from "../../assets/female.png";
function ConfirmDisableModal({ id }: { id: string }) {
  // State and hook declarations
  const { isOpen, onOpen, onClose } = useDisclosure(); // Managing modal state
  const confirmMessage = "Delete my account"; // Message to confirm account deletion
  const [input, setInput] = useState(""); // State for input field
  const navigate = useNavigate(); // Navigation hook
  const dispatch = useAppDispatch(); // Redux dispatch hook
  const toast = useToast(); // Toast notification hook
  const { errorUser, isLoadingUser } = useAppSelector(selectUser); // Redux state selectors

  // Function to handle account deletion
  const disableAccount = async (e: React.FormEvent, id: string) => {
    e.preventDefault(); // Prevent default form submission
    const userService = new UserService(); // Instantiate UserService
    if (input === confirmMessage) {
      // Check if input matches confirm message
      try {
        dispatch(setIsLoadingUser(true)); // Set loading state
        const res = await userService.delete(id); // Delete user account
        dispatch(setIsLoadingUser(false)); // Set loading state
        // Show success toast
        toast({
          title: "Account deleted successfully!",
          status: "info",
          duration: 5000,
          isClosable: true,
        });
        onClose(); // Close modal
        localStorage.removeItem("token"); // Remove token from localStorage
        navigate("/"); // Navigate to homepage
      } catch (error) {
        // Handle error if deletion fails
        dispatch(setErrorUser("Failed to disable account, try again later."));
        // Show error toast
        toast({
          title: "Failed to delete, please try again later!",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        dispatch(setIsLoadingUser(false)); // Set loading state
      }
    } else {
      // Show warning toast if input doesn't match confirm message
      toast({
        title: "Please check your confirm message again!",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Component render
  return (
    <>
      {/* Button to open modal */}
      <Button
        w={"full"}
        mt={8}
        bg={useColorModeValue("red.400", "gray.900")}
        color={"white"}
        rounded={"md"}
        onClick={onOpen}
        _hover={{
          transform: "translateY(-2px)",
          boxShadow: "lg",
          borderColor: "red.400",
        }}
      >
        Delete my account
      </Button>

      {/* Modal for confirmation */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        {/* Form for confirmation */}
        <form onSubmit={(e) => disableAccount(e, id)}>
          <ModalContent>
            <ModalHeader>Confirm Account Deletion</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                {/* Helper text */}
                <FormHelperText mb={2} fontSize={14} my={2}>
                  To confirm account deletion, please type in
                </FormHelperText>
                {/* Confirmation message */}
                <Text
                  mb={2}
                  letterSpacing={1.5}
                  fontSize={16}
                  fontWeight={"bold"}
                >
                  "{confirmMessage}"
                </Text>
                {/* Input field */}
                <Input
                  _focus={{ borderWidth: "3px" }}
                  borderWidth={"1px"}
                  borderColor={"red.300"}
                  color={"red.400"}
                  value={input}
                  _disabled={{ color: "gray.400" }}
                  onChange={(e) => setInput(e.target.value)}
                  type={"text"}
                  fontWeight="500"
                  variant="main"
                  placeholder={"Delete my account"}
                  _placeholder={{
                    fontWeight: "400",
                    color: "secondaryGray.600",
                  }}
                  h="44px"
                  maxH="44px"
                />
                {/* Error message */}
                {errorUser && <FormErrorMessage>{errorUser}</FormErrorMessage>}
              </FormControl>
            </ModalBody>

            {/* Modal footer */}
            <ModalFooter>
              {/* Delete account button */}
              <Button
                w={"full"}
                type="submit"
                isLoading={isLoadingUser}
                bg={useColorModeValue("red.400", "gray.900")}
                color={"white"}
                rounded={"md"}
                _hover={{
                  transform: "translateY(-2px)",
                  boxShadow: "lg",

                  borderColor: "red.400",
                }}
              >
                Delete my account
              </Button>
              {/* Cancel button */}
              <Button
                mx={2}
                _hover={{
                  transform: "translateY(-2px)",
                  boxShadow: "lg",
                }}
                onClick={onClose}
                variant="ghost"
              >
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  );
}

// ProfileCard component definition
export default function ProfileCard({
  id,
  name,
  surname,
  email,
  phone,
  role,
  bgImage,
  gender,
}) {
  return (
    <Center>
      <Box
        h={"full"}
        maxW={"600px"}
        w={"full"}
        bg={useColorModeValue("white", "gray.800")}
        boxShadow={"2xl"}
        rounded={"md"}
        overflow={"hidden"}
      >
        <Image h={"120px"} w={"full"} src={bgImage} objectFit="cover" alt="#" />
        <Flex justify={"center"} mt={-12}>
          <Avatar
            size={"xl"}
            src={gender == "male" ? male : female} // Not clear if bgImage is the correct source for Avatar
            css={{
              border: "2px solid white",
            }}
          />
        </Flex>

        <Box p={6}>
          <Stack spacing={0} align={"center"} mb={5}>
            <Heading fontSize={"2xl"} fontWeight={500} fontFamily={"body"}>
              {name} {surname}
            </Heading>
            <Text color={"gray.500"}>{role === 0 ? "Admin" : "Customer"}</Text>
          </Stack>

          <Stack direction={"row"} justify={"center"} spacing={6}>
            <Stack spacing={0} align={"center"}>
              <Text fontWeight={600}>Email</Text>
              <Text fontSize={"sm"} color={"gray.500"}>
                {email}
              </Text>
            </Stack>
            <Stack spacing={0} align={"center"}>
              <Text fontWeight={600}>Phone Number</Text>
              <Text fontSize={"sm"} color={"gray.500"}>
                {phone}
              </Text>
            </Stack>
          </Stack>

          <ConfirmDisableModal id={id} />
        </Box>
      </Box>
    </Center>
  );
}
