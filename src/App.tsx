import { Route, Routes } from "react-router-dom";
import Header from "./pages/header/Header";
import Dashboard from "./pages/dashboard/Dashboard";
import NoMatch from "./pages/noMatch/NoMatch";
import PostItem from "./pages/item/PostItem";
import ItemDetail from "./pages/item/ItemDetail";
import UpdateItem from "./pages/item/UpdateItem";


function App() {
    return(
     <>
      <Header/>
      <Routes>
        <Route path="/" element={<Dashboard/>} />
        <Route path="/item" element={<PostItem/>} />
        <Route path="/item/:itemCode" element={<ItemDetail/>} />
        <Route path="/item/:itemCode/update" element={<UpdateItem/>} />
        <Route path="*" element={<NoMatch/>} />
      </Routes>
     </>
    );
}

export default App;