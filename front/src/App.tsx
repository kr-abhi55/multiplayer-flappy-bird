import { Routes, Route } from "react-router"
import { BrowserRouter } from "react-router-dom"
import RouterLayout from "./components/RouterLayout"
import Options from "./pages/Options"
import NoPage from "./pages/NoPage"
import Host from "./pages/Host"
import Join from "./pages/Join"
import HostRoom from "./pages/HostRoom"
import JoinRoom from "./pages/JoinRoom"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RouterLayout />}>
          <Route index element={<Options />} />
          <Route path="/host" element={<Host />} />
          <Route path="/join" element={<Join />} />
          <Route path="/host-room" element={<HostRoom />} />
          <Route path="/join-room" element={<JoinRoom />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
