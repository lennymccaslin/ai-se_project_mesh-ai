import "./AppLayout.css";
import Header from "../Header/Header";
import { Outlet } from "react-router";

export default function AppLayout() {
 return (
   <div className="app-layout">
     <Header />
       <main className="app-layout__main">
         <Outlet />
       </main>
   </div>
   );
}