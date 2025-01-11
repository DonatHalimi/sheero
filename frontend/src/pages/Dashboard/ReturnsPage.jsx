import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DashboardHeader, formatDate, LoadingDataGrid } from '../../assets/CustomComponents';
import DashboardTable from '../../components/Dashboard/DashboardTable';
import DeleteModal from '../../components/Modal/DeleteModal';
import AddReturnRequestModal from '../../components/Modal/ReturnRequest/AddReturnRequestModal';
import EditReturnRequestModal from '../../components/Modal/ReturnRequest/EditReturnRequestModal';
import { getReturnRequests } from '../../store/actions/dashboardActions';

const ReturnsPage = () => {
    const { returnRequests, loadingReturns } = useSelector((state) => state.dashboard);
    const dispatch = useDispatch();

    const [selectedReturnRequest, setSelectedReturnRequest] = useState(null);
    const [selectedReturnRequests, setSelectedReturnRequests] = useState([]);
    const [addReturnRequestOpen, setAddReturnRequestOpen] = useState(false);
    const [editReturnRequestOpen, setEditReturnRequestOpen] = useState(false);
    const [deleteReturnRequestOpen, setDeleteReturnRequestOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 5;

    useEffect(() => {
        dispatch(getReturnRequests());
    }, [dispatch]);

    const handleSelectReturnRequest = (requestId) => {
        const id = Array.isArray(requestId) ? requestId[0] : requestId;
        setSelectedReturnRequests((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((selectedId) => selectedId !== id)
                : [...prevSelected, id]
        );
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedReturnRequests(returnRequests.map(request => request._id));
        } else {
            setSelectedReturnRequests([]);
        }
    };

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    const handleEdit = (returnRequest) => {
        setSelectedReturnRequest(returnRequest);
        setEditReturnRequestOpen(true);
    };

    const columns = [
        { key: 'order', label: 'Order ID' },
        { key: 'user.email', label: 'User' },
        { key: 'products', label: 'Products' },
        { key: 'reason', label: 'Reason' },
        {
            key: 'createdAt',
            label: 'Created At',
            render: (returnData) => {
                const date = returnData.createdAt ? new Date(returnData.createdAt) : null;
                if (date) {
                    return formatDate(date);
                }
                return 'N/A';
            }
        },
        { key: 'status', label: 'Status' },
        { key: 'actions', label: 'Actions' }
    ];

    const renderProducts = (products) => {
        return products.map(product => product.name).join(', ');
    };

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
                            setDeleteItemOpen={setDeleteReturnRequestOpen}
                            itemName="Return Request"
                        />

                        <DashboardTable
                            columns={columns}
                            data={returnRequests.map(request => ({
                                ...request,
                                products: renderProducts(request.products),
                            }))}
                            selectedItems={selectedReturnRequests}
                            onSelectItem={handleSelectReturnRequest}
                            onSelectAll={handleSelectAll}
                            itemsPerPage={itemsPerPage}
                            currentPage={currentPage}
                            onPageChange={handlePageClick}
                            onEdit={handleEdit}
                        />
                    </>
                )}

                <AddReturnRequestModal open={addReturnRequestOpen} onClose={() => setAddReturnRequestOpen(false)} onAddSuccess={() => dispatch(getReturnRequests())} />
                <EditReturnRequestModal open={editReturnRequestOpen} onClose={() => setEditReturnRequestOpen(false)} returnRequest={selectedReturnRequest} onEditSuccess={() => dispatch(getReturnRequests())} />
                <DeleteModal
                    open={deleteReturnRequestOpen}
                    onClose={() => setDeleteReturnRequestOpen(false)}
                    items={selectedReturnRequests.map(id => returnRequests.find(request => request._id === id)).filter(request => request)}
                    onDeleteSuccess={() => {
                        dispatch(getReturnRequests())
                        setSelectedReturnRequests([])
                    }}
                    endpoint="/returns/delete-bulk"
                    title="Delete Return Requests"
                    message="Are you sure you want to delete the selected return requests?"
                />
            </div>
        </div>
    );
};

export default ReturnsPage;