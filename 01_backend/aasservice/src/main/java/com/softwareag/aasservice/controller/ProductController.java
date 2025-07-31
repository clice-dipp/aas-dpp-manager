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

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.http.MediaType;

import com.softwareag.aasservice.data.AASDataTransferObject;
import com.softwareag.aasservice.data.AASExportDataTransfer;
import com.softwareag.aasservice.data.DataType;
import com.softwareag.aasservice.data.repositories.AASXDataRepository;
import com.softwareag.aasservice.data.repositories.DataRepository;
import com.softwareag.aasservice.data.repositories.JsonDataRepository;
import com.softwareag.aasservice.mysql.dao.AASUploadRepository;
import com.softwareag.aasservice.mysql.entity.AASUpload;
import com.softwareag.aasservice.service.DownloadService;
import com.softwareag.aasservice.service.EnvironmentService;
import com.softwareag.aasservice.service.AASUpload.AASUploadDeserializier;
import com.softwareag.aasservice.service.AASUpload.AASUploadSerializer;
import com.softwareag.aasservice.utils.Constants;

import jakarta.servlet.http.HttpServletResponse;

import org.apache.tomcat.util.http.fileupload.impl.FileSizeLimitExceededException;

/**
 * REST controller handling API requests related to AAS.
 */
@RestController
@RequestMapping("/api")
public class ProductController {

    @Autowired
    private AASUploadRepository repository;

    /**
     * Retrieves all AAS (Asset Administration Shell) data.
     * 
     * @return List of AASDataTransferObject representing AAS data.
     */
    @GetMapping("/aas")
    public List<AASDataTransferObject> getAllAAS() {
        List<AASUpload> loadedAAS = repository.findAll();
        List<AASDataTransferObject> transferableAAS = new ArrayList<>();
        loadedAAS.forEach(upload -> {
            EnvironmentService envService = AASUploadDeserializier.deserialize(upload.getUpload(),
                    DataType.getDataTypeByString(upload.getType()));
            transferableAAS.add(envService.createAASDataTransferObject(upload.getSender()));
        });
        return transferableAAS;

    }

    /**
     * Retrieves AAS (Asset Administration Shell) data by ID.
     * 
     * @param aas_url The ID of the AAS.
     * @return ResponseEntity containing the AAS data if found, otherwise returns
     *         HttpStatus.NOT_FOUND.
     */
    @GetMapping("/aas/get")
    public ResponseEntity<List<AASDataTransferObject>> getAASById(@RequestParam String aas_url) {

        List<AASUpload> loadedAAS = repository.findByAssetId(aas_url);
        List<AASDataTransferObject> transferableAAS = new ArrayList<>();
        loadedAAS.forEach(upload -> {
            EnvironmentService envService = AASUploadDeserializier.deserialize(upload.getUpload(),
                    DataType.getDataTypeByString(upload.getType()));
            transferableAAS.add(envService.createAASDataTransferObject(upload.getSender()));
        });

        if (!transferableAAS.isEmpty()) {
            return new ResponseEntity<>(transferableAAS, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

    }

    /**
     * Deletes an AAS (Asset Administration Shell) entry by ID.
     * 
     * @param aas_url The ID of the AAS to delete.
     * @return ResponseEntity indicating success if deletion was successful,
     *         otherwise returns HttpStatus.NOT_FOUND.
     */
    @DeleteMapping("/aas/delete")
    public ResponseEntity<String> deleteAAS(@RequestParam String aas_url) {
        repository.deleteByAssetId(aas_url);
        return ResponseEntity.ok("Success: AAS with ID " + aas_url + " deleted");
    }

    /**
     * Submits AAS (Asset Administration Shell) data.
     * 
     * @param submissionData The AASDataTransferObject representing the submitted
     *                       AAS data.
     * @return ResponseEntity indicating success upon submission.
     */
    @PostMapping("/aas/submission")
    public ResponseEntity<String> submission(@RequestBody AASDataTransferObject submissionData) {

        EnvironmentService submittedEnvironmentService = submissionData.toEnvironmentService();

        AASUpload aasUpload = null;

        List<AASUpload> aasUploads = repository.findByAssetId(submittedEnvironmentService.getAssetID());

        if (aasUploads.size() == 0) {

            aasUpload = new AASUpload();

        } else if (aasUploads.size() == 1) {

            aasUpload = aasUploads.get(0);

        } else if (aasUploads.size() > 1 || aasUpload == null) {
            return ResponseEntity.ok("Something went wrong loading the AASUpload!");
        }

        aasUpload = AASUploadSerializer.serialize(submittedEnvironmentService, DataType.AASX,
                submissionData.getSender(),
                aasUpload);
        repository.save(aasUpload);

        return ResponseEntity.ok().build();
    }

    /**
     * Imports AAS (Asset Administration Shell) data from a file.
     * 
     * @param model The model.
     * @param file  The MultipartFile representing the file to import.
     * @return ResponseEntity indicating success upon successful import, or error
     *         messages otherwise.
     */
    @PostMapping("/aas/import")
    public ResponseEntity<String> importAAS(Model model, @RequestParam("file") MultipartFile file) {
        if (!file.isEmpty()) {
            try {
                File importedFile = convertMultipartFileToFile(file);
                String fileExtension = file.getOriginalFilename()
                        .substring(file.getOriginalFilename().lastIndexOf(".") + 1);

                if (!fileExtension.equals("aasx") && !fileExtension.equals("json")) {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body("Invalid File format");
                }

                DataRepository dataRepository = fileExtension.equals("json") ? new JsonDataRepository()
                        : new AASXDataRepository();

                EnvironmentService environmentService = dataRepository
                        .read(importedFile);

                String importedAssetID = environmentService.getAssetID();

                List<AASUpload> aasUploads = repository.findByAssetId(environmentService.getAssetID());

                if (aasUploads.size() > 0) {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body("File with same ID already existing!");

                }

                AASUpload aasUpload = AASUploadSerializer.serialize(environmentService, DataType.AASX,
                        Constants.MASTER);
                repository.save(aasUpload);

                return ResponseEntity.status(HttpStatus.OK).body("File uploaded successfully");
            } catch (FileSizeLimitExceededException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("File exceeds its maximum permitted size of 1048576 bytes");
            } catch (Exception ex) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("File upload failed.");
            }
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No file provided");
        }
    }

    /**
     * Exports selected AAS (Asset Administration Shell) data.
     * 
     * @param exportData The AASExportDataTransfer object containing export details.
     * @param response   The HttpServletResponse to handle the response.
     */
    @CrossOrigin(origins = { "http://localhost:3000", "https://demo.clice-dipp.de" }, exposedHeaders = { "filenames" })
    @PostMapping("/aas/export")
    public void exportAAS(@RequestBody AASExportDataTransfer exportData, HttpServletResponse response) {
        String filenames = "";

        DataRepository dataRepository = (exportData.getExportFormat().equals("json")) ? new JsonDataRepository()
                : new AASXDataRepository();

        for (String assetId : exportData.getSelectedItem()) {
            List<AASUpload> loadedAAS = repository.findByAssetId(assetId);

            for (AASUpload upload : loadedAAS) {
                EnvironmentService envService = AASUploadDeserializier.deserialize(upload.getUpload(),
                        DataType.getDataTypeByString(upload.getType()));

                String filename = envService.getAssetIDShort();
                String fileExtension = (exportData.getExportFormat().equals("json")) ? ".json" : ".aasx";
                filename += fileExtension;
                filenames += filename.toString() + ' ';

                try {
                    Path tempFilePath = Paths.get(filename);
                    dataRepository.write(envService, tempFilePath.toString());
                    response.setContentType(MediaType.APPLICATION_OCTET_STREAM_VALUE);

                    byte[] fileBytes = Files.readAllBytes(tempFilePath);

                    response.addHeader("filenames", filenames);

                    response.getOutputStream().write(fileBytes);

                    response.flushBuffer();

                    Files.deleteIfExists(tempFilePath);
                } catch (IOException e) {
                    e.printStackTrace();
                    // Handle exception
                }

            }

        }

    }

    /**
     * Converts a MultipartFile to a File.
     * 
     * @param multipartFile The MultipartFile to convert.
     * @return The converted File.
     * @throws IOException If an I/O error occurs.
     */
    private File convertMultipartFileToFile(MultipartFile multipartFile) throws IOException {
        File file = new File(multipartFile.getOriginalFilename());
        try (FileOutputStream fos = new FileOutputStream(file)) {
            fos.write(multipartFile.getBytes());
        }
        return file;
    }

    /**
     * Retrieves DataType from string representation.
     * 
     * @param format The string representation of the data format.
     * @return The corresponding DataType.
     */
    private DataType getDataTypeByString(String format) {
        if (format.equals("json")) {
            return DataType.JSON;
        } else if (format.equals("aasx")) {
            return DataType.AASX;
        }
        return null;
    }
}
