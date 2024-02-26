import { ChangeEvent, useEffect, useState } from "react";
import Layout from "../../components/core/Layout";
import { UserService } from "../../services/UserService";
import { useAppDispatch, useAppSelector } from "../../states/hooks";
import { useJwt } from "react-jwt";
import {
  selectUser,
  setErrorUser,
  setIsLoadingUser,
  setUser,
} from "../../states/slices/userSlice";
import Loader from "../../components/core/Loader";
import {
  Box,
  Center,
  VStack,
  Text,
  Button,
  Card,
  Flex,
  HStack,
  Divider,
  useToast,
} from "@chakra-ui/react";
import {
  selectItems,
  setErrorItems,
  setItems,
  setLoadingItems,
} from "../../states/slices/itemSlice";
import { ItemService } from "../../services/ItemService";
import { useNavigate } from "react-router-dom";
import ModifiableAtomicData from "../../components/core/ModifiableAtomicData";
import { User } from "../../types/User";
import ItemsTable from "../../components/core/ItemsTable";
import ProfilCard from "../../components/core/ProfileCard";
// Profile component definition
const Profile = () => {
  // Initialization of necessary hooks and states
  const toast = useToast(); // Toast for displaying notifications
  const dispatch = useAppDispatch(); // Dispatch function for state management
  const navigate = useNavigate(); // Navigation function
  const userSelector = useAppSelector(selectUser); // Select user state from the app
  const itemsSelector = useAppSelector(selectItems); // Select items state from the app
  const userService = new UserService(); // User service instance
  const itemService = new ItemService(); // Item service instance

  // Retrieve authentication token from local storage
  const auth_token = localStorage.getItem("token");
  const { decodedToken }: any = useJwt(auth_token ?? "");

  // State for form data and submission loading
  const [updateForm, setUpdateForm] =
    useState<Partial<User & { password: string }>>();
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  // Effect hook to fetch user data based on decoded token
  useEffect(() => {
    const fetchUser = async () => {
      try {
        dispatch(setIsLoadingUser(true));
        const data = await userService.getByEmail(decodedToken.email);
        dispatch(setUser(data));
        dispatch(setIsLoadingUser(false));
        setUpdateForm({
          password: "",
          ...data,
        });
      } catch (error) {
        dispatch(
          setErrorUser(
            "Error retrieving profile data from server, please try again later!"
          )
        );
        dispatch(setIsLoadingUser(false));
      }
    };
    fetchUser();
  }, [decodedToken]);

  // Handler for form submission for updating user profile
  const updateSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoadingSubmit(true);
      if (updateForm.password !== userSelector.data.password) {
        const res = await userService.updatePassword(
          userSelector.data.id,
          updateForm.password
        );
      } else {
        const res = await userService.update(updateForm, userSelector.data.id);
        dispatch(
          setUser({
            id: updateForm.id,
            address: updateForm.address,
            email: updateForm.email,
            gender: updateForm.gender,
            name: updateForm.name,
            joinedAt: updateForm.joinedAt,
            phoneNumber: updateForm.phoneNumber,
            role: updateForm.role,
            surname: updateForm.surname,
            likedItems: updateForm.likedItems,
            password: updateForm.password,
          })
        );
        setLoadingSubmit(false);
        toast({
          title: "Updated profile successfully!",
          description: "We've successfully updated your profile data.",
          status: "success",
          isClosable: true,
          duration: 5000,
        });
      }
      dispatch(setIsLoadingUser(false));
    } catch (error) {
      toast({
        title: "Error updating!",
        description: "Failed to update user data! please try again later",
        status: "error",
        isClosable: true,
        duration: 5000,
      });
      setLoadingSubmit(false);
    }
  };

  // Effect hook to fetch items from the server
  useEffect(() => {
    const fetchItems = async () => {
      try {
        dispatch(setLoadingItems(true));
        const data = await itemService.getMultiple();
        dispatch(setItems(data));
        dispatch(setLoadingItems(false));
      } catch (error) {
        dispatch(setLoadingItems(false));
        dispatch(
          setErrorItems(
            "Error retrieving items from server, please try again later!"
          )
        );
      }
    };
    fetchItems();
  }, []);

  // Filter user's items
  const userItems = itemsSelector.data.filter(
    (item) => item.owner === userSelector.data.id
  );
  return (
    <Layout>
      {userSelector.isLoadingUser === true ? (
        <Loader message="Retrieving profile data from server, please wait ..." />
      ) : userSelector.data.id.length == 0 ? (
        <Center my={2}>
          <Box rounded={"md"} padding={5} bgColor={"gray.200"}>
            <VStack alignSelf={"center"} spacing={2}>
              <Text color={"blue.400"}>
                You are not logged in! Please login to visit your profile.
              </Text>
              <Button
                colorScheme={"blue"}
                onClick={() => navigate("/auth/login")}
              >
                Login or Signup
              </Button>
            </VStack>
          </Box>
        </Center>
      ) : (
        <VStack spacing={2}>
          <HStack alignItems={"flex-start"} w={"100%"} spacing={2}>
            <ProfilCard
              gender={userSelector.data.gender}
              id={userSelector.data.id}
              bgImage={
                userItems.length > 0
                  ? userItems[Math.floor(Math.random() * userItems.length)]
                      .image
                  : "https://images.unsplash.com/photo-1612865547334-09cb8cb455da?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
              }
              name={userSelector.data.name}
              surname={userSelector.data.surname}
              email={userSelector.data.email}
              phone={userSelector.data.phoneNumber}
              role={userSelector.data.role}
            />
            <Card
              boxShadow={"2xl"}
              flexDirection="column"
              w="70%"
              p="15px"
              overflowX={{ sm: "scroll", lg: "hidden" }}
            >
              <Flex
                direction={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Text fontWeight={"bold"} fontSize={"large"} color={"blue.400"}>
                  User Profile Data
                </Text>
              </Flex>
              <Divider my={2} color={"blue.400"} />
              <form onSubmit={(e) => updateSubmitHandler(e)}>
                <ModifiableAtomicData
                  label={"Name"}
                  value={updateForm.name}
                  onChange={function (e: ChangeEvent<HTMLInputElement>): void {
                    setUpdateForm((prev) => {
                      return {
                        ...prev,
                        name: e.target.value,
                      };
                    });
                  }}
                />
                <ModifiableAtomicData
                  label={"Surname"}
                  value={updateForm.surname}
                  onChange={function (e: ChangeEvent<HTMLInputElement>): void {
                    setUpdateForm((prev) => {
                      return {
                        ...prev,
                        surname: e.target.value,
                      };
                    });
                  }}
                />
                <ModifiableAtomicData
                  label={"Email"}
                  type={"email"}
                  value={updateForm.email}
                  onChange={function (e: ChangeEvent<HTMLInputElement>): void {
                    setUpdateForm((prev) => {
                      return {
                        ...prev,
                        email: e.target.value,
                      };
                    });
                  }}
                />
                <ModifiableAtomicData
                  label={"Phone number"}
                  type={"tel"}
                  value={updateForm.phoneNumber.toString()}
                  onChange={function (e: ChangeEvent<HTMLInputElement>): void {
                    setUpdateForm((prev) => {
                      return {
                        ...prev,
                        phoneNumber: parseInt(e.target.value),
                      };
                    });
                  }}
                />
                <ModifiableAtomicData
                  label={"Address"}
                  value={updateForm.address}
                  onChange={function (e: ChangeEvent<HTMLInputElement>): void {
                    setUpdateForm((prev) => {
                      return {
                        ...prev,
                        address: e.target.value,
                      };
                    });
                  }}
                />
                <ModifiableAtomicData
                  label={"Password"}
                  value={updateForm.password}
                  type={"password"}
                  onChange={function (e: ChangeEvent<HTMLInputElement>): void {
                    setUpdateForm((prev) => {
                      return {
                        ...prev,
                        password: e.target.value,
                      };
                    });
                  }}
                />
                <ModifiableAtomicData
                  label={"Gender"}
                  value={updateForm.gender}
                  modifiable={false}
                  onChange={function (e: ChangeEvent<HTMLInputElement>): void {
                    throw new Error("Function not implemented.");
                  }}
                />
                <Button
                  mt={10}
                  type="submit"
                  _focus={{ border: "none" }}
                  variant={"solid"}
                  isLoading={loadingSubmit}
                  colorScheme="blue"
                >
                  Update
                </Button>
              </form>
            </Card>
          </HStack>
          <Card
            boxShadow={"2xl"}
            flexDirection="column"
            w="100%"
            p="15px"
            overflowX={{ sm: "scroll", lg: "hidden" }}
          >
            <Flex
              direction={"column"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Text fontWeight={"bold"} fontSize={"large"} color={"blue.400"}>
                My items
              </Text>
              <Divider my={2} color={"blue.400"} />
              <ItemsTable
                data={userItems}
                error={itemsSelector.errorItems}
                loading={itemsSelector.loadingItems}
              />
            </Flex>
          </Card>
        </VStack>
      )}
    </Layout>
  );
};

export default Profile;
