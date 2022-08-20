import { Button, Container, Navbar } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { useAppSelector } from "store/helpers";
import { str } from 'jseassy'
import { socket } from "socket";
export function TopNavbar() {

	const user = useAppSelector((state) => state.auth.user);
	const navigate = useNavigate()

	function handleLogout() {
		localStorage.clear()
		socket?.disconnect()
		return navigate('/login')
	}

	return (
		<>
			<Navbar bg="dark" variant="dark">
				<Container>
					<Link to="/">
						<Navbar.Brand>
							Talkative
						</Navbar.Brand>
					</Link>
					<Navbar.Toggle />
					<Navbar.Collapse className="justify-content-center">
						<Navbar.Text>
							Signed in as: <b className="text-white"> {str.ucFirst(user?.username)} </b>
						</Navbar.Text>
						<div>
							<Button onClick={handleLogout}> Logout </Button>
						</div>
					</Navbar.Collapse>
				</Container>
			</Navbar>
			<Outlet />
		</>
	)
}