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

import java.nio.charset.StandardCharsets;
import java.security.NoSuchAlgorithmException;
import java.text.ParseException;
import java.util.Base64;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.google.gson.Gson;
import com.softwareag.aasservice.data.DataType;
import com.softwareag.aasservice.mysql.dao.AASUploadRepository;
import com.softwareag.aasservice.mysql.dao.APIKeyRepository;
import com.softwareag.aasservice.mysql.entity.AASUpload;
import com.softwareag.aasservice.mysql.entity.APIKey;
import com.softwareag.aasservice.mysql.response.RESTResponse;
import com.softwareag.aasservice.mysql.spec.AASUploadSpecifications;
import com.softwareag.aasservice.service.APIKeyService;
import com.softwareag.aasservice.service.AASUpload.AASUploadValidator;
import com.softwareag.aasservice.utils.Constants;
import com.softwareag.aasservice.utils.DateConverter;
import com.softwareag.aasservice.utils.SHA256;

@RestController
@RequestMapping("/api")
public class AASUploadController {

    @Autowired
    private AASUploadRepository uploadRepository;

    @Autowired
    private APIKeyService apiKeyService;

    /**
     * Behandelt einen POST-Anforderung zum Hochladen einer Asset Administration
     * Shell.
     *
     * @param data    Das Byte-Array, das die Daten der AAS enthält.
     * @param apiKey  Der API-Schlüssel
     * @param assetId Die assetID des Assets, die der assetID des hochgeladene AAS
     *                entspricht.
     * @param format  Das Format der AAS (json/aasx).
     * @return Eine ResponseEntity, die den Status und die Nachricht der
     *         Upload-Aktion enthält.
     * @throws NoSuchAlgorithmException
     */
    @PostMapping("/upload")
    public ResponseEntity<String> uploadAAS(@RequestBody byte[] data,
            @RequestHeader("apiKey") String apiKey, @RequestParam("assetId") String assetId,
            @RequestParam String format) throws NoSuchAlgorithmException {
        Gson gson = new Gson();
        try {

            String sender = apiKeyService.getSenderByAPIKey(apiKey);
            if (sender == null)
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(gson.toJson(new RESTResponse(false, "Invalid API Key!")));

            if (uploadRepository.findByAssetId(assetId).size() > 0)
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(gson.toJson(new RESTResponse(false,
                                "The specified AssetID already exists!")));

            DataType dataType = DataType.getDataTypeByString(format);

            if (!AASUploadValidator.isValidAAS(data, assetId, dataType))
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(gson.toJson(new RESTResponse(false,
                                "The uploaded file is not a valid AAS or does not match the specified data type! Make sure that the specified AssetId is equal to the AssetId of the AAS!")));

            insertAASToDatabase(data, assetId, sender, dataType);
            return ResponseEntity
                    .ok(gson.toJson(new RESTResponse(true, "Asset Administration Shell uploaded successfully!")));

        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(gson.toJson(new RESTResponse(false, "An error occured while processing the request!")));
        }
    }

    /**
     * Behandelt einen DELETE-Anforderung zum Löschen einer Asset Administration
     * Shell.
     * 
     * @param apiKey  Der API-Schlüssel des autorisierten Benutzers.
     * @param assetId Die ID der zu löschenden AAS, die im Header gesendet wird.
     * @return Eine ResponseEntity, die den Status und die Nachricht der
     *         Delete-Aktion enthält.
     */
    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteAAS(@RequestHeader("apiKey") String apiKey,
            @RequestParam(value = "assetId") String assetId) {
        Gson gson = new Gson();


        try {

            String sender = apiKeyService.getSenderByAPIKey(apiKey);
            if (sender == null)
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(gson.toJson(new RESTResponse(false, "Invalid API Key!")));

            List<AASUpload> uploads = uploadRepository.findByAssetId(assetId);
            if (uploads.isEmpty())
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(gson.toJson(new RESTResponse(false,
                                "Asset Administration Shell with provided AssetID not found!")));

            AASUpload aasUpload = uploads.get(0);

            if (!sender.equals(Constants.MASTER) && !aasUpload.getSender().equals(sender))
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(gson.toJson(new RESTResponse(false, "You are not authorized to delete this asset!")));

            uploadRepository.delete(aasUpload);

            return ResponseEntity
                    .ok(gson.toJson(new RESTResponse(true, "Asset Administration Shell deleted successfully!")));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(gson.toJson(new RESTResponse(false, "An error occurred while processing the request!")));
        }
    }

    /**
     * Behandelt eine GET-Anforderung zum Abrufen aller hochgeladenen AAS.
     *
     * @param apiKey   Der API-Schlüssel für die Autorisierung der Anfrage.
     *                 (Optional: Wenn erforderlich, sollte im Header "apiKey"
     *                 enthalten sein.)
     * @param pageable Die Paginierungsinformationen.
     * @return Eine Page-Instanz, die eine Liste der AASUpload-Objekte enthält.
     */
    @GetMapping("/getAll")
    public Page<AASUpload> getAll(@RequestHeader(name = "apiKey", required = false) String apiKey, Pageable pageable) {
        return uploadRepository.findAll(pageable);
    }

    /**
     * Behandelt eine GET-Anforderung zum Abrufen von AASUploads basierend auf
     * optionalen Filterkriterien.
     *
     * @param apiKey             Der API-Schlüssel für die Autorisierung der
     *                           Anfrage.
     *                           (Optional: Wenn erforderlich, sollte im Header
     *                           "apiKey" enthalten sein.)
     * @param assetId            Die Asset-ID, nach der gefiltert werden soll
     *                           (optional).
     * @param creationDateAfter  Das Datum, nach dem gefiltert werden soll, um
     *                           Uploads nach diesem Datum zu erhalten (optional).
     * @param creationDateBefore Das Datum, vor dem gefiltert werden soll, um
     *                           Uploads vor diesem Datum zu erhalten (optional).
     * @param sender             Der Absender, nach dem gefiltert werden soll
     *                           (optional).
     * @param type               Der Typ, nach dem gefiltert werden soll (json/aasx)
     *                           (optional).
     * @return Eine Liste von AASUpload-Objekten, die den angegebenen
     *         Filterkriterien entsprechen.
     */
    @GetMapping("/filter")
    public List<AASUpload> getAASUploads(@RequestHeader(name = "apiKey", required = false) String apiKey,
            @RequestParam(required = false) String assetId,
            @RequestParam(required = false) String creationDateAfter,
            @RequestParam(required = false) String creationDateBefore,
            @RequestParam(required = false) String sender,
            @RequestParam(required = false) String format) {
        Specification<AASUpload> spec = Specification.where(null);

        Date afterCreationDate = null;
        Date beforeCreationDate = null;
        try {
            if (creationDateAfter != null) {
                afterCreationDate = DateConverter.convertStringToDate(creationDateAfter);
            }
            if (creationDateBefore != null) {
                beforeCreationDate = DateConverter.convertStringToDate(creationDateBefore);
            }
        } catch (ParseException e) {
            return null;
        }

        if (assetId != null) {
            spec = spec.and(AASUploadSpecifications.assetIdContains(assetId));
        }
        if (afterCreationDate != null) {
            spec = spec.and(AASUploadSpecifications.creationDateAfter(afterCreationDate));
        }
        if (beforeCreationDate != null) {
            spec = spec.and(AASUploadSpecifications.creationDateBefore(beforeCreationDate));
        }
        if (sender != null) {
            spec = spec.and(AASUploadSpecifications.senderEquals(sender));
        }
        if (format != null) {
            spec = spec.and(AASUploadSpecifications.formatEquals(format));
        }

        return uploadRepository.findAll(spec);
    }

    /**
     * Fügt eine Asset Administration Shell in die Datenbank ein.
     *
     * @param data     Das Byte-Array, das die Daten der AAS enthält.
     * @param assetId  Die assetID des Assets.
     * @param sender   Der Absender, der die AAS hochlädt.
     * @param dataType Der Datentyp der AAS (json/aasx).
     */
    private void insertAASToDatabase(byte[] data, String assetId, String sender, DataType dataType) {

        AASUpload aasUpload = new AASUpload();
        aasUpload.setLastEditDate(new Date());

        switch (dataType) {

            case AASX:
                String base64String = Base64.getEncoder().encodeToString(data);
                aasUpload.setUpload(base64String);
                break;

            case JSON:
                String jsonString = new String(data, StandardCharsets.UTF_8);
                aasUpload.setUpload(jsonString);
                break;

            default:
                break;
        }
        aasUpload.setAssetId(assetId);
        aasUpload.setSender(sender);
        aasUpload.setType(dataType.getFormatString());
        uploadRepository.save(aasUpload);

    }

}
