import Layout from "../../components/core/Layout";
import { Divider, Flex, SimpleGrid, Stack } from "@chakra-ui/react";
import ItemComp from "../../components/core/ItemComp";
import CreateItem from "../../components/form/CreateItem";
import { useAppDispatch, useAppSelector } from "../../states/hooks";
import { selectUser, setUser } from "../../states/slices/userSlice";
import { useCallback, useEffect, useState } from "react";
import { UserService } from "../../services/UserService";
import { useJwt } from "react-jwt";
import { ItemService } from "../../services/ItemService";
import {
  selectItems,
  setErrorItems,
  setItems,
  setLoadingItems,
} from "../../states/slices/itemSlice";
import Loader from "../../components/core/Loader";
import ErrorMessage from "../../components/core/ErrorMessage";
import { ItemCategoryService } from "../../services/ItemCategoryService";
import {
  setCategories,
  setErrorCategories,
  setLoadingCategories,
} from "../../states/slices/categoriesSlice";
import { Item } from "../../types/Item";
import Search from "../../components/core/Search";
import usePaginator from "../../components/hoc/usePaginator";
import Pagination from "../../components/hoc/Pagination";

const Home = () => {
  // Retrieve user, items, and categories states from Redux store
  const item = useAppSelector(selectItems);

  // Define dispatcher for Redux actions
  const dispatch = useAppDispatch();

  // Retrieve authentication token from local storage
  const auth_token = localStorage.getItem("token");
  const { decodedToken, isExpired }: any = useJwt(auth_token ?? "");

  // Instantiate services for user, item, and category operations
  const userService = new UserService();
  const itemService = new ItemService();
  const categoriesService = new ItemCategoryService();
  //selectors
  const userSelector = useAppSelector(selectUser)
  //pagination
  const { numOfPages, currentPage, currentData, setPage } = usePaginator({ data: item.data }); // Apply the usePaginator hook
  console.log({data:item.data,currentData})
  //state that hold searched items
  const [searchedItems,setSearchedItems] = useState<Item[]>([])
  //state that holds search input query
  const [query,setQuery] = useState('');
  //search handler
  const search = useCallback(
    (query:string)=>{
        const data = item.data.filter((i)=>i.label.toLowerCase().includes(query.toLowerCase()))
        setSearchedItems(data)
    },[query]
  )
  //search input handler 
  const searchInputHandler = (event:React.ChangeEvent<HTMLInputElement>) =>{
    setQuery(event.target.value)
    search(query)
  }
  // Log decoded token for debugging purposes
  console.log(decodedToken);

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
        dispatch(
          setErrorItems(
            "Error retrieving items from server, please try again later!"
          )
        );
      }
    };
    fetchItems();
  }, []);

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
        dispatch(
          setErrorCategories(
            "Error retrieving categories from server, please try again later!"
          )
        );
      }
    };
    fetchCategories();
  }, []);
  return (
    <Layout>
    {isExpired === true ? null : <Flex mb={3} w={"full"} alignItems={"center"} justifyContent={"space-between"}>
      <Search
        value={query}
        handler={searchInputHandler}
        onSearch={()=>search(query)}
        />
      <CreateItem /></Flex>}
    {item.loadingItems === true ? (
      <Loader message="Retrieving items from server, please wait ..." />
    ) : item.errorItems != null ? (
      <ErrorMessage message={item.errorItems} />
    ) : (

      <Stack spacing={2}>
        
        <Divider />
        <SimpleGrid columns={{"md":2,"lg":3,"sm":1}}>
        {query.length==0?currentData.map((i, index) => (
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
        )):searchedItems.map((i,index)=><ItemComp
        key={index}
        id={i.id}
        label={i.label}
        description={i.description}
        price={i.price}
        owner={i.owner}
        category={i.category}
        addedOn={i.addedOn}
        image={i.image}
      />)}
      </SimpleGrid>
      <Pagination currentPage={currentPage} totalPages={numOfPages} onPageChange={setPage} />
      </Stack>
    )}
  </Layout>
  );
};

export default Home;
