import "./App.css";
import KnowledgeBase from "../../pages/KnowledgeBase/KnowledgeBase";
import Intro from "../../pages/Intro/Intro";
import { Route } from "react-router";
import { Routes } from "react-router";
import AppLayout from "../AppLayout/AppLayout";
import Chat from "../../pages/Chat/Chat";
import Register from "../../pages/Register/Register";
import Login from "../../pages/Login/Login";
import { ProtectedRoute, PublicRoute } from "../ProtectedRoute/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Intro />} />
      <Route element={<AppLayout />}>
      <Route element={<PublicRoute />}>
      <Route path="login" element={<Login />} />
      <Route path='/register' element={<Register />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/knowledge" element={<KnowledgeBase />} />
        <Route path="/chat" element={<Chat />} />
      </Route>
      </Route>
    </Routes>
  );
}

export default App;
