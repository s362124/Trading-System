import { Box, Center, VStack, Text, Spinner } from "@chakra-ui/react";

const Loader = ({ message }: { message?: string }) => {
  return (
    <Center my={2}>
      <Box rounded={"md"} padding={5} bgColor={"gray.200"}>
        <VStack alignSelf={"center"} spacing={2}>
          {message && <Text color={"blue.400"}>{message}</Text>}
          <Spinner color="blue.400" />
        </VStack>
      </Box>
    </Center>
  );
};

export default Loader;
