import { Box, Drawer, Typography } from '@mui/material';
import React from 'react';
import { CloseButton, EditExportButtons, ReadOnlyTextField } from '../../../assets/CustomComponents';
import { downloadFaqData } from '../../../assets/DataExport';
import { drawerPaperSx } from '../../../assets/sx';

const FAQDetailsDrawer = ({ open, onClose, faq, onEdit }) => {
    const handleEditClick = () => {
        onClose();
        onEdit(faq);
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
                {faq ? (
                    <>
                        <Typography className='!font-bold !text-lg'>
                            {faq.question}'s Details
                        </Typography>

                        <ReadOnlyTextField
                            label="Faq ID"
                            value={faq._id}
                        />

                        <ReadOnlyTextField
                            label="Question"
                            value={faq.question}
                        />

                        <ReadOnlyTextField
                            label="Answer"
                            value={faq.answer}
                            multiline
                            rows={4}
                        />

                        <EditExportButtons
                            onEditClick={handleEditClick}
                            onExportClick={() => downloadFaqData(faq)}
                        />
                    </>
                ) : (
                    <ReadOnlyTextField value="Error fetching faq" />
                )}
            </Box>
        </Drawer>
    );
};

export default FAQDetailsDrawer;