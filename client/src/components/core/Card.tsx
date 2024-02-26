import { Box } from '@chakra-ui/react'

const Card = ({children,rest}) => {
  return (
    <Box rounded={"md"}  boxShadow={'2xl'} bgColor={"gray.100"} {...rest}>
        {children}
    </Box>
  )
}

export default Card
