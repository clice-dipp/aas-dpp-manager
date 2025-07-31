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

package com.softwareag.aasservice.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Queue;
import java.util.stream.Collectors;

import org.eclipse.digitaltwin.aas4j.v3.dataformat.aasx.InMemoryFile;
import org.eclipse.digitaltwin.aas4j.v3.model.AssetAdministrationShell;
import org.eclipse.digitaltwin.aas4j.v3.model.ConceptDescription;
import org.eclipse.digitaltwin.aas4j.v3.model.DataElement;
import org.eclipse.digitaltwin.aas4j.v3.model.Environment;
import org.eclipse.digitaltwin.aas4j.v3.model.File;
import org.eclipse.digitaltwin.aas4j.v3.model.KeyTypes;
import org.eclipse.digitaltwin.aas4j.v3.model.LangStringTextType;
import org.eclipse.digitaltwin.aas4j.v3.model.MultiLanguageProperty;
import org.eclipse.digitaltwin.aas4j.v3.model.Property;
import org.eclipse.digitaltwin.aas4j.v3.model.ReferenceElement;
import org.eclipse.digitaltwin.aas4j.v3.model.ReferenceTypes;
import org.eclipse.digitaltwin.aas4j.v3.model.Submodel;
import org.eclipse.digitaltwin.aas4j.v3.model.SubmodelElement;
import org.eclipse.digitaltwin.aas4j.v3.model.SubmodelElementCollection;
import org.eclipse.digitaltwin.aas4j.v3.model.impl.DefaultKey;
import org.eclipse.digitaltwin.aas4j.v3.model.impl.DefaultLangStringTextType;
import org.eclipse.digitaltwin.aas4j.v3.model.impl.DefaultReference;

import com.softwareag.aasservice.data.AASDataTransferObject;
import com.softwareag.aasservice.data.AASDataTransferObject.CarbonFootprint;
import com.softwareag.aasservice.data.AASDataTransferObject.Nameplate;
import com.softwareag.aasservice.data.AASDataTransferObject.ProductCarbonFootprint;
import com.softwareag.aasservice.data.AASDataTransferObject.Submodels;
import com.softwareag.aasservice.data.AASDataTransferObject.TechnicalData;
import com.softwareag.aasservice.data.AASDataTransferObject.TransportCarbonFootprint;
import com.softwareag.aasservice.data.models.DataElementType;
import com.softwareag.modelling.SubmodelTemplate;

public class EnvironmentService implements Environment {

        private Environment environment;
        private List<InMemoryFile> fileList = new ArrayList<>();
        
        public HashMap<Class<? extends SubmodelTemplate>, SubmodelTemplate> submodelTemplates = new HashMap<>();

        public EnvironmentService(Environment environment) {
                this.environment = environment;
        }

        @Override
        public List<AssetAdministrationShell> getAssetAdministrationShells() {
                return environment.getAssetAdministrationShells();
        }

        @Override
        public void setAssetAdministrationShells(List<AssetAdministrationShell> assetAdministrationShells) {
                environment.setAssetAdministrationShells(assetAdministrationShells);
        }

        @Override
        public List<ConceptDescription> getConceptDescriptions() {
                return environment.getConceptDescriptions();
        }

        @Override
        public void setConceptDescriptions(List<ConceptDescription> conceptDescriptions) {
                environment.setConceptDescriptions(conceptDescriptions);
        }

        @Override
        public List<Submodel> getSubmodels() {
                return environment.getSubmodels();
        }

        @Override
        public void setSubmodels(List<Submodel> submodels) {
                environment.setSubmodels(submodels);
        }

        public Environment getEnvironmentInstance() {
                return this.environment;
        }

        public void setFilelist(List<InMemoryFile> fileList) {
                this.fileList = fileList;
        }

        public List<InMemoryFile> getFileList() {
                return this.fileList;
        }

        /**
         * TO DO - Documentation
         *
         * 
         * 
         */
        public EnvironmentService clone() {
                return new EnvironmentService(new AASModifier(environment).build());
        }

        public void duplicateSubmodel(String submodelIdShort, String newSubmodelId, String newSubmodelIdShort) {
                this.environment = new AASModifier(this.environment)
                                .duplicateSubmodel(getSubmodelOfIdShort(submodelIdShort), newSubmodelId,
                                                newSubmodelIdShort)
                                .build();
        }

        public void duplicateSubmodelElementCollection(String submodelIdShort, String submodelElementCollectionIdShort,
                        String newIdShort) {
                this.environment = new AASModifier(environment)
                                .duplicateSubmodelElementCollection(getSubmodelOfIdShort(submodelIdShort),
                                                submodelElementCollectionIdShort, newIdShort)
                                .build();
        }

        public void addCustomProperty(String submodelIdShort, String popertyIdShort) {
                this.environment = new AASModifier(environment)
                                .addCustomProperty(getSubmodelOfIdShort(submodelIdShort), popertyIdShort)
                                .build();
        }

        public void updateAssetID(String value) {
                getAssetAdministrationShells().get(0).setId(value);
        }

        public void updateAssetIDShort(String value) {
                getAssetAdministrationShells().get(0).setIdShort(value);
        }

        public String getAssetID() {
                return getAssetAdministrationShells().get(0).getId();
        }

        public String getAssetIDShort() {
                return getAssetAdministrationShells().get(0).getIdShort();
        }

        public void updateMultilanguageProperty(String value, String submodelIdShort,
                        DataElementType dataElementType,
                        String... submodelElementCollections) {
                try {

                        SubmodelElement submodelElement = getSubmodelElement(submodelIdShort, dataElementType,
                                        submodelElementCollections);

                        if (submodelElement == null || !(submodelElement instanceof MultiLanguageProperty))
                                return;

                        List<LangStringTextType> valueList = new ArrayList<>();
                        DefaultLangStringTextType stringTextType = new DefaultLangStringTextType();

                        stringTextType.setLanguage("de");
                        stringTextType.setText(value);
                        valueList.add(0, stringTextType);

                        ((MultiLanguageProperty) submodelElement).setValue(valueList);

                } catch (Exception ex) {
                        ex.printStackTrace();
                }
        }

        public void updateProperty(String value, String submodelIdShort, DataElementType dataElementType,
                        String... submodelElementCollections) {
                try {

                        SubmodelElement submodelElement = getSubmodelElement(submodelIdShort, dataElementType,
                                        submodelElementCollections);

                        if (submodelElement == null || !(submodelElement instanceof Property))
                                return;

                        ((Property) submodelElement).setValue(value);

                } catch (Exception ex) {
                        ex.printStackTrace();
                }
        }

        public void updateReferenceElement(String value, String submodelIdShort, DataElementType dataElementType,
                        String... submodelElementCollections) {
                try {

                        SubmodelElement submodelElement = getSubmodelElement(submodelIdShort, dataElementType,
                                        submodelElementCollections);

                        if (submodelElement == null || !(submodelElement instanceof ReferenceElement))
                                return;

                        ((ReferenceElement) submodelElement).setValue(new DefaultReference.Builder()
                                        .keys(new DefaultKey.Builder()
                                                        .type(KeyTypes.ASSET_ADMINISTRATION_SHELL) // Not sure yet, if
                                                                                                   // ASSET_ADMINISTRATION_SHELL
                                                                                                   // is used as
                                                                                                   // reference!
                                                        .value(value)
                                                        .build())
                                        .type(ReferenceTypes.EXTERNAL_REFERENCE)
                                        .build());

                } catch (Exception ex) {
                        ex.printStackTrace();
                }
        }

        public void updateFile(String path, String submodelIdShort, DataElementType dataElementType,
                        String... submodelElementCollections) {
                try {

                        SubmodelElement submodelElement = getSubmodelElement(submodelIdShort, dataElementType,
                                        submodelElementCollections);

                        if (submodelElement == null || !(submodelElement instanceof File))
                                return;

                        ((File) submodelElement).setValue(path);

                } catch (Exception ex) {
                        ex.printStackTrace();
                }
        }

        public String getProperty(String submodelIdShort, DataElementType dataElementType,
                        String... submodelElementCollections) {
                try {
                        if (!submodelExists(submodelIdShort))
                                return " ";

                        SubmodelElement submodelElement = getSubmodelElement(submodelIdShort, dataElementType,
                                        submodelElementCollections);

                        if (submodelElement == null || !(submodelElement instanceof Property))
                                return " ";

                        return ((Property) submodelElement).getValue();

                } catch (Exception ex) {
                        ex.printStackTrace();
                        return " ";
                }

        }

        public String getReferenceElement(String submodelIdShort,
                        DataElementType dataElementType,
                        String... submodelElementCollections) {
                try {
                        if (!submodelExists(submodelIdShort))
                                return " ";

                        SubmodelElement submodelElement = getSubmodelElement(submodelIdShort, dataElementType,
                                        submodelElementCollections);

                        if (submodelElement == null || !(submodelElement instanceof ReferenceElement))
                                return " ";

                        return ((ReferenceElement) submodelElement).getValue().getKeys().get(0).getValue();

                } catch (Exception ex) {
                        ex.printStackTrace();
                        return " ";
                }
        }

        public List<LangStringTextType> getMultilanguageProperty(String submodelIdShort,
                        DataElementType dataElementType,
                        String... submodelElementCollections) {
                try {
                        if (!submodelExists(submodelIdShort))
                                return Arrays.asList(
                                                new DefaultLangStringTextType.Builder().text(" ").language("de")
                                                                .build());

                        SubmodelElement submodelElement = getSubmodelElement(submodelIdShort, dataElementType,
                                        submodelElementCollections);

                        if (submodelElement == null || !(submodelElement instanceof MultiLanguageProperty))
                                return Arrays.asList(
                                                new DefaultLangStringTextType.Builder().text(" ").language("de")
                                                                .build());

                        return ((MultiLanguageProperty) submodelElement).getValue();

                } catch (Exception ex) {
                        ex.printStackTrace();
                        return Arrays.asList(
                                        new DefaultLangStringTextType.Builder().text(" ").language("de").build());
                }
        }

        private SubmodelElement getSubmodelElement(String submodelIdShort, DataElementType dataElementType,
                        String... submodelElementCollections) {

                if (submodelElementCollections.length == 0)
                        return getSubmodelOfIdShort(submodelIdShort).getSubmodelElements().stream()
                                        .filter(element -> element.getIdShort().equals(dataElementType.getIdShort()))
                                        .findFirst()
                                        .orElse(null);

                SubmodelElementCollection submodelElementCollection = (SubmodelElementCollection) getCertainSubmodelElementCollection(
                                submodelIdShort, submodelElementCollections);

                return submodelElementCollection.getValue().stream()
                                .filter(element -> element.getIdShort().equals(dataElementType.getIdShort()))
                                .findFirst()
                                .orElse(null);

        }

        private SubmodelElementCollection getCertainSubmodelElementCollection(String submodelIdShort,
                        String... collections) {

                Submodel submodel = getSubmodelOfIdShort(submodelIdShort);
                if (submodel == null || collections == null || collections.length == 0)
                        return null;

                SubmodelElementCollection parentCollection = null;
                for (int i = 0; i < collections.length; i++) {
                        String currentCollection = collections[i];
                        Collection<SubmodelElement> elements;

                        if (i == 0) {
                                elements = submodel.getSubmodelElements();
                        } else {
                                elements = parentCollection != null ? parentCollection.getValue() : null;
                        }

                        if (elements == null)
                                return null; // Collection not found

                        boolean collectionFound = false;
                        for (SubmodelElement element : elements) {
                                if (element instanceof SubmodelElementCollection
                                                && element.getIdShort().equals(currentCollection)) {
                                        parentCollection = (SubmodelElementCollection) element;
                                        collectionFound = true;
                                        break;
                                }
                        }

                        if (!collectionFound)
                                return null; // Collection not found
                }

                return parentCollection;
        }

        public Submodel getSubmodelOfIdShort(String submodelIdShort) {
                return getSubmodels().stream()
                                .filter(submodel -> isSubmodelTypeOf(submodel, submodelIdShort))
                                .findFirst()
                                .orElse(null);
        }

        public boolean isMultilanguageProperty(SubmodelElement submodelElement,
                        DataElementType submodelElementPropertyType) {
                return submodelElement instanceof MultiLanguageProperty
                                && submodelElement.getIdShort().equals(submodelElementPropertyType.getIdShort());
        }

        public boolean isProperty(SubmodelElement submodelElement,
                        DataElementType dataElementType) {
                return submodelElement instanceof Property
                                && submodelElement.getIdShort().equals(dataElementType.getIdShort());
        }

        public boolean isReferenceElement(SubmodelElement submodelElement,
                        DataElementType dataElementType) {
                return submodelElement instanceof ReferenceElement
                                && submodelElement.getIdShort().equals(dataElementType.getIdShort());
        }

        public boolean isFile(SubmodelElement submodelElement,
                        DataElementType dataElementType) {
                return submodelElement instanceof File
                                && submodelElement.getIdShort().equals(dataElementType.getIdShort());
        }

        private boolean submodelExists(String submodelIdShort) {
                return getSubmodels().stream()
                                .filter(submodel -> submodel.getIdShort().equals(submodelIdShort))
                                .collect(Collectors.toList())
                                .size() > 0;
        }

        private boolean isSubmodelTypeOf(Submodel submodel, String submodelIdShort) throws IllegalArgumentException {
                if (submodel.getIdShort().equals(submodelIdShort))
                        return true;
                return false;
        }

        public AASDataTransferObject createAASDataTransferObject(String sender) {

                AASDataTransferObject dto = new AASDataTransferObject();
                dto.setSender(sender);
                dto.setAssetIDshort(this.getAssetIDShort());
                dto.setAssetID(this.getAssetID());

                Nameplate nameplate = transferNameplateSubmodel();

                TechnicalData technicalData = transferTechnicalDataSubmodel();

                CarbonFootprint carbonFootprint = new CarbonFootprint();
                Submodel certainSubmodel = this.getSubmodelOfIdShort("CarbonFootprint");

                List<ProductCarbonFootprint> listProductCarbonFootprints = new ArrayList<>();
                List<TransportCarbonFootprint> listTransportCarbonFootprints = new ArrayList<>();

                certainSubmodel.getSubmodelElements().stream()
                                .filter(element -> element instanceof SubmodelElementCollection)
                                .map(element -> (SubmodelElementCollection) element)
                                .filter(element -> element.getIdShort().startsWith("ProductCarbonFootprint"))
                                .forEach(smcPCF -> {
                                        String smcPCFID = smcPCF.getIdShort();
                                        ProductCarbonFootprint productCarbonFootprint = transferPCF_CarbonFootprintSubmodel(
                                                        smcPCFID);
                                        listProductCarbonFootprints.add(productCarbonFootprint);
                                });

                certainSubmodel.getSubmodelElements().stream()
                                .filter(element -> element instanceof SubmodelElementCollection)
                                .map(element -> (SubmodelElementCollection) element)
                                .filter(element -> element.getIdShort().startsWith("TransportCarbonFootprint"))
                                .forEach(smcTCF -> {

                                        String smcTCFID = smcTCF.getIdShort();
                                        TransportCarbonFootprint transportCarbonFootprint = transferTCF_CarbonFootprint(
                                                        smcTCFID);

                                        listTransportCarbonFootprints.add(transportCarbonFootprint);
                                });

                carbonFootprint.setProductCarbonFootprint(listProductCarbonFootprints);
                carbonFootprint.setTransportCarbonFootprint(listTransportCarbonFootprints);

                Submodels submodels = new Submodels();
                submodels.setNameplate(nameplate);
                submodels.setTechnicalData(technicalData);
                submodels.setCarbonFootprint(carbonFootprint);
                dto.setSubmodels(submodels);

                return dto;
        }

        private Nameplate transferNameplateSubmodel() {

                String submodelIdShort = "Nameplate";

                Nameplate nameplate = new Nameplate();
                nameplate.setURIOfTheProduct(this.getProperty(submodelIdShort,
                                DataElementType.URI_OF_THE_PRODUCT));
                nameplate.setManufacturerName(this.getMultilanguageProperty(submodelIdShort,
                                DataElementType.MANUFACTURER_NAME).get(0).getText());
                nameplate.setSerialNumber(this.getProperty(submodelIdShort,
                                DataElementType.SERIAL_NUMBER));
                nameplate.setYearOfConstruction(this.getProperty(submodelIdShort,
                                DataElementType.YEAR_OF_CONSTRUCTION));
                nameplate.setDateOfManufacture(this.getProperty(submodelIdShort,
                                DataElementType.DATE_OF_MANUFACTURE));

                return nameplate;

        }

        private TechnicalData transferTechnicalDataSubmodel() {

                String submodelIdShort = "TechnicalData";

                TechnicalData technicalData = new TechnicalData();
                technicalData.setManufacturerOrderCode(this.getProperty(submodelIdShort,
                                DataElementType.MANUFACTURER_ORDER_CODE, "GeneralInformation"));
                return technicalData;

        }

        private ProductCarbonFootprint transferPCF_CarbonFootprintSubmodel(String pcfShortId) {

                String submodelIdShort = "CarbonFootprint";

                ProductCarbonFootprint productCarbonFootprint = new ProductCarbonFootprint();
                productCarbonFootprint
                                .setReferableAssetID(this.getReferenceElement(submodelIdShort,
                                                DataElementType.PCF_ASSET_REFERENCE,
                                                pcfShortId));
                productCarbonFootprint.setPcfCalculationMethod(this.getProperty(
                                submodelIdShort,
                                DataElementType.PCF_CALCULATION_METHOD, pcfShortId));
                productCarbonFootprint.setPcfCO2eq(this.getProperty(
                                submodelIdShort, DataElementType.PCFCO2EQ, pcfShortId));
                productCarbonFootprint.setPcfQuantityOfMeasureForCalculation(this.getProperty(
                                submodelIdShort,
                                DataElementType.PCF_QUANTITY_OF_MEASURE_FOR_CALCULATION,
                                pcfShortId));
                productCarbonFootprint.setPcfReferenceValueForCalculation(
                                this.getProperty(submodelIdShort,
                                                DataElementType.PCF_REFERENCE_VALUE_FOR_CALCULATION,
                                                pcfShortId));
                productCarbonFootprint.setPcfLiveCyclePhase(this.getProperty(submodelIdShort,
                                DataElementType.PCF_LIVE_CYCLE_PHASE, pcfShortId));
                productCarbonFootprint.setPcfDescription(this.getProperty(submodelIdShort,
                                DataElementType.PCF_ASSET_DESCRIPTION, pcfShortId));
                productCarbonFootprint.setPcfHandoverStreet(this.getProperty(submodelIdShort,
                                DataElementType.STREET, pcfShortId,
                                "PCFGoodsAddressHandover"));
                productCarbonFootprint.setPcfHandoverNumber(this.getProperty(submodelIdShort,
                                DataElementType.HOUSENUMBER, pcfShortId,
                                "PCFGoodsAddressHandover"));
                productCarbonFootprint.setPcfHandoverCity(this.getProperty(submodelIdShort,
                                DataElementType.CITYTOWN, pcfShortId,
                                "PCFGoodsAddressHandover"));
                productCarbonFootprint.setPcfHandoverZIP(this.getProperty(submodelIdShort,
                                DataElementType.ZIPCODE, pcfShortId,
                                "PCFGoodsAddressHandover"));
                productCarbonFootprint.setPcfHandoverCountry(this.getProperty(submodelIdShort,
                                DataElementType.COUNTRY, pcfShortId,
                                "PCFGoodsAddressHandover"));
                productCarbonFootprint
                                .setPcfHandoverLatitude(this.getProperty(submodelIdShort,
                                                DataElementType.LATITUDE, pcfShortId,
                                                "PCFGoodsAddressHandover"));
                productCarbonFootprint.setPcfHandoverLongitude(
                                this.getProperty(submodelIdShort,
                                                DataElementType.LONGITUDE, pcfShortId,
                                                "PCFGoodsAddressHandover"));

                return productCarbonFootprint;
        }

        private TransportCarbonFootprint transferTCF_CarbonFootprint(String tcfShortId) {

                String submodelIdShort = "CarbonFootprint";

                TransportCarbonFootprint transportCarbonFootprint = new TransportCarbonFootprint();
                transportCarbonFootprint.setTcfCalculationMethod(this.getProperty(
                                submodelIdShort,
                                DataElementType.TCF_CALCULATION_METHOD, tcfShortId));
                transportCarbonFootprint.setTcfCO2eq(this.getProperty(
                                submodelIdShort, DataElementType.TCFCO2EQ, tcfShortId));
                transportCarbonFootprint.setTcfQuantityOfMeasureForCalculation(this.getProperty(
                                submodelIdShort,
                                DataElementType.TCF_QUANTITY_OF_MEASURE_FOR_CALCULATION,
                                tcfShortId));
                transportCarbonFootprint.setTcfReferenceValueForCalculation(
                                this.getProperty(submodelIdShort,
                                                DataElementType.TCF_REFERENCE_VALUE_FOR_CALCULATION,
                                                tcfShortId));
                transportCarbonFootprint
                                .setTcfProcessesForGreenhouseGasEmissionInATransportService(
                                                this.getProperty(submodelIdShort,
                                                                DataElementType.TCF_PROCESSES_FOR_GREENHOUSE_GAS_EMISSION_IN_A_TRANSPORT_SERVICE,
                                                                tcfShortId));
                transportCarbonFootprint
                                .setTcfTakeoverStreet(this.getProperty(submodelIdShort,
                                                DataElementType.STREET, tcfShortId,
                                                "TCFGoodsTransportAddressTakeover"));
                transportCarbonFootprint
                                .setTcfTakeoverNumber(this.getProperty(submodelIdShort,
                                                DataElementType.HOUSENUMBER, tcfShortId,
                                                "TCFGoodsTransportAddressTakeover"));
                transportCarbonFootprint.setTcfTakeoverCity(this.getProperty(submodelIdShort,
                                DataElementType.CITYTOWN, tcfShortId,
                                "TCFGoodsTransportAddressTakeover"));
                transportCarbonFootprint.setTcfTakeoverZIP(this.getProperty(submodelIdShort,
                                DataElementType.ZIPCODE, tcfShortId,
                                "TCFGoodsTransportAddressTakeover"));
                transportCarbonFootprint
                                .setTcfTakeoverCountry(this.getProperty(submodelIdShort,
                                                DataElementType.COUNTRY, tcfShortId,
                                                "TCFGoodsTransportAddressTakeover"));
                transportCarbonFootprint
                                .setTcfTakeoverLatitude(this.getProperty(submodelIdShort,
                                                DataElementType.LATITUDE, tcfShortId,
                                                "TCFGoodsTransportAddressTakeover"));
                transportCarbonFootprint
                                .setTcfTakeoverLongitude(this.getProperty(submodelIdShort,
                                                DataElementType.LONGITUDE, tcfShortId,
                                                "TCFGoodsTransportAddressTakeover"));

                transportCarbonFootprint
                                .setTcfHandoverStreet(this.getProperty(submodelIdShort,
                                                DataElementType.STREET, tcfShortId,
                                                "TCFGoodsTransportAddressHandover"));
                transportCarbonFootprint
                                .setTcfHandoverNumber(this.getProperty(submodelIdShort,
                                                DataElementType.HOUSENUMBER, tcfShortId,
                                                "TCFGoodsTransportAddressHandover"));
                transportCarbonFootprint.setTcfHandoverCity(this.getProperty(submodelIdShort,
                                DataElementType.CITYTOWN, tcfShortId,
                                "TCFGoodsTransportAddressHandover"));
                transportCarbonFootprint.setTcfHandoverZIP(this.getProperty(submodelIdShort,
                                DataElementType.ZIPCODE, tcfShortId,
                                "TCFGoodsTransportAddressHandover"));
                transportCarbonFootprint
                                .setTcfHandoverCountry(this.getProperty(submodelIdShort,
                                                DataElementType.COUNTRY, tcfShortId,
                                                "TCFGoodsTransportAddressHandover"));
                transportCarbonFootprint
                                .setTcfHandoverLatitude(this.getProperty(submodelIdShort,
                                                DataElementType.LATITUDE, tcfShortId,
                                                "TCFGoodsTransportAddressHandover"));
                transportCarbonFootprint
                                .setTcfHandoverLongitude(this.getProperty(submodelIdShort,
                                                DataElementType.LONGITUDE, tcfShortId,
                                                "TCFGoodsTransportAddressHandover"));

                return transportCarbonFootprint;
        }

}
