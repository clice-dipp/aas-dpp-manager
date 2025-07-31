/* 
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

// React imports 
import React, { useEffect, useState } from "react";
import { Modal, Button, ListGroup, Form, Toast } from "react-bootstrap";
import { useLocation } from "react-router-dom";

//Component Imports
import AASFilterToast from "./AASFilterToast";
import { DataGrid } from '@mui/x-data-grid';


// CSS imports
import './ReferableSelectionModal.css';
import AASData from "../../../../AasData";

function ReferableSelectionModal({ showSelectionModal, handleClose, handleSelection }) {
  const [selectedAsset, setSelectedAsset] = useState(null);
  const environmentServices = useLocation().state.environmentServices;
  const [filteredList, setFilteredList] = useState(null);

  useEffect(() => {
    setFilteredList(environmentServices);
  }, []);





  const handleSearchInput = (event) => {
    const searchKey = event.target.value ? event.target.value.toLowerCase() : ''; 
    const filteredList = environmentServices.filter(service =>
      service.assetID.toLowerCase().includes(searchKey)
    );
    setFilteredList(filteredList);
  };





  const handleItemClick = (event) => {
    console.log("Clicked cell assetID:", event);
    const assetID = event.id;
    setSelectedAsset(selectedAsset === assetID ? null : assetID);
  };

  const handleSelect = () => {
    handleSelection(selectedAsset);
  };

  const columns = [
    { field: 'assetIDShort', headerName: 'Short ID', flex:0.5, minWidth:100, filterable: true },
    { field: 'id', headerName: 'Asset ID', minWidth:200, flex:1, filterable: true },
    { field: 'CO2eq', headerName: 'CO2 total [kg]', width:100, align:'center'},
    { field: 'CO2eqItem', headerName: 'CO2 per Unit [kg]',width: 120, filterable: false, align:'center' },
    {field: 'pcfReferenceValueForCalculation', headerName:'Unit', width: 30, align:'center'},
  ];



  const rows = filteredList?.map((aasData) => ({
    assetIDShort: aasData.assetIDShort,
    id: aasData.assetID,
    CO2eq: aasData.sumCO2eq('all'),
    CO2eqItem: aasData.CO2eqPerItem(),
    pcfReferenceValueForCalculation: AASData.getPCFReferenceValueForCalculation(aasData.submodels.CarbonFootprint.ProductCarbonFootprint[0].PCFReferenceValueForCalculation),
  }));


  return (
    <Modal show={showSelectionModal} onHide={handleClose} centered
      dialogClassName="custom-modal-dialog" // Apply styles to the modal dialog container
    >
      <Modal.Header>
        <Modal.Title>Select an Asset you want to refer to:</Modal.Title>
      </Modal.Header>
      <Modal.Body>

        <Form.Control type="text" placeholder="Search ..." className="custom-form-control-search mb-3" onChange={handleSearchInput} />

        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10, page: 0 },
            },
          }}
          pageSizeOptions={[5, 10, 25]}
          disableColumnFilter
          onCellClick={(event) => handleItemClick(event)}
        />



      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Create custom Asset ID
        </Button>
        <Button variant="primary" onClick={handleSelect}>
          Select
        </Button>
      </Modal.Footer>
    </Modal >
  );
}

export default ReferableSelectionModal;
