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

import { useEffect, useState } from 'react';

/**
 * Custom hook to manage a token in sessionStorage.
 *
 * This hook provides functionality to get, set, and store a token in the
 * session storage. The token is used to manage user authentication state
 * and is maintained in the component's state as well.
 *
 * @function useToken
 * @returns {Object} An object containing:
 * @returns {Function} setToken - A function to save the token to sessionStorage and update state.
 * @returns {string} token - The current token retrieved from sessionStorage.
 */
export default function useToken() {

  /**
   * Retrieves the token from sessionStorage.
   *
   * @function getToken
   * @returns {string|null} The token from sessionStorage or null if not found.
   */
  const getToken = () => {
    const tokenString = sessionStorage.getItem('token');
    return tokenString;
  };

  // Initialize state with the token from sessionStorage
  const [token, setToken] = useState(getToken());

  /**
   * Saves the provided token to sessionStorage and updates the state.
   *
   * @function saveToken
   * @param {string} userToken - The token to be saved to sessionStorage and state.
   */
  const saveToken = (userToken) => {
    sessionStorage.setItem('token', userToken);
    setToken(userToken);
  };

  return {
    setToken: saveToken, 
    token,
  };
}
