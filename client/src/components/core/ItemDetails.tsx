"use client";

import {
  Box,
  Container,
  Stack,
  Text,
  Image,
  Flex,
  VStack,
  Button,
  Heading,
  SimpleGrid,
  StackDivider,
  useColorModeValue,
  List,
  ListItem,
  Divider,
  useToast,
  Badge,
} from "@chakra-ui/react";
import { Item } from "../../types/Item";
import { useState, useEffect } from "react";
import { User } from "../../types/User";
import { UserService } from "../../services/UserService";
import Loader from "./Loader";
import ErrorMessage from "./ErrorMessage";
import { useAppDispatch, useAppSelector } from "../../states/hooks";
import { selectCategories } from "../../states/slices/categoriesSlice";
import { selectItems } from "../../states/slices/itemSlice";
import ItemComp from "./ItemComp";
import { selectUser, setUser } from "../../states/slices/userSlice";
import {
  selectFavoriteItems,
  setFavoriteItems,
  setLoadingFavoriteItems,
} from "../../states/slices/favoriteItems";
import { useNavigate } from "react-router-dom";

const ItemDetails: React.FC<Item> = ({ ...props }: Item) => {
  //dispatcher
  const dispatch = useAppDispatch();
  //navigator
  const navigate = useNavigate();
  //states
  const [loadingOwnerData, setLoadingOwnerData] = useState(false);
  const [errorOwnerData, setErrorOwnerData] = useState<string>("");
  const [ownerData, setOwnerData] = useState<Partial<User>>({
    address: "",
    email: "",
    name: "",
    surname: "",
    phoneNumber: 0,
  });
  //global states
  const userSelector = useAppSelector(selectUser);
  const favoritesSelector = useAppSelector(selectFavoriteItems);
  //services
  const userService = new UserService();
  const categories = useAppSelector(selectCategories);
  const items = useAppSelector(selectItems);
  //here we find similar items where price range is in the selected item range and all items have the same category
  const similarItems = items.data.filter(
    (item) =>
      item.category === props.category &&
      item.price >= props.price - 300 &&
      item.price <= props.price + 300
  );
  //toast
  const toast = useToast();
  // Feching item owern data to display for customers
  useEffect(() => {
    const fetchOwnerData = async (id: string) => {
      try {
        setLoadingOwnerData(true);
        const data = await userService.getSingle(id);
        setOwnerData(data);
        setLoadingOwnerData(false);
      } catch (error) {
        setLoadingOwnerData(false);
        setErrorOwnerData(
          "Error fetching owner data, please check your connection or try again later!"
        );
      }
    };
    fetchOwnerData(props.owner);
  }, [props.owner]);
  //A function that is fired when the customer clicks on add to favorites
  const addToFavorite = async () => {
   if(userSelector.data.id.length==0){
    navigate("/auth/login")
   }else{
    try {
      dispatch(setLoadingFavoriteItems(true));
      const data = await userService.addItemToFavorite(
        userSelector.data.id,
        props.id
      );
      dispatch(setUser({likedItems:[...userSelector.data.likedItems, data],...userSelector.data}));
      dispatch(setLoadingFavoriteItems(false));
      toast({
        title: "Success",
        description: "Successfully added item to favorites",
        duration: 5000,
        isClosable: true,
        status: "success",
      });
    } catch (error) {
      dispatch(setLoadingFavoriteItems(false));
      toast({
        title: "Error",
        description: "Can't add item to favorites, please try again later",
        duration: 5000,
        isClosable: true,
        status: "warning",
      });
    }
   }
  }
   //A function that is fired when the customer clicks on remove from favorites
  const removeFromFavorites = async () => {
    if(userSelector.data.id.length==0){
     navigate("/auth/login")
    }else{
     try {
       dispatch(setLoadingFavoriteItems(true));
       const data = await userService.removeItemToFavorite(
         userSelector.data.id,
         props.id
       );
       dispatch(setUser({likedItems:userSelector.data.likedItems.filter(i=>i!=props.id),...userSelector.data}));
       dispatch(setLoadingFavoriteItems(false));
       toast({
         title: "Success",
         description: "Successfully removed item from favorites",
         duration: 5000,
         isClosable: true,
         status: "success",
       });
     } catch (error) {
       dispatch(setLoadingFavoriteItems(false));
       toast({
         title: "Error",
         description: "Can't remove item from favorites, please try again later",
         duration: 5000,
         isClosable: true,
         status: "warning",
       });
     }
    }
  }
  return (
    <Container maxW={"9xl"}>
      <SimpleGrid
        columns={{ base: 1, lg: 2 }}
        spacing={{ base: 8, md: 10 }}
        py={{ base: 18, md: 24 }}
      >
        <Flex>
          <Image
            rounded={"md"}
            alt={"product image"}
            src={props.image}
            fit={"cover"}
            align={"center"}
            w={"100%"}
            h={{ base: "100%", sm: "400px", lg: "500px" }}
          />
        </Flex>
        <Stack spacing={{ base: 6, md: 10 }}>
          <Box as={"header"}>
            <Heading
              lineHeight={1.1}
              fontWeight={600}
              fontSize={{ base: "2xl", sm: "4xl", lg: "5xl" }}
            >
              {props.label}
            </Heading>
            <Badge px={4} colorScheme={"telegram"} rounded={"full"}>
            <Text
              fontWeight={500}
              fontSize={"2xl"}
            >
              ${props.price} USD
            </Text>
            </Badge>
          </Box>

          <Stack
            spacing={{ base: 4, sm: 6 }}
            direction={"column"}
            divider={
              <StackDivider
                borderColor={useColorModeValue("gray.200", "gray.600")}
              />
            }
          >
            <VStack spacing={{ base: 4, sm: 6 }}>
              <Text
                color={useColorModeValue("gray.500", "gray.400")}
                fontSize={"2xl"}
                fontWeight={"300"}
              >
                Category :{" "}
                {categories.data.find((i) => i.id == props.category)!=undefined?categories.data.find((i) => i.id == props.category).label:'Deleted category'}
              </Text>
              <Text fontSize={"lg"}>{props.description}</Text>
            </VStack>

            <Box>
              <Text
                fontSize={{ base: "16px", lg: "18px" }}
                color={useColorModeValue("yellow.500", "yellow.300")}
                fontWeight={"500"}
                textTransform={"uppercase"}
                mb={"4"}
              >
                Owner Details
              </Text>

              {loadingOwnerData === true ? (
                <Loader message="Fetching owner data, please wait.." />
              ) : errorOwnerData.length > 0 ? (
                <ErrorMessage message={errorOwnerData} />
              ) : (
                <List spacing={2}>
                  <ListItem>
                    <Text as={"span"} fontWeight={"bold"}>
                      Full name:
                    </Text>{" "}
                    {ownerData.name} {ownerData.surname}
                  </ListItem>
                  <ListItem>
                    <Text as={"span"} fontWeight={"bold"}>
                      Email Address:
                    </Text>{" "}
                    {ownerData.email}
                  </ListItem>
                  <ListItem>
                    <Text as={"span"} fontWeight={"bold"}>
                      Phone number:
                    </Text>{" "}
                    {ownerData.phoneNumber}
                  </ListItem>
                  <ListItem>
                    <Text as={"span"} fontWeight={"bold"}>
                      Address:
                    </Text>{" "}
                    {ownerData.address}
                  </ListItem>
                </List>
              )}
            </Box>
          </Stack>

          <Button
            onClick={userSelector.data.likedItems.find(i=>i===props.id)!=undefined?removeFromFavorites:addToFavorite}
            rounded={"none"}
            w={"full"}
            mt={8}
            size={"lg"}
            py={"7"}
            isLoading={favoritesSelector.loadingFavoriteItems}
            bg={userSelector.data.likedItems.find(i=>i===props.id)==undefined?useColorModeValue("blue.400", "blue.300"):useColorModeValue("red.400", "red.300")}
            color={useColorModeValue("white", "gray.900")}
            textTransform={"uppercase"}
            _hover={{
              transform: "translateY(2px)",
              boxShadow: "lg",
            }}
          >
            {userSelector.data.likedItems.find(i=>i===props.id)!=undefined?"Remove From Favorites":"Add to Favorites"}
          </Button>
        </Stack>
      </SimpleGrid>
      <Divider></Divider>
      <Text color={"blue.400"} fontWeight={"semibold"}>
        Similar items
      </Text>
      <SimpleGrid mt={3} columns={{"md":2,"lg":3,"sm":1}}>
        {similarItems.length > 0 &&
          similarItems.map((i, index) => <ItemComp key={index} {...i} />)}
      </SimpleGrid>
    </Container>
  );
};

export default ItemDetails
