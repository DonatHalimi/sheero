import { Box, Drawer } from '@mui/material';
import React from 'react';
import { BoxBetween, CloseButton, DateAdornment, DetailsTitle, formatDate, IdAdornment, PersonAdornment, ReadOnlyTextField } from '../../../../assets/CustomComponents';
import { downloadCountryData } from '../../../../assets/DataExport';
import { drawerPaperSx } from '../../../../assets/sx';

const CountryDetailsDrawer = ({ open, onClose, country, onEdit, onDelete }) => {
    const handleEdit = () => {
        onClose();
        onEdit(country);
    };

    const handleExport = () => {
        downloadCountryData(country);
    };

    const handleDelete = () => {
        onClose();
        onDelete(country);
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
                {country ? (
                    <>
                        <DetailsTitle
                            entity={country}
                            entityName="Country"
                            handleEdit={handleEdit}
                            handleExport={handleExport}
                            handleDelete={handleDelete}
                        />

                        <ReadOnlyTextField
                            label="Country ID"
                            value={country._id}
                            InputProps={IdAdornment()}
                        />

                        <BoxBetween>
                            <ReadOnlyTextField
                                label="Country Code"
                                value={country.countryCode}
                            />
                            <ReadOnlyTextField
                                label="Country"
                                value={country.name}
                            />
                        </BoxBetween>

                        <BoxBetween>
                            <ReadOnlyTextField
                                label="Created At"
                                value={formatDate(country.createdAt)}
                                InputProps={DateAdornment()}
                            />
                            <ReadOnlyTextField
                                label="Updated At"
                                value={formatDate(country.updatedAt)}
                                InputProps={DateAdornment()}
                            />
                        </BoxBetween>

                        {country.createdBy && (
                            <ReadOnlyTextField
                                label="Created By"
                                value={`${country.createdBy.firstName} ${country.createdBy.lastName} - ${country.createdBy.email}`}
                                InputProps={PersonAdornment()}
                            />
                        )}

                        {country.updatedBy && (
                            <ReadOnlyTextField
                                label="Updated By"
                                value={`${country.updatedBy.firstName} ${country.updatedBy.lastName} - ${country.updatedBy.email}`}
                                InputProps={PersonAdornment()}
                            />
                        )}
                    </>
                ) : (
                    <ReadOnlyTextField value="Error fetching country" />
                )}
            </Box>
        </Drawer>
    );
};

export default CountryDetailsDrawer;