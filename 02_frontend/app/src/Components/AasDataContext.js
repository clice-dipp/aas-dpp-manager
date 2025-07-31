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
import React, { createContext, useState, useEffect } from 'react';

// Components import
import LoadingAnimation from './views/overview/LoadingAnimation.js';
import ErrorModal from './general/ErrorModal.js';

// Data Class imports
import AASData from './AasData.js';




export const AasDataContext = createContext();

export const AasDataProvider = ({ children }) => {
  const [allAas, setAllAas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAllAas() {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/aas`);
        const data = await response.json();
        const aasData = data.map(item => new AASData(item));
        setAllAas(aasData);
      } catch (error) {
        setError(error);
        console.error('Error fetching aas data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllAas();
  }, []);


  const updateAasData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/aas`);
      const data = await response.json();
      const aasData = data.map(item => new AASData(item));
      setAllAas(aasData);
    } catch (error) {
      setError(error);
      console.error('Error updating aas data:', error);
    }
  }


  if (loading) {
    return <LoadingAnimation />;
  }

  if (error) {
    return <ErrorModal />;
  }

  return (
    <AasDataContext.Provider value={{ allAas, loading, updateAasData}}>
      {children}
    </AasDataContext.Provider>
  );


};
