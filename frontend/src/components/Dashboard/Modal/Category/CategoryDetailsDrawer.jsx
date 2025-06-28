import { Box, Drawer, useTheme } from '@mui/material';
import { paperPropsSx } from '../../../../assets/sx';
import { getImageUrl } from '../../../../utils/config/config';
import { DateAdornment, IdAdornment, PersonAdornment } from '../../../custom/Adornments';
import { DetailsTitle } from '../../../custom/Dashboard';
import { BoxBetween, CloseButton, ReadOnlyTextField } from '../../../custom/MUI';
import { formatDate } from '../../../custom/utils';
import { downloadCategoryData } from '../../../Product/Utils/DataExport';

const CategoryDetailsDrawer = ({ open, onClose, category, onEdit, onDelete }) => {
    const theme = useTheme();

    const handleEdit = () => {
        onClose();
        onEdit(category);
    };

    const handleExport = () => {
        downloadCategoryData(category);
    };

    const handleDelete = () => {
        onClose();
        onDelete(category);
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
                {category ? (
                    <>
                        <DetailsTitle
                            entity={category}
                            entityName="Category"
                            handleEdit={handleEdit}
                            handleExport={handleExport}
                            handleDelete={handleDelete}
                        />

                        <ReadOnlyTextField
                            label="Category ID"
                            value={category._id}
                            InputProps={IdAdornment()}
                        />

                        <ReadOnlyTextField
                            label="Name"
                            value={category.name}
                        />

                        <Box className="flex flex-col items-center mt-3 mb-3">
                            <img
                                src={getImageUrl(category.image)}
                                alt={`${category.name} image`}
                                className='w-1/3'
                            />
                        </Box>

                        <BoxBetween>
                            <ReadOnlyTextField
                                label="Created At"
                                value={formatDate(category.createdAt)}
                                InputProps={DateAdornment()}
                            />
                            <ReadOnlyTextField
                                label="Updated At"
                                value={formatDate(category.updatedAt)}
                                InputProps={DateAdornment()}
                            />
                        </BoxBetween>

                        {category.createdBy && (
                            <ReadOnlyTextField
                                label="Created By"
                                value={`${category.createdBy.firstName} ${category.createdBy.lastName} - ${category.createdBy.email}`}
                                InputProps={PersonAdornment()}
                            />
                        )}

                        {category.updatedBy && (
                            <ReadOnlyTextField
                                label="Updated By"
                                value={`${category.updatedBy.firstName} ${category.updatedBy.lastName} - ${category.updatedBy.email}`}
                                InputProps={PersonAdornment()}
                            />
                        )}
                    </>
                ) : (
                    <ReadOnlyTextField value="Error fetching category" />
                )}
            </Box>
        </Drawer>
    );
};

export default CategoryDetailsDrawer;