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

import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

/**
 * A React component for user login.
 * 
 * This component provides a form for users to enter their username and password.
 * It handles the form submission, communicates with the backend API for authentication,
 * and manages navigation upon successful login.
 *
 * @param {Object} props - The component props.
 * @param {Function} props.setToken - A function to set the authentication token in the parent component.
 * @returns {JSX.Element} The rendered login form component.
 */
function Login({ setToken }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    /**
     * Handles the change in the username input field.
     *
     * @param {React.ChangeEvent<HTMLInputElement>} event - The change event for the username input.
     */
    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    /**
     * Handles the change in the password input field.
     *
     * @param {React.ChangeEvent<HTMLInputElement>} event - The change event for the password input.
     */
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    /**
     * Handles the form submission, performs login, and navigates on successful authentication.
     *
     * @param {React.FormEvent<HTMLFormElement>} event - The form submission event.
     */
    const handleLoginClick = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error('Invalid username or password!');
            }

            const data = await response.json();
            const token = data.token;
            setToken(token);
            navigate("/aas");

            console.log('Login successful. Token:', token);
        } catch (error) {
            // Create and display a Bootstrap alert bar
            const alertElement = document.createElement('div');
            alertElement.classList.add('alert', 'alert-danger', 'mb-0', 'mt-3', 'text-center');
            alertElement.textContent = error.message;

            const alertContainer = document.getElementById('alert-container') || document.body;
            alertContainer.appendChild(alertElement);
            setTimeout(() => alertElement.remove(), 2500);
        }
    };

    return (
        <Container className="flex-grow-1 d-flex flex-column py-3 justify-content-center">
            <Container className="border bg-light px-5 py-4" style={{ width: '400px' }}>
                <Form onSubmit={handleLoginClick}>
                    <Form.Group className="mb-4" controlId="formUsername">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Username"
                            value={username}
                            onChange={handleUsernameChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="formPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={handlePasswordChange}
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit" className="w-100 mb-4">
                        Login
                    </Button>

                    <div className="text-center">
                        <p>Not a member?</p>
                        <p>Reach out to the responsible project manager.</p>
                    </div>
                </Form>
            </Container>
        </Container>
    );
}

export default Login;
