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
import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';

// CSS imports
import './CarbonFootprintBody.css';

// Component imports
import AccordionBuilder from '../AccordionBuilder';
import ProductCarbonFootprintBody from './ProductCarbonFootprint/ProductCarbonFootprint';
import TransportCarbonFootprintBody from './TransportCarbonFootprint';


function CarbonFootprintBody({ carbonFootprint, register, setValue, unregister }) {

  const [productCarbonFootprintAccordions, setProductCarbonFootprintAccordions] = useState([]);
  const [transportCarbonFootprintAccordions, setTransportCarbonFootprintAccordions] = useState([]);

  useEffect(() => {
    if (carbonFootprint) {
      setProductCarbonFootprintAccordions(carbonFootprint.ProductCarbonFootprint.map((item, index) => ({
        header: `Product Carbon Footprint ${index === 0 ? " - Current AAS" : index + 1}`,
        body: <ProductCarbonFootprintBody key={index} productCarbonFootprint={item} register={register} setValue={setValue} index={index} />
      })));

      setTransportCarbonFootprintAccordions(carbonFootprint.TransportCarbonFootprint.map((item, index) => ({
        header: `Transport Carbon Footprint ${index === 0 ? " - Current AAS" : index + 1}`,
        body: <TransportCarbonFootprintBody key={index} transportCarbonFootprint={item} register={register} index={index} />
      })));
    } else {
      console.log('Prev arrays in else: ', productCarbonFootprintAccordions.length)
      setProductCarbonFootprintAccordions([
        {
          header: 'Product Carbon Footprint - Current AAS',
          body: <ProductCarbonFootprintBody key={0} productCarbonFootprint={null} register={register} index={0} setValue={setValue} />
        }
      ]);
      setTransportCarbonFootprintAccordions([
        {
          header: 'Transport Carbon Footprint - Current AAS',
          body: <TransportCarbonFootprintBody key={0} transportCarbonFootprint={null} register={register} index={0} />
        }
      ]);
    }
  }, [carbonFootprint]);

  function handlePCFAddButton() {
    setProductCarbonFootprintAccordions(prevPCFAccodions => [
      ...prevPCFAccodions,
      {
        header: `Product Carbon Footprint ${prevPCFAccodions.length + 1}`,
        body: <ProductCarbonFootprintBody key={prevPCFAccodions.length} productCarbonFootprint={null} register={register} index={prevPCFAccodions.length} setValue={setValue}></ProductCarbonFootprintBody>
      }
    ]);
  };

  function handlePCFRemoveButton() {
    unregister(`ReferableAssetID[${productCarbonFootprintAccordions.length - 1}]`);
    unregister(`PCFCalculationMethod[${productCarbonFootprintAccordions.length - 1}]`);
    unregister(`PCFCO2eq[${productCarbonFootprintAccordions.length - 1}]`);
    unregister(`PCFQuantityOfMeasureForCalculation[${productCarbonFootprintAccordions.length - 1}]`);
    unregister(`PCFReferenceValueForCalculation[${productCarbonFootprintAccordions.length - 1}]`);
    unregister(`PCFLiveCyclePhase[${productCarbonFootprintAccordions.length - 1}]`);
    unregister(`PCFDescription[${productCarbonFootprintAccordions.length - 1}]`);
    unregister(`ExplanatoryStatement[${productCarbonFootprintAccordions.length - 1}]`);
    unregister(`PCFHandoverStreet[${productCarbonFootprintAccordions.length - 1}]`);
    unregister(`PCFHandoverNumber[${productCarbonFootprintAccordions.length - 1}]`);
    unregister(`PCFHandoverCity[${productCarbonFootprintAccordions.length - 1}]`);
    unregister(`PCFHandoverZIP[${productCarbonFootprintAccordions.length - 1}]`);
    unregister(`PCFHandoverCountry[${productCarbonFootprintAccordions.length - 1}]`);
    unregister(`PCFHandoverLatitude[${productCarbonFootprintAccordions.length - 1}]`);
    unregister(`PCFHandoverLongitude[${productCarbonFootprintAccordions.length - 1}]`);
    setProductCarbonFootprintAccordions(prevPCFAccodions =>
      prevPCFAccodions.length === 1
        ? prevPCFAccodions
        : prevPCFAccodions.slice(0, -1)
    );

  }


  function handleTCFAddButton() {
    setTransportCarbonFootprintAccordions(prevTCFAccodions => [
      ...prevTCFAccodions,
      {
        header: `Transport Carbon Footprint ${prevTCFAccodions.length + 1}`,
        body: <TransportCarbonFootprintBody key={prevTCFAccodions.length} transportCarbonFootprint={null} register={register} index={prevTCFAccodions.length}></TransportCarbonFootprintBody>
      }
    ]);
  };

  function handleTCFRemoveButton() {
    unregister(`TCFCalculationMethod[${transportCarbonFootprintAccordions.length - 1}]`);
    unregister(`TCFCO2eq[${transportCarbonFootprintAccordions.length - 1}]`);
    unregister(`TCFQuantityOfMeasureForCalculation[${transportCarbonFootprintAccordions.length - 1}]`);
    unregister(`TCFReferenceValueForCalculation[${transportCarbonFootprintAccordions.length - 1}]`);
    unregister(`TCFProcessesForGreenhouseGasEmissionInATransportService[${transportCarbonFootprintAccordions.length - 1}]`);
    unregister(`TCFTakeoverStreet[${transportCarbonFootprintAccordions.length - 1}]`);
    unregister(`TCFTakeoverNumber[${transportCarbonFootprintAccordions.length - 1}]`);
    unregister(`TCFTakeoverCity[${transportCarbonFootprintAccordions.length - 1}]`);
    unregister(`TCFTakeoverZIP[${transportCarbonFootprintAccordions.length - 1}]`);
    unregister(`TCFTakeoverCountry[${transportCarbonFootprintAccordions.length - 1}]`);
    unregister(`TCFTakeoverLatitude[${transportCarbonFootprintAccordions.length - 1}]`);
    unregister(`TCFTakeoverLongitude[${transportCarbonFootprintAccordions.length - 1}]`);
    unregister(`TCFHandoverStreet[${transportCarbonFootprintAccordions.length - 1}]`);
    unregister(`TCFHandoverNumber[${transportCarbonFootprintAccordions.length - 1}]`);
    unregister(`TCFHandoverCity[${transportCarbonFootprintAccordions.length - 1}]`);
    unregister(`TCFHandoverZIP[${transportCarbonFootprintAccordions.length - 1}]`);
    unregister(`TCFHandoverCountry[${transportCarbonFootprintAccordions.length - 1}]`);
    unregister(`TCFHandoverLatitude[${transportCarbonFootprintAccordions.length - 1}]`);
    unregister(`TCFHandoverLongitude[${transportCarbonFootprintAccordions.length - 1}]`);

    setTransportCarbonFootprintAccordions(prevTCFAccodions =>
      prevTCFAccodions.length === 1
        ? prevTCFAccodions
        : prevTCFAccodions.slice(0, -1)
    );
  }






  return (
    <>
      <AccordionBuilder accordionBodys={productCarbonFootprintAccordions}></AccordionBuilder>
      <div className="d-flex justify-content-end">
        <Button className="btn btn-sm custom-add-button custom-remove-button mx-0 mb-4" onClick={handlePCFRemoveButton} disabled={productCarbonFootprintAccordions.length === 1}>-</Button>
        <Button className="btn btn-sm custom-add-button mx-2 mb-4" onClick={handlePCFAddButton}>+</Button>
      </div>
      <AccordionBuilder accordionBodys={transportCarbonFootprintAccordions}></AccordionBuilder>
      <div className="d-flex justify-content-end">
        <Button className="btn btn-sm custom-add-button custom-remove-button mx-0" onClick={handleTCFRemoveButton} disabled={transportCarbonFootprintAccordions.length === 1}>-</Button>
        <Button className="btn btn-sm custom-add-button mx-2" onClick={handleTCFAddButton}>+</Button>
      </div>
    </>
  )

}

export default CarbonFootprintBody;
