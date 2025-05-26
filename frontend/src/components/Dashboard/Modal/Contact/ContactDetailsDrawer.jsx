import { Box, Drawer } from '@mui/material';
import { drawerPaperSx } from '../../../../assets/sx';
import { IdAdornment } from '../../../custom/Adornments';
import { DetailsTitle } from '../../../custom/Dashboard';
import { BoxBetween, CloseButton, ReadOnlyTextField } from '../../../custom/MUI';
import { formatDate } from '../../../custom/utils';
import { downloadContactData } from '../../../Product/Utils/DataExport';

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
                            multiline
                            rows={4}
                            value={contact.message}
                        />

                        {contact.createdAt &&
                            <ReadOnlyTextField
                                label="Created At"
                                value={formatDate(contact.createdAt)}
                            />
                        }

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