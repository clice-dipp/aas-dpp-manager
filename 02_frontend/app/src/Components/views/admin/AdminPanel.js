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

//React Imports
import React, { useState, useEffect, useRef } from 'react';
import { Container, Form, Button, Table, Alert, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';


// Icon Import
import { ReactComponent as TrashIcon } from '../../../assets/icons/TrashIcon.svg';
import { ReactComponent as PenIcon } from '../../../assets/icons/PenIcon.svg';


// CSS Imports
import "../aas/AasShow.css";
import "./AdminPanel.css";
import "./../../../Components/Colors.css";

//Helper Imports
import { fetchApiKeys, deleteApiKey, addApiKey, renameApiKey, regenerateApiKey } from '../../../helper/apiKeyHelper';







function AdminPanel() {
    const [apiKeys, setApiKeys] = useState([]);
    const [newUser, setNewUser] = useState('');
    const [lastAddedKey, setLastAddedKey] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showRenewalModal, setShowRenewalModal] = useState(false);
    const [newOwnerName, setNewOwnerName] = useState('');
    const [keyToDelete, setKeyToDelete] = useState('');
    const [keyToEdit, setKeyToEdit] = useState('');
    const alertRef = useRef(null);  // Ref für das Alert-Element

    useEffect(() => {
        const loadApiKeys = async () => {
            const keys = await fetchApiKeys();
            setApiKeys(keys);
        };
        loadApiKeys();
    }, []);

    useEffect(() => {
        if (lastAddedKey && alertRef.current) {
            window.scrollTo({
                top: alertRef.current.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    }, [lastAddedKey]);

    useEffect(() => {
        console.log('keyToEdit: ', keyToEdit);
    }, [keyToEdit]);


    const handleDelete = async () => {
        await deleteApiKey(keyToDelete);
        setApiKeys(apiKeys.filter(key => key.owner !== keyToDelete));
        setShowDeleteModal(false);
    };

    const handleRenaming = async (event) => {
        event.preventDefault();
        renameApiKey(keyToEdit, newOwnerName);
        setApiKeys(apiKeys.map((key) => key.owner === keyToEdit ? { ...key, owner: newOwnerName } : key));
        setShowEditModal(false);
    };

    const handleRenewal = async (event) => {
        
        event.preventDefault();
        debugger;
        const updatedApiKey = await regenerateApiKey(keyToEdit);
        
        setApiKeys(apiKeys.map((key) => key.owner === keyToEdit ? updatedApiKey : key));
        setShowRenewalModal(false);
        setLastAddedKey(updatedApiKey);
    }

    const handleRenamingChange = (event) => {
        setNewOwnerName(event.target.value);
    }

    const handleDeleteModalClose = () => {
        setShowDeleteModal(false);
    };

    const handleEditModalClose = () => {
        setShowEditModal(false);
    };

    const handleRenewalModalClose = () => {
        setShowRenewalModal(false);
    };

    const handleTrashIconClick = (owner) => {
        setKeyToDelete(owner);
        setShowDeleteModal(true);
    };

    const handlePenIconClick = (owner) => {
        setKeyToEdit(owner);
        setNewOwnerName(owner);
        setShowEditModal(true);
    };

    const handleRenewIconClick = (owner) => {
        setKeyToEdit(owner);
        setShowRenewalModal(true);
    };

    const handleAdd = async () => {
        const addedKey = await addApiKey(newUser);
        if (addedKey) {
            setApiKeys([...apiKeys, addedKey]);
            setNewUser('');
            setLastAddedKey(addedKey);
        }
    };

    return (
        <Container className="flex-grow-1 d-flex flex-column py-3 justify-content-center">
            <Modal show={showDeleteModal} onHide={handleDeleteModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete API Key</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete the API Key? <br /> <br />
                    <strong style={{ fontSize: '20px' }}><i className="bi bi-exclamation-diamond"></i></strong> This action cannot be undone. Once deleted, the data cannot be recovered. Proceed with caution.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleDeleteModalClose}>
                        Close
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showEditModal} onHide={handleEditModalClose}>
                <Form
                    onSubmit={handleRenaming}

                >
                    <Modal.Header closeButton>
                        <Modal.Title>Rename</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Control
                            type="text"
                            value={newOwnerName}
                            onChange={handleRenamingChange}
                            required
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleEditModalClose}>
                            Close
                        </Button>
                        <Button variant="primary" type='submit'>
                            Rename
                        </Button>
                    </Modal.Footer>
                </Form>

            </Modal>
            <Modal show={showRenewalModal} onHide={handleRenewalModalClose}>
                <Form
                    onSubmit={handleRenewal}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Regenerate API Key</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you want to regnerate a new API key for that user? <br/> <br/>
                        <strong style={{ fontSize: '20px' }}><i className="bi bi-exclamation-diamond"></i></strong> This action cannot be undone. Once regenerated, the old API Key will not work anymore and cannot be recovered. Proceed with caution.
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleRenewalModalClose}>
                            Close
                        </Button>
                        <Button variant="primary" type='submit'>
                            Regenerate API Key
                        </Button>
                    </Modal.Footer>
                </Form>

            </Modal>
            <Container className="flex-grow-1 d-flex flex-column border bg-light px-5 py-4">
                <h4 className='custom-h1'>API Key Overview</h4>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Username</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {apiKeys.map((key, index) => (
                            <tr key={key.owner}>
                                <td>{index + 1}</td>
                                <td>{key.owner}</td>
                                <td>
                                    <button
                                        type='button'
                                        className='btn'
                                        title='Generate New Api Key'
                                        onClick={() => handleRenewIconClick(key.owner)}
                                    >
                                        <strong><i className="bi bi-arrow-repeat" style={{ color: 'var(--content-primary)', fontSize: '20px' }}></i></strong>
                                    </button>
                                    <button
                                        type='button'
                                        className='btn'
                                        title='Rename'
                                        onClick={() => handlePenIconClick(key.owner)}
                                    >
                                        <PenIcon />
                                    </button>
                                    <button
                                        type='button'
                                        className='btn'
                                        title='Delete'
                                        onClick={() => handleTrashIconClick(key.owner)}
                                    >
                                        <TrashIcon />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                {lastAddedKey &&
                    <Alert id='newAPIKeyAlert' ref={alertRef} variant="success" onClose={() => setLastAddedKey(null)} dismissible>
                        <Alert.Heading>A new API Key has been created!</Alert.Heading>
                        <p>
                            The API key for the user <strong>{lastAddedKey.owner}</strong> has been created.
                        </p>
                        <table>
                            <tbody>
                                <tr>
                                    <td><strong>Username:</strong></td>
                                    <td>{lastAddedKey.owner}</td>
                                </tr>
                                <tr>
                                    <td><strong>API Key:</strong></td>
                                    <td>{lastAddedKey.keyHash}</td>
                                </tr>
                            </tbody>
                        </table>
                        <br />
                        <Alert variant='warning'>
                            <i className="bi bi-exclamation-circle-fill"> Please remember the shown API Key. After closing this window the key is not accessible anymore! </i>

                        </Alert>

                    </Alert>
                }

                <Form>
                    <Form.Group className="mb-3" controlId="formNewApiKey">
                        <Form.Label>New API Key</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter new username"
                            value={newUser}
                            onChange={(e) => {
                                console.log(e.target.value);
                                setNewUser(e.target.value);
                            }}
                        />
                    </Form.Group>
                    <Button variant="primary" onClick={handleAdd}>
                        Add API Key
                    </Button>
                </Form>
            </Container>
        </Container>
    );
}

export default AdminPanel;
