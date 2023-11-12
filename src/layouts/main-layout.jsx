import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { BsUnity } from 'react-icons/bs';
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function MainLayout({ children }) {
  const { cartDetail } = useSelector((state) => state.cart);
  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary mb-2">
        <Container>
          <Navbar.Brand as={Link} to="/">
            <span className="d-flex align-items-center"><BsUnity />&nbsp;Movie Shop</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">ค้นหา</Nav.Link>
              <Nav.Link as={Link} to="/movie">ภาพยนตร์</Nav.Link>
              <Nav.Link as={Link} to="/cart">ตะกร้า
                <span
                  style={{
                    background: "#11c917",
                    color: "white",
                    borderRadius: 30,
                    padding: "2px 8px"
                  }}
                >
                  {cartDetail.nums}
                </span>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <>{children}</>
    </>
  );
}

export default MainLayout;