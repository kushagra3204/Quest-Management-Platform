import { Outlet, Navigate } from "react-router-dom";

interface Props {
    user: string | null;
}

const AdminProtectedRoutes = ({ user }: Props) => {
    if (user === null) return <p>Loading...</p>;
    return user === "admin" ? <Outlet /> : <Navigate to="/" />;
};

export default AdminProtectedRoutes;