import { Tooltip } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DashboardHeader, exportOptions, formatDate, LoadingDataGrid } from '../../assets/CustomComponents';
import { exportToExcel, exportToJSON } from '../../assets/DataExport';
import DashboardTable from '../../components/Dashboard/DashboardTable';
import DeleteModal from '../../components/Modal/DeleteModal';
import ImagePreviewModal from '../../components/Modal/ImagePreviewModal';
import SubscriptionDetailsDrawer from '../../components/Modal/Product/SubscriptionDetailsDrawer';
import { getProductRestockSubscriptions } from '../../store/actions/dashboardActions';
import { getImageUrl } from '../../utils/config';

const ProductRestockSubscriptionsPage = () => {
    const dispatch = useDispatch();
    const { productRestockSubscriptions, loadingProductRestockSubscriptions } = useSelector((state) => state.dashboard);

    const [selectedSubscription, setSelectedSubscription] = useState(null);
    const [selectedSubscriptions, setSelectedSubscriptions] = useState([]);
    const [deleteSubscriptionOpen, setDeleteSubscriptionOpen] = useState(false);
    const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [viewDetailsOpen, setViewDetailsOpen] = useState(false);

    const itemsPerPage = 6;

    useEffect(() => {
        dispatch(getProductRestockSubscriptions());
    }, [dispatch]);

    const handleSelectSubscription = (subscriptionId) => {
        const id = Array.isArray(subscriptionId) ? subscriptionId[0] : subscriptionId;
        setSelectedSubscriptions((prev) =>
            prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]
        );
    };

    const handleSelectAll = (e) => {
        setSelectedSubscriptions(e.target.checked ? productRestockSubscriptions.map((sub) => sub._id) : []);
    };

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    }

    const handleImageClick = (imageUrl) => {
        setSelectedSubscription(imageUrl);
        setImagePreviewOpen(true);
    };

    const getSelectedSubscriptions = () => {
        return selectedSubscriptions
            .map((id) => productRestockSubscriptions.find((sub) => sub._id === id))
            .filter((sub) => sub);
    };

    const handleDeleteSuccess = () => {
        dispatch(getProductRestockSubscriptions());
        setSelectedSubscriptions([]);
    };

    const flattenedData = productRestockSubscriptions.map((sub) => ({
        ...sub,
        productId: sub.productId._id,
        productImage: sub.productId.image,
        productName: sub.productId.name,
        productInventory: sub.productId.inventoryCount,
        email: sub.email,
        createdAt: sub.createdAt,
    }));

    const handleExport = (data, format) => {
        format === 'excel' ? exportToExcel(flattenedData, 'productRestockSubscriptions_data') : exportToJSON(data, 'productRestockSubscriptions_data');
    };

    const handleViewDetails = (sub) => {
        setSelectedSubscription(sub);
        setViewDetailsOpen(true);
    };

    const closeDrawer = () => {
        setViewDetailsOpen(false);
        setSelectedSubscription(null);
    };

    const columns = [
        {
            key: 'productImage',
            label: 'Product Image',
            render: (item) =>
                <Tooltip title='Click to preview' placement='left' arrow>
                    <img
                        src={getImageUrl(item.productId.image)}
                        alt={item.productId.image}
                        width={70}
                        style={{ position: 'relative', top: '3px' }}
                        onClick={() => handleImageClick(getImageUrl(item.image))}
                        className='rounded-md cursor-pointer'
                    />
                </Tooltip>
        },
        { key: 'productName', label: 'Product Name', render: (row) => row.productId?.name },
        { key: 'productInventory', label: 'Product Inventory', render: (row) => row.productId?.inventoryCount || 0 },
        { key: 'email', label: 'User Email' },
        { key: 'createdAt', label: 'Created At', render: (row) => formatDate(row.createdAt) },
        { key: 'actions', label: 'Actions' },
    ];

    return (
        <div className='container mx-auto max-w-screen-2xl px-4 mt-20'>
            <div className='flex flex-col items-center justify-center'>
                {loadingProductRestockSubscriptions ? (
                    <LoadingDataGrid />
                ) : (
                    <>
                        <DashboardHeader
                            title="Product Restock Subscriptions"
                            selectedItems={selectedSubscriptions}
                            setDeleteItemOpen={setDeleteSubscriptionOpen}
                            itemName="Subscription"
                            exportOptions={exportOptions(productRestockSubscriptions, handleExport)}
                            showAddButton={false}
                        />
                        <DashboardTable
                            columns={columns}
                            data={productRestockSubscriptions}
                            selectedItems={selectedSubscriptions}
                            onSelectItem={handleSelectSubscription}
                            onSelectAll={handleSelectAll}
                            itemsPerPage={itemsPerPage}
                            currentPage={currentPage}
                            onPageChange={handlePageClick}
                            onViewDetails={handleViewDetails}
                            showEditButton={false}
                        />
                    </>
                )}

                <DeleteModal
                    open={deleteSubscriptionOpen}
                    onClose={() => setDeleteSubscriptionOpen(false)}
                    items={getSelectedSubscriptions()}
                    onDeleteSuccess={handleDeleteSuccess}
                    endpoint="/products/subscriptions/delete-bulk"
                    title="Delete Subscriptions"
                    message="Are you sure you want to delete the selected subscriptions?"
                />

                <SubscriptionDetailsDrawer open={viewDetailsOpen} onClose={closeDrawer} subscription={selectedSubscription} />

                <ImagePreviewModal open={imagePreviewOpen} onClose={() => setImagePreviewOpen(false)} imageUrl={selectedSubscription} />
            </div>
        </div>
    );
};

export default ProductRestockSubscriptionsPage;