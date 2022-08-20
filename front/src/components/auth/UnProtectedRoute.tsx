import { Navigate, Outlet } from "react-router-dom";

export function UnProtectedRoute() {

	const token = localStorage.getItem("token")

	if (token && token !== "undefined") {
		return <Navigate to="/" />;
	}
	return <Outlet />
};