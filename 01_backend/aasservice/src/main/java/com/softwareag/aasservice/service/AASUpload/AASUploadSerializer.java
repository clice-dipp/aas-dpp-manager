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
import java.util.Date;

import com.softwareag.aasservice.data.DataType;
import com.softwareag.aasservice.data.repositories.AASXDataRepository;
import com.softwareag.aasservice.data.repositories.JsonDataRepository;
import com.softwareag.aasservice.mysql.entity.AASUpload;
import com.softwareag.aasservice.service.EnvironmentService;

public class AASUploadSerializer {

    public static AASUpload serialize(EnvironmentService environmentService, DataType dataType, String sender, AASUpload aasUpload) {
        switch (dataType) {
            case AASX:
                return serializeAASX(aasUpload, environmentService, sender);
            case JSON:
                return serializeJSON(aasUpload, environmentService, sender);
            default:
                throw new IllegalArgumentException("Unsupported data type: " + dataType);
        }
    }

    public static AASUpload serialize(EnvironmentService environmentService, DataType dataType, String sender) {
        return serialize(environmentService, dataType, sender, new AASUpload());
    }

    private static AASUpload serializeAASX(AASUpload aasUpload, EnvironmentService service, String sender) {
        AASXDataRepository aasxDataRepository = new AASXDataRepository();
        byte[] data = aasxDataRepository.write(service);

        populateAASUpload(aasUpload, service, sender, data, "aasx");
        return aasUpload;
    }

    private static AASUpload serializeJSON(AASUpload aasUpload, EnvironmentService service, String sender) {
        JsonDataRepository jsonDataRepository = new JsonDataRepository();
        byte[] data = jsonDataRepository.write(service);

        populateAASUpload(aasUpload, service, sender, data, "json");
        return aasUpload;
    }

    private static void populateAASUpload(AASUpload aasUpload, EnvironmentService service, String sender, byte[] data, String type) {
        aasUpload.setLastEditDate(new Date());
        aasUpload.setUpload(type.equals("json") ? new String(data, StandardCharsets.UTF_8) : Base64.getEncoder().encodeToString(data));
        aasUpload.setAssetId(service.getAssetID());
        aasUpload.setSender(sender);
        aasUpload.setType(type);
    }

}
