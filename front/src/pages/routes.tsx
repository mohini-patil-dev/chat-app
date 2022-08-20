import {
	BrowserRouter,
	Routes,
	Route,
} from "react-router-dom";
import { ProtectedRoute } from "components/auth/ProtectedRoute";
import { UnProtectedRoute } from 'components/auth/UnProtectedRoute'
import { Login } from "pages/auth/login";
import { Register } from "pages/auth/register";
import { Home } from 'pages/home'
import { RouteNotFound } from 'pages/others/404'
import { TopNavbar } from "components/layouts/headers/Navbar";
import { VerifyEmail } from "./auth/verifyEmail";

export function AppRoutes() {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<UnProtectedRoute />}>
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
					<Route path="/verify-email" element={<VerifyEmail />} />
				</Route>

				<Route element={<ProtectedRoute />}>
					<Route element={<TopNavbar />}>
						<Route path="/" element={<Home />} />
					</Route>
				</Route>


				<Route path="*" element={<RouteNotFound />} /> {/* 404 Route */}
			</Routes>
		</BrowserRouter>
	)
}