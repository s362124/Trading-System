import { useCallback, useEffect, useState } from "react";
import Layout from "../../components/core/Layout";
import { ItemCategoryService } from "../../services/ItemCategoryService";
import { useAppDispatch, useAppSelector } from "../../states/hooks";
import {
  selectCategories,
  setCategories,
  setLoadingCategories,
} from "../../states/slices/categoriesSlice";
import { DataTable } from "../../components/core/DataTable";
import { ItemCategory } from "../../types/ItemCategory";
import { createColumnHelper } from "@tanstack/react-table";
import ErrorMessage from "../../components/core/ErrorMessage";
import { setErrorItems } from "../../states/slices/itemSlice";
import CreateCategory from "../../components/form/CreateCategory";
import { useJwt } from "react-jwt";
import { useNavigate } from "react-router-dom";
import { Divider, Flex, HStack, IconButton, useToast } from "@chakra-ui/react";
import {
  selectUser,
  setIsLoadingUser,
  setUser,
} from "../../states/slices/userSlice";
import { UserService } from "../../services/UserService";
import { FiEdit, FiX } from "react-icons/fi";
import UpdateCategory from "../../components/form/UpdateCategory";
import Search from "../../components/core/Search";
import usePaginator from "../../components/hoc/usePaginator";
import Pagination from "../../components/hoc/Pagination";
// Define the type for a row in the DataTable representing a category
type CategoryRow = ItemCategory & {
  actions: any;
};

// Component for managing categories
const Categories = () => {
  // Services
  const categoriesService = new ItemCategoryService();
  const userService = new UserService();

  // Global states
  const categoriesSelector = useAppSelector(selectCategories);
  const userSelector = useAppSelector(selectUser);
  //column creator
  const columnHelper = createColumnHelper<CategoryRow>();

  // Dispatcher
  const dispatch = useAppDispatch();

  // Get the JWT token from localStorage and decode it
  const auth_token = localStorage.getItem("token");
  const { decodedToken, isExpired }: any = useJwt(auth_token ?? "");
  const navigate = useNavigate();
  //toast
  const toast = useToast();
  //pagination
  const { numOfPages, currentPage, currentData, setPage } = usePaginator({
    data: categoriesSelector.data,
  }); // Apply the usePaginator hook

  //state that hold searched items
  const [searchedItems, setSearchedItems] = useState<Partial<ItemCategory>[]>(
    []
  );
  //state that holds search input query
  const [query, setQuery] = useState("");
  //search handler
  const search = useCallback(
    (query: string) => {
      const data = categoriesSelector.data.filter((i) =>
        i.label.toLowerCase().includes(query.toLowerCase())
      );
      setSearchedItems(data);
    },
    [query]
  );
  //search input handler
  const searchInputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    search(query);
  };

  //delete category function
  const deleteCategory = async (id: string) => {
    try {
      const data = await categoriesService.delete(id);
      console.log(data);
      toast({
        title: "Deleted successfully",
        description: "Record deleted successfully",
        duration: 5000,
        isClosable: true,
        status: "success",
      });
      dispatch(
        setCategories(categoriesSelector.data.filter((i) => i.id != id))
      );
    } catch (error) {
      toast({
        title: "Failed to delete",
        description:
          "An error occured when attempting to delete record, please try again late",
        duration: 5000,
        isClosable: true,
        status: "error",
      });
    }
  };

  // Define columns for the DataTable
  const columns = [
    columnHelper.accessor("id", {
      cell: (info) => info.getValue(),
      header: "Identifier",
    }),
    columnHelper.accessor("label", {
      cell: (info) => info.getValue(),
      header: "Designation",
    }),
    columnHelper.accessor("actions", {
      cell: (info) => (
        <Flex align="center">
          <HStack spacing="2">
            <UpdateCategory
              currentData={categoriesSelector.data.find(
                (i) => i.id === info.row.original.id
              )}
            />
            <IconButton
              onClick={() => deleteCategory(info.row.original.id)}
              icon={<FiX />}
              colorScheme="gray"
              aria-label={"Delete"}
            />
          </HStack>
        </Flex>
      ),
      header: "Actions",
    }),
  ];

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

  // Fetch categories from the server
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
          setErrorItems(
            "Error retrieving categories from the server, please try again later!"
          )
        );
      }
    };
    fetchCategories();
  }, []);

  return (
    <Layout>
      {userSelector.data.role == 1 ? (
        <ErrorMessage message="You don't have access to this route" />
      ) : (
        <>
          <Flex
            mb={3}
            w={"full"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Search
              value={query}
              handler={searchInputHandler}
              onSearch={() => search(query)}
            />
            <CreateCategory />
          </Flex>
          <Divider my={3}></Divider>
          {categoriesSelector.errorCategories != null ? (
            <ErrorMessage message={categoriesSelector.errorCategories} />
          ) : (
            <>
              <DataTable
                columns={columns}
                data={query.length == 0 ? currentData : searchedItems}
                title="Categories list"
                loading={categoriesSelector.loadingCategories}
              />
              <Pagination
                currentPage={currentPage}
                onPageChange={setPage}
                totalPages={numOfPages}
              />
            </>
          )}
        </>
      )}
    </Layout>
  );
};

export default Categories;
