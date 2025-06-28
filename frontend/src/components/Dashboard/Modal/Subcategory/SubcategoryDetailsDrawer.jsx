import { Box, Drawer, useTheme } from '@mui/material';
import { paperPropsSx } from '../../../../assets/sx';
import { getImageUrl } from '../../../../utils/config/config';
import { DateAdornment, IdAdornment, PersonAdornment } from '../../../custom/Adornments';
import { DetailsTitle } from '../../../custom/Dashboard';
import { BoxBetween, CloseButton, ReadOnlyTextField } from '../../../custom/MUI';
import { formatDate } from '../../../custom/utils';
import { downloadSubcategoryData } from '../../../Product/Utils/DataExport';

const SubcategoryDetailsDrawer = ({ open, onClose, subcategory, onEdit, onDelete }) => {
    const theme = useTheme();

    const handleEdit = () => {
        onClose();
        onEdit(subcategory);
    };

    const handleExport = () => {
        downloadSubcategoryData(subcategory);
    };

    const handleDelete = () => {
        onClose();
        onDelete(subcategory);
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
                {subcategory ? (
                    <>
                        <DetailsTitle
                            entity={subcategory}
                            entityName="Subcategory"
                            handleEdit={handleEdit}
                            handleExport={handleExport}
                            handleDelete={handleDelete}
                        />

                        <ReadOnlyTextField
                            label="Subcategory ID"
                            value={subcategory._id}
                            InputProps={IdAdornment()}
                        />

                        <ReadOnlyTextField
                            label="Name"
                            value={subcategory.name}
                        />

                        <ReadOnlyTextField
                            label="Category ID"
                            value={subcategory.category._id}
                            InputProps={IdAdornment()}
                        />

                        <ReadOnlyTextField
                            label="Category"
                            value={subcategory.category.name}
                        />

                        <Box className="flex flex-col items-center mt-3 mb-3">
                            <img
                                src={getImageUrl(subcategory.image)}
                                alt={`${subcategory.name} image`}
                                className='w-1/3'
                            />
                        </Box>

                        <BoxBetween>
                            <ReadOnlyTextField
                                label="Created At"
                                value={formatDate(subcategory.createdAt)}
                                InputProps={DateAdornment()}
                            />
                            <ReadOnlyTextField
                                label="Updated At"
                                value={formatDate(subcategory.updatedAt)}
                                InputProps={DateAdornment()}
                            />
                        </BoxBetween>


                        {subcategory.createdBy && (
                            <ReadOnlyTextField
                                label="Created By"
                                value={`${subcategory.createdBy.firstName} ${subcategory.createdBy.lastName} - ${subcategory.createdBy.email}`}
                                InputProps={PersonAdornment()}
                            />
                        )}

                        {subcategory.updatedBy && (
                            <ReadOnlyTextField
                                label="Updated By"
                                value={`${subcategory.updatedBy.firstName} ${subcategory.updatedBy.lastName} - ${subcategory.updatedBy.email}`}
                                InputProps={PersonAdornment()}
                            />
                        )}
                    </>
                ) : (
                    <ReadOnlyTextField value="Error fetching subcategory" />
                )}
            </Box>
        </Drawer>
    );
};

export default SubcategoryDetailsDrawer;