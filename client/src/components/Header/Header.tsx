import "./Header.css";
import logo from "../../assets/Logo.png";
import { NavLink } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router";
import { useState } from "react";

type HeaderProps = {
  onMenuOpen: () => void;
  onMenuClose: () => void;
  isMobileMenuOpen: boolean;
};

export default function Header({
  onMenuOpen,
  onMenuClose,
  isMobileMenuOpen,
}: HeaderProps) {
  const { isAuthenticated, currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  const handleLogout = () => {
    setIsAccountMenuOpen(false);
    logout();
    onMenuClose();
    navigate("/login", { replace: true });
  };

  function getNavLinkClass({ isActive }: { isActive: boolean }) {
    return isActive ? "nav-link nav-link--active" : "nav-link";
  }
  return (
    <header className={isMobileMenuOpen ? "header header_mobile" : "header"}>
      <button
        type="button"
        className="header__menu-btn"
        aria-label="Open menu"
        onClick={onMenuOpen}
      />
      <img className="header__logo" src={logo} alt="Mesh AI" />
      <nav
        className={
          isMobileMenuOpen ? "header__nav header__nav_mobile" : "header__nav"
        }
        aria-label="Main navigation"
      >
        {isAuthenticated && (
          <>
            <NavLink
              to="/knowledge"
              end
              className={getNavLinkClass}
              onClick={onMenuClose}
            >
              Knowledge Base
            </NavLink>
            <NavLink
              to="/chat"
              end
              className={getNavLinkClass}
              onClick={onMenuClose}
            >
              Chat
            </NavLink>
            <div className="header__account">
              <button
                type="button"
                className="header__dropdown-btn"
                aria-haspopup="menu"
                aria-expanded={isAccountMenuOpen}
                aria-controls="header-account-menu"
                onClick={() => setIsAccountMenuOpen((open) => !open)}
              >
                {currentUser?.name}'s Account
              </button>
              {isAccountMenuOpen && (
                <ul
                  className="header__menu"
                  id="header-account-menu"
                  role="menu"
                >
                  <li role="none">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleLogout}
                    >
                      Log out
                    </button>
                  </li>
                </ul>
              )}
            </div>
          </>
        )}
      </nav>
    </header>
  );
}
