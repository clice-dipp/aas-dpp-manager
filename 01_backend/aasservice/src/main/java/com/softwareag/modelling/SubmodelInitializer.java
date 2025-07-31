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

package com.softwareag.modelling;

import java.lang.reflect.Field;

import org.eclipse.digitaltwin.aas4j.v3.model.Submodel;
import org.eclipse.digitaltwin.aas4j.v3.model.SubmodelElement;
import org.eclipse.digitaltwin.aas4j.v3.model.SubmodelElementCollection;

import com.softwareag.aasservice.service.EnvironmentService;

public class SubmodelInitializer {

    public static void initSubmodel(SubmodelTemplate submodelTemplate, EnvironmentService environmentService, String templateName) throws IllegalArgumentException, IllegalAccessException, NoSuchFieldException, SecurityException {
        Class<?> clazz = submodelTemplate.getClass();
        Field field = clazz.getDeclaredField(templateName.toUpperCase());

        Submodel model = environmentService.getSubmodels().stream()
                .map(submodel -> (Submodel) submodel)
                .filter(submodel -> submodel.getIdShort().contains(templateName))
                .findFirst()
                .orElseThrow();

        field.set(submodelTemplate, model);
    
        try {
            for (SubmodelElement submodelElement : model.getSubmodelElements()) {
                initSubmodelElement(submodelTemplate, submodelElement, "");
            }
        } catch (IllegalArgumentException | IllegalAccessException e) {
            e.printStackTrace();
        }
    }
    
    private static void initSubmodelElement(SubmodelTemplate submodelTemplate, SubmodelElement submodelElement, String prefix) throws IllegalAccessException {
        Class<?> clazz = submodelTemplate.getClass();
        Field[] fields = clazz.getDeclaredFields();
        for (Field field : fields) {
            String fieldName = field.getName().replaceAll("_", "").replace(prefix, "");
            if (fieldName.equals(submodelElement.getIdShort().toUpperCase())) {
                field.set(submodelTemplate, submodelElement);
            }
        }
    
        if (submodelElement instanceof SubmodelElementCollection) {
            SubmodelElementCollection collection = (SubmodelElementCollection) submodelElement;
            String newPrefix = submodelElement.getIdShort().toUpperCase();
            for (SubmodelElement collectionElement : collection.getValue()) {
                initSubmodelElement(submodelTemplate, collectionElement, newPrefix);
            }
        }
    }
    
}
