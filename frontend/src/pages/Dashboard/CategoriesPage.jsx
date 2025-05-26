import { useState } from 'react';
import { DashboardImage } from '../../components/custom/Dashboard';
import { formatDate } from '../../components/custom/utils';
import DashboardPage from '../../components/Dashboard/DashboardPage';
import CategoryDetailsDrawer from '../../components/Dashboard/Modal/Category/CategoryDetailsDrawer';
import CategoryForm from '../../components/Dashboard/Modal/Category/CategoryForm';
import ImagePreviewModal from '../../components/Dashboard/Modal/ImagePreviewModal';
import { getCategories } from '../../store/actions/categoryActions';

const CategoriesPage = () => {
    const itemsSelector = (state) => state.categories.categories;
    const loadingSelector = (state) => state.categories.loadingCategories;

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
        { key: 'createdAt', label: 'Created At', render: (item) => formatDate(item.createdAt) },
        { key: 'updatedAt', label: 'Updated At', render: (item) => formatDate(item.updatedAt) },
        { key: 'actions', label: 'Actions' }
    ];

    return (
        <>
            <DashboardPage
                title="Categories"
                columns={columns}
                itemsSelector={itemsSelector}
                loadingSelector={loadingSelector}
                fetchAction={getCategories}
                entityName="category"
                FormComponent={CategoryForm}
                DetailsDrawerComponent={CategoryDetailsDrawer}
                transformFunction={(item) => item}
                formItemProp="category"
                detailsItemProp="category"
            />

            <ImagePreviewModal open={imagePreviewOpen} onClose={() => setImagePreviewOpen(false)} imageUrl={selectedImage} />
        </>
    );
};

export default CategoriesPage;