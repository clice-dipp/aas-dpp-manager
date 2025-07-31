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

package com.softwareag.aasservice.mysql.spec;

import java.util.Date;

import org.springframework.data.jpa.domain.Specification;

import com.softwareag.aasservice.mysql.entity.AASUpload;

public class AASUploadSpecifications {
    
    public static Specification<AASUpload> assetIdContains(String assetId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.like(root.get("assetId"), assetId);
    }
    
    public static Specification<AASUpload> creationDateAfter(Date date) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.greaterThan(root.get("creationDate"), date);
    }
    
    public static Specification<AASUpload> creationDateBefore(Date date) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.lessThan(root.get("creationDate"), date);
    }

    public static Specification<AASUpload> senderEquals(String sender) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("sender"), sender);
    }
    
    public static Specification<AASUpload> formatEquals(String format) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("type"), format);
    }

}
