import { Box, Drawer, Typography } from '@mui/material';
import React from 'react';
import { BoxBetween, CloseButton, DateAdornment, EditExportButtons, formatDate, IdAdornment, PersonAdornment, ReadOnlyTextField } from '../../../assets/CustomComponents';
import { downloadCountryData } from '../../../assets/DataExport';
import { drawerPaperSx } from '../../../assets/sx';

const CountryDetailsDrawer = ({ open, onClose, country, onEdit }) => {
    const handleEditClick = () => {
        onClose();
        onEdit(country);
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
                        <Typography className='!font-bold !text-lg'>
                            {country.name}'s Details
                        </Typography>

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

                        <EditExportButtons
                            onEditClick={handleEditClick}
                            onExportClick={() => downloadCountryData(country)}
                        />
                    </>
                ) : (
                    <ReadOnlyTextField value="Error fetching country" />
                )}
            </Box>
        </Drawer>
    );
};

export default CountryDetailsDrawer;