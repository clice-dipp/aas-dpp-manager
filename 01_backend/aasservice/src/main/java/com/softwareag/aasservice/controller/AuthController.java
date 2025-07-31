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

package com.softwareag.aasservice.controller;

import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.google.gson.Gson;
import com.softwareag.aasservice.data.UserCredentials;
import com.softwareag.aasservice.mysql.controller.AASUploadController;
import com.softwareag.aasservice.mysql.response.RESTResponse;
import com.softwareag.aasservice.service.APIKeyService;;;


@RestController
@RequestMapping("/api")
public class AuthController {

    @Autowired
    private APIKeyService apiKeyService;


    @CrossOrigin(origins = {"http://localhost:3000", "https://demo.clice-dipp.de"})
    @PostMapping("/auth/login")
    public ResponseEntity<String> login(@RequestBody UserCredentials credentials) {
        Gson gson = new Gson();

        try {
            String validUser = apiKeyService.getSenderByAPIKey(credentials.getPassword());
            if(validUser != null && validUser.equals(credentials.getUsername())) {
                Map<String, String> response = new HashMap<>();
                response.put("token", validUser);
                return ResponseEntity.ok(gson.toJson(response));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(gson.toJson(new RESTResponse(false, "Unauthorized: Invalid username or password.")));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(gson.toJson(new RESTResponse(false, "An error occurred while processing the request!")));
        }
    }
}

