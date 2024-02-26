
import { ChakraProvider } from '@chakra-ui/react'

import { BrowserRouter, Route, Routes } from "react-router-dom";
import useRoutes from '../../utils/useRoutes';
import theme from './theme';




// Main component responsible for setting up routing and providing Chakra UI theming
const Main = () => {
  // Fetching routes configuration using a custom hook
  const routes = useRoutes();

  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter >
      <Routes >
        {routes.map((route,_index)=><Route  path={route.path} element={route.element} />)}
      </Routes>
      </BrowserRouter>
    </ChakraProvider>
  )
}

export default Main
