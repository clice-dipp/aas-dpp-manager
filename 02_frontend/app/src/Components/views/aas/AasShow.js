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
import React, { useContext, useState, useEffect } from "react";
import { Container, Row, Col, Stack, Tab, ListGroup, Button, Form } from "react-bootstrap";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import AASData, { getPCFLiveCyclePhase, getPCFCalculationMethod } from "../../AasData.js";



//Component Imports
import C02eqDistributionBarChart from "../CO2eqDistributionBarChart.js";
import pcfSMCShowTab, { PcfSMCShowTab, TcfSMCShowTab } from "./SmcShowTab.js";
import BackButtonContainer from "../../general/BackButtonContainer.js";
import { AasDataContext } from "../../AasDataContext.js";


//Helper imports
import { fetchOneAasShow, aasExport as handleExportSubmit } from './../../../helper/aasHelper.js';


//CSS Import 
import "../../Colors.css";
import './AasShow.css';
import "./../../general/Main.css";


//Icon import
import { ReactComponent as Truck } from "./../../../assets/icons/Truck.svg";







export default function AasShow() {

  const [aas, setAas] = useState(new AASData(useLoaderData()[0]));
  const { allAas, loading } = useContext(AasDataContext);
  const { aas_url } = useParams();
  const [downloadFormat, setDownloadFormat] = useState('aasx')
  const navigate = useNavigate();


  // Fetch data when URL parameter changes
  useEffect(() => {
    console.log('url', aas_url);
    const loadAasData = async () => {
      try {
        const fetchedData = await fetchOneAasShow(aas_url);
        setAas(new AASData(fetchedData));
      } catch (error) {
        console.error(error);
      }
    };
    loadAasData();
  }, [aas_url]);



  const goBackToOverview = () => {
    navigate('/aas');
  };

  const handleDownloadClick = () => {
    const assetID = aas.assetID;
    const exportData = {
      exportFormat: downloadFormat,
      selectedItems: [assetID]
    }
    handleExportSubmit(exportData);    
  };

  const handleDownloadFormatChange = (event) => {
    setDownloadFormat(event.target.value);
  };


  return (
    <Container className="py-3">
      <Container fluid className="rounded-0 border bg-light px-5 py-4">
        <Row className="pb-4">
          <Col md='8'>
            <Button size="sm" onClick={goBackToOverview}>
              Back
            </Button>


          </Col>
          <Col className="d-flex justify-content-end" md="4">
            <Form.Select
              size="sm"
              style={{ width: '80px' }}
              value={downloadFormat}
              onChange={handleDownloadFormatChange}>

              <option value="json">JSON</option>
              <option value="aasx">AASX</option>
            </Form.Select>
            <Button className="px-2 mx-2" variant="secondary" size="sm" onClick={handleDownloadClick}>
              Download
            </Button>
          </Col>

        </Row>


        <Stack gap={3}>


          <Row>
            <Col lg={8}>
              <h1 className="custom-h1">{aas.assetIDShort}</h1>
            </Col>
            <Col className="d-flex justify-content-center" lg={4}>
              <div className="custom-tile rounded-2 mt-3">
                <Row>
                  <Col className="d-flex justify-content-center align-items-start" md style={{ fontWeight: 'bolder', fontSize: '8rem' }}>
                    {aas.sumCO2eq('all')}
                  </Col>
                  <Col md className="d-flex justify-content-center align-items-center pb-3 px-4" style={{ fontSize: '2rem' }}>
                    kg CO2 Emissions
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>

          <h2 className="custom-h2">Nameplate</h2>
          <Row>
            <Col>

              <Row className="px-3">
                <Col sm={3} style={{ color: 'rgb(0,0,0,0.7)' }}>
                  <p><strong>URI:</strong></p>
                </Col>
                <Col sm={9}>
                  <p>{aas.submodels.Nameplate.URIOfTheProduct}</p>
                </Col>
              </Row>


              <Row className="px-3">
                <Col sm={3} style={{ color: 'rgb(0,0,0,0.7)' }}>
                  <p><strong>Serial number:</strong></p>
                </Col>
                <Col sm={9}>
                  <p>{aas.submodels.Nameplate.SerialNumber}</p>
                </Col>
              </Row>

              <Row className="px-3">
                <Col sm={3} style={{ color: 'rgb(0,0,0,0.7)' }}>
                  <p><strong>Manufacturer:</strong></p>
                </Col>
                <Col sm={9}>
                  <p>{aas.submodels.Nameplate.ManufacturerName}</p>
                </Col>
              </Row>

              <Row className="px-3">
                <Col sm={3} style={{ color: 'rgb(0,0,0,0.7)' }}>
                  <p><strong>Year of construction:</strong></p>
                </Col>
                <Col sm={9}>
                  <p>{aas.submodels.Nameplate.YearOfConstruction}</p>
                </Col>
              </Row>

              <Row className="px-3">
                <Col sm={3} style={{ color: 'rgb(0,0,0,0.7)' }}>
                  <p><strong>Date of construction:</strong></p>
                </Col>
                <Col sm={9}>
                  <p>{aas.submodels.Nameplate.DateOfManufacture}</p>
                </Col>
              </Row>

              <hr className="mb-4"></hr>

            </Col>
          </Row>

          <h2 className="custom-h2">Technical Data</h2>
          <Row>
            <Col>

              <Row className="px-3">
                <Col sm={3} style={{ color: 'rgb(0,0,0,0.7)' }}>
                  <p><strong>Order code:</strong></p>
                </Col>
                <Col sm={9}>
                  <p>{aas.submodels.TechnicalData.ManufacturerOrderCode}</p>
                </Col>
              </Row>

              <hr className="mb-4"></hr>

            </Col>
          </Row>

          <h2 className="custom-h2">Carbon Footprint</h2>
          <h4 className="custom-h2 mt-4">CO2 Emissions categorized by Lifecycle Phases</h4>



          <Row>
            <Col className="rounded-2 border bg-white mx-3" lg={12} style={{ width: '97%', boxShadow: 'inset 1px 1px 10px rgb(0,0,0,0.2)' }}>
              {aas && <C02eqDistributionBarChart
                aasData={aas}
                optionsScaleX={{
                  font: {
                    size: 10
                  },
                  title: {
                    display: true,
                    text: 'kg of CO2',
                    align: 'end'
                  },
                  ticks: {
                    font: {
                      size: 10
                    },
                    display: true // Example boolean value determining whether ticks should be displayed
                  },
                  stacked: true
                }}
              ></C02eqDistributionBarChart>}
            </Col>
          </Row>

          <h4 className="custom-h2 mt-4">Reference Assets</h4>
          {/* Tap View of SMC */}
          <Tab.Container id="list-group-tabs-example" defaultActiveKey="#referenceItem1">
            <Row className="">
              <Col sm={4}>

                <ListGroup className="list-group">
                  {aas.submodels.CarbonFootprint.ProductCarbonFootprint.map((element, index) => (
                    <ListGroup.Item key={index} action eventKey={`#referenceItem${index + 1}`}>
                      {element.ReferableAssetID}
                    </ListGroup.Item>
                  ))}

                </ListGroup>
              </Col>
              <Col sm={8}>
                <Tab.Content>
                  {aas.submodels.CarbonFootprint.ProductCarbonFootprint.map((element, index) => (
                    <Tab.Pane key={`#referenceItem${index + 1}`} eventKey={`#referenceItem${index + 1}`}>
                      <PcfSMCShowTab pcfSMC={element} allAas={allAas} navigate={navigate}></PcfSMCShowTab>
                    </Tab.Pane>
                  ))}

                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>

          <h4 className="custom-h2 mt-5">Transport Routes</h4>
          {/* Tap View of SMC */}
          <Tab.Container id="list-group-tabs-example" defaultActiveKey="#route1">
            <Row className="">
              <Col sm={4}>

                <ListGroup className="list-group">
                  {aas.submodels.CarbonFootprint.TransportCarbonFootprint.map((element, index) => (
                    <ListGroup.Item key={index} action eventKey={`#route${index + 1}`}>
                      {element.TCFTakeoverCity} <Truck></Truck>  {element.TCFHandoverCity}

                    </ListGroup.Item>
                  ))}

                </ListGroup>
              </Col>

              <Col sm={8}>
                <Tab.Content>
                  {aas.submodels.CarbonFootprint.TransportCarbonFootprint.map((element, index) => (
                    <Tab.Pane key={`#route${index + 1}`} eventKey={`#route${index + 1}`}>
                      <TcfSMCShowTab tcfSMC={element}></TcfSMCShowTab>
                    </Tab.Pane>
                  ))}

                </Tab.Content>
              </Col>


            </Row>
          </Tab.Container>

        </Stack>


      </Container>
    </Container>
  );
};
