import { Box, Drawer, Typography } from '@mui/material';
import React from 'react';
import { BoxBetween, CloseButton, DateAdornment, EditExportButtons, formatDate, IdAdornment, PersonAdornment, ReadOnlyTextField } from '../../../assets/CustomComponents';
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
                            label="FAQ ID"
                            value={faq._id}
                            InputProps={IdAdornment()}
                        />

                        <ReadOnlyTextField
                            label="Question"
                            value={faq.question}
                            multiline
                            rows={3}
                        />

                        <ReadOnlyTextField
                            label="Answer"
                            value={faq.answer}
                            multiline
                            rows={3}
                        />

                        <BoxBetween>
                            <ReadOnlyTextField
                                label="Created At"
                                value={formatDate(faq.createdAt)}
                                InputProps={DateAdornment()}
                            />
                            <ReadOnlyTextField
                                label="Updated At"
                                value={formatDate(faq.updatedAt)}
                                InputProps={DateAdornment()}
                            />
                        </BoxBetween>

                        {faq.createdBy && (
                            <ReadOnlyTextField
                                label="Created By"
                                value={`${faq.createdBy.firstName} ${faq.createdBy.lastName} - ${faq.createdBy.email}`}
                                InputProps={PersonAdornment()}
                            />
                        )}

                        {faq.updatedBy && (
                            <ReadOnlyTextField
                                label="Updated By"
                                value={`${faq.updatedBy.firstName} ${faq.updatedBy.lastName} - ${faq.updatedBy.email}`}
                                InputProps={PersonAdornment()}
                            />
                        )}

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