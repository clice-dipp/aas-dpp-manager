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
import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import ReferableSelectionModal from './ReferableSelectionModal';


function ProductCarbonFootprintBody({ productCarbonFootprint, register, index, setValue}) {
    const [showSelectionModal, setShowSelectionModal] = useState(false);

    useEffect(() => {
        setValue(`ReferableAssetID[${index}]`, productCarbonFootprint?.ReferableAssetID);
    }, []);


    const handleReferableClick = () => {
        setShowSelectionModal(true);
    }

    const handleModalSelection = (selectedAssetID) => {

        setValue(`ReferableAssetID[${index}]`, selectedAssetID)
        setShowSelectionModal(false);
    }

    const handleModalClose = () => {
        setShowSelectionModal(false);
    }

    const handleReferableInputChange = (event) => {
        setValue(`ReferableAssetID[${index}]`, event.target.value);
    }













    return (
        <>
            <div className="mb-3">
                <Form.Group controlId="ReferableAssetID">
                    <Form.Label>ID of the related Asset</Form.Label>
                    <Form.Control
                        onChange={handleReferableInputChange}
                        {...register(`ReferableAssetID[${index}]`)}
                        name={`ReferableAssetID[${index}]`} type="text"
                        placeholder={productCarbonFootprint?.ReferableAssetID ? "" : "https://example.company.de/id/1234"}
                        onClick={handleReferableClick}
                        autoComplete="off"
                    />
                </Form.Group>
                <ReferableSelectionModal showSelectionModal={showSelectionModal} handleClose={handleModalClose} handleSelection={handleModalSelection} />

            </div>
            <div className="mb-3">
                <Form.Group controlId="PCFCalculationMethod">
                    <Form.Label>Calculation Method</Form.Label>
                    <Form.Select {...register(`PCFCalculationMethod[${index}]`)} name={`PCFCalculationMethod[${index}]`} className="d-block w-100" defaultValue={productCarbonFootprint?.PCFCalculationMethod || ''}>
                        <option value="">Choose...</option>
                        <option value="0173-1#07-ABU223#002">EN 15804</option>
                        <option value="0173-1#07-ABU221#002">GHG Protocol</option>
                        <option value="0173-1#07-ABU222#002">IEC TS 63058</option>
                        <option value="0173-1#07-ABV505#002">ISO 14040</option>
                        <option value="0173-1#07-ABV506#002">ISO 14044</option>
                        <option value="0173-1#07-ABU218#002">ISO 14067</option>
                        <option value="0173-1#07-ACA792#001">IEC 63366</option>
                        <option value="0173-1#07-ABU220#002">PEP Ecopassport</option>
                    </Form.Select>
                    <div className="invalid-feedback">
                        Please enter a calculation method.
                    </div>
                </Form.Group>
            </div>
            <div className="mb-3">
                <Form.Group controlId="PCFCO2eq">
                    <Form.Label>CO2 Equivalent [kg]</Form.Label>
                    {/* Ensure that `register` is correctly applied to the `ref` attribute */}
                    <Form.Control {...register(`PCFCO2eq[${index}]`)}
                        name={`PCFCO2eq[${index}]`}
                        type="text"
                        placeholder="0.00"
                        min="0"
                        defaultValue={productCarbonFootprint?.PCFCO2eq} />
                    <div className="invalid-feedback">
                        A CO2 equivalent is missing.
                    </div>
                </Form.Group>

            </div>
            <div className="row d-flex flex-row">
                <div className="col-6 mb-3">
                    <Form.Group controlId="PCFQuantityOfMeasureForCalculation">
                        <Form.Label>Quantity of the measured product</Form.Label>
                        <Form.Control {...register(`PCFQuantityOfMeasureForCalculation[${index}]`)} name={`PCFQuantityOfMeasureForCalculation[${index}]`} type="text" placeholder="0" min="0" defaultValue={productCarbonFootprint?.PCFQuantityOfMeasureForCalculation} />
                    </Form.Group>
                </div>
                <div className="col-2 mb-3">
                    <Form.Group controlId="PCFReferenceValueForCalculation">
                        <Form.Label>Reference Value</Form.Label>
                        <Form.Select {...register(`PCFReferenceValueForCalculation[${index}]`)} name={`PCFReferenceValueForCalculation[${index}]`} className="custom-select d-block" defaultValue={productCarbonFootprint?.PCFReferenceValueForCalculation}>
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
                <Form.Group controlId="PCFLiveCyclePhase">
                    <Form.Label>Life Cycle Phase of the Product</Form.Label>
                    <Form.Select {...register(`PCFLiveCyclePhase[${index}]`)} name={`PCFLiveCyclePhase[${index}]`} className="d-block w-100" defaultValue={productCarbonFootprint?.PCFLiveCyclePhase}>
                        <option value="">Choose...</option>
                        <option value="0173-1#07-ABU208#001">A1 – raw material supply (and upstream production)</option>
                        <option value="0173-1#07-ABU209#001">A2 - cradle-to-gate transport to factory</option>
                        <option value="0173-1#07-ABU210#001">A3 - production</option>
                        <option value="0173-1#07-ABU211#001">A4 - transport to final destination</option>
                        <option value="0173-1#07-ABU212#001">B1 – usage phase</option>
                        <option value="0173-1#07-ABV498#001">B2 – maintenance</option>
                        <option value="0173-1#07-ABV497#001">B3 - repair</option>
                        <option value="0173-1#07-ABV499#001">B5 – update/upgrade, refurbishing</option>
                        <option value="0173-1#07-ABV500#001">B6 – usage energy consumption</option>
                        <option value="0173-1#07-ABV501#001">B7 – usage water consumption</option>
                        <option value="0173-1#07-ABV502#001">C1 – reassembly</option>
                        <option value="0173-1#07-ABU213#001">C2 – transport to recycler</option>
                        <option value="0173-1#07-ABV503#001">C3 – recycling, waste treatment</option>
                        <option value="0173-1#07-ABV504#001">C4 – landfill</option>
                        <option value="0173-1#07-ABU214#001">D - reuse</option>
                        <option value="0173-1#07-ABZ789#001">A1-A3</option>
                    </Form.Select>
                    <div className="invalid-feedback">
                        Please enter a reference value.
                    </div>
                </Form.Group>
            </div>
            <div className="mb-3">
                <Form.Group controlId="PCFDescription">
                    <Form.Label>Asset Description</Form.Label>
                    <Form.Control {...register(`PCFDescription[${index}]`)} name={`PCFDescription[${index}]`} as="textarea" rows={3} defaultValue={productCarbonFootprint?.PCFDescription} />
                </Form.Group>
            </div>
            <div className="mb-3">
                <Form.Group controlId="ExplanatoryStatement">
                    <Form.Label>Explanatory Statement</Form.Label>
                    <Form.Control {...register(`ExplanatoryStatement[${index}]`)} name={`ExplanatoryStatement[${index}]`} type="file" />
                </Form.Group>
            </div>
            <label htmlFor="HandoverAddress" className="from-lable">Handover Address</label>
            <div id="HandoverAddress">
                <div className="mb-2 row">
                    <div className="col-10">
                        <Form.Control {...register(`PCFHandoverStreet[${index}]`)} name={`PCFHandoverStreet[${index}]`} type="text" id="PCFHandoverStreet" placeholder="Street" defaultValue={productCarbonFootprint?.PCFHandoverStreet} />
                    </div>
                    <div className="col-2">
                        <Form.Control {...register(`PCFHandoverNumber[${index}]`)} name={`PCFHandoverNumber[${index}]`} type="text" id="PCFHandoverNumber" placeholder="Number" defaultValue={productCarbonFootprint?.PCFHandoverNumber} />
                    </div>
                </div>
                <div className="mb-2 row">
                    <div className="col-6">
                        <Form.Control {...register(`PCFHandoverCity[${index}]`)} name={`PCFHandoverCity[${index}]`} type="text" id="PCFHandoverCity" placeholder="City" defaultValue={productCarbonFootprint?.PCFHandoverCity} />
                    </div>
                    <div className="col-3">
                        <Form.Control {...register(`PCFHandoverZIP[${index}]`)} name={`PCFHandoverZIP[${index}]`} type="number" id="PCFHandoverZIP" placeholder="ZIP" defaultValue={productCarbonFootprint?.PCFHandoverZIP} />
                    </div>
                    <div className="col-3">
                        <Form.Control {...register(`PCFHandoverCountry[${index}]`)} name={`PCFHandoverCountry[${index}]`} type="text" id="PCFHandoverCountry" placeholder="Country" defaultValue={productCarbonFootprint?.PCFHandoverCountry} />
                    </div>
                </div>
                <div className="mb-2 row">
                    <div className="col-6">
                        <Form.Control {...register(`PCFHandoverLatitude[${index}]`)} name={`PCFHandoverLatitude[${index}]`} type="text" id="PCFHandoverLatitude" placeholder="Latitude" defaultValue={productCarbonFootprint?.PCFHandoverLatitude} />
                    </div>
                    <div className="col-6">
                        <Form.Control {...register(`PCFHandoverLongitude[${index}]`)} name={`PCFHandoverLongitude[${index}]`} type="text" id="PCFHandoverLongitude" placeholder="Longitude" defaultValue={productCarbonFootprint?.PCFHandoverLongitude} />
                    </div>
                </div>
            </div>
        </>

    );
}

export default ProductCarbonFootprintBody;
