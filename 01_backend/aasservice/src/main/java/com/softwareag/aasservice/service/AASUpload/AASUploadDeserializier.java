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

package com.softwareag.aasservice.service.AASUpload;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

import com.softwareag.aasservice.data.DataType;
import com.softwareag.aasservice.data.repositories.AASXDataRepository;
import com.softwareag.aasservice.data.repositories.JsonDataRepository;
import com.softwareag.aasservice.service.EnvironmentService;

public class AASUploadDeserializier {

    public static EnvironmentService deserialize(String data, DataType dataType) {

        switch (dataType) {

            case AASX:
                return deserializeAASX(data);
            case JSON:
                return deserializeJSON(data);
            default:
                break;
        }

        return null;
    }

    private static EnvironmentService deserializeAASX(String data) {
        AASXDataRepository aasxDataRepository = new AASXDataRepository();
        return new EnvironmentService(aasxDataRepository.read(Base64.getDecoder().decode(data)));
    }

    private static EnvironmentService deserializeJSON(String data) {
        JsonDataRepository jsonDataRepository = new JsonDataRepository();
        return new EnvironmentService(jsonDataRepository.read(data.getBytes(StandardCharsets.UTF_8)));
    }

}
