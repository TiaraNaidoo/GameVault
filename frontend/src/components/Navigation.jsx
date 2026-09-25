/*
Main navigation shown only once a user is authenticated.
 
isAdmin controls whether the Admin Dashboard link appears at
all. This is a USABILITY measure only - hiding the link does not
protect anything by itself. Actual protection is:
  1. the /admin route itself checking the role again (App.jsx)
  2. the backend's authenticateToken + authoriseRoles("admin")
     rejecting any admin request regardless of what the frontend
     shows or hides
*/
import { NavLink } from "react-router-dom";
 
function Navigation({ onLogout, isAdmin }) {
 
    return (
        <nav className="main-nav">
 
            <span className="main-nav-brand">
                GameVault
            </span>
 
            <div className="main-nav-links">
                <NavLink
                    to="/games"
                    className={({ isActive }) => isActive ? "active" : ""}
                >
                    Browse Games
                </NavLink>
 
                <NavLink
                    to="/collection"
                    className={({ isActive }) => isActive ? "active" : ""}
                >
                    My Collection
                </NavLink>
 
                <NavLink
                    to="/profile"
                    className={({ isActive }) => isActive ? "active" : ""}
                >
                    My Profile
                </NavLink>
 
                {isAdmin && (
                    <NavLink
                        to="/admin"
                        className={({ isActive }) => isActive ? "active" : ""}
                    >
                        Admin Dashboard
                    </NavLink>
                )}
 
                <button className="logout-link" onClick={onLogout}>
                    Logout
                </button>
            </div>
 
        </nav>
    );
}
 
export default Navigation;
 