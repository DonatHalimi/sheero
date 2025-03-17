import { Box, Drawer, Typography } from '@mui/material';
import React from 'react';
import { BoxBetween, CloseButton, DateAdornment, EditExportButtons, formatDate, IdAdornment, PersonAdornment, ReadOnlyTextField } from '../../../assets/CustomComponents';
import { downloadCityData } from '../../../assets/DataExport';
import { drawerPaperSx } from '../../../assets/sx';

const CityDetailsDrawer = ({ open, onClose, city, onEdit }) => {
    const handleEditClick = () => {
        onClose();
        onEdit(city);
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
                {city ? (
                    <>
                        <Typography className='!font-bold !text-lg'>
                            {city.name}'s Details
                        </Typography>

                        <ReadOnlyTextField
                            label="City ID"
                            value={city._id}
                            InputProps={IdAdornment()}
                        />

                        <BoxBetween>
                            <ReadOnlyTextField
                                label="Name"
                                value={city.name}
                            />

                            <ReadOnlyTextField
                                label="Zip Code"
                                value={city.zipCode}
                            />
                        </BoxBetween>

                        <ReadOnlyTextField
                            label="Country ID"
                            value={city.country._id}
                            InputProps={IdAdornment()}
                        />

                        <BoxBetween>
                            <ReadOnlyTextField
                                label="Country Code"
                                value={city.country.countryCode}
                            />
                            <ReadOnlyTextField
                                label="Country"
                                value={city.country.name}
                            />
                        </BoxBetween>

                        <BoxBetween>
                            <ReadOnlyTextField
                                label="Created At"
                                value={formatDate(city.createdAt)}
                                InputProps={DateAdornment()}
                            />
                            <ReadOnlyTextField
                                label="Updated At"
                                value={formatDate(city.updatedAt)}
                                InputProps={DateAdornment()}
                            />
                        </BoxBetween>

                        {city.createdBy && (
                            <ReadOnlyTextField
                                label="Created By"
                                value={`${city.createdBy.firstName} ${city.createdBy.lastName} - ${city.createdBy.email}`}
                                InputProps={PersonAdornment()}
                            />
                        )}

                        {city.updatedBy && (
                            <ReadOnlyTextField
                                label="Updated By"
                                value={`${city.updatedBy.firstName} ${city.updatedBy.lastName} - ${city.updatedBy.email}`}
                                InputProps={PersonAdornment()}
                            />
                        )}

                        <EditExportButtons
                            onEditClick={handleEditClick}
                            onExportClick={() => downloadCityData(city)}
                        />
                    </>
                ) : (
                    <ReadOnlyTextField value="Error fetching city" />
                )}
            </Box>
        </Drawer>
    );
};

export default CityDetailsDrawer;