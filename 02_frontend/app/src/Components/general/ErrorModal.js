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

import { useEffect, useState } from "react";
import { Button, Alert } from "react-bootstrap";
import { useNavigate, useRouteError } from "react-router-dom";
import './ErrorModal.css';

export default function ErrorModal() {
  const error = useRouteError();
  const [modalIsOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    setIsOpen(true);
  }, [error])

  const handleClose = () => {
    setIsOpen(false);
    navigate(-1);
  }

  // Render error message based on its properties
  const errorMessage = error ? (error.message || "An error occurred") : "An error occurred";




  return (
    <div className="alert-modal">
      <div className="alert-backdrop"></div>
      <Alert variant="danger" className="alert-container">

        <Alert.Heading>Error: Something went wrong!</Alert.Heading>
        <p>
          We're sorry, but an unexpected error occurred. Please try again later. If the problem persists, please contact the developers for assistance.
        </p>
        <p>Thank you for your understanding.</p>
        <hr />
        <div className="d-flex justify-content-end">
          <Button onClick={handleClose}>Close</Button>
        </div>
      </Alert>
    </div>

  )
}