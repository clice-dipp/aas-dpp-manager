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

import java.security.NoSuchAlgorithmException;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.softwareag.aasservice.mysql.dao.APIKeyRepository;
import com.softwareag.aasservice.mysql.entity.APIKey;
import com.softwareag.aasservice.utils.Constants;
import com.softwareag.aasservice.utils.SHA256;

@Service
public class APIKeyService {

    @Autowired
    private APIKeyRepository keyRepository;


    /**
     * Sucht den Sender anhand des API-Schlüssels in der Datenbank.
     *
     * @param key Der API-Schlüssel des Senders.
     * @return Der Name des Senders, der den API-Schlüssel besitzt. Null, wenn kein
     *         entsprechender Sender gefunden wurde.
     * @throws NoSuchAlgorithmException Wenn der Algorithmus für die Hash-Funktion
     *                                  nicht gefunden wird.
     */
    public String getSenderByAPIKey(String key) throws NoSuchAlgorithmException {
        if (Constants.MASTER_API_KEY.equals(key)) {
            return Constants.MASTER;
        }
        String keyHash = SHA256.hashString(key);
        Optional<APIKey> apiKey = keyRepository.findByKeyHash(keyHash);
        if (apiKey.isPresent()) {
            return apiKey.get().getOwner();
        }
        return null;
    }
}
