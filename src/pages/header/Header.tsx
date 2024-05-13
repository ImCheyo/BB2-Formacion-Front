import { Container, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";

const Header = () => {
    return(
        <>
            <Navbar bg="primary" variant="dark">
                <Container>
                    <Navbar.Brand><strong>Item Management</strong></Navbar.Brand>
                    <Nav className="ml-auto">
                        <Nav.Link as={Link} to="/" className="nav-link">Items</Nav.Link>
                        <Nav.Link as={Link} to="/item" className="nav-link">Create Item</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
        </>
    )
}

export default Header;