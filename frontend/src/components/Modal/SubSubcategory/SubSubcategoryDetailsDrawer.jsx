import { Box, Drawer, Typography } from '@mui/material';
import React from 'react';
import { BoxBetween, CloseButton, DateAdornment, EditExportButtons, formatDate, IdAdornment, ReadOnlyTextField } from '../../../assets/CustomComponents';
import { downloadSubSubcategoryData } from '../../../assets/DataExport';
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
                            InputProps={IdAdornment()}
                        />

                        <ReadOnlyTextField
                            label="Name"
                            value={subSubcategory.name}
                        />

                        <ReadOnlyTextField
                            label="Subcategory ID"
                            value={subSubcategory.subcategory._id}
                            InputProps={IdAdornment()}
                        />

                        <ReadOnlyTextField
                            label="Subcategory"
                            value={subSubcategory.subcategory.name}
                        />

                        <BoxBetween>
                            <ReadOnlyTextField
                                label="Created At"
                                value={formatDate(subSubcategory.createdAt)}
                                InputProps={DateAdornment()}
                            />
                            <ReadOnlyTextField
                                label="Updated At"
                                value={formatDate(subSubcategory.updatedAt)}
                                InputProps={DateAdornment()}
                            />
                        </BoxBetween>

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