import { Download } from '@mui/icons-material';
import { Box, Drawer, Typography } from '@mui/material';
import React from 'react';
import { BoxBetween, CloseButton, IdAdornment, OutlinedBrownButton, ReadOnlyTextField } from '../../../assets/CustomComponents';
import { downloadContactData } from '../../../assets/DataExport';
import { drawerPaperSx } from '../../../assets/sx';

const ContactDetailsDrawer = ({ open, onClose, contact, onEdit }) => {
    const user = `${contact?.userId?.firstName} ${contact?.userId?.lastName} - ${contact?.userId?.email}`;

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
                        <Typography className='!font-bold !text-lg'>
                            Contact message from {contact.name}
                        </Typography>

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

                        <OutlinedBrownButton
                            variant="contained"
                            startIcon={<Download />}
                            onClick={() => downloadContactData(contact)}
                        >
                            Export as JSON
                        </OutlinedBrownButton>
                    </>
                ) : (
                    <ReadOnlyTextField value="Error fetching contact" />
                )}
            </Box>
        </Drawer>
    );
};

export default ContactDetailsDrawer;