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

package com.softwareag.aasservice.data;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.softwareag.aasservice.data.models.DataElementType;
import com.softwareag.aasservice.data.repositories.AASXDataRepository;
import com.softwareag.aasservice.data.repositories.DataRepository;
import com.softwareag.aasservice.data.repositories.JsonDataRepository;
import com.softwareag.aasservice.service.EnvironmentService;
import com.softwareag.aasservice.utils.Constants;

import lombok.Data;

import java.io.File;
import java.util.List;

@Data
public class AASDataTransferObject {

        @JsonProperty("sender")
        private String sender;

        @JsonProperty("assetIDShort")
        private String assetIDshort;

        @JsonProperty("assetID")
        private String assetID;

        @JsonProperty("submodels")
        private Submodels submodels;

        @Data
        public static class Submodels {
                @JsonProperty("Nameplate")
                private Nameplate nameplate;

                @JsonProperty("TechnicalData")
                private TechnicalData technicalData;

                @JsonProperty("CarbonFootprint")
                private CarbonFootprint carbonFootprint;

        }

        @Data
        public static class Nameplate {
                @JsonProperty("URIOfTheProduct")
                private String URIOfTheProduct;

                @JsonProperty("ManufacturerName")
                private String manufacturerName;

                @JsonProperty("SerialNumber")
                private String serialNumber;

                @JsonProperty("YearOfConstruction")
                private String yearOfConstruction;

                @JsonProperty("DateOfManufacture")
                private String dateOfManufacture;

        }

        @Data
        public static class TechnicalData {
                @JsonProperty("ManufacturerOrderCode")
                private String manufacturerOrderCode;

                @JsonProperty("ManufacturerLogo")
                private Object manufacturerLogo;

                @JsonProperty("ProductImage")
                private Object productImage;

        }

        @Data
        public static class CarbonFootprint {
                @JsonProperty("ProductCarbonFootprint")
                private List<ProductCarbonFootprint> productCarbonFootprint;

                @JsonProperty("TransportCarbonFootprint")
                private List<TransportCarbonFootprint> transportCarbonFootprint;

        }

        @Data
        public static class ProductCarbonFootprint {
                @JsonProperty("ReferableAssetID")
                private String referableAssetID;

                @JsonProperty("PCFCalculationMethod")
                private String pcfCalculationMethod;

                @JsonProperty("PCFCO2eq")
                private String pcfCO2eq;

                @JsonProperty("PCFQuantityOfMeasureForCalculation")
                private String pcfQuantityOfMeasureForCalculation;

                @JsonProperty("PCFReferenceValueForCalculation")
                private String pcfReferenceValueForCalculation;

                @JsonProperty("PCFLiveCyclePhase")
                private String pcfLiveCyclePhase;

                @JsonProperty("PCFDescription")
                private String pcfDescription;

                @JsonProperty("ExplanatoryStatement")
                private String explanatoryStatement;

                @JsonProperty("PCFHandoverStreet")
                private String pcfHandoverStreet;

                @JsonProperty("PCFHandoverNumber")
                private String pcfHandoverNumber;

                @JsonProperty("PCFHandoverCity")
                private String pcfHandoverCity;

                @JsonProperty("PCFHandoverZIP")
                private String pcfHandoverZIP;

                @JsonProperty("PCFHandoverCountry")
                private String pcfHandoverCountry;

                @JsonProperty("PCFHandoverLatitude")
                private String pcfHandoverLatitude;

                @JsonProperty("PCFHandoverLongitude")
                private String pcfHandoverLongitude;

        }

        @Data
        public static class TransportCarbonFootprint {
                @JsonProperty("TCFCalculationMethod")
                private String tcfCalculationMethod;

                @JsonProperty("TCFCO2eq")
                private String tcfCO2eq;

                @JsonProperty("TCFQuantityOfMeasureForCalculation")
                private String tcfQuantityOfMeasureForCalculation;

                @JsonProperty("TCFReferenceValueForCalculation")
                private String tcfReferenceValueForCalculation;

                @JsonProperty("TCFProcessesForGreenhouseGasEmissionInATransportService")
                private String tcfProcessesForGreenhouseGasEmissionInATransportService;

                @JsonProperty("TCFTakeoverStreet")
                private String tcfTakeoverStreet;

                @JsonProperty("TCFTakeoverNumber")
                private String tcfTakeoverNumber;

                @JsonProperty("TCFTakeoverCity")
                private String tcfTakeoverCity;

                @JsonProperty("TCFTakeoverZIP")
                private String tcfTakeoverZIP;

                @JsonProperty("TCFTakeoverCountry")
                private String tcfTakeoverCountry;

                @JsonProperty("TCFTakeoverLatitude")
                private String tcfTakeoverLatitude;

                @JsonProperty("TCFTakeoverLongitude")
                private String tcfTakeoverLongitude;

                @JsonProperty("TCFHandoverStreet")
                private String tcfHandoverStreet;

                @JsonProperty("TCFHandoverNumber")
                private String tcfHandoverNumber;

                @JsonProperty("TCFHandoverCity")
                private String tcfHandoverCity;

                @JsonProperty("TCFHandoverZIP")
                private String tcfHandoverZIP;

                @JsonProperty("TCFHandoverCountry")
                private String tcfHandoverCountry;

                @JsonProperty("TCFHandoverLatitude")
                private String tcfHandoverLatitude;

                @JsonProperty("TCFHandoverLongitude")
                private String tcfHandoverLongitude;
        }

        public EnvironmentService toEnvironmentService() {
                DataRepository aasxDataRepository = new AASXDataRepository();
                EnvironmentService environmentService = aasxDataRepository
                                .read(new File(Constants.RESOURCE_DIRECTORY + "/" + "FullAASTemplate.aasx"));

                environmentService.updateAssetIDShort(getAssetIDshort());
                environmentService.updateAssetID(getAssetID());

                /* Nameplate */
                insertNameplateSubmodel(environmentService);

                /* Technical Data */
                insertTechnicalDataSubmodel(environmentService);

                /* Carbon Footprint */

                /* --- ProductCarbonFootprint --- */
                int numberOfPCF = 1;
                for (ProductCarbonFootprint pcf : getSubmodels().getCarbonFootprint().getProductCarbonFootprint()) {
                        String submodelElementCollectionIdShort = "ProductCarbonFootprint";
                        if (numberOfPCF > 1) {
                                submodelElementCollectionIdShort += "_" + (numberOfPCF);
                                environmentService.duplicateSubmodelElementCollection("CarbonFootprint",
                                                "ProductCarbonFootprint", submodelElementCollectionIdShort);
                        }

                        insertPCF_CarbonFootprintSubmodel(environmentService, pcf, submodelElementCollectionIdShort);
                        numberOfPCF++;
                }

                /* --- CarbonFootprint --- */
                int numberOfTCF = 1;
                for (TransportCarbonFootprint tcf : getSubmodels().getCarbonFootprint().getTransportCarbonFootprint()) {
                        String submodelElementCollectionIdShort = "TransportCarbonFootprint";
                        if (numberOfTCF > 1) {
                                submodelElementCollectionIdShort += "_"
                                                + (numberOfTCF);
                                environmentService.duplicateSubmodelElementCollection("CarbonFootprint",
                                                "TransportCarbonFootprint", submodelElementCollectionIdShort);
                        }

                        insertTCF_CarbonFootprintSubmodel(environmentService, tcf, submodelElementCollectionIdShort);
                        numberOfTCF++;

                }

                return environmentService;
        }

        private void insertNameplateSubmodel(EnvironmentService environmentService) {
                Nameplate nameplate = getSubmodels().getNameplate();
                String submodelIdShort = "Nameplate";

                environmentService.updateProperty(nameplate.getURIOfTheProduct(), submodelIdShort,
                                DataElementType.URI_OF_THE_PRODUCT);
                environmentService.updateMultilanguageProperty(nameplate.getManufacturerName(), submodelIdShort,
                                DataElementType.MANUFACTURER_NAME);
                environmentService.updateProperty(nameplate.getSerialNumber(), submodelIdShort,
                                DataElementType.SERIAL_NUMBER);
                environmentService.updateProperty(nameplate.getYearOfConstruction(), submodelIdShort,
                                DataElementType.YEAR_OF_CONSTRUCTION);
                environmentService.updateProperty(nameplate.getDateOfManufacture(), submodelIdShort,
                                DataElementType.DATE_OF_MANUFACTURE);
        }

        private void insertTechnicalDataSubmodel(EnvironmentService environmentService) {
                TechnicalData technicalData = getSubmodels().getTechnicalData();
                String submodelIdShort = "TechnicalData";

                environmentService.updateProperty(technicalData.getManufacturerOrderCode(), submodelIdShort,
                                DataElementType.MANUFACTURER_ORDER_CODE, "GeneralInformation");
        }

        private void insertPCF_CarbonFootprintSubmodel(EnvironmentService environmentService,
                        ProductCarbonFootprint productCarbonFootprint, String submodelElementCollectionIdShort) {

                String submodelIdShort = "CarbonFootprint";

                environmentService.updateReferenceElement(productCarbonFootprint.getReferableAssetID(),
                                submodelIdShort,
                                DataElementType.PCF_ASSET_REFERENCE,
                                submodelElementCollectionIdShort);
                environmentService.updateProperty(productCarbonFootprint.getPcfCalculationMethod(), submodelIdShort,
                                DataElementType.PCF_CALCULATION_METHOD,
                                submodelElementCollectionIdShort);
                environmentService.updateProperty(productCarbonFootprint.getPcfCO2eq(), submodelIdShort,
                                DataElementType.PCFCO2EQ, submodelElementCollectionIdShort);
                environmentService.updateProperty(productCarbonFootprint.getPcfQuantityOfMeasureForCalculation(),
                                submodelIdShort,
                                DataElementType.PCF_QUANTITY_OF_MEASURE_FOR_CALCULATION,
                                submodelElementCollectionIdShort);
                environmentService.updateProperty(productCarbonFootprint.getPcfReferenceValueForCalculation(),
                                submodelIdShort,
                                DataElementType.PCF_REFERENCE_VALUE_FOR_CALCULATION,
                                submodelElementCollectionIdShort);
                environmentService.updateProperty(productCarbonFootprint.getPcfLiveCyclePhase(), submodelIdShort,
                                DataElementType.PCF_LIVE_CYCLE_PHASE,
                                submodelElementCollectionIdShort);
                environmentService.updateProperty(productCarbonFootprint.getPcfDescription(), submodelIdShort,
                                DataElementType.PCF_ASSET_DESCRIPTION,
                                submodelElementCollectionIdShort);
                environmentService.updateProperty(productCarbonFootprint.getPcfHandoverStreet(), submodelIdShort,
                                DataElementType.STREET, submodelElementCollectionIdShort,
                                "PCFGoodsAddressHandover");
                environmentService.updateProperty(productCarbonFootprint.getPcfHandoverNumber(), submodelIdShort,
                                DataElementType.HOUSENUMBER, submodelElementCollectionIdShort,
                                "PCFGoodsAddressHandover");
                environmentService.updateProperty(productCarbonFootprint.getPcfHandoverCity(), submodelIdShort,
                                DataElementType.CITYTOWN, submodelElementCollectionIdShort,
                                "PCFGoodsAddressHandover");
                environmentService.updateProperty(productCarbonFootprint.getPcfHandoverZIP(), submodelIdShort,
                                DataElementType.ZIPCODE, submodelElementCollectionIdShort,
                                "PCFGoodsAddressHandover");
                environmentService.updateProperty(productCarbonFootprint.getPcfHandoverCountry(), submodelIdShort,
                                DataElementType.COUNTRY, submodelElementCollectionIdShort,
                                "PCFGoodsAddressHandover");
                environmentService.updateProperty(productCarbonFootprint.getPcfHandoverLatitude(), submodelIdShort,
                                DataElementType.LATITUDE, submodelElementCollectionIdShort,
                                "PCFGoodsAddressHandover");
                environmentService.updateProperty(productCarbonFootprint.getPcfHandoverLongitude(), submodelIdShort,
                                DataElementType.LONGITUDE, submodelElementCollectionIdShort,
                                "PCFGoodsAddressHandover");

        }

        private void insertTCF_CarbonFootprintSubmodel(EnvironmentService environmentService, TransportCarbonFootprint transportCarbonFootprint, String submodelElementCollectionIdShort) {

                String submodelIdShort = "CarbonFootprint";


                environmentService.updateProperty(transportCarbonFootprint.getTcfCalculationMethod(), submodelIdShort,
                                        DataElementType.TCF_CALCULATION_METHOD,
                                        submodelElementCollectionIdShort);
                        environmentService.updateProperty(transportCarbonFootprint.getTcfCO2eq(), submodelIdShort,
                                        DataElementType.TCFCO2EQ, submodelElementCollectionIdShort);
                        environmentService.updateProperty(transportCarbonFootprint.getTcfReferenceValueForCalculation(), submodelIdShort,
                                        DataElementType.TCF_REFERENCE_VALUE_FOR_CALCULATION,
                                        submodelElementCollectionIdShort);
                        environmentService.updateProperty(transportCarbonFootprint.getTcfQuantityOfMeasureForCalculation(),
                                        submodelIdShort,
                                        DataElementType.TCF_QUANTITY_OF_MEASURE_FOR_CALCULATION,
                                        submodelElementCollectionIdShort);
                        environmentService.updateProperty(
                                        transportCarbonFootprint.getTcfProcessesForGreenhouseGasEmissionInATransportService(),
                                        submodelIdShort,
                                        DataElementType.TCF_PROCESSES_FOR_GREENHOUSE_GAS_EMISSION_IN_A_TRANSPORT_SERVICE,
                                        submodelElementCollectionIdShort);
                        environmentService.updateProperty(transportCarbonFootprint.getTcfTakeoverStreet(), submodelIdShort,
                                        DataElementType.STREET, submodelElementCollectionIdShort,
                                        "TCFGoodsTransportAddressTakeover");
                        environmentService.updateProperty(transportCarbonFootprint.getTcfTakeoverNumber(), submodelIdShort,
                                        DataElementType.HOUSENUMBER, submodelElementCollectionIdShort,
                                        "TCFGoodsTransportAddressTakeover");
                        environmentService.updateProperty(transportCarbonFootprint.getTcfTakeoverCity(), submodelIdShort,
                                        DataElementType.CITYTOWN, submodelElementCollectionIdShort,
                                        "TCFGoodsTransportAddressTakeover");
                        environmentService.updateProperty(transportCarbonFootprint.getTcfTakeoverZIP(), submodelIdShort,
                                        DataElementType.ZIPCODE, submodelElementCollectionIdShort,
                                        "TCFGoodsTransportAddressTakeover");
                        environmentService.updateProperty(transportCarbonFootprint.getTcfTakeoverCountry(), submodelIdShort,
                                        DataElementType.COUNTRY, submodelElementCollectionIdShort,
                                        "TCFGoodsTransportAddressTakeover");
                        environmentService.updateProperty(transportCarbonFootprint.getTcfTakeoverLatitude(), submodelIdShort,
                                        DataElementType.LATITUDE, submodelElementCollectionIdShort,
                                        "TCFGoodsTransportAddressTakeover");
                        environmentService.updateProperty(transportCarbonFootprint.getTcfTakeoverLongitude(), submodelIdShort,
                                        DataElementType.LONGITUDE, submodelElementCollectionIdShort,
                                        "TCFGoodsTransportAddressTakeover");

                        environmentService.updateProperty(transportCarbonFootprint.getTcfHandoverStreet(), submodelIdShort,
                                        DataElementType.STREET, submodelElementCollectionIdShort,
                                        "TCFGoodsTransportAddressHandover");
                        environmentService.updateProperty(transportCarbonFootprint.getTcfHandoverNumber(), submodelIdShort,
                                        DataElementType.HOUSENUMBER, submodelElementCollectionIdShort,
                                        "TCFGoodsTransportAddressHandover");
                        environmentService.updateProperty(transportCarbonFootprint.getTcfHandoverCity(), submodelIdShort,
                                        DataElementType.CITYTOWN, submodelElementCollectionIdShort,
                                        "TCFGoodsTransportAddressHandover");
                        environmentService.updateProperty(transportCarbonFootprint.getTcfHandoverZIP(), submodelIdShort,
                                        DataElementType.ZIPCODE, submodelElementCollectionIdShort,
                                        "TCFGoodsTransportAddressHandover");
                        environmentService.updateProperty(transportCarbonFootprint.getTcfHandoverCountry(), submodelIdShort,
                                        DataElementType.COUNTRY, submodelElementCollectionIdShort,
                                        "TCFGoodsTransportAddressHandover");
                        environmentService.updateProperty(transportCarbonFootprint.getTcfHandoverLatitude(), submodelIdShort,
                                        DataElementType.LATITUDE, submodelElementCollectionIdShort,
                                        "TCFGoodsTransportAddressHandover");
                        environmentService.updateProperty(transportCarbonFootprint.getTcfHandoverLongitude(), submodelIdShort,
                                        DataElementType.LONGITUDE, submodelElementCollectionIdShort,
                                        "TCFGoodsTransportAddressHandover");
        }

}
