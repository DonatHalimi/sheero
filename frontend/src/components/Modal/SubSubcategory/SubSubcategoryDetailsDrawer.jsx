import { Box, Drawer, Typography } from '@mui/material';
import React from 'react';
import { CloseButton, downloadSubSubcategoryData, EditExportButtons, ReadOnlyTextField } from '../../../assets/CustomComponents';
import { drawerPaperSx } from '../../../assets/sx';

const SubSubcategoryDetailsDrawer = ({ open, onClose, subSubcategory, onEdit }) => {
    const handleEditClick = () => {
        onClose();
        onEdit(subSubcategory);
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
                {subSubcategory ? (
                    <>
                        <Typography className='!font-bold !text-lg'>
                            {subSubcategory.name} SubSubcategory Details
                        </Typography>

                        <ReadOnlyTextField
                            label="SubSubcategory ID"
                            value={subSubcategory._id}
                        />

                        <ReadOnlyTextField
                            label="Name"
                            value={subSubcategory.name}
                        />

                        <ReadOnlyTextField
                            label="Subcategory"
                            value={subSubcategory.subcategory.name}
                        />

                        <EditExportButtons
                            onEditClick={handleEditClick}
                            onExportClick={() => downloadSubSubcategoryData(subSubcategory)}
                        />
                    </>
                ) : (
                    <ReadOnlyTextField value="Error fetching subSubcategory" />
                )}
            </Box>
        </Drawer>
    );
};

export default SubSubcategoryDetailsDrawer;