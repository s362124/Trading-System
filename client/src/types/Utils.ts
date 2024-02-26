import { FlexProps, BoxProps } from "@chakra-ui/react";
import { IconType } from "react-icons";

// Interface for props of a link item in the navigation
export interface LinkItemProps {
  name: string; // Name or label of the link
  icon: IconType; // Icon component for the link
  href: string; // URL the link navigates to
  isAdminRoute?: boolean; // Optional flag indicating if it's an admin route
}

// Interface for props of a navigation item
export interface NavItemProps extends FlexProps {
  icon: IconType; // Icon component for the navigation item
  children: React.ReactNode; // Children components (usually text or labels)
  href: string; // URL the navigation item navigates to
  isAdminRoute?: boolean;
  isSelected: boolean; // Optional flag indicating if it's an admin route
}

// Interface for props of a mobile component
export interface MobileProps extends FlexProps {
  onOpen: () => void; // Function called when mobile component opens
}

// Interface for props of a sidebar component
export interface SidebarProps extends BoxProps {
  onClose: () => void; // Function called when sidebar component closes
}
