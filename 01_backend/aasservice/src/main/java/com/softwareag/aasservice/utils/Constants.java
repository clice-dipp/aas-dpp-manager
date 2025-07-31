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

package com.softwareag.aasservice.utils;

import io.github.cdimascio.dotenv.Dotenv;

public class Constants {

    private static final Dotenv dotenv = Dotenv.configure().load();

    public static final String MASTER_API_KEY = dotenv.get("MASTER_KEY");
    public static final String MASTER = "softwareag";

    public static final String WORKING_DIRECTORY = System.getProperty("user.dir");
    public static final String RESOURCE_DIRECTORY = WORKING_DIRECTORY + "/resources";
    // public static final String RESOURCE_DIRECTORY = WORKING_DIRECTORY + "/templates";
    public static final String OUTPUT_DIRECTORY = WORKING_DIRECTORY;
    
}
