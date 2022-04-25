import React from 'react';
import { Container, Navbar, Nav, Dropdown, Button} from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import dewey from '../../assets/deweyt.png';
import pro from '../../assets/avatar.png';
import out from '../../assets/logout.png';
import  { useAuth0 } from '@auth0/auth0-react';
import './NavCustom.css';
import '../../fonts/Lato-Regular.ttf';


const LoginButton = () => {
    const { loginWithRedirect, isAuthenticated } = useAuth0()
    return ( !isAuthenticated &&  
        <Button variant="dark"
            onClick={() => loginWithRedirect({
                appState:{
                    returnTo: window.location.pathname
                }
            })}
            >Log In
        </Button>
    )
}

const Profile = () => {
    const { user, isLoading, logout, isAuthenticated } = useAuth0();
    if (isLoading) {
        return <div>
        </div>;
      }
    return ( isAuthenticated &&
        <Dropdown id="profile">
        <Dropdown.Toggle id="dropdown-autoclose-true" variant="dark">
        <img 
            src= {pro}
            width="30px"
            height="30px"
            style={{marginRight:"10px", borderRadius:"50%", 
            textAlign:"center", backgroundColor:"white"}}
            alt="Profile Logo"
            />
          {user.name}
        </Dropdown.Toggle>
        <Dropdown.Menu id="dropdown-menu">
          <Dropdown.Item onClick={() => logout({ returnTo: window.location.origin })}> Log Out 
          <img 
            src= {out}
            width="20px"
            height="20px"
            className='d-inline-block alight-top'
            style={{float:"right", alignItems:"center", marginTop:"2px"}}
            alt="Logout Logo"
            /></Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    )
  }

export default function NavigationBar(){
    return(
        <Navbar collapseOnSelect className="color-nav" expand="md">
            <Container fluid={true}>
                <Navbar.Brand>
                    <img 
                        src= {dewey}
                        width="70px"
                        height="70px"
                        className='d-inline-block alight-top'
                        style={{marginLeft:"50px",marginRight:"45px", alignItems:"center"}}
                        alt="Deweybot logo"
                    />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls='responsive-navbar-nav' />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav>
                        <Nav.Link as={NavLink} to='/' style={{textAlign:"center", fontSize:"18px", marginRight:"15px", marginLeft: "5px"}}>Home</Nav.Link>
                        <Nav.Link as={NavLink} to='/uidebug' style={{textAlign:"center", fontSize:"18px",marginRight:"15px", marginLeft: "15px"}}>UI Debug</Nav.Link>
                        <Nav.Link as={NavLink} to='/manualhandling' style={{textAlign:"center", fontSize:"18px",marginRight:"15px", marginLeft: "15px"}}>Manual Handling</Nav.Link>
						<Nav.Link as={NavLink} to='/trainingdata' style={{textAlign:"center", fontSize:"18px",marginRight:"15px", marginLeft: "15px"}}>Training Data</Nav.Link>
					</Nav>
                </Navbar.Collapse>
                <Navbar.Collapse id="responsive-navbar-nav" className='justify-content-end'>
                    <Nav>
                        <Profile />
                        <LoginButton />
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}
