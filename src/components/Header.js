import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import logoApp from '../assets/logo192.png'
import {NavLink, useNavigate} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { useContext, useState } from 'react';
import { UserContext } from '../Context/UserContext';

const Header = (props) => {

    const { logout, user } = useContext(UserContext)

    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate("/")
        toast.success("logout success")
    }

    return (<>
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="/">
                    
                    <img 
                        src={logoApp}
                        width="30"
                        height="30"
                        className='d-inline-block align-top'
                        alt='React logo'
                    />
                    <span >Test App</span>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    { (user && user.auth || window.location.pathname === '/') &&
                    <>
                            <Nav className="me-auto"> 
                                <NavLink to="/" className="nav-link">Home</NavLink>
                                <NavLink to="/users" className="nav-link">Manage User</NavLink>

                            </Nav>
                            <Nav>
                                {user && user.email && <span className='nav-link'>Welcom {user.email}</span>}
                                <NavDropdown title={<span><FontAwesomeIcon icon={faCog}/> Setting</span>}>

                                    {user && user.auth === true
                                        ? <NavDropdown.Item onClick={() => handleLogout()}>Logout</NavDropdown.Item> 
                                        : <NavLink to="/login" className="dropdown-item">Login</NavLink>
                                    }
                                    
                                    
                                </NavDropdown>
                            </Nav>
                    </>   
                    }
                   

                </Navbar.Collapse>
            </Container>
        </Navbar>
        
    </>)
}

export default Header