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

import { ToastContainer } from "react-bootstrap";

/**
 * Represents data related to AAS (Asset Administration Shell) and provides
 * methods to calculate CO2 equivalent emissions and interpret various data keys.
 *
 * @class AASData
 */
class AASData {
    /**
     * Creates an instance of AASData.
     * 
     * @param {Object} data - The data object containing properties for the AASData instance.
     * @param {string} data.sender - The sender information.
     * @param {string} data.assetIDShort - Short asset ID.
     * @param {string} data.assetID - Full asset ID.
     * @param {Object} data.submodels - Submodels containing carbon footprint data.
     */
    constructor(data) {
        this.sender = data.sender;
        this.assetIDShort = data.assetIDShort;
        this.assetID = data.assetID;
        this.submodels = data.submodels;
    }

    /**
     * Calculates the total CO2 equivalent emissions from the given submodel.
     *
     * @param {string} from - Specifies which submodel to calculate CO2 equivalent emissions from.
     *   Can be 'all', 'pcf', or 'tcf'.
     * @returns {number} The total CO2 equivalent emissions.
     */
    sumCO2eq(from) {
        let totalCO2eq = 0;
        const containsCO2eq = str => str.includes("CO2eq");

        /**
         * Recursively calculates CO2 equivalent emissions from an object.
         *
         * @param {Object} obj - The object to be traversed for CO2eq keys.
         */
        const calculate = (obj) => {
            for (let key in obj) {
                if (typeof obj[key] === "object" && obj[key] !== null) {
                    calculate(obj[key]);
                } else {
                    if (containsCO2eq(key) && !isNaN(parseFloat(obj[key]))) {
                        totalCO2eq += parseFloat(obj[key]);
                    }
                }
            }
        };

        switch (from) {
            case 'all':
                calculate(this.submodels.CarbonFootprint);
                break;
            case 'pcf':
                calculate(this.submodels.CarbonFootprint.ProductCarbonFootprint);
                break;
            case 'tcf':
                calculate(this.submodels.CarbonFootprint.TransportCarbonFootprint);
                break;
            default:
                break;
        }

        return totalCO2eq;
    }

    /**
     * Calculates the total CO2 equivalent emissions for a specific life cycle phase.
     *
     * @param {string} queryParameter - The life cycle phase to filter CO2 equivalent emissions.
     * @returns {number} The total CO2 equivalent emissions for the specified life cycle phase.
     */
    sumCO2eqPerLifeCycle(queryParameter) {
        let totalCO2eq = 0;
        const containsCO2eq = str => str.includes("CO2eq");

        /**
         * Calculates CO2 equivalent emissions for a specific life cycle phase from an array of items.
         *
         * @param {Object[]} obj - The array of items to be filtered and summed.
         * @param {string} queryParameter - The life cycle phase to filter by.
         */
        const calculate = (obj, queryParameter) => {
            for (let i = 0; i < obj.length; i++) {
                const item = obj[i];
                if (item.PCFLiveCyclePhase === queryParameter) {
                    totalCO2eq += parseFloat(item.PCFCO2eq);
                }
            }
        };
        calculate(this.submodels.CarbonFootprint.ProductCarbonFootprint, queryParameter);
        return totalCO2eq;
    }

    /**
     * Calculates the CO2 equivalent emissions per item based on the total emissions and quantity of measure.
     *
     * @returns {string} The CO2 equivalent emissions per item, or 'no quantity' if quantity is not defined.
     */
    CO2eqPerItem() {
        let result = this.sumCO2eq('all');
        let quantityOfMeasure = parseFloat(this.submodels.CarbonFootprint.ProductCarbonFootprint[0].PCFQuantityOfMeasureForCalculation);
        if (!isNaN(quantityOfMeasure)) {
            result = (result / quantityOfMeasure).toFixed(2);
            return result;
        } else {
            return 'no quantity';
        }
    }

    /**
     * Gets the reference value for PCF calculation based on a key.
     *
     * @param {string} key - The key to look up in the reference value map.
     * @returns {string} The reference value associated with the key, or 'not defined' if the key is not found.
     */
    static getPCFReferenceValueForCalculation(key) {
        const key_map = {
            "0173-1#07-ABZ596#001": "g",
            "0173-1#07-ABZ597#001": "kg",
            "0173-1#07-ABZ598#001": "t",
            "0173-1#07-ABZ599#001": "ml",
            "0173-1#07-ABZ600#001": "l",
            "0173-1#07-ABZ601#001": "cbm",
            "0173-1#07-ABZ602#001": "qm",
            "0173-1#07-ABZ603#001": "piece",
            '': "not defined"
        };

        return key_map[key] || "not defined";
    }

    /**
     * Gets the PCF live cycle phase description based on a key.
     *
     * @param {string} key - The key to look up in the live cycle phase map.
     * @returns {string} The description of the live cycle phase associated with the key, or 'not defined' if the key is not found.
     */
    static getPCFLiveCyclePhase(key) {
        const key_map = {
            "0173-1#07-ABU208#001": "A1 – raw material supply (and upstream production)",
            "0173-1#07-ABU209#001": "A2 - cradle-to-gate transport to factory",
            "0173-1#07-ABU210#001": "A3 - production",
            "0173-1#07-ABU211#001": "A4 - transport to final destination",
            "0173-1#07-ABU212#001": "B1 – usage phase",
            "0173-1#07-ABV498#001": "B2 – maintenance",
            "0173-1#07-ABV497#001": "B3 - repair",
            "0173-1#07-ABV499#001": "B5 – update/upgrade, refurbishing",
            "0173-1#07-ABV500#001": "B6 – usage energy consumption",
            "0173-1#07-ABV501#001": "B7 – usage water consumption",
            "0173-1#07-ABV502#001": "C1 – reassembly",
            "0173-1#07-ABU213#001": "C2 – transport to recycler",
            "0173-1#07-ABV503#001": "C3 – recycling, waste treatment",
            "0173-1#07-ABV504#001": "C4 – landfill",
            "0173-1#07-ABU214#001": "D - reuse",
            "0173-1#07-ABZ789#001": "A1-A3 – combined A1, A2, and A3 processes",
            "": "not defined"
        };

        return key_map[key] || "not defined";
    }

    /**
     * Gets the PCF calculation method based on a key.
     *
     * @param {string} key - The key to look up in the calculation method map.
     * @returns {string} The PCF calculation method associated with the key, or 'not defined' if the key is not found.
     */
    static getPCFCalculationMethod(key) {
        const key_map = {
            '0173-1#07-ABU223#002': 'EN 15804',
            '0173-1#07-ABU221#002': 'GHG Protocol',
            '0173-1#07-ABU222#002': 'IEC TS 63058',
            '0173-1#07-ABV505#002': 'ISO 14040',
            '0173-1#07-ABV506#002': 'ISO 14044',
            '0173-1#07-ABU218#002': 'ISO 14067',
            '0173-1#07-ACA792#001': 'IEC 63366',
            '0173-1#07-ABU220#002': 'PEP Ecopassport',
            '': 'not defined'
        };

        return key_map[key] || 'not defined';
    }

    /**
     * Gets the TCF processes for greenhouse gas emission in a transport service based on a key.
     *
     * @param {string} key - The key to look up in the TCF processes map.
     * @returns {string} The TCF process associated with the key, or 'not defined' if the key is not found.
     */
    static getTCFProcessesForGreenhouseGasEmissionInATransportService(key) {
        const key_map = {
            '0173-1#07-ABU216#001': 'WTT - Well-to-Tank',
            '0173-1#07-ABU215#001': 'TTW - Tank-to-Wheel',
            '0173-1#07-ABU217#001': 'WTW - Well-to-Wheel'
        };

        return key_map[key] || "not defined";
    }
}

export default AASData;
