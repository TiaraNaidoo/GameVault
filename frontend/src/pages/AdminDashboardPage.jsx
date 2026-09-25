/*
Admin Dashboard - central place for managing GameVault's games.
*/
import { useState, useEffect } from "react";
 
import { getAllGames, createGame, updateGame, deleteGame } from "../services/api";
import GameForm from "../components/admin/GameForm";
import GameManagement from "../components/admin/GameManagement";
 
function AdminDashboardPage() {
 
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
 
    // Controls whether GameForm is shown, and in which mode.
    // null           -> form hidden
    // {}              -> would mean "add" mode, but we use a
    //                    dedicated boolean instead
    const [showForm, setShowForm] = useState(false);
    const [editingGame, setEditingGame] = useState(null); // null = add mode
 
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState("");
 
    const [dashboardMessage, setDashboardMessage] = useState("");
 
    useEffect(() => {
 
        const loadGames = async () => {
 
            try {
                setLoading(true);
                setLoadError("");
 
                const response = await getAllGames();
                setGames(response.data);
 
            } catch (requestError) {
                setLoadError(requestError.message);
            } finally {
                setLoading(false);
            }
        };
 
        loadGames();
 
    }, []);
 
    const handleAddNewClick = () => {
        setEditingGame(null);
        setFormError("");
        setDashboardMessage("");
        setShowForm(true);
    };
 
    const handleEditClick = (game) => {
        setEditingGame(game);
        setFormError("");
        setDashboardMessage("");
        setShowForm(true);
    };
 
    const handleFormCancel = () => {
        setShowForm(false);
        setEditingGame(null);
        setFormError("");
    };
 
    /*
    Handles both create and edit
    */
    const handleFormSubmit = async (gameData) => {
 
        try {
            setSubmitting(true);
            setFormError("");
 
            if (editingGame) {
 
                const response = await updateGame(editingGame._id, gameData);
 
                setGames((current) =>
                    current.map((game) =>
                        game._id === editingGame._id ? response.data : game
                    )
                );
 
                setDashboardMessage(`"${response.data.title}" was updated.`);
 
            } else {
 
                const response = await createGame(gameData);
 
                setGames((current) => [response.data, ...current]);
 
                setDashboardMessage(`"${response.data.title}" was created.`);
            }
 
            setShowForm(false);
            setEditingGame(null);
 
        } catch (requestError) {
            setFormError(requestError.message);
        } finally {
            setSubmitting(false);
        }
    };
 
    const handleDeleteClick = async (game) => {
 
        const confirmed = window.confirm(
            `Delete "${game.title}"?\n\nThis action will remove the game from GameVault.`
        );
 
        if (!confirmed) {
            return;
        }
 
        try {
            setDashboardMessage("");
 
            await deleteGame(game._id);
 
            setGames((current) =>
                current.filter((existingGame) => existingGame._id !== game._id)
            );
 
            setDashboardMessage(`"${game.title}" was deleted.`);
 
        } catch (requestError) {
            setDashboardMessage(requestError.message);
        }
    };
 
    return (
        <div className="page">
 
            <h2>Admin Dashboard</h2>
 
            {!showForm && (
                <button onClick={handleAddNewClick}>
                    Add New Game
                </button>
            )}
 
            {dashboardMessage && (
                <p className="collection-message">{dashboardMessage}</p>
            )}
 
            {showForm && (
                <GameForm
                    key={editingGame ? editingGame._id : "new"}
                    initialGame={editingGame}
                    onSubmit={handleFormSubmit}
                    onCancel={handleFormCancel}
                    submitting={submitting}
                    formError={formError}
                />
            )}
 
            {loading && (
                <p>Loading games...</p>
            )}
 
            {!loading && loadError && (
                <div className="status-error">
                    <strong>Could not load games</strong>
                    <p>{loadError}</p>
                </div>
            )}
 
            {!loading && !loadError && (
                <GameManagement
                    games={games}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                />
            )}
 
        </div>
    );
}
 
export default AdminDashboardPage;
 