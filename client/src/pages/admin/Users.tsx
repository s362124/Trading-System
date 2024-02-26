import { useCallback, useEffect, useState } from "react";
import Layout from "../../components/core/Layout";
import { useAppDispatch, useAppSelector } from "../../states/hooks";
import { DataTable } from "../../components/core/DataTable";
import {  createColumnHelper } from "@tanstack/react-table";
import ErrorMessage from "../../components/core/ErrorMessage";
import { useJwt } from "react-jwt";
import { useNavigate } from "react-router-dom";
import { User } from "../../types/User";
import { UserService } from "../../services/UserService";
import {
  selectUsers,
  setErrorUsers,
  setIsLoadingUsers,
  setUsers,
} from "../../states/slices/usersSlice";
import {
  selectUser,
  setIsLoadingUser,
  setUser,
} from "../../states/slices/userSlice";
import { Divider, Flex, Spinner, Stack,Badge } from "@chakra-ui/react";
import Search from "../../components/core/Search";
import usePaginator from "../../components/hoc/usePaginator";
import Pagination from "../../components/hoc/Pagination";

// Define the type for a row in the DataTable representing a user
type UserRow = Omit<User, "id" | "role">;

// Users component for managing users
const Users = () => {
  // Services
  const userService = new UserService();

  // Global states
  const usersSelector = useAppSelector(selectUsers);
  const userSelector = useAppSelector(selectUser);
  const columnHelper = createColumnHelper<UserRow>();

  // Dispatcher
  const dispatch = useAppDispatch();

  // Get the JWT token from localStorage and decode it
  const auth_token = localStorage.getItem("token");
  const { decodedToken, isExpired }: any = useJwt(auth_token ?? "");
  const navigate = useNavigate();

  //pagination
  const { numOfPages, currentPage, currentData, setPage } = usePaginator({
    data: usersSelector.data,
  }); // Apply the usePaginator hook
  //state that hold searched items
  const [searchedItems, setSearchedItems] = useState<Partial<User>[]>([]);
  //state that holds search input query
  const [query, setQuery] = useState("");
  //search handler
  const search = useCallback(
    (query: string) => {
      const data = usersSelector.data.filter(
        (i) =>
          i.name.toLowerCase().includes(query.toLowerCase()) ||
          i.surname.toLowerCase().includes(query.toLowerCase()) ||
          i.email.toLowerCase().includes(query.toLowerCase()) ||
          i.phoneNumber.toString().includes(query.toLowerCase()) ||
          i.address.toLowerCase().includes(query.toLowerCase()) 
      )
      ;
      setSearchedItems(data);
    },
    [query]
  );
  //search input handler
  const searchInputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    search(query);
  };

  // Define columns for the DataTable
  const columns = [
    columnHelper.accessor("name", {
      cell: (info) => info.getValue(),
      header: "Name",
    }),
    columnHelper.accessor("surname", {
      cell: (info) => info.getValue(),
      header: "Surname",
    }),
    columnHelper.accessor("email", {
      cell: (info) => <Badge rounded={"full"} colorScheme={"telegram"}>{info.getValue()}</Badge>,
      header: "Email Address",
    }),
    columnHelper.accessor("phoneNumber", {
      cell: (info) =>  <Badge rounded={"full"} colorScheme={"green"}>{info.getValue()}</Badge>,
      header: "Phone number",
    }),
    columnHelper.accessor("address", {
      cell: (info) => info.getValue(),
      header: "Address",
    }),
    columnHelper.accessor("gender", {
      cell: (info) => info.getValue(),
      header: "Gender",
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

  // Fetch users from the server
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (userSelector.isLoadingUser == false) {
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
    <Layout>
      {userSelector.data.role == 1 ? (
        <ErrorMessage message="You don't have access to this route" />
      ) : (
        <>
          {userSelector.isLoadingUser === true ? (
            <Spinner />
          ) : usersSelector.errorUsers != null ? (
            <ErrorMessage message={usersSelector.errorUsers} />
          ) : (
            <Stack direction={"column"}>
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
              </Flex>
              <Divider my={3}></Divider>
              <DataTable
                columns={columns}
                data={query.length==0?currentData.map((i) => {
                  const { id, role, ...rest } = i;
                  return rest;
                }):searchedItems.map(i=>{
                  const { id, role, ...rest } = i;
                  return rest;
                })}
                title="Users list"
                loading={usersSelector.isLoadingUsers}
              />
              <Pagination
                currentPage={currentPage}
                onPageChange={setPage}
                totalPages={numOfPages}
              />
            </Stack>
          )}
        </>
      )}
    </Layout>
  );
};

export default Users;
