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

// Function to fetch all AAS data from the API
export async function fetchAllAas() {
    console.log("Data Loader Overview!")
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/aas`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching environmentServices:', error);
        return [];
    }
};



// Function to fetch a single AAS data object based on the provided URL parameter
export async function fetchOneAasEdit({ request }) {
    console.log("fetch one aas");
    const aas_url = new URL(request.url).searchParams.get('aas_url');
    try {
        // Fetch data from the API
        const apiEndpoint = new URL(`${process.env.REACT_APP_API_URL}/aas/get`);
        apiEndpoint.searchParams.set("aas_url", aas_url);
        const response = await fetch(apiEndpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {

        throw new Error('AAS with the id was not found.');
    }
}

// Function to fetch a single AAS data object based on the provided URL parameter
export async function fetchOneAasShow({ request }) {
    const aas_url = new URL(request.url).searchParams.get('aas_url');
    try {
        // Fetch data from the API
        const apiEndpoint = new URL(`${process.env.REACT_APP_API_URL}/aas/get`);
        apiEndpoint.searchParams.set("aas_url", aas_url);
        const response = await fetch(apiEndpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {

        throw new Error('AAS with the id was not found.');
    }
}


// Function to submit AAS from data to the backend
export async function AASSubmission(data, navigate, updateAasData, token) {

    // Map over the arrays to transform the data structure
    const productCarbonFootprint = data.PCFCalculationMethod.map((item, index) => ({
        ReferableAssetID: ensureValidString(data.ReferableAssetID[index]) || "",
        PCFCalculationMethod: ensureValidString(item) || "",
        PCFCO2eq: ensureValidString(data.PCFCO2eq[index]) || "",
        PCFQuantityOfMeasureForCalculation: ensureValidString(data.PCFQuantityOfMeasureForCalculation[index]) || "",
        PCFReferenceValueForCalculation: ensureValidString(data.PCFReferenceValueForCalculation[index]) || "",
        PCFLiveCyclePhase: ensureValidString(data.PCFLiveCyclePhase[index]) || "",
        PCFDescription: ensureValidString(data.PCFDescription[index]) || "",
        ExplanatoryStatement: ensureValidString(data.ExplanatoryStatement[index]) || "",
        PCFHandoverStreet: ensureValidString(data.PCFHandoverStreet[index]) || "",
        PCFHandoverNumber: ensureValidString(data.PCFHandoverNumber[index]) || "",
        PCFHandoverCity: ensureValidString(data.PCFHandoverCity[index]) || "",
        PCFHandoverZIP: ensureValidString(data.PCFHandoverZIP[index]) || "",
        PCFHandoverCountry: ensureValidString(data.PCFHandoverCountry[index]) || "",
        PCFHandoverLatitude: ensureValidString(data.PCFHandoverLatitude[index]) || "",
        PCFHandoverLongitude: ensureValidString(data.PCFHandoverLongitude[index]) || ""
    }));

    const transportCarbonFootprint = data.TCFCalculationMethod.map((item, index) => ({
        TCFCalculationMethod: ensureValidString(item),
        TCFCO2eq: ensureValidString(data.TCFCO2eq[index]),
        TCFQuantityOfMeasureForCalculation: ensureValidString(data.TCFQuantityOfMeasureForCalculation[index]),
        TCFReferenceValueForCalculation: ensureValidString(data.TCFReferenceValueForCalculation[index]),
        TCFProcessesForGreenhouseGasEmissionInATransportService: ensureValidString(data.TCFProcessesForGreenhouseGasEmissionInATransportService[index]),
        TCFTakeoverStreet: ensureValidString(data.TCFTakeoverStreet[index]),
        TCFTakeoverNumber: ensureValidString(data.TCFTakeoverNumber[index]),
        TCFTakeoverCity: ensureValidString(data.TCFTakeoverCity[index]),
        TCFTakeoverZIP: ensureValidString(data.TCFTakeoverZIP[index]),
        TCFTakeoverCountry: ensureValidString(data.TCFTakeoverCountry[index]),
        TCFTakeoverLatitude: ensureValidString(data.TCFTakeoverLatitude[index]),
        TCFTakeoverLongitude: ensureValidString(data.TCFTakeoverLongitude[index]),
        TCFHandoverStreet: ensureValidString(data.TCFHandoverStreet[index]),
        TCFHandoverNumber: ensureValidString(data.TCFHandoverNumber[index]),
        TCFHandoverCity: ensureValidString(data.TCFHandoverCity[index]),
        TCFHandoverZIP: ensureValidString(data.TCFHandoverZIP[index]),
        TCFHandoverCountry: ensureValidString(data.TCFHandoverCountry[index]),
        TCFHandoverLatitude: ensureValidString(data.TCFHandoverLatitude[index]),
        TCFHandoverLongitude: ensureValidString(data.TCFHandoverLongitude[index])
    }));


    // Construct the final object
    const transformedData = {
        sender: ensureValidString(token),
        assetIDShort: ensureValidString(data.assetIDShort),
        assetID: ensureValidString(data.assetID),
        submodels: {
            Nameplate: {
                URIOfTheProduct: ensureValidString(data.URIOfTheProduct),
                ManufacturerName: ensureValidString(data.ManufacturerName),
                SerialNumber: ensureValidString(data.SerialNumber),
                YearOfConstruction: ensureValidString(data.YearOfConstruction),
                DateOfManufacture: ensureValidString(data.DateOfManufacture)
            },
            TechnicalData: {
                ManufacturerOrderCode: ensureValidString(data.ManufacturerOrderCode),
                ManufacturerLogo: "", // Placeholder values, you can assign actual values here if available
                ProductImage: "" // Placeholder values, you can assign actual values here if available
            },
            CarbonFootprint: {
                ProductCarbonFootprint: productCarbonFootprint,
                TransportCarbonFootprint: transportCarbonFootprint
            }
        }
    };

    // Make a POST request to your backend with the transformedData
    fetch(`${process.env.REACT_APP_API_URL}/aas/submission`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(transformedData)
    })
        .then(response => {
            if (response.ok) {
                console.log('Success: Data submitted successfully.');
                updateAasData();
                navigate('/aas');
            } else {
                // Handle non-OK response status
                console.error('Error:', response.statusText);
                alert(`Error: ${response.statusText}`);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert(`Error: ${error.message}`);
        });
};


// Function to ensure a valid string value
function ensureValidString(value) {
    if (value === null || value === undefined) {
        return ""; // Convert null or undefined to an empty string
    } else if (typeof value !== 'string') {
        // Convert non-string values to string
        return String(value);
    }
    return value;
}


// Function to handle AAS file import
export async function aasImport(event) {
    const file = event.target.files[0];

    if (file) {
        const formData = new FormData();
        formData.append('file', file);
        fetch(`${process.env.REACT_APP_API_URL}/aas/import`, {
            method: 'POST',
            body: formData
        })
            .then(response => {
                if (response.ok) {
                    window.location.reload();
                } else {
                    return response.text().then(text => {
                        throw new Error(text);
                    });
                }
            })
            .then(data => {
                console.log(data);
            })
            .catch(error => {
                const errorText = error.message || 'Upload failed!';

                // Create and display Bootstrap alert bar
                const alertElement = document.createElement('div');
                alertElement.classList.add('alert', 'alert-danger', 'mb-0', 'mt-3');
                alertElement.textContent = errorText;

                const alertContainer = document.getElementById('alert-container') || document.body;
                alertContainer.appendChild(alertElement);
                setTimeout(() => alertElement.remove(), 3000);
            });
    }
};

// Function to trigger AAS data export from the backend
export async function aasExport(data) {

    debugger;

    for (const selectedItem of data.selectedItems) {
        const requestData = {
            exportFormat: data.exportFormat,
            selectedItem: [selectedItem]
        };

        fetch(`${process.env.REACT_APP_API_URL}/aas/export`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        })
            .then(async response => {

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                } else {
                    const filename = response.headers.get('filenames');
                    const blob = await response.blob();
                    return { blob, filename };
                }

            })
            .then(({ blob, filename }) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            })
            .catch(error => {
                // Handle errors
                console.error('There was a problem with the download:', error);
            });
    }
}


