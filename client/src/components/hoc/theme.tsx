import { ThemeConfig, extendTheme } from '@chakra-ui/react'
import * as os from '@fontsource/open-sans';
import * as raleway from'@fontsource-variable/raleway';


// 2. Add your color mode config
const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}
const theme = extendTheme({
  fonts: {
    heading: `'Open Sans', sans-serif`,
    body: `'Raleway', sans-serif`,
  }
})
export default theme