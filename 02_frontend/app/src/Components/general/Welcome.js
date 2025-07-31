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

// React and React Bootstrap imports
import React from 'react';
import { Container } from 'react-bootstrap';



function Welcome() {
  return (
    <Container id='welcomeDiv' className="flex-grow-1 d-flex flex-column justify-content-center align-items-center">
      <input type="image" src="press_to_start.svg" alt="Submit" style={{ width: '100%', maxWidth:'400px' }} onClick={()=>window.location.href="/aas"}/>
    </Container>
  );
}

export default Welcome;

