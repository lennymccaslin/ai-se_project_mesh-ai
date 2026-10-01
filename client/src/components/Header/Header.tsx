import "./Header.css";
import logo from "../../assets/Logo.png";
import { NavLink } from "react-router";

type HeaderProps = {
 onMenuOpen: () => void;
 onMenuClose: () => void;
 isMobileMenuOpen: boolean;
};

export default function Header({ onMenuOpen, onMenuClose, isMobileMenuOpen }: HeaderProps) {
    function getNavLinkClass({ isActive }: { isActive: boolean }) {
        return isActive ? "nav-link nav-link--active" : "nav-link";
  }
    return (
    <header className={isMobileMenuOpen ? 'header header_mobile' : 'header'}>
        <button
 type="button"
 className="header__menu-btn"
 aria-label="Open menu"
 onClick={onMenuOpen}
/>
        <img className="header__logo" src={logo} alt="Mesh AI" />
        <nav 
        className={isMobileMenuOpen ? 'header__nav header__nav_mobile' : 'header__nav'} 
        aria-label="Main navigation"
        >
            <NavLink 
            to="/knowledge" 
            className={getNavLinkClass}
            onClick={onMenuClose}
            >
                Knowledge Base
            </NavLink>
            <NavLink
                to="/chat"
                className={getNavLinkClass}
                onClick={onMenuClose}
            >
                Chat
            </NavLink>
        </nav>
    </header>
    );
}