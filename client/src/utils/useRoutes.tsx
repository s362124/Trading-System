// Import necessary dependencies and components
import { ReactNode } from 'react';
import Login from '../pages/auth/Login'; // Login component
import Signup from '../pages/auth/Signup'; // Signup component
import Home from '../pages/home/Home'; // Home component
import SelectedItem from '../pages/selectedItem/SelectedItem'; // SelectedItem component
import Categories from '../pages/admin/Categories'; // Categories component
import Users from '../pages/admin/Users'; // Users component
import Items from '../pages/admin/Items'; // Items component
import Favorites from '../pages/favorites/Favorites';
import Profile from '../pages/profile/Profile';


// Define a type for route configuration
export type RouteType = {
    element: ReactNode; // The React element to be rendered
    path: TemplateStringsArray; // The path of the route
}

// Define a custom hook for generating routes
const useRoutes = () => {

    // Define an array of route configurations
    return [
        {
            path: `/auth/login`, // Path for the Login page
            element: <Login /> // Render the Login component
        },
        {
            path: `/auth/signup`, // Path for the Signup page
            element: <Signup /> // Render the Signup component
        },
        {
            path: `/`, // Root path
            element: <Home /> // Render Login if token is expired, otherwise render Home
        },
        {
            path: `/selectedItem`, // Path for the SelectedItem page
            element: <SelectedItem /> // Render the SelectedItem component
        },
        {
            path: `/admin/categories`, // Path for the Categories page
            element: <Categories /> // Render the Categories component
        },
        {
            path: `/admin/users`, // Path for the Users page
            element: <Users /> // Render the Users component
        },
        {
            path: `/admin/items`, // Path for the Items page
            element: <Items /> // Render the Items component
        },
        {
            path: `/favorites`, // Path for the favorites page
            element: <Favorites /> // Render the Favorites component
        },
        {
            path: `/profile`, // Path for the Profile page
            element: <Profile /> // Render the Profile component
        }
    ];
}

// Export the useRoutes hook as default
export default useRoutes;
