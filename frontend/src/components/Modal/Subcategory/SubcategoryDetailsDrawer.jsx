import { Box, Drawer, Typography } from '@mui/material';
import React from 'react';
import { CloseButton, downloadSubcategoryData, EditExportButtons, ReadOnlyTextField } from '../../../assets/CustomComponents';
import { drawerPaperSx } from '../../../assets/sx';
import { getImageUrl } from '../../../utils/config';

const SubcategoryDetailsDrawer = ({ open, onClose, subcategory, onEdit }) => {
    const handleEditClick = () => {
        onClose();
        onEdit(subcategory);
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
                {subcategory ? (
                    <>
                        <Typography className='!font-bold !text-lg'>
                            {subcategory.name} Subcategory Details
                        </Typography>

                        <ReadOnlyTextField
                            label="Subcategory ID"
                            value={subcategory._id}
                        />

                        <ReadOnlyTextField
                            label="Name"
                            value={subcategory.name}
                        />

                        <ReadOnlyTextField
                            label="Category"
                            value={subcategory.category.name}
                        />

                        <Box className="flex flex-col items-center mt-3 mb-3">
                            <img
                                src={getImageUrl(subcategory.image)}
                                alt={`${subcategory.name} image`}
                                className='w-1/3'
                            />
                        </Box>

                        <EditExportButtons
                            onEditClick={handleEditClick}
                            onExportClick={() => downloadSubcategoryData(subcategory)}
                        />
                    </>
                ) : (
                    <ReadOnlyTextField value="Error fetching subcategory" />
                )}
            </Box>
        </Drawer>
    );
};

export default SubcategoryDetailsDrawer;