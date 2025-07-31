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
import { Container, Row, Col } from 'react-bootstrap';

// Image imports
import sagPrimaryLogoDark from '../../assets/icons/sag-primary-logo-dark.svg';


// CSS Imports#
import "./Footer.css";


function Footer() {
  return (
    <footer className="pt-2" style={{ fontSize: 'small' }}>
      <Container>
        <Row>
          <Col xs={12} md={3} className="mb-3 d-flex align-items-center justify-content-center">
            <img src={sagPrimaryLogoDark} alt="Logo" style={{ width: '100%', maxWidth:'250px' }} />
          </Col>
          <Col xs={12} md={6} className="mt-3 text-center">
            <ul className="list-unstyled small">
              <li className="mb-2">
                Designed and built by the{' '}
                <a href="https://www.softwareag.com/de_de.html" target="_blank" rel="noopener noreferrer">
                  Software AG
                </a>{' '}
                Team.
              </li>
              <li className="mb-2">Currently v0.0.3</li>
            </ul>
          </Col>
          <Col xs={12} md={3} className="mt-3 text-center">
            <h6>Links</h6>
            <ul className="list-unstyled">
              <li className="mb-1">
                <a href="https://www.softwareag.com/de_de.html" target="_blank" rel="noopener noreferrer">
                  Software AG
                </a>
              </li>
              <li className="mb-1">
                <a
                  href="https://www.ptw.tu-darmstadt.de/forschung_ptw/eta/aktuelle_projekte_eta/clicedipp/index.de.jsp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  CliCE - DiPP
                </a>
              </li>
            </ul>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
