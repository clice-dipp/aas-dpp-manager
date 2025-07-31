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
import React, { useState, useEffect } from 'react';
import { Container, Table } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';


// Icon Import
import { ReactComponent as PenIcon } from '../../../../assets/icons/PenIcon.svg';
import { ReactComponent as TrashIcon } from '../../../../assets/icons/TrashIcon.svg';
import { ReactComponent as PenIcon_disabled } from '../../../../assets/icons/PenIcon_disabled.svg';
import { ReactComponent as TrashIcon_disabled } from '../../../../assets/icons/TrashIcon_disabled.svg';

// Components Import
import LoadingAnimation from '../LoadingAnimation';
import { DataGrid } from '@mui/x-data-grid';
import C02eqDistributionBarChart from '../../CO2eqDistributionBarChart.js';

//CSS Import
import './OverviewTable.css';
import "./../../../general/Main.css";



function OverviewTable({ environmentServices, handleDeleteModalShow, setValue, loading, token }) {

    const navigate = useNavigate();
    const [selectedRows, setSelectedRows] = useState([]);

    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection);
    };


    const handleEditClick = (service) => {
        const editURL = new URL("aas/edit", window.location.origin);
        editURL.searchParams.set("aas_url", service.assetID);
        const relativeEditURL = editURL.pathname + editURL.search;
        navigate(relativeEditURL.toString(), {
            state: {
                environmentServices: environmentServices
            }
        });
    };

    const handleShowClick = (assetID) => {
        const showURL = `/aas/show?aas_url=${assetID}`;
        navigate(showURL);
    };

    useEffect(() => {
        setValue('selectedItems', selectedRows);
    }, [selectedRows, setValue]);


    const columns = [
        {
            field: 'assetID', headerName: 'ID', flex: 6, minWidth: 80, filterable: true,
            renderCell: (params) => (
                <button
                    type="button"
                    className='btn link-button'
                    onClick={() => handleShowClick(params.row.id)}
                >
                    {params.row.id}
                </button>
            )
        },
        { field: 'assetIDShort', headerName: 'ID-short', width: 100, filterable: true },
        { field: 'pcfCO2eq', headerName: 'PCF CO2 [kg]', minWidth: 120, filterable: true, align: 'center', type: 'number' },
        { field: 'tcfCO2eq', headerName: 'TCF CO2 [kg]', minWidth: 120, filterable: true, align: 'center', type: 'number' },
        {
            field: 'pcfLiveCyclePhase', headerName: 'Life Cycle Phase', minWidth: 250, flex: 4, filterable: false, sortable: false,
            renderCell: (params) => (

                <C02eqDistributionBarChart aasData={params.row.pcfLiveCyclePhase}
                    optionsScaleX={{
                        title: {
                            font: {
                                size: 10
                            },
                            display: true,
                            text: 'kg of CO2',
                            align: 'center'

                        },
                        ticks: {
                            font: {
                                size: 10
                            },
                            display: true // Example boolean value determining whether ticks should be displayed
                        },
                        stacked: true
                    }} />
            ),
        },
        {
            field: 'edit',
            headerName: 'Edit',
            width: 50,
            filterable: false,
            sortable: false,
            renderCell: (params) => {
                const isOwner = params.row.pcfLiveCyclePhase.sender === token || token === 'softwareag' || token === 'master';

                return (
                    <button
                        type="button"
                        className='btn'
                        onClick={() => handleEditClick(params.row)}
                        disabled={!isOwner}
                    >
                        {isOwner ? <PenIcon /> : <PenIcon_disabled />}
                    </button>
                );
            },
            align: 'center',
        },
        {
            field: 'delete',
            headerName: 'Delete',
            width: 70,
            filterable: false,
            sortable: false,
            renderCell: (params) => {
                const isOwner = params.row.pcfLiveCyclePhase.sender === token || token === 'softwareag' || token === 'master';
                return (

                    <button
                        type="button"
                        className="btn"
                        onClick={() => handleDeleteModalShow(params.row.id)}
                        disabled={!isOwner}
                    >
                        {isOwner ? <TrashIcon /> : <TrashIcon_disabled />}
                    </button>
                );
            },
            align: 'center',
        },
    ];

    var rows = environmentServices?.map((aasData) => ({
        id: aasData.assetID,
        assetID: aasData.assetID,
        assetIDShort: aasData.assetIDShort,
        pcfCO2eq: aasData.sumCO2eq('pcf'),
        tcfCO2eq: aasData.sumCO2eq('tcf'),
        pcfLiveCyclePhase: aasData,
    }));





    return (
        <>
            {!loading &&

                <DataGrid
                    className='mb-3'
                    autoHeight
                    rows={rows}
                    columns={columns}
                    rowHeight={120}

                    initialState={{
                        pagination: {
                            paginationModel: { pageSize: 10, page: 0 },
                        },
                    }}
                    checkboxSelection={true}
                    onRowSelectionModelChange={handleSelectionChange}
                    pageSizeOptions={[5, 10, 25]}
                />

            }






        </>


    );
};

export default OverviewTable;