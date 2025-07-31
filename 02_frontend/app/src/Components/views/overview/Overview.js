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

// React imports
import React, { useContext, useEffect, useState } from 'react';
import { Container, Button, Form, Modal, Row, Col } from 'react-bootstrap';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

// Component imports
import OverviewTable from './overviewTable/OverviewTable.js';
import LoadingAnimation from './LoadingAnimation.js';

// Helper imports
import { aasImport as handleFileInputChange, aasExport as handleExportSubmit } from '../../../helper/aasHelper.js';

// Data Class imports
import AASData from '../../AasData.js';

//CSS Import
import "./Overview.css";
import "./../../general/Main.css";
import { AasDataContext } from '../../AasDataContext.js';


function AASOverview({ token }) {

  const { allAas, loading } = useContext(AasDataContext);
  const [filteredList, setFilteredList] = useState(allAas);
  const navigate = useNavigate();
  const [selectedIDtoDelete, setSelectedIDtoDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { register, handleSubmit, setValue } = useForm();


  useEffect(() => {
    setFilteredList(allAas);
  }, [allAas]);


  const handleClose = () => setShowDeleteModal(false);

  const handleDeleteModalShow = (id) => {
    setSelectedIDtoDelete(id);
    setShowDeleteModal(true);
  };

  const handleAddButtonClick = () => {
    // window.location.href = "/aas/new";
    navigate("/aas/new", {
      state: {
        environmentServices: allAas
      }
    })
  };

  const handleDelete = async () => {
    const aasURLToDelete = allAas.findIndex(service => service.assetID === selectedIDtoDelete);

    try {
      if (aasURLToDelete !== -1) {
        console.log("aasURLToDelete: ", selectedIDtoDelete);
        const params = new URLSearchParams({ aas_url: selectedIDtoDelete });
        console.log("params: ", params);
        const apiEndpoint = `${process.env.REACT_APP_API_URL}/aas/delete`;

        const response = await fetch(`${apiEndpoint}?${params.toString()}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          console.log('Successfully delete: ', response.statusText);
          window.location.reload();
        } else {
          console.error('Failed to delete:', response.statusText);
        }
      } else {
        // Item not found in the environmentServices array
        console.error('Item not found for deletion');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };


  const handleSearchInput = (event) => {
    const searchKey = event.target.value ? event.target.value.toLowerCase() : '';
    const filteredList = allAas.filter(service =>
      service.assetID.toLowerCase().includes(searchKey)
    );
    setFilteredList(filteredList);
  };



  return (
    <Container className="flex-grow-1 d-flex flex-column py-3">

      <Modal show={showDeleteModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete AAS</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete the AAS item?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="flex-grow-1 d-flex flex-column border bg-light px-5 py-4">

        <Container className='mb-4'>
          <Row>
            <Col className='d-flex align-items-end px-0'>
              <Form.Control type="text" placeholder="Search ..." className="custom-form-control-search" onChange={handleSearchInput} />
            </Col>

            <Col className='d-flex justify-content-end px-0'>
              {token &&
                <>
                  <Button variant="warning" className="ml-auto mx-2" id="importButton" onClick={() => { document.getElementById('aasFileInput').click() }}>Import AAS</Button>
                  <input name="aasFileInput" type="file" id="aasFileInput" style={{ display: 'none' }} onChange={handleFileInputChange} />
                  <Button variant="primary" className="ml-auto" id="addButton" onClick={handleAddButtonClick}>Add</Button>

                </>
              }




            </Col>


          </Row>
        </Container>



        <Form onSubmit={handleSubmit(handleExportSubmit)} method="post" className="flex-grow-1 d-flex flex-column">
          <OverviewTable
            environmentServices={filteredList}
            handleDeleteModalShow={handleDeleteModalShow}
            setValue={setValue}
            loading={loading}
            token={token}
          ></OverviewTable>

          <div className="mt-auto row mt-2 mx-0">
            <Button type="submit" className="col-10 btn btn-primary" id="exportButton">Export the AAS as ...</Button>
            <div className="col-2 px-1">
              <Form.Select className="form-select" id="exportFormat" name="exportFormat" {...register("exportFormat")}>
                <option value="json">JSON</option>
                <option value="aasx">AASX</option>
              </Form.Select>
            </div>
          </div>
        </Form>
      </div>
    </Container>
  );
}

export default AASOverview;
