import { Box, Center, VStack,Text } from '@chakra-ui/react'

const ErrorMessage = ({message}:{message?:string}) => {
  return (
    <Center my={2}>
            <Box rounded={"md"} padding={5} bgColor={"red.100"}>
                <VStack alignSelf={"center"} spacing={2} >
                {message && <Text color={"red.400"}>{message}</Text>}
                </VStack>
            </Box>
    </Center>
  )
}

export default ErrorMessage
