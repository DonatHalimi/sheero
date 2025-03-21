import { Paper, useTheme } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React from 'react';
import { ActionsCell, CustomNoRowsOverlay, CustomToolbar } from '../../assets/CustomComponents';
import { dashboardTablePaperSx, dashboardTableSx } from '../../assets/sx';

const getNestedValue = (obj, path) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

/**
 * A reusable table component for displaying data in a dashboard.
 *
 * @param {Array} columns - An array of column objects with keys for label and key.
 * @param {Array} data - An array of data objects to be displayed in the table.
 * @param {Array} selectedItems - An array of selected item IDs.
 * @param {Function} onSelectItem - A callback function for when an item is selected.
 * @param {Number} itemsPerPage - The number of items to display per page.
 * @param {Number} currentPage - The current page number.
 * @param {Function} onPageChange - A callback function for when the page changes.
 * @param {Function} renderTableActions - A function that returns the table actions.
 * @param {Function} onEdit - A callback function for the edit action.
 * @param {Function} onDelete - A callback function for the delete action.
 * @param {String} containerClassName - A class name for the container element.
 * @return {JSX.Element} The table component.
 */
const DashboardTable = ({
    columns,
    data,
    selectedItems,
    onSelectItem,
    itemsPerPage,
    currentPage,
    onPageChange,
    renderTableActions,
    onEdit,
    onDelete,
    containerClassName,
    onViewDetails,
    showEditButton = true,
}) => {
    const theme = useTheme();

    const gridColumns = columns.map((column) => ({
        field: column.key,
        headerName: column.label,
        flex: 1,
        minWidth: 150,
        renderCell: (params) => {
            if (column.key === 'actions') {
                return (
                    <div onClick={(e) => e.stopPropagation()}>
                        <ActionsCell
                            row={params.row}
                            theme={theme}
                            onViewDetails={onViewDetails}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            showEditButton={showEditButton}
                        />
                    </div>
                );
            } else if (column.key === 'image') {
                return (
                    <div onClick={(e) => e.stopPropagation()}>
                        {column.render(params.row)}
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
        if (!event.target.closest('.MuiDataGrid-actionsCell') && !event.target.closest('.MuiDataGrid-imageCell')) {
            let newSelection;
            if (selectedItems.includes(params.id)) {
                newSelection = selectedItems.filter(id => id !== params.id);
            } else {
                newSelection = [...selectedItems, params.id];
            }
            onSelectItem(newSelection);
        }
    };

    const handleSelectionModelChange = (newSelectionModel) => {
        onSelectItem(newSelectionModel);
    };

    return (
        <>
            {renderTableActions && renderTableActions()}
            <Paper
                sx={dashboardTablePaperSx(theme)}
                style={{ height: 'auto', width: '100%', boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)' }}
                className={`${containerClassName || 'max-w-screen-2xl mx-auto'} mb-20`}
            >
                <DataGrid
                    rows={gridRows}
                    columns={gridColumns}
                    onRowSelectionModelChange={handleSelectionModelChange}
                    rowSelectionModel={selectedItems}
                    onRowClick={handleRowClick}
                    pageSize={itemsPerPage}
                    page={currentPage}
                    onPageChange={(params) => onPageChange(params.page)}
                    pagination
                    checkboxSelection
                    disableColumnResize
                    autoHeight
                    disableSelectionOnClick
                    keepNonExistentRowsSelected
                    initialState={{
                        density: 'comfortable',
                    }}
                    slots={{
                        toolbar: CustomToolbar,
                        noRowsOverlay: CustomNoRowsOverlay,
                    }}
                    sx={{
                        ...dashboardTableSx(theme),
                    }}
                />
            </Paper>
        </>
    );
};

export default DashboardTable;