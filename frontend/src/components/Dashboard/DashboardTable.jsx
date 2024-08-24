import { Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React from 'react';
import { CustomNoRowsOverlay, DashboardStyling, CustomToolbar } from '../../assets/CustomComponents';

const getNestedValue = (obj, path) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

const DashboardTable = ({
    columns,
    data,
    selectedItems,
    onSelectItem,
    onRowRightClick,
    itemsPerPage,
    currentPage,
    onPageChange,
    renderActionButtons,
    renderTableActions,
    containerClassName,
}) => {
    const gridColumns = columns.map((column) => ({
        field: column.key,
        headerName: column.label,
        flex: 1,
        minWidth: 150,
        renderCell: (params) => {
            if (column.key === 'actions') {
                return (
                    <div onClick={(e) => e.stopPropagation()}>
                        {renderActionButtons(params.row)}
                    </div>
                );
            } else if (column.key === 'password' && containerClassName === 'user') {
                return '●●●●●●●●●●';
            } else {
                return column.render
                    ? column.render(params.row)
                    : getNestedValue(params.row, column.key);
            }
        },
    }));

    const gridRows = data.map((item) => ({
        id: item._id,
        ...item,
    }));

    const handleRowClick = (params, event) => {
        if (!event.target.closest('.MuiDataGrid-actionsCell')) {
            onSelectItem([params.id]);
        }
    };

    return (
        <>
            {renderTableActions && renderTableActions()}
            <Paper
                className={containerClassName || 'max-w-screen-2xl mx-auto'}
                style={{ height: 'auto', width: '100%' }}
            >
                <DataGrid
                    rows={gridRows}
                    columns={gridColumns}
                    onSelectionModelChange={(newSelection) => onSelectItem(newSelection)}
                    onRowClick={handleRowClick}
                    onRowContextMenu={(event, params) => onRowRightClick(event, params.row)}
                    pageSize={itemsPerPage}
                    page={currentPage}
                    onPageChange={(params) => onPageChange(params.page)}
                    pagination
                    checkboxSelection
                    disableColumnResize
                    autoHeight
                    disableSelectionOnClick
                    initialState={{
                        density: 'comfortable',
                    }}
                    slots={{
                        toolbar: CustomToolbar,
                        noRowsOverlay: CustomNoRowsOverlay,
                    }}
                    sx={DashboardStyling}
                />
            </Paper>
        </>
    );
};

export default DashboardTable;