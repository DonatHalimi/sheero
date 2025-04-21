import { Box, Drawer } from '@mui/material';
import React from 'react';
import { BoxBetween, CloseButton, DetailsTitle, IdAdornment, ReadOnlyTextField } from '../../../../assets/CustomComponents';
import { downloadContactData } from '../../../../assets/DataExport';
import { drawerPaperSx } from '../../../../assets/sx';

const ContactDetailsDrawer = ({ open, onClose, contact, onDelete }) => {
    const user = `${contact?.userId?.firstName} ${contact?.userId?.lastName} - ${contact?.userId?.email}`;

    const handleExport = () => {
        downloadContactData(contact);
    };

    const handleDelete = () => {
        onClose();
        onDelete(contact);
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
                {contact ? (
                    <>
                        <DetailsTitle
                            entity={contact}
                            entityName="Contact"
                            handleExport={handleExport}
                            handleDelete={handleDelete}
                            showEditButton={false}
                        />

                        <ReadOnlyTextField
                            label="Contact ID"
                            value={contact._id}
                            InputProps={IdAdornment()}
                        />

                        <BoxBetween>
                            <ReadOnlyTextField
                                label="Name"
                                value={contact.name}
                            />

                            <ReadOnlyTextField
                                label="Email"
                                value={contact.email}
                            />
                        </BoxBetween>

                        <ReadOnlyTextField
                            label="Subject"
                            value={contact.subject}
                        />

                        <ReadOnlyTextField
                            label="Message"
                            value={contact.message}
                        />

                        {contact.userId?._id &&
                            <ReadOnlyTextField
                                label="User"
                                value={user}
                            />
                        }
                    </>
                ) : (
                    <ReadOnlyTextField value="Error fetching contact" />
                )}
            </Box>
        </Drawer>
    );
};

export default ContactDetailsDrawer;