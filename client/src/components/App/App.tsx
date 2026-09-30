import "./App.css"
import KnowledgeBase from "../../pages/KnowledgeBase/KnowledgeBase";
import Intro from "../../pages/Intro/Intro";
import { Route } from "react-router";
import { Routes } from "react-router";
import AppLayout from "../AppLayout/AppLayout";
import Chat from "../../pages/Chat/Chat";

function App() {
 return (
   <Routes>
    <Route
    path="/"
     element={<Intro />} />
     <Route element={<AppLayout />}>
     <Route
    path="/knowledge"
       element={<KnowledgeBase />} 
       />
      <Route
      path="/chat"
      element={<Chat />}
      />
     </Route>
   </Routes>
 );
}

export default App
