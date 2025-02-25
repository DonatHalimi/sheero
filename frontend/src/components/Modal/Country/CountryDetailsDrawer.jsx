import { Box, Drawer, Typography } from '@mui/material';
import React from 'react';
import { BoxBetween, CloseButton, EditExportButtons, IdAdornment, ReadOnlyTextField } from '../../../assets/CustomComponents';
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