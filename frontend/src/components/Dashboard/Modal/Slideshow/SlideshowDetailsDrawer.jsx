import { Box, Drawer } from '@mui/material';
import React from 'react';
import { CloseButton, DetailsTitle, IdAdornment, PersonAdornment, ReadOnlyTextField } from '../../../../assets/CustomComponents';
import { downloadImageData } from '../../../../assets/DataExport';
import { drawerPaperSx } from '../../../../assets/sx';
import { getImageUrl } from '../../../../utils/config';

const SlideshowDetailsDrawer = ({ open, onClose, slideshow, onEdit, onDelete }) => {
    const handleEdit = () => {
        onClose();
        onEdit(slideshow);
    };

    const handleExport = () => {
        downloadImageData(slideshow);
    };

    const handleDelete = () => {
        onClose();
        onDelete(slideshow);
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
                {slideshow ? (
                    <>
                        <DetailsTitle
                            entity={slideshow}
                            entityName="Slideshow Image"
                            handleEdit={handleEdit}
                            handleExport={handleExport}
                            handleDelete={handleDelete}
                        />

                        <ReadOnlyTextField
                            label="Slideshow ID"
                            value={slideshow?._id}
                            InputProps={IdAdornment()}
                        />

                        <ReadOnlyTextField
                            label="Title"
                            value={slideshow?.title}
                        />

                        <ReadOnlyTextField
                            label="Description"
                            value={slideshow?.description}
                        />

                        <Box className="flex flex-col items-center mt-3 mb-3">
                            <img
                                src={getImageUrl(slideshow?.image)}
                                alt={`${slideshow.name} image`}
                                className='rounded'
                            />
                        </Box>

                        {slideshow.createdBy && (
                            <ReadOnlyTextField
                                label="Created By"
                                value={`${slideshow.createdBy.firstName} ${slideshow.createdBy.lastName} - ${slideshow.createdBy.email}`}
                                InputProps={PersonAdornment()}
                            />
                        )}

                        {slideshow.updatedBy && (
                            <ReadOnlyTextField
                                label="Updated By"
                                value={`${slideshow.updatedBy.firstName} ${slideshow.updatedBy.lastName} - ${slideshow.updatedBy.email}`}
                                InputProps={PersonAdornment()}
                            />
                        )}
                    </>
                ) : (
                    <ReadOnlyTextField value="Error fetching slideshow details" />
                )}
            </Box>
        </Drawer>
    );
};

export default SlideshowDetailsDrawer;