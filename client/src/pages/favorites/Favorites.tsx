import { useEffect } from "react";
import Layout from "../../components/core/Layout";
import { UserService } from "../../services/UserService";
import { useAppDispatch, useAppSelector } from "../../states/hooks";
import {
  selectFavoriteItems
} from "../../states/slices/favoriteItems";
import { useJwt } from "react-jwt";
import { selectUser, setUser } from "../../states/slices/userSlice";
import Loader from "../../components/core/Loader";
import ErrorMessage from "../../components/core/ErrorMessage";
import { Box, Center, SimpleGrid, VStack,Text, Button } from "@chakra-ui/react";
import ItemComp from "../../components/core/ItemComp";
import { selectItems, setErrorItems, setItems, setLoadingItems } from "../../states/slices/itemSlice";
import { ItemService } from "../../services/ItemService";
import { setCategories, setErrorCategories, setLoadingCategories } from "../../states/slices/categoriesSlice";
import { ItemCategoryService } from "../../services/ItemCategoryService";
import { useNavigate } from "react-router-dom";

const Favorites = () => {
  //action dispatcher
  const dispatch = useAppDispatch();
  //navigator
  const navigate = useNavigate()
  //user state from app selector
  const userSelector = useAppSelector(selectUser);
  //items state from app selector
  const itemsSelector = useAppSelector(selectItems)
  //user service instance
  const userService = new UserService();
 //item service instance 
 const itemService = new ItemService();
    //categories service instance
    const categoriesService = new ItemCategoryService();

  // Retrieve authentication token from local storage
  const auth_token = localStorage.getItem("token");
  const { decodedToken }: any = useJwt(auth_token ?? "");
  // Effect hook to fetch user data based on decoded token
  useEffect(() => {
    const getUser = async () => {
      const data = await userService.getByEmail(decodedToken.email);
      dispatch(setUser(data));
    };
    getUser();
  }, [decodedToken]);

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
        dispatch(setErrorItems("Error retrieving items from server, please try again later!"));
      }
    };
    fetchItems();
  }, []);
  

    const data = userSelector.data.likedItems;
    const mapDataToItems = itemsSelector.data.filter(i=>data.find(item=>item===i.id)!=undefined)


     
  // Effect hook to fetch categories from the server
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        dispatch(setLoadingCategories(true));
        const data = await categoriesService.getMultiple();
        dispatch(setCategories(data));
        dispatch(setLoadingCategories(false));
      } catch (error) {
        dispatch(setLoadingCategories(false));
        dispatch(setErrorCategories("Error retrieving categories from server, please try again later!"));
      }
    };
    fetchCategories();
  }, []);
  return (
    <Layout>
      {userSelector.isLoadingUser === true ? (
        <Loader message="Retrieving favourite items from server, please wait ..." />
      ) : userSelector.errorUser != null ? (
        <ErrorMessage message={userSelector.errorUser} />
      ) : (
       userSelector.data.id.length==0?<Center my={2}>
       <Box rounded={"md"} padding={5} bgColor={"gray.200"}>
         <VStack alignSelf={"center"} spacing={2}>
           <Text color={"blue.400"}>You are not logged in! Please login to start adding items you like to your favorites.</Text>
           <Button colorScheme={"blue"} onClick={()=>navigate("/auth/login")}>Login or Signup</Button>
         </VStack>
       </Box>
     </Center>: <SimpleGrid columns={{"md":2,"lg":3,"sm":1}}>
       {mapDataToItems.length==0?<Center my={2}>
   <Box rounded={"md"} padding={5} bgColor={"gray.200"}>
     <VStack alignSelf={"center"} spacing={2}>
       <Text color={"blue.400"}>You have no favorite items yet! consider adding some.</Text>
       
     </VStack>
   </Box>
 </Center>:mapDataToItems.map((i, index) => (
         <ItemComp
           key={index}
           id={i.id}
           label={i.label}
           description={i.description}
           price={i.price}
           owner={i.owner}
           category={i.category}
           addedOn={i.addedOn}
           image={i.image}
         />
       ))}
     </SimpleGrid>
      )}
    </Layout>
  );
};

export default Favorites;
