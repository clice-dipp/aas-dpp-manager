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
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.poi.openxml4j.exceptions.InvalidFormatException;

// import org.eclipse.digitaltwin.aas4j.v3.dataformat.SerializationException;
import org.eclipse.digitaltwin.aas4j.v3.dataformat.aasx.AASXDeserializer;
import org.eclipse.digitaltwin.aas4j.v3.dataformat.aasx.AASXSerializer;
import org.eclipse.digitaltwin.aas4j.v3.dataformat.core.DeserializationException;
import org.eclipse.digitaltwin.aas4j.v3.dataformat.xml.XmlDeserializer;
import org.eclipse.digitaltwin.aas4j.v3.model.Environment;
import org.eclipse.digitaltwin.aas4j.v3.model.Submodel;

import com.softwareag.aasservice.service.EnvironmentService;
import com.softwareag.aasservice.utils.Constants;
import com.softwareag.modelling.SubmodelTemplate;

public class AASXDataRepository implements DataRepository {

    public EnvironmentService readAASX(Class<? extends SubmodelTemplate>[] submodelTemplateClasses, File inputFile) {
        try {
            FileInputStream fileInputStream = new FileInputStream(inputFile);
            AASXDeserializer deserializer = new AASXDeserializer(fileInputStream);
            String xmlString = removeEmptyTags(deserializer.getXMLResourceString());

            Environment environment = new XmlDeserializer().read(xmlString);

            EnvironmentService envService = new EnvironmentService(environment);

            for (Class<? extends SubmodelTemplate> templateClass : submodelTemplateClasses) {

                try {
                    Constructor<? extends SubmodelTemplate> constructor = templateClass
                            .getDeclaredConstructor(EnvironmentService.class);

                    SubmodelTemplate submodel = constructor.newInstance(envService);

                    if(submodel.isValid())
                        envService.submodelTemplates.put(templateClass, submodel);
                } catch (InstantiationException | IllegalAccessException | NoSuchMethodException
                        | InvocationTargetException e) {
                    e.printStackTrace();
                }
                
            }

            fileInputStream.close();
            return envService;

        } catch (FileNotFoundException e) {
            System.err.println("Error: The specified file was not found. Please check the file path and try again.");
            e.printStackTrace();
            return null;
        } catch (InvalidFormatException e) {
            System.err.println("Error: There is an InvalidFormatException.");
            e.printStackTrace();
            return null;
        } catch (IOException e) {
            System.err.println("Error: There is an IOException.");
            e.printStackTrace();
            return null;
        } catch (DeserializationException e1) {
            // TODO Auto-generated catch block
            e1.printStackTrace();
            return null;
        } 
    }

    /* OBEN FÜR HAUSARBEIT */

    public EnvironmentService read(byte[] data) {
        return readAASX(new ByteArrayInputStream(data));
    }

    public EnvironmentService read(File inputFile) {
        System.out.println("Reading from file: " + inputFile);

        try {
            return readAASX(new FileInputStream(inputFile));
        } catch (FileNotFoundException e) {
            System.err.println("Error: The specified file was not found. Please check the file path and try again.");
            e.printStackTrace();
            return null;
        }

    }

    private EnvironmentService readAASX(InputStream in) {
        try {
            AASXDeserializer deserializer = new AASXDeserializer(in);
            String xmlString = removeEmptyTags(deserializer.getXMLResourceString());

            Environment environment = new XmlDeserializer().read(xmlString);

            EnvironmentService envService = new EnvironmentService(environment);
            // envService.setFilelist(deserializer.getRelatedFiles());
            in.close();
            return envService;

        } catch (FileNotFoundException e) {
            System.err.println("Error: The specified file was not found. Please check the file path and try again.");
            e.printStackTrace();
            return null;
        } catch (InvalidFormatException e) {
            System.err.println("Error: There is an InvalidFormatException.");
            e.printStackTrace();
            return null;
        } catch (IOException e) {
            System.err.println("Error: There is an IOException.");
            e.printStackTrace();
            return null;
        } catch (DeserializationException e) {
            System.err.println("Error: There is a DeserializationException.");
            // e.printStackTrace();
            return null;
        }
    }

    public void write(EnvironmentService env, String outputFilename) {
        File folder = new File(Constants.OUTPUT_DIRECTORY + "/" + env.getAssetIDShort());
        // if (!folder.exists())
        //     folder.mkdir();
        File outputFile = new File(Constants.OUTPUT_DIRECTORY + "/" + outputFilename);

        try {
            // List<InMemoryFile> fileList = new ArrayList<>();
            // byte[] fileContent = Files.readAllBytes(Path.of(Constants.OUTPUT_DIRECTORY +
            // "/Stahl/Stahl.aasx"));
            // fileList.add(new InMemoryFile(fileContent, Constants.OUTPUT_DIRECTORY +
            // "/Stahl/Stahl.aasx"));

            try (OutputStream fileOutputStream = new FileOutputStream(outputFile)) {
                AASXSerializer serializer = new AASXSerializer();
                serializer.write(env.getEnvironmentInstance(), env.getFileList(), fileOutputStream);
                System.out.println("Successfully wrote on output file (" + outputFilename + ")");
            } catch (IOException e) {
                // Handle the exceptions here
                System.err.println("Failed to write on the output file.");
                e.printStackTrace(); // Printing the stack trace
            }
        } catch (Exception ex) {
            // ex.printStackTrace();
        }
    }

    public byte[] write(EnvironmentService env) {
        try {
            AASXSerializer serializer = new AASXSerializer();
            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            serializer.write(env.getEnvironmentInstance(), env.getFileList(), byteArrayOutputStream);

            return byteArrayOutputStream.toByteArray();

        } catch (Exception ex) {
            return null;
        }
    }

    private String removeEmptyTags(String xml) {
        Pattern pattern = Pattern.compile("<[^>/]+\\s*/>");
        Matcher matcher = pattern.matcher(xml);
        StringBuffer sb = new StringBuffer();
        while (matcher.find()) {
            matcher.appendReplacement(sb, "");
        }
        matcher.appendTail(sb);
        return sb.toString();
    }

}
