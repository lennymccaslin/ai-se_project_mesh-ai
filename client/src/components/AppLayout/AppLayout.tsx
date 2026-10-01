import "./AppLayout.css";
import Header from "../Header/Header";
import { Outlet } from "react-router";
import { useState } from "react";

export default function AppLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(true)
 return (
   <div className="app-layout">
     <Header
     onMenuOpen={() => setIsMobileMenuOpen(true)}
     onMenuClose={() => setIsMobileMenuOpen(false)}
     isMobileMenuOpen={isMobileMenuOpen}
     >
     </Header>
     {isMobileMenuOpen && (
  <div
    className="app-layout__backdrop"
    onClick={() => setIsMobileMenuOpen(false)}
  />
)}
       <main className="app-layout__main">
         <Outlet
         context={{ isMobileMenuOpen, setIsMobileMenuOpen }}
         >

         </Outlet>
       </main>
   </div>
   );
}