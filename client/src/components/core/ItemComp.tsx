"use client";

import {
  Flex,
  Circle,
  Box,
  Image,
  Badge,
  useColorModeValue,
  Icon,
  Tooltip,
  Text,
  IconButton,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import { Item } from "../../types/Item";
import { useAppDispatch, useAppSelector } from "../../states/hooks";
import { setSelectedItem } from "../../states/slices/selectedItemSlice";
import { useNavigate } from "react-router-dom";
import { UserService } from "../../services/UserService";
import { useEffect, useState } from "react";
import { setLoadingFavoriteItems } from "../../states/slices/favoriteItems";
import { selectUser } from "../../states/slices/userSlice";
import { selectUsers } from "../../states/slices/usersSlice";

const ItemComp: React.FC<Partial<Item>> = (props: Item) => {
  // Destructure props
  const { image, label, owner, price, addedOn, id } = props;

  // State for owner name and loading
  const [ownerName, setOwnerName] = useState("");
  const [loading, setLoading] = useState(false);

  // Redux dispatcher hook
  const dispatch = useAppDispatch();
  //navigator hook
  const navigate = useNavigate();
  //user selector
  const userSelector = useAppSelector(selectUser);
  //toast
  const toast = useToast();
  // Function to handle item selection
  const onSelect = () => {
    dispatch(setSelectedItem(props));
    navigate("/selectedItem");
  };

  // UserService instance
  const userService = new UserService();
  //users selector
  const usersSelector = useAppSelector(selectUsers);
  // Effect hook to fetch owner details
  useEffect(() => {
    const fetchOwner = async (id: string) => {
      try {
        setLoading(true);
        const data = await userService.getSingle(id);
        setOwnerName(data.name + " " + data.surname);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchOwner(owner);
  }, [owner, userSelector.data.likedItems]);

  /*we find if the item is new or not by calculating if the day its added on is at most
      inferior than 30 days from now 
      */
  const isNew =
    new Date(addedOn).getDate() <=
    new Date().getTime() - 1000 * 60 * 60 * 24 * 30;

  const addToFavorite = async () => {
    if (userSelector.data.id.length == 0) {
      navigate("/auth/login");
    } else {
      try {
        dispatch(setLoadingFavoriteItems(true));
        const data = await userService.addItemToFavorite(
          userSelector.data.id,
          props.id
        );
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
  };
  return (
    <Flex
      p={50}
      w="full"
      alignItems="flex-start"
      onClick={onSelect}
      justifyContent="center"
    >
      <Box
        bg={useColorModeValue("white", "gray.800")}
        boxShadow={"2xl"}
        h={"xl"}
        borderWidth="1px"
        rounded="lg"
        shadow="lg"
        _hover={{
          borderWidth: "2px",
          transform: "translateY(2px)",
          boxShadow: "lg",
        }}
        cursor={"pointer"}
        position="relative"
      >
        {isNew && (
          <Circle
            size="10px"
            position="absolute"
            top={2}
            right={2}
            bg="green.200"
          />
        )}

        <Image
          fit={"cover"}
          width={"md"}
          height={"sm"}
          overflow={"hidden"}
          src={image}
          alt={`Picture of ${label}`}
          roundedTop="lg"
        />

        <Box p="6">
          <Box display="flex" alignItems="baseline">
            {isNew && (
              <Badge rounded="full" px="2" fontSize="0.8em" colorScheme="green">
                New
              </Badge>
            )}
          </Box>
          <Flex mt="1" justifyContent="space-between" alignContent="center">
            <Box
              fontSize="2xl"
              fontWeight="semibold"
              as="h4"
              lineHeight="tight"
              isTruncated
            >
              {label}
            </Box>
            <Tooltip
              label="Add to to favorite"
              bg="white"
              placement={"top"}
              color={"gray.800"}
              fontSize={"1.2em"}
            >
              <IconButton
                isDisabled={
                  userSelector.data.likedItems.find((i) => i === id) !=
                  undefined
                }
                onClick={(e) => {
                  e.stopPropagation();
                  addToFavorite();
                }}
                icon={
                  <Icon
                    color={
                      userSelector.data.likedItems.find((i) => i === id) !=
                      undefined
                        ? "red"
                        : "black"
                    }
                    as={
                      userSelector.data.likedItems.find((i) => i === id) !=
                      undefined
                        ? BsHeartFill
                        : BsHeart
                    }
                    h={7}
                    w={7}
                    alignSelf={"center"}
                  />
                }
                display={"flex"}
                aria-label={""}
              />
            </Tooltip>
          </Flex>

          <Flex justifyContent="space-between" alignContent="center">
            {loading === true ? (
              <Spinner color="blue.400" />
            ) : (
              <Text>{ownerName}</Text>
            )}
            <Box fontSize="2xl" color={useColorModeValue("gray.800", "white")}>
              <Box as="span" color={"gray.600"} fontSize="lg">
                $
              </Box>
              {price.toFixed(2)}
            </Box>
          </Flex>
        </Box>
      </Box>
    </Flex>
  );
};

export default ItemComp;
