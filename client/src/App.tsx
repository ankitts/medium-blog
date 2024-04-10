import { BrowserRouter, Routes, Route } from "react-router-dom"
import Blog from "./pages/Blog"
import Blogs from "./pages/Blogs"
import Signin from "./pages/Signin"
import Signup from "./pages/Signup"

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='*' element={<Signin />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/signin' element={<Signin />} />
          <Route path='/blogs' element={<Blogs />} />
          <Route path='/blog/:id' element={<Blog />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
