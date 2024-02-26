import {Provider} from "react-redux"
import { store } from './states/store'
import Main from './components/hoc/Main'
import "./App.css"
function App() {

  return (
    <Provider store={store}>
      <Main></Main>
    </Provider>
  )
}

export default App
