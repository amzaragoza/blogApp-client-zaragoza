import { useContext } from 'react';
import {Container, Nav, Navbar} from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import UserContext from '../UserContext';

export default function AppNavbar() {

	const { user } = useContext(UserContext);

	return(
		<Navbar bg="primary" expand="lg">
			<Container fluid>
			    <Navbar.Brand as={NavLink} to="/" className=" text-white">Zuitt Blog App</Navbar.Brand>
			    <Navbar.Toggle aria-controls="basic-navbar-nav" />
			    <Navbar.Collapse id="basic-navbar-nav">
				    <Nav className="ms-auto">
				        <Nav.Link as={NavLink} to="/" exact="true" className=" text-white">Home</Nav.Link>
				        {(user.id !== null) 
                            ? (
								(user.isAdmin === true)
								? (
									<>
	                                    <Nav.Link as={NavLink} to="/posts" exact="true" className=" text-white">Dashboard</Nav.Link>
										<Nav.Link as={NavLink} to="/logout" exact="true" className=" text-white">Logout</Nav.Link>
									</>
								) : (
									<>
	                                    <Nav.Link as={NavLink} to="/posts" exact="true" className=" text-white">Posts</Nav.Link>
	                                    <Nav.Link as={NavLink} to="/addPost" exact="true" className=" text-white">Add Post</Nav.Link>
										<Nav.Link as={NavLink} to="/logout" exact="true" className=" text-white">Logout</Nav.Link>
									</>
								)
							) : (
								<>
									<Nav.Link as={NavLink} to="/posts" exact="true" className=" text-white">Posts</Nav.Link>
									<Nav.Link as={NavLink} to="/login" exact="true" className=" text-white">Login</Nav.Link>
									<Nav.Link as={NavLink} to="/register" exact="true" className=" text-white">Register</Nav.Link>
								</>
							)
						}
				    </Nav>
			    </Navbar.Collapse>
			</Container>
		</Navbar>
	)
}