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
import React, { useState } from "react";
import { Container, Row, Col, Stack, Tab, ListGroup, Button } from "react-bootstrap";
import { useLoaderData, useNavigate } from "react-router-dom";
import AASData from "../../AasData.js";


//CSS Import 
import "../../Colors.css";
import './AasShow.css';
import "./../../general/Main.css";



export function PcfSMCShowTab({ pcfSMC, allAas, navigate}) {

    const handleDetailButtonClick = (assetID) => {
        
        const showURL = `/aas/show?aas_url=${assetID}`;

        navigate(showURL);
    }

    const existingAssetIds = allAas.map(service => service.assetID);

    const isReferableAssetIncluded = existingAssetIds.includes(pcfSMC.ReferableAssetID);




    return (
        <>
            <Row>
                <Col sm={10}>
                    <Row className="px-3">
                        <Col sm={5} style={{ color: 'rgb(0,0,0,0.7)' }}>
                            <p><strong>CO2 equivalent:</strong></p>
                        </Col>
                        <Col sm={7}>
                            <p>{pcfSMC.PCFCO2eq} kg</p>
                        </Col>
                    </Row>
                    <Row className="px-3">
                        <Col sm={5} style={{ color: 'rgb(0,0,0,0.7)' }}>
                            <p><strong>Quantity of the current assets:</strong></p>
                        </Col>
                        <Col sm={7}>
                            <p>{pcfSMC.PCFQuantityOfMeasureForCalculation} {AASData.getPCFReferenceValueForCalculation(pcfSMC.PCFReferenceValueForCalculation)}</p>
                        </Col>
                    </Row>
                    <Row className="px-3">
                        <Col sm={5} style={{ color: 'rgb(0,0,0,0.7)' }}>
                            <p><strong>CO2 calculation method:</strong></p>
                        </Col>
                        <Col sm={7}>
                            <p>{AASData.getPCFCalculationMethod(pcfSMC.PCFCalculationMethod)}</p>
                        </Col>
                    </Row>

                    <Row className="px-3">
                        <Col sm={5} style={{ color: 'rgb(0,0,0,0.7)' }}>
                            <p><strong>Lifecycle phase:</strong></p>
                        </Col>
                        <Col sm={7}>
                            <p>{AASData.getPCFLiveCyclePhase(pcfSMC.PCFLiveCyclePhase)}</p>
                        </Col>
                    </Row>

                </Col>
                {/* <Col sm={2}>
                    {isReferableAssetIncluded ? (
                        <Button size="sm" onClick={() => handleDetailButtonClick(pcfSMC.ReferableAssetID)}>
                            More Details
                        </Button>

                    ) : (
                        <Button size="sm" disabled>
                            No Details available
                        </Button>
                    )}
                </Col> */}
            </Row>
        </>

    );


}

export function TcfSMCShowTab({ tcfSMC }) {
    return (
        <>
            <Row>
                <Col>
                    <Row className="px-3">
                        <Col sm={5} style={{ color: 'rgb(0,0,0,0.7)' }}>
                            <p><strong>CO2 equivalent:</strong></p>
                        </Col>
                        <Col sm={7}>
                            <p>{tcfSMC.TCFCO2eq} kg</p>
                        </Col>
                    </Row>
                    <Row className="px-3">
                        <Col sm={5} style={{ color: 'rgb(0,0,0,0.7)' }}>
                            <p><strong>Quantity of the transported assets:</strong></p>
                        </Col>
                        <Col sm={7}>
                            <p>{tcfSMC.TCFQuantityOfMeasureForCalculation} {AASData.getPCFReferenceValueForCalculation(tcfSMC.TCFReferenceValueForCalculation)}</p>
                        </Col>
                    </Row>
                    <Row className="px-3">
                        <Col sm={5} style={{ color: 'rgb(0,0,0,0.7)' }}>
                            <p><strong>Process in the transport service:</strong></p>
                        </Col>
                        <Col sm={7}>
                            <p>{AASData.getTCFProcessesForGreenhouseGasEmissionInATransportService(tcfSMC.TCFProcessesForGreenhouseGasEmissionInATransportService)}</p>
                        </Col>
                    </Row>


                </Col>
            </Row>
        </>
    );
}