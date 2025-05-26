import { useState } from 'react';
import { DashboardImage } from '../../components/custom/Dashboard';
import DashboardPage from '../../components/Dashboard/DashboardPage';
import ImagePreviewModal from '../../components/Dashboard/Modal/ImagePreviewModal';
import SlideshowDetailsDrawer from '../../components/Dashboard/Modal/Slideshow/SlideshowDetailsDrawer';
import SlideshowForm from '../../components/Dashboard/Modal/Slideshow/SlideshowForm';
import { getImages } from '../../store/actions/slideshowActions';

const SlideshowPage = () => {
    const itemsSelector = (state) => state.slideshow.images;
    const loadingSelector = (state) => state.slideshow.loading;

    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreviewOpen, setImagePreviewOpen] = useState(false);

    const handleImageClick = (imageUrl) => {
        setSelectedImage(imageUrl);
        setImagePreviewOpen(true);
    };

    const columns = [
        { key: 'title', label: 'Title' },
        { key: 'description', label: 'Description' },
        {
            key: 'image',
            label: 'Image',
            render: (item) => <DashboardImage item={item} handleImageClick={handleImageClick} />
        },
        { key: 'actions', label: 'Actions' }
    ];

    return (
        <>
            <DashboardPage
                title="Slideshow Images"
                columns={columns}
                itemsSelector={itemsSelector}
                loadingSelector={loadingSelector}
                fetchAction={getImages}
                entityName="slideshow"
                FormComponent={SlideshowForm}
                DetailsDrawerComponent={SlideshowDetailsDrawer}
                transformFunction={(item) => item}
                formItemProp="slideshow"
                detailsItemProp="slideshow"
            />

            <ImagePreviewModal open={imagePreviewOpen} onClose={() => setImagePreviewOpen(false)} imageUrl={selectedImage} />
        </>
    );
};

export default SlideshowPage;