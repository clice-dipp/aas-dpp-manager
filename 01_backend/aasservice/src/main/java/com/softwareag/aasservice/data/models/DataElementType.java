/**
*	Copyright 2025 Software GmbH (previously Software AG)
*    
*    Licensed under the Apache License, Version 2.0 (the "License");
*    you may not use this file except in compliance with the License.
*    You may obtain a copy of the License at
*    
*      http://www.apache.org/licenses/LICENSE-2.0
*    
*    Unless required by applicable law or agreed to in writing, software
*   distributed under the License is distributed on an "AS IS" BASIS,
*    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*    See the License for the specific language governing permissions and
*    limitations under the License.
*/

package com.softwareag.aasservice.data.models;

public enum DataElementType {
    /* ProductCarbonFootprint */
    PCF_ASSET_REFERENCE("PCFAssetReference"),
    PCF_CALCULATION_METHOD("PCFCalculationMethod"),
    PCFCO2EQ("PCFCO2eq"),
    PCF_REFERENCE_VALUE_FOR_CALCULATION("PCFReferenceValueForCalculation"),
    PCF_QUANTITY_OF_MEASURE_FOR_CALCULATION("PCFQuantityOfMeasureForCalculation"),
    PCF_LIVE_CYCLE_PHASE("PCFLiveCyclePhase"),
    PCF_ASSET_DESCRIPTION("PCFAssetDescription"),

    /* General */
    STREET("Street"),
    HOUSENUMBER("HouseNumber"),
    ZIPCODE("ZipCode"),
    CITYTOWN("CityTown"),
    COUNTRY("Country"),
    LATITUDE("Latitude"),
    LONGITUDE("Longitude"),

    /* TransportCarbonFootprint */
    TCF_CALCULATION_METHOD("TCFCalculationMethod"),
    TCFCO2EQ("TCFCO2eq"),
    TCF_REFERENCE_VALUE_FOR_CALCULATION("TCFReferenceValueForCalculation"),
    TCF_QUANTITY_OF_MEASURE_FOR_CALCULATION("TCFQuantityOfMeasureForCalculation"),
    TCF_PROCESSES_FOR_GREENHOUSE_GAS_EMISSION_IN_A_TRANSPORT_SERVICE("TCFProcessesForGreenhouseGasEmissionInATransportService"),

    /* Nameplate */
    URI_OF_THE_PRODUCT("URIOfTheProduct"),
    MANUFACTURER_NAME("ManufacturerName"),
    SERIAL_NUMBER("SerialNumber"),
    YEAR_OF_CONSTRUCTION("YearOfConstruction"),
    DATE_OF_MANUFACTURE("DateOfManufacture"),

    /* TechnicalData */

    MANUFACTURER_ORDER_CODE("ManufacturerOrderCode"),
    MANUFACTURER_LOGO("ManufacturerLogo"),
    PRODUCT_IMAGE("ProductImage"),

    /* ReferenceProperty */
    REFERENCE_PROPERTY("ReferenceProperty");



    private String idShort;

    DataElementType(String idShort) {
        this.idShort = idShort;
    }

    public String getIdShort() {
        return idShort;
    }
}
