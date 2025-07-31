/**
*	 Copyright 2025 Software GmbH (previously Software AG)
*    
*    Licensed under the Apache License, Version 2.0 (the "License");
*    you may not use this file except in compliance with the License.
*    You may obtain a copy of the License at
*    
*      http://www.apache.org/licenses/LICENSE-2.0
*    
*    Unless required by applicable law or agreed to in writing, software
*    distributed under the License is distributed on an "AS IS" BASIS,
*    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*    See the License for the specific language governing permissions and
*    limitations under the License.
*/

package com.softwareag.modelling;

import java.util.Collection;

import org.eclipse.digitaltwin.aas4j.v3.model.Submodel;
import org.eclipse.digitaltwin.aas4j.v3.model.SubmodelElement;
import org.eclipse.digitaltwin.aas4j.v3.model.SubmodelElementCollection;

import com.softwareag.aasservice.service.EnvironmentService;

public class TemplateValidator {


    public static boolean isTemplateValid(EnvironmentService templateEnvironmentService, EnvironmentService environmentService, String templateName) {

        if(!containsTemplateIdShort(environmentService, templateName))
            return false;

        Submodel currentSubmodel = environmentService.getSubmodels().stream()
                                        .map(submodel -> (Submodel) submodel)
                                        .filter(submodel -> submodel.getIdShort().contains(templateName))
                                        .findFirst()
                                        .orElseThrow();

        if(templateEnvironmentService.getSubmodels().size()!=1)
            return false;

        Submodel templateSubmodel = templateEnvironmentService.getSubmodels().get(0);


        return isElementsEqual(templateSubmodel.getSubmodelElements(), currentSubmodel.getSubmodelElements());
    }

    private static boolean isElementsEqual(Collection<SubmodelElement> templateElements, Collection<SubmodelElement> currentElements) {

        for(SubmodelElement templateElement : templateElements) {

            SubmodelElement containingElement = containsElement(templateElement, currentElements);
            if(containingElement == null)
                return false;

            if(templateElement instanceof SubmodelElementCollection)
                if(!isElementsEqual(((SubmodelElementCollection)templateElement).getValue(), ((SubmodelElementCollection)containingElement).getValue()))
                    return false;

        }

        return true;

        
    }

    private static SubmodelElement containsElement(SubmodelElement submodelElement, Collection<SubmodelElement> submodelElements) {

        for(SubmodelElement element : submodelElements) {
            if(element.getSemanticId().equals(submodelElement.getSemanticId()))
                return element;
        }

        return null;

    }

    private static boolean containsTemplateIdShort(EnvironmentService environmentService, String templateName) {
        return environmentService.getSubmodels().stream()
                .filter(submodel -> submodel.getIdShort().contains(templateName))
                .count() == 1;
    }


}
