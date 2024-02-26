import {
  useColorModeValue,
  Flex,
  Text,
  CloseButton,
  Box,
  Divider,
  VStack,
  List,
  ListItem,
  Button,
  useColorMode,
} from "@chakra-ui/react";

import { useState } from "react";
import {
  FiBook,
  FiCheck,
  FiGrid,
  FiHome,
  FiStar,
  FiUser,
  FiUsers,
} from "react-icons/fi";
import { useAppSelector, useAppDispatch } from "../../../states/hooks";
import { selectCategories } from "../../../states/slices/categoriesSlice";
import { setItems } from "../../../states/slices/itemSlice";
import { selectUser } from "../../../states/slices/userSlice";
import { ItemCategory } from "../../../types/ItemCategory";
import { LinkItemProps, SidebarProps } from "../../../types/Utils";
import NavItem from "./NavItem";
import { ItemService } from "../../../services/ItemService";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { useLocation } from "react-router-dom";

// SidebarContent component
const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  // Select categories, items and user from the state
  const categoriesSelector = useAppSelector(selectCategories);
  const user = useAppSelector(selectUser);
  // item service
  const itemService = new ItemService();
  //dispatcher
  const dispatch = useAppDispatch();
  //local state used to handle selected category
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory>({
    id: "",
    label: "",
  });
  // Array of link items with their properties
  const UserLinkItems: Array<LinkItemProps> = [
    { name: "Home", icon: FiHome, href: "/", isAdminRoute: false },
    { name: "Profile", icon: FiUser, href: "/profile", isAdminRoute: false },
    {
      name: "Categories",
      icon: FiGrid,
      href: "/admin/categories",
      isAdminRoute: true,
    },
    { name: "Users", icon: FiUsers, href: "/admin/users", isAdminRoute: true },
    { name: "Items", icon: FiBook, href: "/admin/items", isAdminRoute: true },
    {
      name: "Favorites",
      icon: FiStar,
      href: "/favorites",
      isAdminRoute: false,
    },
  ];
  const GuestLinkItem: Array<LinkItemProps> = [
    { name: "Home", icon: FiHome, href: "/", isAdminRoute: false },
  ];
  // Using useLocation hook to get the current location object
  const location = useLocation();

  // Accessing the pathname property of the location object to get the current route
  const currentRoute = location.pathname;
  // Filter items by category
  const filterItemsByCategory = async (categoryId: string) => {
    const data = await itemService.getMultipleByCategory(categoryId);
    dispatch(setItems(data));
  };
  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="inherit" fontWeight="bold">
          Trading System
        </Text>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      {user.data.role == 0
        ? UserLinkItems.map((link) => {
            return (
              <NavItem
                isAdminRoute={link.isAdminRoute}
                href={link.href}
                key={link.name}
                icon={link.icon}
                isSelected={currentRoute === link.href}
              >
                {link.name}
              </NavItem>
            );
          })
        : user.data.id.length == 0
        ? GuestLinkItem.map((link) => {
            return (
              <NavItem
                isSelected={currentRoute === link.href}
                isAdminRoute={link.isAdminRoute}
                href={link.href}
                key={link.name}
                icon={link.icon}
              >
                {link.name}
              </NavItem>
            );
          })
        : UserLinkItems.filter((i) => i.isAdminRoute == false).map((link) => {
            return (
              <NavItem
                isSelected={currentRoute === link.href}
                isAdminRoute={link.isAdminRoute}
                href={link.href}
                key={link.name}
                icon={link.icon}
              >
                {link.name}
              </NavItem>
            );
          })}
      <Divider my={3} />
      <VStack>
        <Flex
          align="center"
          px="4"
          py="2"
          mx="4"
          my="4"
          w={"full"}
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-around"}
        >
          <Text color={"blue.400"} fontWeight={"semibold"} fontSize={18}>
            Categories
          </Text>
        </Flex>

        <List>
          {categoriesSelector.data.map((i, _index) => (
            <ListItem key={_index}>
              <Button
                variant={"ghost"}
                colorScheme={"blue"}
                onClick={() => {
                  setSelectedCategory(i);
                  filterItemsByCategory(i.id);
                }}
              >
                <Flex w={"100%"} justifyContent={"space-between"}>
                  <Text mr={5}>{i.label}</Text>
                  {selectedCategory?.id == i.id ? <FiCheck /> : null}
                </Flex>
              </Button>
            </ListItem>
          ))}
        </List>
      </VStack>
    </Box>
  );
};

export default SidebarContent;
