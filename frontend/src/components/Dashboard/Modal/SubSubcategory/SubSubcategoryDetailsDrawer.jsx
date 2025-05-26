import { Box, Drawer } from '@mui/material';
import { drawerPaperSx } from '../../../../assets/sx';
import { DateAdornment, IdAdornment, PersonAdornment } from '../../../custom/Adornments';
import { DetailsTitle } from '../../../custom/Dashboard';
import { BoxBetween, CloseButton, ReadOnlyTextField } from '../../../custom/MUI';
import { formatDate } from '../../../custom/utils';
import { downloadSubSubcategoryData } from '../../../Product/Utils/DataExport';

const SubSubcategoryDetailsDrawer = ({ open, onClose, subSubcategory, onEdit, onDelete }) => {
    const handleEdit = () => {
        onClose();
        onEdit(subSubcategory);
    };

    const handleExport = () => {
        downloadSubSubcategoryData(subSubcategory);
    };

    const handleDelete = () => {
        onClose();
        onDelete(subSubcategory);
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
                {subSubcategory ? (
                    <>
                        <DetailsTitle
                            entity={subSubcategory}
                            entityName="SubSubcategory"
                            handleEdit={handleEdit}
                            handleExport={handleExport}
                            handleDelete={handleDelete}
                        />

                        <ReadOnlyTextField
                            label="SubSubcategory ID"
                            value={subSubcategory._id}
                            InputProps={IdAdornment()}
                        />

                        <ReadOnlyTextField
                            label="Name"
                            value={subSubcategory.name}
                        />

                        <ReadOnlyTextField
                            label="Subcategory ID"
                            value={subSubcategory.subcategory._id}
                            InputProps={IdAdornment()}
                        />

                        <ReadOnlyTextField
                            label="Subcategory"
                            value={subSubcategory.subcategory.name}
                        />

                        <BoxBetween>
                            <ReadOnlyTextField
                                label="Created At"
                                value={formatDate(subSubcategory.createdAt)}
                                InputProps={DateAdornment()}
                            />
                            <ReadOnlyTextField
                                label="Updated At"
                                value={formatDate(subSubcategory.updatedAt)}
                                InputProps={DateAdornment()}
                            />
                        </BoxBetween>

                        {subSubcategory.createdBy && (
                            <ReadOnlyTextField
                                label="Created By"
                                value={`${subSubcategory.createdBy.firstName} ${subSubcategory.createdBy.lastName} - ${subSubcategory.createdBy.email}`}
                                InputProps={PersonAdornment()}
                            />
                        )}

                        {subSubcategory.updatedBy && (
                            <ReadOnlyTextField
                                label="Updated By"
                                value={`${subSubcategory.updatedBy.firstName} ${subSubcategory.updatedBy.lastName} - ${subSubcategory.updatedBy.email}`}
                                InputProps={PersonAdornment()}
                            />
                        )}
                    </>
                ) : (
                    <ReadOnlyTextField value="Error fetching subSubcategory" />
                )}
            </Box>
        </Drawer>
    );
};

export default SubSubcategoryDetailsDrawer;