import { Box, Drawer, useTheme } from '@mui/material';
import { paperPropsSx } from '../../../../assets/sx';
import { DateAdornment, IdAdornment, PersonAdornment } from '../../../custom/Adornments';
import { DetailsTitle } from '../../../custom/Dashboard';
import { BoxBetween, CloseButton, ReadOnlyTextField } from '../../../custom/MUI';
import { formatDate } from '../../../custom/utils';
import { downloadCityData } from '../../../Product/Utils/DataExport';

const CityDetailsDrawer = ({ open, onClose, city, onEdit, onDelete }) => {
    const theme = useTheme();

    const handleEdit = () => {
        onClose();
        onEdit(city);
    };

    const handleExport = () => {
        downloadCityData(city);
    };

    const handleDelete = () => {
        onClose();
        onDelete(city);
    };

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
                {city ? (
                    <>
                        <DetailsTitle
                            entity={city}
                            entityName="City"
                            handleEdit={handleEdit}
                            handleExport={handleExport}
                            handleDelete={handleDelete}
                        />

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
                    </>
                ) : (
                    <ReadOnlyTextField value="Error fetching city" />
                )}
            </Box>
        </Drawer>
    );
};

export default CityDetailsDrawer;