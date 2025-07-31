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

package com.softwareag.aasservice.mysql.dao;

import java.util.List;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;

import com.softwareag.aasservice.mysql.entity.AASUpload;

import jakarta.transaction.Transactional;

@Transactional
public interface AASUploadRepository extends JpaRepository<AASUpload, Long> {
    
    List<AASUpload> findAll(Specification<AASUpload> spec);
    
    List<AASUpload> findBySender(String sender);
    List<AASUpload> findByAssetId(String assetId);

    void deleteByAssetId(String assetId);
}
