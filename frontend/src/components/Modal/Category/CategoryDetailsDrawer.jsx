import { Box, Drawer, Typography } from '@mui/material';
import React from 'react';
import { BoxBetween, CloseButton, DateAdornment, EditExportButtons, formatDate, IdAdornment, ReadOnlyTextField } from '../../../assets/CustomComponents';
import { downloadCategoryData } from '../../../assets/DataExport';
import { drawerPaperSx } from '../../../assets/sx';
import { getImageUrl } from '../../../utils/config';

const CategoryDetailsDrawer = ({ open, onClose, category, onEdit }) => {
    const handleEditClick = () => {
        onClose();
        onEdit(category);
    };

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={drawerPaperSx}
            sx={{ zIndex: 9999 }}
        >
            <CloseButton onClose={onClose} />
            <Box className="flex flex-col w-full mt-4 gap-4">
                {category ? (
                    <>
                        <Typography className='!font-bold !text-lg'>
                            {category.name} Category Details
                        </Typography>

                        <ReadOnlyTextField
                            label="Category ID"
                            value={category._id}
                            InputProps={IdAdornment()}
                        />

                        <ReadOnlyTextField
                            label="Name"
                            value={category.name}
                        />

                        <Box className="flex flex-col items-center mt-3 mb-3">
                            <img
                                src={getImageUrl(category.image)}
                                alt={`${category.name} image`}
                                className='w-1/3'
                            />
                        </Box>

                        <BoxBetween>
                            <ReadOnlyTextField
                                label="Created At"
                                value={formatDate(category.createdAt)}
                                InputProps={DateAdornment()}
                            />
                            <ReadOnlyTextField
                                label="Updated At"
                                value={formatDate(category.updatedAt)}
                                InputProps={DateAdornment()}
                            />
                        </BoxBetween>

                        <EditExportButtons
                            onEditClick={handleEditClick}
                            onExportClick={() => downloadCategoryData(category)}
                        />
                    </>
                ) : (
                    <ReadOnlyTextField value="Error fetching category" />
                )}
            </Box>
        </Drawer>
    );
};

export default CategoryDetailsDrawer;
