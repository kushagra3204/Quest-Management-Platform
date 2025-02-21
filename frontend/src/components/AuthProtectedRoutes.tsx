import { Navigate, Outlet } from 'react-router-dom';

const AuthProtectedRoutes = ({ isAuthenticated }: { isAuthenticated: boolean | null }) => {
    console.log("Authenticated:", isAuthenticated);
    if (isAuthenticated === null) return <p>Loading...</p>;
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default AuthProtectedRoutes;