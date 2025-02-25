import { Box, Drawer, Typography } from '@mui/material';
import React from 'react';
import { CloseButton, EditExportButtons, IdAdornment, ReadOnlyTextField } from '../../../assets/CustomComponents';
import { downloadImageData } from '../../../assets/DataExport';
import { drawerPaperSx } from '../../../assets/sx';
import { getImageUrl } from '../../../utils/config';

const SlideshowDetailsDrawer = ({ open, onClose, image, onEdit }) => {
    const handleEditClick = () => {
        onClose();
        onEdit(image);
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
                {image ? (
                    <>
                        <Typography className='!font-bold !text-lg'>
                            {image.title}'s Details
                        </Typography>

                        <ReadOnlyTextField
                            label="Image ID"
                            value={image?._id}
                            InputProps={IdAdornment()}
                        />

                        <ReadOnlyTextField
                            label="Title"
                            value={image?.title}
                        />

                        <ReadOnlyTextField
                            label="Description"
                            value={image?.description}
                        />

                        <Box className="flex flex-col items-center mt-3 mb-3">
                            <img
                                src={getImageUrl(image?.image)}
                                alt={`${image.name} image`}
                                className='rounded'
                            />
                        </Box>

                        <EditExportButtons
                            onEditClick={handleEditClick}
                            onExportClick={() => downloadImageData(image)}
                        />
                    </>
                ) : (
                    <ReadOnlyTextField value="Error fetching image" />
                )}
            </Box>
        </Drawer>
    );
};

export default SlideshowDetailsDrawer;