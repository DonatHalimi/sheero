import { Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React from 'react';
import { CustomNoRowsOverlay, CustomToolbar } from '../../assets/CustomComponents';

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
    // Prepare columns for DataGrid with even width distribution
    const gridColumns = columns.map((column) => ({
        field: column.key,
        headerName: column.label,
        flex: 1,
        minWidth: 150,
        renderCell: (params) => {
            if (column.key === 'actions') {
                return renderActionButtons(params.row);
            } else if (column.key === 'password' && containerClassName === 'user') {
                return '●●●●●●●●●●';
            } else {
                return column.render
                    ? column.render(params.row)
                    : getNestedValue(params.row, column.key);
            }
        },
    }));

    // Prepare rows for DataGrid
    const gridRows = data.map((item) => ({
        id: item._id,
        ...item,
    }));

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
                    pageSize={itemsPerPage}
                    page={currentPage}
                    onPageChange={(params) => onPageChange(params.page)}
                    pagination
                    checkboxSelection
                    onSelectionModelChange={(newSelection) => onSelectItem(newSelection.selectionModel)}
                    onRowClick={(params) => onSelectItem([params.id])}
                    onRowContextMenu={(event, params) => onRowRightClick(event, params.row)}
                    autoHeight
                    disableSelectionOnClick
                    initialState={{
                        density: 'comfortable',
                    }}
                    slots={{
                        toolbar: CustomToolbar,
                        noRowsOverlay: CustomNoRowsOverlay,
                    }}
                    sx={{
                        '& .MuiDataGrid-cell:focus': {
                            outline: 'none',
                        },
                        '& .MuiDataGrid-cell:focus-within': {
                            outline: 'none',
                        },
                        '--DataGrid-overlayHeight': '300px',

                    }}
                />
            </Paper>
        </>
    );
};

export default DashboardTable;