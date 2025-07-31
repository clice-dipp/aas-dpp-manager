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

package com.softwareag.aasservice.data.repositories;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.Charset;
import java.util.UUID;

import org.eclipse.digitaltwin.aas4j.v3.dataformat.core.DeserializationException;
import org.eclipse.digitaltwin.aas4j.v3.dataformat.core.SerializationException;
import org.eclipse.digitaltwin.aas4j.v3.dataformat.json.JsonDeserializer;
import org.eclipse.digitaltwin.aas4j.v3.dataformat.json.JsonSerializer;
import org.eclipse.digitaltwin.aas4j.v3.model.Environment;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.softwareag.aasservice.service.EnvironmentService;
import com.softwareag.aasservice.utils.Constants;

public class JsonDataRepository implements DataRepository {

    public EnvironmentService read(byte[] data) {
        return readJSON(new ByteArrayInputStream(data));
    }

    public EnvironmentService read(File inputFile) {
        System.out.println("Reading from file: " + inputFile);

        try {
            return readJSON(new FileInputStream(inputFile));
        } catch (FileNotFoundException e) {
            System.err.println("Error: The specified file was not found. Please check the file path and try again.");
            e.printStackTrace();
            return null;
        }

    }

    public EnvironmentService readJSON(InputStream in) {
        try {
            JsonDeserializer deserializer = new JsonDeserializer();

            Environment env = deserializer.read(in, Environment.class);
            in.close();
            return new EnvironmentService(env);
        } catch (FileNotFoundException e) {
            System.err.println("Error: The specified file was not found. Please check the file path and try again.");
            e.printStackTrace();
            return null;
        } catch (DeserializationException e) {
            System.err.println("Error: There is a DeserializationException.");
            return null;
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    public void write(EnvironmentService env, String outputFilename) {
        File outputFile = new File(Constants.OUTPUT_DIRECTORY + "/" + outputFilename);
        System.out.println("Writing to the file: " + outputFile);

        try {
            JsonSerializer serializer = new JsonSerializer();
            String jsonString = serializer.write(env.getEnvironmentInstance());

            try (FileWriter fileWriter = new FileWriter(outputFile)) {

                fileWriter.write(jsonString);
                System.out.println("Successfully wrote on output file (" + outputFilename + ")");

            } catch (IOException e) {
                System.err.println("Failed to write on the output file.");
                e.printStackTrace();
            }
        } catch (SerializationException e1) {
            e1.printStackTrace();
        }
    }

    public byte[] write(EnvironmentService env) {
        try {
            JsonSerializer serializer = new JsonSerializer();
            String jsonString = serializer.write(env.getEnvironmentInstance());
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

            try {
                outputStream.write(jsonString.getBytes());
                return outputStream.toByteArray();
            } catch (IOException e) {
                System.err.println("Failed to write to byte array.");
                e.printStackTrace();
                return null;
            } finally {
                try {
                    outputStream.close();
                } catch (IOException e) {
                    // Ignore, closing
                }
            }
        } catch (SerializationException e) {
            System.err.println("Error serializing AssetAdministrationShellEnvironment");
            e.printStackTrace();
            return null;
        }
    }

}
