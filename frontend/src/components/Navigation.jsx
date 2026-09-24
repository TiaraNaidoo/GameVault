/*
Main navigation shown only once a user is authenticated.
 
Uses NavLink so the currently active page can be styled
differently (indx.css additions)
*/
import { NavLink } from "react-router-dom";
 
function Navigation({ onLogout }) {
 
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
 
                <button className="logout-link" onClick={onLogout}>
                    Logout
                </button>
            </div>
 
        </nav>
    );
}
 
export default Navigation;
 