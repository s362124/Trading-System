import { IconButton, Input, Stack } from "@chakra-ui/react";
import React from "react";
import { FiSearch } from "react-icons/fi";

type Props = {
  value: string;
  handler: (event:React.ChangeEvent<HTMLInputElement>) => void;
  onSearch?: () => void;
};
const Search = (props: Props) => {
  return (
    <Stack w={"50%"} direction={"row"} spacing={3}>
      <Input
        value={props.value}
        onChange={props.handler}
        colorScheme={"blue"}
        borderColor={"blue.300"}
        focusBorderColor="blue.400"
        color={"blue.400"}
        rounded={"full"}
        placeholder="search..."
      />
      <IconButton
        onClick={props.onSearch}
        aria-label="search"
        colorScheme={"blue"}
        icon={<FiSearch color="white" />}
        rounded={"full"}
      />
    </Stack>
  );
};

export default Search;
