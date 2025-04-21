import { Box, Drawer } from '@mui/material';
import React from 'react';
import { BoxBetween, CloseButton, DateAdornment, DetailsTitle, formatDate, IdAdornment, PersonAdornment, ReadOnlyTextField } from '../../../../assets/CustomComponents';
import { downloadFaqData } from '../../../../assets/DataExport';
import { drawerPaperSx } from '../../../../assets/sx';

const FAQDetailsDrawer = ({ open, onClose, faq, onEdit, onDelete }) => {
    const handleEdit = () => {
        onClose();
        onEdit(faq);
    };

    const handleExport = () => {
        downloadFaqData(faq);
    };

    const handleDelete = () => {
        onClose();
        onDelete(faq);
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
                        <DetailsTitle
                            entity={faq}
                            entityName="FAQ"
                            handleEdit={handleEdit}
                            handleExport={handleExport}
                            handleDelete={handleDelete}
                        />

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
                    </>
                ) : (
                    <ReadOnlyTextField value="Error fetching faq" />
                )}
            </Box>
        </Drawer>
    );
};

export default FAQDetailsDrawer;