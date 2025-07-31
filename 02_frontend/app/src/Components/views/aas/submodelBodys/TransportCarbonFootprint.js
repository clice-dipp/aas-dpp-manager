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

function TransportCarbonFootprintBody({transportCarbonFootprint, register, index}) {
  return (
    <div>
      <div className="mb-3">
        <Form.Group controlId="TCFCalculationMethod">
          <Form.Label>Calculation Method</Form.Label>
          <Form.Select {...register(`TCFCalculationMethod[${index}]`)} name={`TCFCalculationMethod[${index}]`} className="d-block w-100" defaultValue={transportCarbonFootprint?.TCFCalculationMethod}>
            <option value="">Choose...</option>
            <option value="0173-1#07-ABU223#001">EN 15804</option>
            <option value="0173-1#07-ABU221#001">GHG Protocol</option>
            <option value="0173-1#07-ABU222#001">IEC TS 63058</option>
            <option value="0173-1#07-ABV505#001">ISO 14040</option>
            <option value="0173-1#07-ABV506#001">ISO 14044</option>
            <option value="0173-1#07-ABU218#001">ISO 14067</option>
          </Form.Select>
          <div className="invalid-feedback">
            Please enter a calculation method.
          </div>
        </Form.Group>
      </div>
      <div className="mb-3">
        <Form.Group controlId="TCFCO2eq">
          <Form.Label>CO2 Equivalent [kg]</Form.Label>
          <Form.Control {...register(`TCFCO2eq[${index}]`)} name={`TCFCO2eq[${index}]`} type="text" placeholder="0.00" min="0" defaultValue={transportCarbonFootprint?.TCFCO2eq}/>
          <div className="invalid-feedback">
            A CO2 equivalent is missing.
          </div>
        </Form.Group>
      </div>
      <div className="row d-flex flex-row">
        <div className="col-6 mb-3">
          <Form.Group controlId="TCFQuantityOfMeasureForCalculation">
            <Form.Label>Quantity of the measured product</Form.Label>
            <Form.Control {...register(`TCFQuantityOfMeasureForCalculation[${index}]`)} name={`TCFQuantityOfMeasureForCalculation[${index}]`} type="text" placeholder="0" min="0" defaultValue={transportCarbonFootprint?.TCFQuantityOfMeasureForCalculation} />
          </Form.Group>
        </div>
        <div className="col-2 mb-3">
          <Form.Group controlId="TCFReferenceValueForCalculation">
            <Form.Label>Reference Value</Form.Label>
            <Form.Select {...register(`TCFReferenceValueForCalculation[${index}]`)} name={`TCFReferenceValueForCalculation[${index}]`} className="d-block w-100" defaultValue={transportCarbonFootprint?.TCFReferenceValueForCalculation}>
              <option value="">Choose...</option>
              <option value="0173-1#07-ABZ596#001">g</option>
              <option value="0173-1#07-ABZ597#001">kg</option>
              <option value="0173-1#07-ABZ598#001">t</option>
              <option value="0173-1#07-ABZ599#001">ml</option>
              <option value="0173-1#07-ABZ600#001">l</option>
              <option value="0173-1#07-ABZ601#001">cbm</option>
              <option value="0173-1#07-ABZ602#001">qm</option>
              <option value="0173-1#07-ABZ603#001">piece</option>
            </Form.Select>
            <div className="invalid-feedback">
              Please enter a reference value.
            </div>
          </Form.Group>
        </div>
      </div>
      <div className="mb-3">
        <Form.Group controlId="TCFProcessesForGreenhouseGasEmissionInATransportService">
          <Form.Label>Process for Greenhouse Gas Emission</Form.Label>
          <Form.Select {...register(`TCFProcessesForGreenhouseGasEmissionInATransportService[${index}]`)} name={`TCFProcessesForGreenhouseGasEmissionInATransportService[${index}]`} className="d-block w-100" defaultValue={transportCarbonFootprint?.TCFProcessesForGreenhouseGasEmissionInATransportService}>
            <option value="">Choose...</option>
            <option value="0173-1#07-ABU216#001">WTT - Well-to-Tank</option>
            <option value="0173-1#07-ABU215#001">TTW - Tank-to-Wheel</option>
            <option value="0173-1#07-ABU217#001">WTW - Well-to-Wheel</option>
          </Form.Select>
          <div className="invalid-feedback">
            Please enter a Process for Greenhouse Gas Emission.
          </div>
        </Form.Group>
      </div>
      <label htmlFor="TCFTakeoverAddress" className="from-lable">Handover Address</label>
      <div id="TCFTakeoverAddress">
        <div className="mb-2 row">
          <div className="col-10">
            <Form.Control {...register(`TCFTakeoverStreet[${index}]`)} name={`TCFTakeoverStreet[${index}]`} type="text" id="TCFTakeoverStreet" placeholder="Street" defaultValue={transportCarbonFootprint?.TCFTakeoverStreet}/>
          </div>
          <div className="col-2">
            <Form.Control {...register(`TCFTakeoverNumber[${index}]`)} name={`TCFTakeoverNumber[${index}]`} type="text" id="TCFTakeoverNumber" placeholder="Number" defaultValue={transportCarbonFootprint?.TCFTakeoverNumber}/>
          </div>
        </div>
        <div className="mb-2 row">
          <div className="col-6">
            <Form.Control {...register(`TCFTakeoverCity[${index}]`)} name={`TCFTakeoverCity[${index}]`} type="text" id="TCFTakeoverCity" placeholder="City" defaultValue={transportCarbonFootprint?.TCFTakeoverCity}/>
          </div>
          <div className="col-3">
            <Form.Control {...register(`TCFTakeoverZIP[${index}]`)} name={`TCFTakeoverZIP[${index}]`} type="text" id="TCFTakeoverZIP" placeholder="ZIP" defaultValue={transportCarbonFootprint?.TCFTakeoverZIP}/>
          </div>
          <div className="col-3">
            <Form.Control  {...register(`TCFTakeoverCountry[${index}]`)} name={`TCFTakeoverCountry[${index}]`} type="text" id="TCFTakeoverCountry" placeholder="Country" defaultValue={transportCarbonFootprint?.TCFTakeoverCountry}/>
          </div>
        </div>
        <div className="mb-2 row">
          <div className="col-6">
            <Form.Control {...register(`TCFTakeoverLatitude[${index}]`)} name={`TCFTakeoverLatitude[${index}]`} type="text" id="TCFTakeoverLatitude" placeholder="Latitude" defaultValue={transportCarbonFootprint?.TCFTakeoverLatitude}/>
          </div>
          <div className="col-6">
            <Form.Control {...register(`TCFTakeoverLongitude[${index}]`)} name={`TCFTakeoverLongitude[${index}]`} type="text" id="TCFTakeoverLongitude" placeholder="Longitude" defaultValue={transportCarbonFootprint?.TCFTakeoverLongitude}/>
          </div>
        </div>
      </div>
      <label htmlFor="TCFHandoverAddress" className="from-lable">Handover Address</label>
      <div id="TCFHandoverAddress">
        <div className="mb-2 row">
          <div className="col-10">
            <Form.Control {...register(`TCFHandoverStreet[${index}]`)} name={`TCFHandoverStreet[${index}]`} type="text" id="TCFHandoverStreet" placeholder="Street" defaultValue={transportCarbonFootprint?.TCFHandoverStreet} />
          </div>
          <div className="col-2">
            <Form.Control {...register(`TCFHandoverNumber[${index}]`)} name={`TCFHandoverNumber[${index}]`}  type="text" id="TCFHandoverNumber" placeholder="Number" defaultValue={transportCarbonFootprint?.TCFHandoverNumber}/>
          </div>
        </div>
        <div className="mb-2 row">
          <div className="col-6">
            <Form.Control {...register(`TCFHandoverCity[${index}]`)} name={`TCFHandoverCity[${index}]`} type="text" id="TCFHandoverCity" placeholder="City" defaultValue={transportCarbonFootprint?.TCFHandoverCity}/>
          </div>
          <div className="col-3">
            <Form.Control {...register(`TCFHandoverZIP[${index}]`)} name={`TCFHandoverZIP[${index}]`} type="text" id="TCFHandoverZIP" placeholder="ZIP" defaultValue={transportCarbonFootprint?.TCFHandoverZIP}/>
          </div>
          <div className="col-3">
            <Form.Control {...register(`TCFHandoverCountry[${index}]`)} name={`TCFHandoverCountry[${index}]`}  type="text" id="TCFHandoverCountry" placeholder="Country" defaultValue={transportCarbonFootprint?.TCFHandoverCountry}/>
          </div>
        </div>
        <div className="mb-2 row">
          <div className="col-6">
            <Form.Control {...register(`TCFHandoverLatitude[${index}]`)} name={`TCFHandoverLatitude[${index}]`} type="text" id="TCFHandoverLatitude" placeholder="Latitude" defaultValue={transportCarbonFootprint?.TCFHandoverLatitude} />
          </div>
          <div className="col-6">
            <Form.Control {...register(`TCFHandoverLongitude[${index}]`)} name={`TCFHandoverLongitude[${index}]`} type="text" id="TCFHandoverLongitude" placeholder="Longitude" defaultValue={transportCarbonFootprint?.TCFHandoverLongitude} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TransportCarbonFootprintBody;
