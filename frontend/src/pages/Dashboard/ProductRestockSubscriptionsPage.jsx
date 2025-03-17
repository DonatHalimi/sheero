import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DashboardHeader, exportOptions, formatDate, LoadingDataGrid } from '../../assets/CustomComponents';
import { exportToExcel, exportToJSON } from '../../assets/DataExport';
import DashboardTable from '../../components/Dashboard/DashboardTable';
import DeleteModal from '../../components/Modal/DeleteModal';
import SubscriptionDetailsDrawer from '../../components/Modal/Product/SubscriptionDetailsDrawer';
import { getProductRestockSubscriptions } from '../../store/actions/dashboardActions';
import { getImageUrl } from '../../utils/config';

const ProductRestockSubscriptionsPage = () => {
    const dispatch = useDispatch();
    const { productRestockSubscriptions, loadingProductRestockSubscriptions } = useSelector((state) => state.dashboard);

    const [selectedSubscription, setSelectedSubscription] = useState(null);
    const [selectedSubscriptions, setSelectedSubscriptions] = useState([]);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deletionContext, setDeletionContext] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [viewDetailsOpen, setViewDetailsOpen] = useState(false);

    const itemsPerPage = 6;

    useEffect(() => {
        dispatch(getProductRestockSubscriptions());
    }, [dispatch]);

    const handleSelectSubscription = (newSelection) => {
        setSelectedSubscriptions(newSelection);
    };

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    const handleDeleteSuccess = () => {
        dispatch(getProductRestockSubscriptions());
        setSelectedSubscriptions([]);
    };

    const handleViewDetails = (sub) => {
        setSelectedSubscription(sub);
        setViewDetailsOpen(true);
    };

    const closeDrawer = () => {
        setViewDetailsOpen(false);
        setSelectedSubscription(null);
    };

    const handleBulkDelete = () => {
        if (selectedSubscriptions.length > 0) {
            setDeletionContext({
                endpoint: '/products/subscriptions/delete-bulk',
                data: { ids: selectedSubscriptions },
            });
            setDeleteModalOpen(true);
        }
    };

    const handleSingleDelete = (subscription) => {
        setDeletionContext({
            endpoint: `/products/subscriptions/delete/${subscription._id}`,
            data: null,
        });
        setDeleteModalOpen(true);
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

    const columns = [
        {
            key: 'productImage',
            label: 'Product Image',
            render: (item) =>
                <img
                    src={getImageUrl(item.productId.image)}
                    alt={item.productId.name}
                    width={70}
                    style={{ position: 'relative', top: '3px' }}
                    className='rounded-md'
                />
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
                            setDeleteItemOpen={handleBulkDelete}
                            itemName="Subscription"
                            exportOptions={exportOptions(productRestockSubscriptions, handleExport)}
                            showAddButton={false}
                        />
                        <DashboardTable
                            columns={columns}
                            data={productRestockSubscriptions}
                            selectedItems={selectedSubscriptions}
                            onSelectItem={handleSelectSubscription}
                            itemsPerPage={itemsPerPage}
                            currentPage={currentPage}
                            onPageChange={handlePageClick}
                            onViewDetails={handleViewDetails}
                            onDelete={handleSingleDelete}
                            showEditButton={false}
                        />
                    </>
                )}

                <DeleteModal
                    open={deleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                    deletionContext={deletionContext}
                    onDeleteSuccess={handleDeleteSuccess}
                    title={deletionContext?.endpoint.includes('bulk') ? 'Delete Subscriptions' : 'Delete Subscription'}
                    message={deletionContext?.endpoint.includes('bulk')
                        ? 'Are you sure you want to delete the selected subscriptions?'
                        : 'Are you sure you want to delete this subscription?'
                    }
                />

                <SubscriptionDetailsDrawer open={viewDetailsOpen} onClose={closeDrawer} subscription={selectedSubscription} />
            </div>
        </div>
    );
};

export default ProductRestockSubscriptionsPage;