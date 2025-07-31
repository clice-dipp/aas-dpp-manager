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

package com.softwareag.aasservice;

import java.io.File;

import org.eclipse.digitaltwin.aas4j.v3.model.Submodel;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.softwareag.aasservice.data.models.DataElementType;
import com.softwareag.aasservice.data.repositories.AASXDataRepository;
import com.softwareag.aasservice.service.EnvironmentService;
import com.softwareag.aasservice.utils.Constants;
import com.softwareag.modelling.SubmodelTemplate;
import com.softwareag.modelling.models.CarbonFootprintTemplate;

@SpringBootApplication
public class AasServiceApplication {

	public static void main(String[] args) {

		/*Class<? extends SubmodelTemplate>[] templateClasses = new Class[]{CarbonFootprintTemplate.class};
	  	AASXDataRepository aasxDataRepository = new AASXDataRepository();
		EnvironmentService environmentService = aasxDataRepository.readAASX(templateClasses, new File(Constants.OUTPUT_DIRECTORY+"/FullAASTemplate2.aasx")); 
		System.out.println(((CarbonFootprintTemplate)environmentService.submodelTemplates.get(CarbonFootprintTemplate.class)).PRODUCT_CARBON_FOOTPRINT_PCF_CO2EQ.getValue()); */
		
		/*environmentService.updateMultilanguageProperty("MusterAG", "Nameplate", DataElementType.MANUFACTURER_NAME);
		System.out.println(environmentService.getMultilanguageProperty("Nameplate", DataElementType.MANUFACTURER_NAME).get(0).getText()); */
		SpringApplication.run(AasServiceApplication.class, args);
	}



}
