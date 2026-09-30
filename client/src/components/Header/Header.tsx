import "./Header.css";
import logo from "../../assets/Logo.png";
import { NavLink } from "react-router";

export default function Header() {
    function getNavLinkClass({ isActive }: { isActive: boolean }) {
        return isActive ? "nav-link nav-link--active" : "nav-link";
  }
    return (
    <header className="header">
        <img className="header__logo" src={logo} alt="Mesh AI" />
        <nav className="header__nav" aria-label="Main navigation">
            <NavLink to="/knowledge" className={getNavLinkClass}>
                Knowledge Base
            </NavLink>
            <NavLink to="/chat" className={getNavLinkClass}>
                Chat
            </NavLink>
        </nav>
    </header>
    );
}