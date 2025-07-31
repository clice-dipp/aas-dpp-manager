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


public enum SubmodelElementCollectionType {
    /* CarbonFootprint */
    PRODUCT_CARBON_FOOTPRINT("ProductCarbonFootprint"),
    PCF_GOODS_ADDRESS_HANDOVER("PCFGoodsAddressHandover"),
    TRANSPORT_CARBON_FOOTPRINT("TransportCarbonFootprint"),
    TCF_GOODS_TRANSPORT_ADDRESS_TAKEOVER("TCFGoodsTransportAddressTakeover"),
    TCF_GOODS_TRANSPORT_ADDRESS_HANDOVER("TCFGoodsTransportAddressHandover"),

    /* TechnicalData */
    GENERAL_INFORMATION("GeneralInformation"),
    PRODUCT_CLASSIFICATIONS("ProductClassifications"),
    PRODUCT_CLASSIFICATION_ITEM("ProductClassificationItem"),
    TECHNICAL_PROPERTIES("TechnicalProperties"),
    MAIN_SECTION("MainSection"),
    SUB_SECTION("SubSection"),
    FURTHER_INFORMATION("FurtherInformation"),

    /* Nameplate */
    CONTACT_INFORMATION("ContactInformation"),
    PHONE("Phone"),
    FAX("Fax"),
    EMAIL("Email"),
    IP_COMMUNICATION("IPCommunication{00}"),
    MARKINGS("Markings"),
    MARKING("Marking"),
    EXPLOSION_SAFETIES("ExplosionSafeties"),
    EXPLOSION_SAFETIY("ExplosionSafety"),
    AMBIENT_CONDITIONS("AmbientConditions"),
    PROCESS_CONDITIONS("ProcessConditions"),
    EXTERNAL_ELECTRICAL_CIRCUIT("ExternalElectricalCircuit"),
    SAFETY_RELATED_PROPERTIES_FOR_PASSIVE_BEHAVIOUR("SafetyRelatedPropertiesForPassiveBehaviour"),
    SAFETY_RELATED_PROPERTIES_FOR_ACTIVE_BEHAVIOUR("SafetyRelatedPropertiesForActiveBehaviour"),
    ASSET_SPECIFIC_PROPERTIES("AssetSpecificProperties"),
    GUIDELINE_SPECIFIC_PROPERTIES("GuidelineSpecificProperties{00}");

    private String idShort;

    SubmodelElementCollectionType(String idShort) {
        this.idShort = idShort;
    }

    public String getIdShort() {
        return idShort;
    }

}
