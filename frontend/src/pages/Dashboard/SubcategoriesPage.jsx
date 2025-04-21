import React, { useState } from 'react';
import { DashboardImage, formatDate } from '../../assets/CustomComponents';
import DashboardPage from '../../components/Dashboard/DashboardPage';
import ImagePreviewModal from '../../components/Dashboard/Modal/ImagePreviewModal';
import SubcategoryDetailsDrawer from '../../components/Dashboard/Modal/Subcategory/SubcategoryDetailsDrawer';
import SubcategoryForm from '../../components/Dashboard/Modal/Subcategory/SubcategoryForm';
import { getSubcategories } from '../../store/actions/dashboardActions';

const SubcategoriesPage = () => {
    const itemsSelector = (state) => state.dashboard.subcategories;
    const loadingSelector = (state) => state.dashboard.loadingSubcategories;

    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreviewOpen, setImagePreviewOpen] = useState(false);

    const handleImageClick = (imageUrl) => {
        setSelectedImage(imageUrl);
        setImagePreviewOpen(true);
    };

    const columns = [
        { key: 'name', label: 'Name' },
        {
            key: 'image',
            label: 'Image',
            render: (item) => <DashboardImage item={item} handleImageClick={handleImageClick} />
        },
        { key: 'category.name', label: 'Category' },
        { key: 'createdAt', label: 'Created At', render: (item) => formatDate(item.createdAt) },
        { key: 'updatedAt', label: 'Updated At', render: (item) => formatDate(item.updatedAt) },
        { key: 'actions', label: 'Actions' }
    ];

    const handleExport = (subcategory) => ({
        ...subcategory,
        category: subcategory.category ? subcategory.category.name : 'N/A'
    });

    return (
        <>
            <DashboardPage
                title="Subcategories"
                columns={columns}
                itemsSelector={itemsSelector}
                loadingSelector={loadingSelector}
                fetchAction={getSubcategories}
                entityName="subcategory"
                FormComponent={SubcategoryForm}
                DetailsDrawerComponent={SubcategoryDetailsDrawer}
                transformFunction={handleExport}
                formItemProp="subcategory"
                detailsItemProp="subcategory"
            />

            <ImagePreviewModal open={imagePreviewOpen} onClose={() => setImagePreviewOpen(false)} imageUrl={selectedImage} />
        </>
    );
};

export default SubcategoriesPage;