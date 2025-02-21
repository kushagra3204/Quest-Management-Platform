import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Signup';
import AdminProtectedRoutes from './components/AdminProtectedRoutes';
import CreateQuest from './pages/CreateQuest';
import AuthProtectedRoutes from './components/AuthProtectedRoutes';
import QuestList from './pages/QuestList';

function App() {

    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const response = await fetch('http://localhost:5000/api/auth/user', {
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                });

                const data = await response.json();
                console.log("Auth Check Response:", data);

                if (response.ok) {
                    setRole(data.role);
                    setLoggedIn(true);
                } else {
                    setRole("user");
                    setLoggedIn(false);
                }
            } catch (error) {
                console.error("Error fetching user role:", error);
                setRole("user");
                setLoggedIn(false);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) return <p>Loading...</p>;

    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AdminProtectedRoutes user={role} />}>
                    <Route path="/create-quest" element={<CreateQuest />} />
                </Route>

                <Route element={<AuthProtectedRoutes isAuthenticated={loggedIn} />}>
                    <Route path="/active-quests" element={<QuestList />} />
                </Route>


                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login setLoggedInUser={setLoggedIn} />} />
                <Route path="/signup" element={<Register />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;