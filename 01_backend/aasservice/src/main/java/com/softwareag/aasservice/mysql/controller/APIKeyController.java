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

package com.softwareag.aasservice.mysql.controller;

import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.apache.poi.ss.formula.functions.T;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.google.gson.Gson;
import com.jayway.jsonpath.Option;
import com.softwareag.aasservice.mysql.dao.APIKeyRepository;
import com.softwareag.aasservice.mysql.entity.APIKey;
import com.softwareag.aasservice.mysql.response.RESTResponse;
import com.softwareag.aasservice.utils.Constants;
import com.softwareag.aasservice.utils.SHA256;

@RestController
@RequestMapping("/apikey")
public class APIKeyController {

    @Autowired
    private APIKeyRepository repository;

    /**
     * Erstellt einen neuen API-Schlüssel für den angegebenen Besitzer und speichert
     * ihn in der Datenbank.
     * 
     * @param apiKey Der API-Schlüssel für die Authentifizierung der Anfrage.
     * @param owner  Der Besitzer des neuen API-Schlüssels.
     * @return Eine ResponseEntity mit einem JSON-String, der den Status der
     *         Operation und den generierten Schlüssel enthält.
     * @throws NoSuchAlgorithmException Wenn der verwendete Algorithmus für die
     *                                  Hash-Funktion nicht gefunden wird.
     */
    @PostMapping("/create")
    public ResponseEntity<String> create(@RequestHeader("apiKey") String apiKey, @RequestParam String owner)
            throws NoSuchAlgorithmException {
        Gson gson = new Gson();

        if (!isValidMasterKey(apiKey))
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(gson.toJson(new RESTResponse(false, "Invalid API Key!")));

        UUID uuid = UUID.randomUUID();
        String key = uuid.toString();
        Optional<APIKey> optionalAPIKey = repository.findByOwner(owner);

        if (optionalAPIKey.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(gson.toJson(new RESTResponse(false, "The owner \"" + owner
                            + "\" already exists. Please delete the existing entry to generate a new API key.")));
        } else {
            insertKeyToDatabase(owner, SHA256.hashString(key));
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(gson.toJson(new RESTResponse(true, key)));

        }

    }

    @GetMapping("/getAll")
    public ResponseEntity<String> getAll(@RequestHeader(name = "apiKey", required = false) String apiKey) {
        Gson gson = new Gson();

        if (!isValidMasterKey(apiKey)) {
            HttpHeaders headers = new HttpHeaders();
            headers.add("Error-Message", "Invalid Admin Key!");
            RESTResponse errorResponse = new RESTResponse(false, "Invalid Admin Key!");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).headers(headers).body(gson.toJson(errorResponse));
        } else {
            List<APIKey> apiKeys = repository.findAll();
            return ResponseEntity.status(HttpStatus.ACCEPTED).body(gson.toJson(apiKeys));
        }
    }

    @PutMapping("/rename")
    public ResponseEntity<String> rename(@RequestHeader(name = "apiKey", required = false) String apiKey,
            @RequestParam String oldOwnerName,
            @RequestParam String newOwnerName) {
        Gson gson = new Gson();

        if (!isValidMasterKey(apiKey)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(gson.toJson(new RESTResponse(false, "Invalid API Key!")));
        }

        Optional<APIKey> optionalApiKeyEntry = repository.findByOwner(oldOwnerName);
        if (!optionalApiKeyEntry.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(gson.toJson(new RESTResponse(false, "Old owner name not found!")));
        }

        APIKey oldApiKey = optionalApiKeyEntry.get();
        APIKey newApiKey = new APIKey();
        newApiKey.setOwner(newOwnerName);
        newApiKey.setKeyHash(oldApiKey.getKeyHash());

        repository.save(newApiKey);
        repository.delete(oldApiKey);

        return ResponseEntity.status(HttpStatus.OK)
                .body(gson.toJson(new RESTResponse(true, "Owner name updated successfully!")));
    }


    @PutMapping("/regenerate")
    public ResponseEntity<String> regenerate(@RequestHeader(name = "apiKey", required = false) String apiKey,
            @RequestParam String owner) throws NoSuchAlgorithmException {
        Gson gson = new Gson();

        if (!isValidMasterKey(apiKey)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(gson.toJson(new RESTResponse(false, "Invalid API Key!")));
        }

        Optional<APIKey> optionalApiKeyEntry = repository.findByOwner(owner);
        if (!optionalApiKeyEntry.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(gson.toJson(new RESTResponse(false, "Owner name not found!")));
        }

        APIKey apiKeyEntry = optionalApiKeyEntry.get();

        UUID uuid = UUID.randomUUID();
        String key = uuid.toString();

        apiKeyEntry.setKeyHash(SHA256.hashString(key));
        repository.save(apiKeyEntry);


        return ResponseEntity.status(HttpStatus.OK)
                    .body(gson.toJson(new RESTResponse(true, key)));
    }

    /**
     * Fügt den API-Schlüssel des Besitzers in die Datenbank ein.
     * 
     * @param owner   Der Besitzer des API-Schlüssels.
     * @param keyHash Der gehashte Wert des API-Schlüssels.
     */
    private void insertKeyToDatabase(String owner, String keyHash) {

        APIKey apiKey = new APIKey();
        apiKey.setOwner(owner);
        apiKey.setKeyHash(keyHash);
        repository.save(apiKey);
    }

    /**
     * Entfernt den API-Schlüssel des angegebenen Besitzers aus der Datenbank.
     * 
     * @param apiKey Der API-Schlüssel für die Authentifizierung der Anfrage.
     * @param owner  Der Besitzer des zu entfernenden API-Schlüssels.
     * @return Eine ResponseEntity mit einem JSON-String, der den Status der
     *         Operation enthält.
     * @throws NoSuchAlgorithmException Wenn der verwendete Algorithmus für die
     *                                  Hash-Funktion nicht gefunden wird.
     */
    @DeleteMapping("/delete")
    public ResponseEntity<String> remove(@RequestHeader("apiKey") String apiKey, @RequestParam String owner)
            throws NoSuchAlgorithmException {
        Gson gson = new Gson();

        if (!isValidMasterKey(apiKey))
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(gson.toJson(new RESTResponse(false, "Invalid API Key!")));

        boolean removed = removeKeyFromDatabase(owner);

        if (removed)
            return ResponseEntity.ok(gson.toJson(new RESTResponse(true, "API Key removed successfully.")));
        else
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(gson.toJson(new RESTResponse(false, "Key not found for owner: " + owner)));
    }

    /**
     * Entfernt den API-Schlüssel des angegebenen Besitzers aus der Datenbank.
     * 
     * @param owner Der Besitzer des zu entfernenden API-Schlüssels.
     * @return {@code true}, wenn der API-Schlüssel erfolgreich entfernt wurde,
     *         andernfalls {@code false}.
     */
    private boolean removeKeyFromDatabase(String owner) {
        Optional<APIKey> optionalAPIKey = repository.findByOwner(owner);

        if (optionalAPIKey.isPresent()) {
            repository.delete(optionalAPIKey.get());
            return true;
        } else {
            return false;
        }
    }

    /**
     * Überprüft, ob der bereitgestellte API-Schlüssel der Master-Schlüssel ist.
     *
     * @param key Der zu überprüfende API-Schlüssel.
     * @return true, wenn der Schlüssel gültig ist.
     */
    private boolean isValidMasterKey(String key) {
        return Constants.MASTER_API_KEY.equals(key);
    }

}
