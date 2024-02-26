import { useCallback, useEffect, useState } from "react";
import Layout from "../../components/core/Layout";
import { ItemCategoryService } from "../../services/ItemCategoryService";
import { useAppDispatch, useAppSelector } from "../../states/hooks";
import {
  selectCategories,
  setCategories,
  setErrorCategories,
  setLoadingCategories,
} from "../../states/slices/categoriesSlice";
import { DataTable } from "../../components/core/DataTable";
import { createColumnHelper } from "@tanstack/react-table";
import ErrorMessage from "../../components/core/ErrorMessage";
import {
  selectItems,
  setErrorItems,
  setItems,
  setLoadingItems,
} from "../../states/slices/itemSlice";
import { useJwt } from "react-jwt";
import { useNavigate } from "react-router-dom";
import { Badge, Divider, Flex, HStack, IconButton, Stack, useTab,Text,useToast } from "@chakra-ui/react";
import {
  selectUser,
  setIsLoadingUser,
  setUser,
} from "../../states/slices/userSlice";
import { UserService } from "../../services/UserService";
import { ItemService } from "../../services/ItemService";
import ItemsTable from "../../components/core/ItemsTable";



// Component for managing items
const Items = () => {
  // Services
  const itemsService = new ItemService();
  const userService = new UserService();

  // Global states
  const itemsSelector = useAppSelector(selectItems);
  const userSelector = useAppSelector(selectUser)

  // Dispatcher
  const dispatch = useAppDispatch();

  // Get the JWT token from localStorage and decode it
  const auth_token = localStorage.getItem("token");
  const { decodedToken, isExpired }: any = useJwt(auth_token ?? "");
  const navigate = useNavigate();
  



  // Fetch user data based on the decoded token
  useEffect(() => {
    const getUser = async () => {
      dispatch(setIsLoadingUser(true));
      const data = await userService.getByEmail(decodedToken.email);
      dispatch(setUser(data));
      dispatch(setIsLoadingUser(false));
    };
    getUser();
  }, [decodedToken]);

  // Redirect to the home page if the JWT token is expired
  useEffect(() => {
    if (isExpired === true) navigate("/");
  }, [isExpired]);

  // Fetch items from the server
  useEffect(() => {
    const fetchItems = async () => {
      try {
        dispatch(setLoadingItems(true));
        const data = await itemsService.getMultiple();
        dispatch(setItems(data));
        dispatch(setLoadingItems(false));
      } catch (error) {
        dispatch(setLoadingItems(false));
        dispatch(
          setErrorItems(
            "Error retrieving items from the server, please try again later!"
          )
        );
      }
    };
    fetchItems();
  }, []);

  
  
  return (
    <Layout>
     {
      userSelector.data.role==1? <ErrorMessage message="You don't have access to this route" />:<>
  
      <ItemsTable data={itemsSelector.data} loading={itemsSelector.loadingItems} error={itemsSelector.errorItems} />
      </>
     }
    </Layout>
  );
};

export default Items;
