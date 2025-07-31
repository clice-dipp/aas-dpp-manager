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

package com.softwareag.modelling.models;

import java.io.File;
import java.lang.reflect.Field;
import java.util.Collection;
import java.util.List;

import org.eclipse.digitaltwin.aas4j.v3.model.AdministrativeInformation;
import org.eclipse.digitaltwin.aas4j.v3.model.AssetAdministrationShell;
import org.eclipse.digitaltwin.aas4j.v3.model.EmbeddedDataSpecification;
import org.eclipse.digitaltwin.aas4j.v3.model.Extension;
import org.eclipse.digitaltwin.aas4j.v3.model.LangStringNameType;
import org.eclipse.digitaltwin.aas4j.v3.model.LangStringTextType;
import org.eclipse.digitaltwin.aas4j.v3.model.ModellingKind;
import org.eclipse.digitaltwin.aas4j.v3.model.Property;
import org.eclipse.digitaltwin.aas4j.v3.model.Qualifier;
import org.eclipse.digitaltwin.aas4j.v3.model.Reference;
import org.eclipse.digitaltwin.aas4j.v3.model.Submodel;
import org.eclipse.digitaltwin.aas4j.v3.model.SubmodelElement;
import org.eclipse.digitaltwin.aas4j.v3.model.SubmodelElementCollection;

import com.softwareag.aasservice.data.repositories.AASXDataRepository;
import com.softwareag.aasservice.service.EnvironmentService;
import com.softwareag.aasservice.utils.Constants;
import com.softwareag.modelling.SubmodelInitializer;
import com.softwareag.modelling.SubmodelTemplate;
import com.softwareag.modelling.TemplateValidator;

public class CarbonFootprintTemplate implements SubmodelTemplate {

    private final String TEMPLATE_NAME = "CarbonFootprint";

    public Submodel CARBONFOOTPRINT;

    public SubmodelElementCollection PRODUCT_CARBON_FOOTPRINT;
    public Property PRODUCT_CARBON_FOOTPRINT_PCF_CALCULATION_METHOD;
    public Property PRODUCT_CARBON_FOOTPRINT_PCF_CO2EQ;

    public SubmodelElementCollection TRANSPORT_CARBON_FOOTPRINT;
    public Property TRANSPORT_CARBON_FOOTPRINT_PUBLICATION_DATE;
    public Property TRANSPORT_CARBON_FOOTPRINT_EXPIRATION_DATE;

    private EnvironmentService templateEnvironmentService = new AASXDataRepository()
            .read(new File(Constants.OUTPUT_DIRECTORY + "/" + TEMPLATE_NAME + ".aasx"));

    public EnvironmentService environmentService;

    private boolean isValid = true;


    public CarbonFootprintTemplate(EnvironmentService environmentService) throws IllegalArgumentException, IllegalAccessException, NoSuchFieldException, SecurityException {

        if (!TemplateValidator.isTemplateValid(templateEnvironmentService, environmentService, TEMPLATE_NAME)){
            isValid = false;
            return;
        }

        this.environmentService = environmentService;

        SubmodelInitializer.initSubmodel(this, environmentService, TEMPLATE_NAME);
        //System.out.println(PRODUCT_CARBON_FOOTPRINT_PCF_CO2EQ.getValue());
    }

    @Override
    public boolean isValid() {
        return isValid;
    }


}
