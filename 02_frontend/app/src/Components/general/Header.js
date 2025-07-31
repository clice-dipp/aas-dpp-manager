/* 
*	 Copyright 2025 Software GmbH (previously Software AG)
*    
*    Licensed under the Apache License, Version 2.0 (the "License");
*    you may not use this file except in compliance with the License.
*    You may obtain a copy of the License at
*    
*      http://www.apache.org/licenses/LICENSE-2.0
*    
*    Unless required by applicable law or agreed to in writing, software
*    distributed under the License is distributed on an "AS IS" BASIS,
*    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*    See the License for the specific language governing permissions and
*    limitations under the License.
*/

// react imports
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';

// Image imports
import aasLogo from '../../assets/images/aas_logo.png';
import cliceDippLogo from '../../assets/images/clice_dipp_logo.png'

//CSS import
import './Header.css';
import useToken from '../../helper/useToken';
import { useEffect } from 'react';

function Header({ token, setToken }) {

    const handleLogoutClick = () => {
        setToken(null);
        sessionStorage.removeItem('token');
    }



    return (
        <Navbar className="navbar-custom" fixed='top'>
            <Container>

                <Navbar.Brand className='navbar-brand-custom' href='/'>
                    <img src={cliceDippLogo} alt="Logo" style={{ maxHeight: '80px' }} className='logo-height' />
                </Navbar.Brand>

                <Nav className='ml-auto'>
                    <Nav.Link className='nav-link-custom' href='/aas'>Overview</Nav.Link>
                    {token == 'softwareag' &&
                        <Nav.Link className='nav-link-custom' href='/admin'>Admin</Nav.Link>
                    }

                    {token ?
                        <Nav.Link className='nav-link-custom' onClick={handleLogoutClick}>Logout</Nav.Link> :
                        <Nav.Link className='nav-link-custom' href='/login'>Login</Nav.Link>
                    }


                </Nav>

            </Container>
        </Navbar>
    );
}

export default Header;
