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

function TechnicalDataBody({technicalData, register}) {
  return (
    <>
      <div className="mb-3">
        <Form.Group controlId="ManufacturerOrderCode">
          <Form.Label>Manufacturer Order Code</Form.Label>
          <Form.Control {...register("ManufacturerOrderCode")} name="ManufacturerOrderCode" type="text" placeholder="123456789" defaultValue={technicalData?.ManufacturerOrderCode}/>
          <div className="invalid-feedback">
            The Serial Number of the product is missing.
          </div>
        </Form.Group>
      </div>
      <div className="row">
        <div className="col-md-6 mb-3">
          <Form.Group controlId="ManufacturerLogo">
            <Form.Label>Manufacturer Logo</Form.Label>
            <Form.Control type="file" />
          </Form.Group>
        </div>
        <div className="col-md-6 mb-3">
          <Form.Group controlId="ProductImage">
            <Form.Label>Product Image</Form.Label>
            <Form.Control type="file" />
          </Form.Group>
        </div>
      </div>
    </>
  );
}

export default TechnicalDataBody;
