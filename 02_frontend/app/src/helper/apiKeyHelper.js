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

//

export async function  fetchApiKeys(){
    try {
        const response = await fetch(`${process.env.REACT_APP_APIKEY_URL}/getAll`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'apiKey': process.env.REACT_APP_MASTER_KEY
            }
        });

        if (!response.ok) {
            const errorMessage = response.headers.get('Error-Message') || 'Failed to fetch API keys';
            throw new Error(errorMessage);
        }

        const apiKeys = await response.json();
        return apiKeys;
    } catch (error) {
        console.error('Error fetching API keys:', error);
        return [];
    }
};


export async function deleteApiKey(owner){
    // This should be replaced with a real API call
    console.log(`Deleting API key with id: ${owner}`);
    try {
        const response = await fetch(`${process.env.REACT_APP_APIKEY_URL}/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'apiKey': process.env.REACT_APP_MASTER_KEY
            },
            body: new URLSearchParams({
                owner: owner
            })
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            const errorMessage = errorResponse.message || "Unkown error occurred";
            throw new Error(errorMessage);
        }
    } catch (error) {
        const alertElement = document.createElement('div');
        alertElement.classList.add('alert', 'alert-danger', 'mb-0', 'mt-3');
        alertElement.textContent = error.message;

        const alertContainer = document.getElementById('alert-container') || document.body;
        alertContainer.appendChild(alertElement);

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        setTimeout(() => alertElement.remove(), 10000);
    }

};

export async function addApiKey(newUsername){
    try {
        if (!newUsername) {
            throw new Error("Please enter a new username!");
        }
        const response = await fetch(`${process.env.REACT_APP_APIKEY_URL}/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'apiKey': process.env.REACT_APP_MASTER_KEY
            },
            body: new URLSearchParams({
                owner: newUsername
            })
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            const errorMessage = errorResponse.message || "Unknown error occurred";
            throw new Error(errorMessage);
        } else {
            const data = await response.json();
            return { owner: newUsername, keyHash: data.message };
        }

    } catch (error) {
        const alertElement = document.createElement('div');
        alertElement.classList.add('alert', 'alert-danger', 'mb-0', 'mt-3');
        alertElement.textContent = error.message;

        const alertContainer = document.getElementById('alert-container') || document.body;
        alertContainer.appendChild(alertElement);

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        setTimeout(() => alertElement.remove(), 10000);
    }

    return null;
};

export async function renameApiKey(oldOwnerName, newOwnerName) {
    try{

        const response = await fetch(`${process.env.REACT_APP_APIKEY_URL}/rename`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'apiKey': process.env.REACT_APP_MASTER_KEY
            },
            body: new URLSearchParams({
                oldOwnerName: oldOwnerName,
                newOwnerName: newOwnerName
            })
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            const errorMessage = errorResponse.message || "Unknown error occurred";
            throw new Error(errorMessage);
        } else {
            const data = await response.json();
            return true;
        }


    } catch (error) {

    }
        
};

export async function regenerateApiKey(owner) {
    try{

        const response = await fetch(`${process.env.REACT_APP_APIKEY_URL}/regenerate`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'apiKey': process.env.REACT_APP_MASTER_KEY
            },
            body: new URLSearchParams({
                owner: owner,
            })
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            const errorMessage = errorResponse.message || "Unknown error occurred";
            throw new Error(errorMessage);
        } else {
            const data = await response.json();
            debugger;
            return { owner: owner, keyHash: data.message };
        }


    } catch (error) {

    }   
};