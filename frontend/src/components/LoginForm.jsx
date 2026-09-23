/*
LoginForm.jsx = same structure as RegisterForm.jsx,
minus the name field - login identifies the account using the
supplied email and password only.
*/
import { useState } from "react";
 
import { loginUser } from "../services/api";
 
// onAuthSuccess is a func that will be received from App.jsx
function LoginForm({
    onAuthSuccess
}) {
 
    const [
        email,
        setEmail
    ] = useState("");
 
    const [
        password,
        setPassword
    ] = useState("");
 
    const [
        error,
        setError
    ] = useState("");
 
    const [
        loading,
        setLoading
    ] = useState(false);
 
    const handleSubmit = async (
        event
    ) => {
 
        event.preventDefault();
 
        setError("");
 
        setLoading(true);
 
        try {
 
            const loginData = {
                email,
                password
            };
 
            const data = await loginUser(loginData);
 
            onAuthSuccess(data);
 
        } catch (requestError) {
 
            setError(requestError.message);
 
        } finally {
 
            setLoading(false);
 
        }
    };
 
    return (
        <form className="auth-form" onSubmit={handleSubmit}>
 
            <label htmlFor="login-email">
                Email
            </label>
            <input
                id="login-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
            />
 
            <label htmlFor="login-password">
                Password
            </label>
            <input
                id="login-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
            />
 
            {error && (
                <p className="auth-error">
                    {error}
                </p>
            )}
 
            <button type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
            </button>
 
        </form>
    );
}
 
export default LoginForm;
 