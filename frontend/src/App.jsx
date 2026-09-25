/*
React hooks imported
 
useState allows a component to remember changing values in
its state
 
useEffect allows code to run when a component changes/loading/loaded
*/
 
import {
    useState,
    useEffect
} from "react";
 
import {
    Routes,
    Route,
    Navigate
} from "react-router-dom";
 
import {
    getHealth,
    getProfile
} from "./services/api";
 
// ./ means "look inside the same folder this file is in."
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Navigation from "./components/Navigation";
 
import GamesPage from "./pages/GamesPage";
import GameDetailsPage from "./pages/GameDetailsPage";
import CollectionPage from "./pages/CollectionPage";
import ProfilePage from "./pages/ProfilePage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
 
/*
The key used to store the JWT in the browser's localStorage.
Kept as one constant so the same exact string is used every time
the token is saved, read, or removed - a typo in any one spot
would silently break persistence.
*/
const TOKEN_STORAGE_KEY = "gamevaultToken";
 
function App() {
 
    const [health, setHealth] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
 
    const [authView, setAuthView] = useState("login");
 
    const [token, setToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY));
 
    const [currentUser, setCurrentUser] = useState(null);
    const [profileLoading, setProfileLoading] = useState(true);
 
    useEffect(() => {
 
        const checkBackend = async () => {
 
            try {
                setLoading(true);
                setError("");
 
                const data = await getHealth();
                setHealth(data);
 
            } catch (requestError) {
                setError(requestError.message);
            } finally {
                setLoading(false);
            }
        };
 
        checkBackend();
 
    }, []);
 
    /*
    Re-runs whenever the token changes (login, logout, or a
    token restored from localStorage on first load) - so role
    information always reflects whoever is CURRENTLY logged in.
    */
    useEffect(() => {
 
        if (!token) {
            setCurrentUser(null);
            setProfileLoading(false);
            return;
        }
 
        const loadProfile = async () => {
 
            try {
                setProfileLoading(true);
                const response = await getProfile();
                setCurrentUser(response.user);
 
            } catch (requestError) {
                setCurrentUser(null);
 
            } finally {
                setProfileLoading(false);
            }
        };
 
        loadProfile();
 
    }, [token]);
 
    const handleAuthSuccess = (data) => {
 
        if (!data || !data.token) {
            setError("Authentication succeeded but no token was returned.");
            return;
        }
 
        localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
        setToken(data.token);
    };
 
    const logout = () => {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        setToken(null);
        setCurrentUser(null);
        setAuthView("login");
    };
 
    /*
    Not authenticated: show the existing health-check card plus
    the login/register forms. No routing needed here - this is
    the "before login" screen.
    */
    if (!token) {
        return (
            <div className="app">
 
                <header className="header">
                    <div>
                        <h1>Gamevault</h1>
                        <p>Your secure video game collection</p>
                    </div>
                </header>
 
                <main className="main-content">
 
                    <section className="welcome-card">
                        <p className="label">Welcome to</p>
                        <h2>GameVault</h2>
                        <p>Browse, manage and organise your video game collection</p>
                    </section>
 
                    <section className="status-card">
                        <h2>API connection</h2>
 
                        {loading && (
                            <p>Checking GameVault API...</p>
                        )}
 
                        {!loading && error && (
                            <div className="status-error">
                                <strong>Backend unavailable</strong>
                                <p>{error}</p>
                            </div>
                        )}
 
                        {!loading && health && (
                            <div className="status-success">
                                <strong>Backend connected</strong>
                                <p>Application:{" "}{health.application}</p>
                                <p>Status:{" "}{health.status}</p>
                                <p>Environment:{" "}{health.environment}</p>
                                <p>Protocol:{" "}{health.protocol}</p>
                            </div>
                        )}
                    </section>
 
                    <section className="auth-card">
                        <div className="auth-nav">
                            <button
                                className={authView === "login" ? "active" : ""}
                                onClick={() => setAuthView("login")}
                            >
                                Login
                            </button>
                            <button
                                className={authView === "register" ? "active" : ""}
                                onClick={() => setAuthView("register")}
                            >
                                Register
                            </button>
                        </div>
 
                        {authView === "login" ? (
                            <LoginForm onAuthSuccess={handleAuthSuccess} />
                        ) : (
                            <RegisterForm onAuthSuccess={handleAuthSuccess} />
                        )}
                    </section>
 
                </main>
 
            </div>
        );
    }
 
    /*
    Authenticated, but the profile (and therefore the role) has
    not resolved yet. Waiting here avoids a normal admin user
    being briefly redirected away from /admin on every page load
    before their role is known.
    */
    if (profileLoading) {
        return (
            <div className="app">
                <p style={{ textAlign: "center", marginTop: "3rem" }}>
                    Loading your account...
                </p>
            </div>
        );
    }
 
    const isAdmin = currentUser?.role === "admin";
 
    return (
        <div className="app">
 
            <Navigation onLogout={logout} isAdmin={isAdmin} />
 
            <main className="main-content main-content-wide">
 
                <Routes>
                    <Route path="/games" element={<GamesPage />} />
                    <Route path="/games/:id" element={<GameDetailsPage />} />
                    <Route path="/collection" element={<CollectionPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
 
                    <Route
                        path="/admin"
                        element={
                            isAdmin
                                ? <AdminDashboardPage />
                                : <Navigate to="/games" replace />
                        }
                    />
 
                    <Route path="*" element={<Navigate to="/games" replace />} />
                </Routes>
 
            </main>
 
        </div>
    );
}
 
export default App;
 