/*
My Profile page.
 
GET /auth/profile already exists
It uses the JWT to identify the user, so no user ID is ever
requested from the person viewing the page.
*/
import { useState, useEffect } from "react";
 
import { getProfile } from "../services/api";
 
function ProfilePage() {
 
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
 
    useEffect(() => {
 
        const loadProfile = async () => {
 
            try {
                setLoading(true);
                setError("");
 
                const response = await getProfile();
 
                // The auth controller returns { user: {...} }.
                setProfile(response.user);
 
            } catch (requestError) {
                setError(requestError.message);
            } finally {
                setLoading(false);
            }
        };
 
        loadProfile();
 
    }, []);
 
    return (
        <div className="page">
 
            <h2>My Profile</h2>
 
            {loading && (
                <p>Loading profile...</p>
            )}
 
            {!loading && error && (
                <div className="status-error">
                    <strong>Could not load profile</strong>
                    <p>{error}</p>
                </div>
            )}
 
            {!loading && !error && profile && (
                <div className="profile-details">
                    <p><strong>Name:</strong> {profile.name}</p>
                    <p><strong>Email:</strong> {profile.email}</p>
                    <p><strong>Role:</strong> {profile.role}</p>
                </div>
            )}
 
        </div>
    );
}
 
export default ProfilePage;
 