import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DashboardHeader, exportOptions, LoadingDataGrid, RenderReturnStatus } from '../../assets/CustomComponents';
import { exportToExcel, exportToJSON } from '../../assets/DataExport';
import DashboardTable from '../../components/Dashboard/DashboardTable';
import DeleteModal from '../../components/Modal/DeleteModal';
import AddReturnRequestModal from '../../components/Modal/ReturnRequest/AddReturnRequestModal';
import EditReturnRequestModal from '../../components/Modal/ReturnRequest/EditReturnRequestModal';
import ReturnDetailsDrawer from '../../components/Modal/ReturnRequest/ReturnDetailsDrawer';
import { getReturnRequests } from '../../store/actions/dashboardActions';

const ReturnsPage = () => {
    const { returnRequests, loadingReturns } = useSelector((state) => state.dashboard);
    const dispatch = useDispatch();

    const [selectedReturnRequest, setSelectedReturnRequest] = useState(null);
    const [selectedReturnRequests, setSelectedReturnRequests] = useState([]);
    const [addReturnRequestOpen, setAddReturnRequestOpen] = useState(false);
    const [editReturnRequestOpen, setEditReturnRequestOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deletionContext, setDeletionContext] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [viewDetailsOpen, setViewDetailsOpen] = useState(false);

    const itemsPerPage = 5;

    useEffect(() => {
        dispatch(getReturnRequests());
    }, [dispatch]);

    const handleSelectReturnRequest = (newSelection) => {
        setSelectedReturnRequests(newSelection);
    };

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    const handleEdit = (returnRequest) => {
        setSelectedReturnRequest(returnRequest);
        setEditReturnRequestOpen(true);
    };

    const handleEditFromDrawer = (returnRequest) => {
        setViewDetailsOpen(false);
        setSelectedReturnRequest(returnRequest);
        setEditReturnRequestOpen(true);
    };

    const handleDeleteSuccess = () => {
        dispatch(getReturnRequests());
        setSelectedReturnRequests([]);
    };

    const handleViewDetails = (returnRequest) => {
        setSelectedReturnRequest(returnRequest);
        setViewDetailsOpen(true);
    };

    const closeDrawer = () => {
        setViewDetailsOpen(false);
        setSelectedReturnRequest(null);
    };

    const handleBulkDelete = () => {
        if (selectedReturnRequests.length > 0) {
            setDeletionContext({
                endpoint: '/returns/delete-bulk',
                data: { ids: selectedReturnRequests },
            });
            setDeleteModalOpen(true);
        }
    };

    const handleSingleDelete = (returnRequest) => {
        setDeletionContext({
            endpoint: `/returns/delete/${returnRequest._id}`,
            data: null,
        });
        setDeleteModalOpen(true);
    };

    const columns = [
        { key: 'id', label: 'Return ID' },
        { key: 'order', label: 'Order ID' },
        { key: 'user.email', label: 'User' },
        { key: 'products', label: 'Products' },
        { key: 'reason', label: 'Reason' },
        {
            key: 'status',
            label: 'Status',
            render: (returnRequest) => <RenderReturnStatus returnRequest={returnRequest} />,
        },
        { key: 'actions', label: 'Actions' }
    ];

    const renderProducts = (products) => {
        return products.map(product => product.name).join(', ');
    };

    const userFormat = (returnRequest) => `${returnRequest.user.firstName} ${returnRequest.user.lastName} - ${returnRequest.user.email}`;

    const handleExport = (data, format) => {
        const flattenedReturnRequests = data.map(returnRequest => ({
            ...returnRequest,
            products: renderProducts(returnRequest.products),
            user: userFormat(returnRequest),
        }))

        format === 'excel' ? exportToExcel(flattenedReturnRequests, 'returnRequests_data') : exportToJSON(data, 'returnRequests_data');
    }

    return (
        <div className='container mx-auto max-w-screen-2xl px-4 mt-20'>
            <div className='flex flex-col items-center justify-center'>
                {loadingReturns ? (
                    <LoadingDataGrid />
                ) : (
                    <>
                        <DashboardHeader
                            title="Return Requests"
                            selectedItems={selectedReturnRequests}
                            setAddItemOpen={setAddReturnRequestOpen}
                            setDeleteItemOpen={handleBulkDelete}
                            itemName="Return Request"
                            exportOptions={exportOptions(returnRequests, handleExport)}
                        />

                        <DashboardTable
                            columns={columns}
                            data={returnRequests.map(request => ({
                                ...request,
                                products: renderProducts(request.products),
                            }))}
                            selectedItems={selectedReturnRequests}
                            onSelectItem={handleSelectReturnRequest}
                            itemsPerPage={itemsPerPage}
                            currentPage={currentPage}
                            onPageChange={handlePageClick}
                            onEdit={handleEdit}
                            onViewDetails={handleViewDetails}
                            onDelete={handleSingleDelete}
                        />
                    </>
                )}

                <AddReturnRequestModal open={addReturnRequestOpen} onClose={() => setAddReturnRequestOpen(false)} onAddSuccess={() => dispatch(getReturnRequests())} />
                <EditReturnRequestModal open={editReturnRequestOpen} onClose={() => setEditReturnRequestOpen(false)} returnRequest={selectedReturnRequest} onViewDetails={handleViewDetails} onEditSuccess={() => dispatch(getReturnRequests())} />
                <ReturnDetailsDrawer open={viewDetailsOpen} onClose={closeDrawer} returnRequest={selectedReturnRequest} onEdit={handleEditFromDrawer} />

                <DeleteModal
                    open={deleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                    deletionContext={deletionContext}
                    onDeleteSuccess={handleDeleteSuccess}
                    title={deletionContext?.endpoint.includes('bulk') ? 'Delete Return Requests' : 'Delete Return Request'}
                    message={
                        deletionContext?.endpoint.includes('bulk')
                            ? 'Are you sure you want to delete the selected return requests?'
                            : 'Are you sure you want to delete this return request?'
                    }
                />
            </div>
        </div>
    );
};

export default ReturnsPage;