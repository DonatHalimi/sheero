import { Checkbox, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React from 'react';
import ReactPaginate from 'react-paginate';
import { BoldTableCell } from '../../assets/CustomComponents';
import { DashboardPagination } from './Pagination';

const getNestedValue = (obj, path) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

const DashboardTable = ({
    columns,
    data,
    selectedItems,
    onSelectItem,
    onSelectAll,
    itemsPerPage,
    currentPage,
    onPageChange,
    renderActionButtons,
    renderTableActions,
    containerClassName,
}) => {
    const pageCount = Math.ceil(data.length / itemsPerPage);
    const isPreviousDisabled = currentPage === 0;
    const isNextDisabled = currentPage >= pageCount - 1;
    const paginationEnabled = data.length > 0 && pageCount > 1;

    const getCurrentPageItems = () => {
        const startIndex = currentPage * itemsPerPage;
        return data.slice(startIndex, startIndex + itemsPerPage);
    };

    return (
        <>
            {renderTableActions && renderTableActions()}
            <TableContainer component={Paper} className={containerClassName || 'max-w-screen-2xl mx-auto'}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {columns.map((column, index) => (
                                <BoldTableCell key={index}>
                                    {column.label === 'checkbox' ? (
                                        <Checkbox
                                            checked={selectedItems.length === data.length}
                                            onChange={onSelectAll}
                                        />
                                    ) : column.label}
                                </BoldTableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {getCurrentPageItems().length > 0 ? (
                            getCurrentPageItems().map((item) => (
                                <TableRow key={item._id}>
                                    {columns.map((column, index) => (
                                        <TableCell key={index}>
                                            {column.key === 'checkbox' ? (
                                                <Checkbox
                                                    checked={selectedItems.includes(item._id)}
                                                    onChange={() => onSelectItem(item._id)}
                                                />
                                            ) : column.key === 'actions' ? (
                                                renderActionButtons(item)
                                            ) : column.key === 'password' && containerClassName === 'user' ? (
                                                '●●●●●●●●●●'
                                            ) : (
                                                column.render ? column.render(item) : getNestedValue(item, column.key)
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} align="center">
                                    No items found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {paginationEnabled && (
                <div className="w-full flex justify-start mt-6 mb-24">
                    <ReactPaginate
                        pageCount={pageCount}
                        pageRangeDisplayed={2}
                        marginPagesDisplayed={1}
                        onPageChange={onPageChange}
                        containerClassName={DashboardPagination.container}
                        activeClassName={DashboardPagination.active}
                        previousLinkClassName={`${DashboardPagination.previous} ${isPreviousDisabled ? DashboardPagination.disabled : ''}`}
                        nextLinkClassName={`${DashboardPagination.next} ${isNextDisabled ? DashboardPagination.disabled : ''}`}
                        disabledClassName={DashboardPagination.disabled}
                        activeLinkClassName={DashboardPagination.activeLink}
                        previousLabel={<span className={DashboardPagination.previousLabel}>Previous</span>}
                        nextLabel={<span className={DashboardPagination.nextLabel}>Next</span>}
                        breakLabel={<span className={DashboardPagination.break}>...</span>}
                        pageClassName={DashboardPagination.page}
                        pageLinkClassName={DashboardPagination.link}
                    />
                </div>
            )}
        </>
    );
};

export default DashboardTable;