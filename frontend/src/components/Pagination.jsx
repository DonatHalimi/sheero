import { Button, ButtonGroup } from '@mui/material';
import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const handleFirstPage = () => onPageChange(1);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            onPageChange(page);
        }
    };

    const getPageButtons = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <Button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    variant={i === currentPage ? 'contained' : 'outlined'}
                >
                    {i}
                </Button>
            );
        }
        return pages;
    };

    const handleLastPage = () => onPageChange(totalPages);

    return (
        <div className="flex justify-end items-end p-4">
            <ButtonGroup variant="outlined">
                <Button onClick={handleFirstPage} disabled={currentPage === 1}>First</Button>
                {getPageButtons()}
                <Button onClick={handleLastPage} disabled={currentPage === totalPages}>Last</Button>
            </ButtonGroup>
        </div>
    );
};

export default Pagination;
