import { Flex, Icon, Box } from "@chakra-ui/react";
import { NavItemProps } from "../../../types/Utils";

const NavItem = ({
  icon,
  isAdminRoute,
  children,
  href,
  isSelected,
  ...rest
}: NavItemProps) => {
  return (
    <Box
      as="a"
      href={href}
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
    >
      <Flex
        align="center"
        px="4"
        py="2"
        mx="4"
        my="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        color={isSelected === true ? "white" : "black"}
        bg={isSelected === true ? "blue.400" : "transparent"}
        _hover={{
          bg: "blue.400",
          color: "white",
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            color={isSelected === true ? "wite" : "black"}
            _groupHover={{
              color: "white",
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Box>
  );
};

export default NavItem;
