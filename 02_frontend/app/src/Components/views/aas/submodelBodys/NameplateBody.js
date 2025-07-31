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
import React from 'react';
import { Form } from 'react-bootstrap';

function NameplateBody({nameplate, register}) {
  return (
    <>
      <div className="mb-3">
        <Form.Group controlId="URIOfTheProduct">
          <Form.Label>URI of the Product</Form.Label>
          <Form.Control {...register("URIOfTheProduct")} name="URIOfTheProduct" type="text" placeholder="https://www.domain-abc.com/Model-Nr-1234/Serial-Nr-5678" defaultValue={nameplate?.URIOfTheProduct}/>
          <div className="invalid-feedback">
            The URI of the product is missing.
          </div>
        </Form.Group>
      </div>
      <div className="mb-3">
        <Form.Group controlId="ManufacturerName">
          <Form.Label>Manufacturer Name</Form.Label>
          <Form.Control {...register("ManufacturerName")} name="ManufacturerName" type="text" placeholder="Muster AG" defaultValue={nameplate?.ManufacturerName} />
          <div className="invalid-feedback">
            The Manufacturer Name is missing.
          </div>
        </Form.Group>
      </div>
      <div className="mb-3">
        <Form.Group controlId="SerialNumber">
          <Form.Label>Serial Number</Form.Label>
          <Form.Control {...register("SerialNumber")} name="SerialNumber" type="text" placeholder="123-456-789" defaultValue={nameplate?.SerialNumber}/>
          <div className="invalid-feedback">
            The Serial Number of the product is missing.
          </div>
        </Form.Group>
      </div>
      <div className="row">
        <div className="col-6 mb-3">
          <Form.Group controlId="YearOfConstruction">
            <Form.Label>Year of Construction</Form.Label>
            <Form.Control {...register("YearOfConstruction")} name="YearOfConstruction" type="number" min="1000" max="3000" step="1" placeholder="2023" defaultValue={nameplate?.YearOfConstruction} />
            <div className="invalid-feedback">
              The Year of Construction is missing.
            </div>
          </Form.Group>
        </div>
        <div className="col-6 mb-3">
          <Form.Group controlId="DateOfManufacture">
            <Form.Label>Date of Manufacture</Form.Label>
            <Form.Control {...register("DateOfManufacture")} name="DateOfManufacture" type="date" placeholder="2023-01-01" defaultValue={nameplate?.DateOfManufacture}/>
            <div className="invalid-feedback">
              The Date of Manufacture is missing.
            </div>
          </Form.Group>
        </div>
      </div>
    </>
  );
}

export default NameplateBody;
