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

// react imports
import React, { useContext } from 'react';
import { Container, Form, Row, Col } from "react-bootstrap";
import { useLoaderData, useLocation, useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';


// Component imports
import AccordionBuilder from "./AccordionBuilder";
import TechnicalDataBody from "./submodelBodys/TechnicalDataBody";
import NameplateBody from "./submodelBodys/NameplateBody";
import CarbonFootprintBody from "./submodelBodys/CarbonFootprintBody";
import BackButtonContainer from "../../general/BackButtonContainer";

// Helper imports
import { AASSubmission } from "../../../helper/aasHelper";
import { AasDataContext } from '../../AasDataContext.js';

//CSS imports
import "./../../general/Main.css";



function AasForm() {
    const existingAssetIds = useLocation().state.environmentServices.map(service => service.assetID);

    var data = useLoaderData();
    if (data != null) {
        data = data[0];
    } else {
        data = null;
    }

    const navigate = useNavigate();
    const { updateAasData } = useContext(AasDataContext);

    const { unregister, register, setValue, handleSubmit, formState: { errors } } = useForm();


    const accordionData = [
        {
            header: "Nameplate",
            body: <NameplateBody nameplate={data?.submodels.Nameplate} register={register} />
        },
        {
            header: "Technical Data",
            body: <TechnicalDataBody technicalData={data?.submodels.TechnicalData} register={register}/>
        },
        {
            header: "Carbon Footprint",
            body: <CarbonFootprintBody carbonFootprint={data?.submodels.CarbonFootprint} register={register} setValue={setValue} unregister={unregister} />
        }
    ];



    return (
        <Container className="flex-grow-1 d-flex flex-column py-3">
            <div className="flex-grow-1 d-flex flex-column border bg-light px-5 py-4">
                <BackButtonContainer></BackButtonContainer>
                <div id="formHeadline">
                    {data == null ?
                        (<>
                            <h4 className="mb-3">AAS Configurator</h4>
                            Here you can configure a new AAS and specify all the datails for the submodels Nameplate, Technical Data and
                            Carbon Footprint. Add all relevant
                            informations and submit by clicking the save button.
                        </>
                        ) :
                        (<>
                            <h4 className="mb-3">AAS Editor</h4>
                            Edit your selected AAS.
                            Changes can be saved by clicking the Save button.
                        </>
                        )}

                </div>
                <hr className="mb-4"></hr>
                <Form className="flex-grow-1 d-flex flex-column" onSubmit={handleSubmit((data) => AASSubmission(data, navigate, updateAasData, sessionStorage.getItem('token')))}>
                    <div className="row mb-4">

                        <Form.Group className="col-md-6 mb-3" controlId="assetIDShort">
                            <Form.Label>Asset ID short</Form.Label>
                            <Form.Control {...register("assetIDShort")} type="text" placeholder="assetIDShort" defaultValue={data?.assetIDShort} />
                        </Form.Group>
                        <Form.Group className="col-md-6 mb-3" controlId="assetID">
                            <Form.Label>Asset ID</Form.Label>
                            <Form.Control {...register("assetID", {
                                validate: (value) => {
                                    console.log('assetID:', data?.assetID);
                                    console.log('value:', value);
                                    console.log("data?.assetID==value: ", data?.assetID===value);
                                    console.log("!existingAssetIds.includes(value): ", !existingAssetIds.includes(value));
                                    return data?.assetID===value || !existingAssetIds.includes(value)
                                }
                            })}
                                name="assetID"
                                type="text"
                                placeholder="https://example.company.com/newAssetName"
                                defaultValue={data?.assetID}
                                isInvalid={!!errors.assetID} />

                            <Form.Control.Feedback type="invalid">
                                This Asset ID already exists!
                            </Form.Control.Feedback>

                        </Form.Group>
                    </div>
                    <div className="mb-4">
                        <AccordionBuilder className="mb-4" accordionBodys={accordionData} />
                    </div>



                    <hr className="mt-auto mb-4"></hr>
                    <div className="d-flex justify-content-end">
                        <button className="btn btn-primary btn-lg align-self-end align-self-bottom" type="submit">Save</button>
                    </div>
                </Form>


            </div>
        </Container>
    );
}



export default AasForm;