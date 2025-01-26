import { Box, Drawer, Typography } from '@mui/material';
import React from 'react';
import { BoxBetween, CloseButton, downloadCityData, EditExportButtons, ReadOnlyTextField } from '../../../assets/CustomComponents';
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