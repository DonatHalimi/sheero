import { Box, Drawer, useTheme } from '@mui/material';
import { paperPropsSx } from '../../../../assets/sx';
import { DateAdornment, DescriptionAdornment, IdAdornment, PersonAdornment, SubjectAdornment } from '../../../custom/Adornments';
import { DetailsTitle } from '../../../custom/Dashboard';
import { BoxBetween, CloseButton, ReadOnlyTextField } from '../../../custom/MUI';
import { formatDate } from '../../../custom/utils';
import { downloadContactData } from '../../../Product/Utils/DataExport';

const ContactDetailsDrawer = ({ open, onClose, contact, onDelete }) => {
    const theme = useTheme();

    const user = `${contact?.userId?.firstName} ${contact?.userId?.lastName} - ${contact?.userId?.email}`;

    const handleExport = () => {
        downloadContactData(contact);
    };

    const handleDelete = () => {
        onClose();
        onDelete(contact);
    };

    console.log(contact);

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={paperPropsSx(theme)}
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
                            InputProps={SubjectAdornment()}
                        />

                        <ReadOnlyTextField
                            label="Message"
                            multiline
                            rows={4}
                            value={contact.message}
                            InputProps={DescriptionAdornment()}
                        />

                        {contact.createdAt &&
                            <ReadOnlyTextField
                                label="Created At"
                                value={formatDate(contact.createdAt)}
                                InputProps={DateAdornment()}
                            />
                        }

                        {contact.userId?._id &&
                            <ReadOnlyTextField
                                label="User"
                                value={user}
                                InputProps={PersonAdornment()}
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