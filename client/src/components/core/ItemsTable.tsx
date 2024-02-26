import React, { useCallback, useEffect, useState } from 'react';
import { Item } from '../../types/Item';
import { Badge, Divider, Flex, HStack, IconButton, Stack, Text, useToast } from '@chakra-ui/react';
import { createColumnHelper } from '@tanstack/react-table';
import { DataTable } from './DataTable';
import ErrorMessage from './ErrorMessage';
import usePaginator from '../hoc/usePaginator';
import { useAppDispatch, useAppSelector } from '../../states/hooks';
import { ItemService } from '../../services/ItemService';
import { FiX } from 'react-icons/fi';
import { selectCategories, setCategories, setErrorCategories, setLoadingCategories } from '../../states/slices/categoriesSlice';
import { setItems } from '../../states/slices/itemSlice';
import { selectUsers, setErrorUsers, setIsLoadingUsers, setUsers } from '../../states/slices/usersSlice';
import UpdateItem from '../form/UpdateItem';
import { UserService } from '../../services/UserService';
import { ItemCategoryService } from '../../services/ItemCategoryService';
import Pagination from '../hoc/Pagination';
import CreateItem from '../form/CreateItem';
import Search from './Search';

// Define the type for a row in the DataTable representing an item
type ItemRow = Omit<Item, "image" | "description"> & {
  actions: any;
};

type Props = {
  error: string | null;
  loading: boolean;
  data: Item[];
};

const ItemsTable = ({ error, loading, data }: Props) => {
  // Services
  const itemsService = new ItemService();
  const userService = new UserService();
  const categoriesService = new ItemCategoryService();

  // Action dispatcher
  const dispatch = useAppDispatch();

  // Toast
  const toast = useToast();

  // Columns creator
  const columnHelper = createColumnHelper<ItemRow>();

  // Pagination
  const { numOfPages, currentPage, currentData, setPage } = usePaginator({ data: data });

  // Selectors
  const categoriesSelector = useAppSelector(selectCategories);
  const usersSelector = useAppSelector(selectUsers);

  // State that holds searched items
  const [searchedItems, setSearchedItems] = useState<Partial<Item>[]>([]);

  // State that holds search input query
  const [query, setQuery] = useState('');

  // Search handler
  const search = useCallback(
    (query: string) => {
      const result = data.filter((i) => i.label.toLowerCase().includes(query.toLowerCase()));
      setSearchedItems(result);
    },
    [data]
  );

  // Search input handler
  const searchInputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    search(query);
  };

  // Delete Item function
  const deleteItem = async (id: string) => {
    try {
      const newData = await itemsService.delete(id);

      toast({
        title: "Deleted successfully",
        description: "Record deleted successfully",
        duration: 5000,
        isClosable: true,
        status: "success"
      });

      dispatch(setItems(newData.filter(i => i.id !== id)));
    } catch (error) {
      toast({
        title: "Failed to delete",
        description: "An error occurred when attempting to delete record, please try again later",
        duration: 5000,
        isClosable: true,
        status: "error"
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
      cell: (info) => <Text fontWeight={'bold'} color={"green.400"}>{info.getValue()}</Text>,
      header: "Designation",
    }),
    columnHelper.accessor("category", {
      cell: (info) => {
        if (categoriesSelector.data.length > 0) {
          let category = categoriesSelector.data.find(i => i.id === info.getValue());
          if (category == undefined) {
            return <Badge rounded={"full"} colorScheme={"telegram"}>Deleted category</Badge>;
          } else {
            return <Badge rounded={"full"} colorScheme={"telegram"}>{category.label}</Badge>;
          }
        } else {
          return <Badge rounded={"full"} colorScheme={"telegram"}>{info.getValue()}</Badge>;
        }
      },
      header: "Category",
    }),
    columnHelper.accessor("price", {
      cell: (info) => <Text color={"gray.700"} fontWeight="bold">{info.getValue()}</Text>,
      header: "Price (in $)",
    }),
    columnHelper.accessor("addedOn", {
      cell: (info) => <Badge rounded={"full"} colorScheme={"whatsapp"}>{new Date(info.getValue().toString()).toLocaleDateString()}</Badge>,
      header: "Added on",
    }),
    columnHelper.accessor("owner", {
      cell: (info) => {
        if (usersSelector.data.length > 0) {
          let user = usersSelector.data.find(i => i.id === info.getValue());
          return user ? `${user.name} ${user.surname}` : info.getValue();
        } else {
          return info.getValue();
        }
      },
      header: "Owner",
    }),
    columnHelper.accessor("actions", {
      cell: (info) => <Flex align="center">
        <HStack spacing="2">
          <UpdateItem currentData={data.find(i => i.id === info.row.original.id)} />
          <IconButton
            onClick={() => deleteItem(info.row.original.id)}
            icon={<FiX />}
            colorScheme="gray"
            aria-label={"Delete"}
          />
        </HStack>
      </Flex>,
      header: "Actions",
    }),
  ];

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
          setErrorCategories(
            "Error retrieving categories from the server, please try again later!"
          )
        );
      }
    };
    fetchCategories();
  }, []);

  // Fetch users from the server
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (!usersSelector.isLoadingUsers) {
          dispatch(setIsLoadingUsers(true));
          const data = await userService.getMultiple();
          dispatch(setUsers(data));
          dispatch(setIsLoadingUsers(false));
        }
      } catch (error) {
        dispatch(setIsLoadingUsers(false));
        dispatch(
          setErrorUsers(
            "Error retrieving users from the server, please try again later!"
          )
        );
      }
    };
    fetchUsers();
  }, []);

  return (
    error != null ? (
      <ErrorMessage message={error} />
    ) : (
      <>
        <Flex mb={3} w={"full"} alignItems={"center"} justifyContent={"space-between"}>
          <Search
            value={query}
            handler={searchInputHandler}
            onSearch={() => search(query)} />
          <CreateItem />
        </Flex>
        <Divider my={3}></Divider>
        <Stack spacing={3}>
          <DataTable
            columns={columns}
            data={query.length > 0 ? searchedItems : currentData}
            title="Items list"
            loading={loading} />
          <Pagination currentPage={currentPage} onPageChange={setPage} totalPages={numOfPages} />
        </Stack>
      </>
    )
  );
}

export default ItemsTable;
