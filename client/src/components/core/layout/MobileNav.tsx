import {
  Flex,
  useColorModeValue,
  Text,
  Box,
  IconButton,
  HStack,
  Menu,
  MenuButton,
  Avatar,
  VStack,
  MenuList,
  MenuDivider,
  MenuItem,
  Button,
} from "@chakra-ui/react";
import { FiMenu, FiBell, FiChevronDown } from "react-icons/fi";
import { useJwt } from "react-jwt";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../states/hooks";
import { selectUser } from "../../../states/slices/userSlice";
import { MobileProps } from "../../../types/Utils";

import male from "../../../assets/male.png";
import female from "../../../assets/female.png";
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  // Retrieve auth token from local storage or initialize an empty string
  const auth_token = localStorage.getItem("token") ?? "";
  // Destructure isExpired from useJwt hook, it checks if the token is expired
  const { isExpired } = useJwt(auth_token);
  // Retrieve user data from app selector
  const user = useAppSelector(selectUser);
  // Initialize navigate function from useNavigate hook
  const navigate = useNavigate();

  // Define signout function to remove token from local storage and navigate to "/"
  const signout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{ base: "space-between", md: "flex-end" }}
      {...rest}
    >
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text
        mt={4}
        display={{ base: "flex", md: "none" }}
        fontSize="2xl"
        fontWeight="semibold"
      >
        Tarding System
      </Text>

      <HStack spacing={{ base: "0", md: "6" }}>
        {isExpired === false ? (
          <>
            <Flex alignItems={"center"}>
              <Menu>
                <MenuButton
                  py={2}
                  transition="all 0.3s"
                  _focus={{ boxShadow: "none", border: "none" }}
                  _hover={{ border: "none" }}
                >
                  <HStack>
                    <Avatar
                      size={"lg"}
                      src={user.data.gender === "male" ? male : female}
                    />
                    <VStack
                      display={{ base: "none", md: "flex" }}
                      alignItems="flex-start"
                      spacing="1px"
                      ml="2"
                    >
                      <Text fontSize="sm">
                        {user.data.name} {user.data.surname}
                      </Text>
                      <Text fontSize="xs" color="gray.600">
                        {user.data.role === 0 ? "Admin" : "Customer"}
                      </Text>
                    </VStack>
                    <Box display={{ base: "none", md: "flex" }}>
                      <FiChevronDown />
                    </Box>
                  </HStack>
                </MenuButton>
                <MenuList
                  zIndex={99999}
                  bg={useColorModeValue("white", "gray.900")}
                  borderColor={useColorModeValue("gray.200", "gray.700")}
                >
                  <MenuDivider />
                  <MenuItem onClick={signout}>Sign out</MenuItem>
                </MenuList>
              </Menu>
            </Flex>
          </>
        ) : (
          <>
            <Button
              onClick={() => navigate("/auth/login")}
              _focus={{ border: "none" }}
              variant={"ghost"}
              colorScheme="blue"
            >
              Login
            </Button>
            <Button
              onClick={() => navigate("/auth/signup")}
              _focus={{ border: "none" }}
              variant={"solid"}
              colorScheme="blue"
            >
              Start Selling
            </Button>
          </>
        )}
      </HStack>
    </Flex>
  );
};

export default MobileNav;
