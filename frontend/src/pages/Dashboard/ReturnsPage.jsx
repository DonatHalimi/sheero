import React, { useContext, useEffect, useState } from 'react';
import { DashboardHeader } from '../../assets/CustomComponents';
import useAxios from '../../axiosInstance';
import DashboardTable from '../../components/Dashboard/DashboardTable';
import DeleteModal from '../../components/Modal/DeleteModal';
import EditReturnRequestModal from '../../components/Modal/ReturnRequest/EditReturnRequestModal';
import { AuthContext } from '../../context/AuthContext';
import AddReturnRequestModal from '../../components/Modal/ReturnRequest/AddReturnRequestModal';

const ReturnsPage = () => {
    const [returnRequests, setReturnRequests] = useState([]);
    const [selectedReturnRequest, setSelectedReturnRequest] = useState(null);
    const [selectedReturnRequests, setSelectedReturnRequests] = useState([]);
    const [addReturnRequestOpen, setAddReturnRequestOpen] = useState(false);
    const [editReturnRequestOpen, setEditReturnRequestOpen] = useState(false);
    const [deleteReturnRequestOpen, setDeleteReturnRequestOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 5;

    const { refreshToken } = useContext(AuthContext);
    const axiosInstance = useAxios(refreshToken);

    useEffect(() => {
        fetchReturnRequests();
    }, [editReturnRequestOpen, deleteReturnRequestOpen, axiosInstance]);

    const fetchReturnRequests = async () => {
        try {
            const response = await axiosInstance.get('/returns/get');
            setReturnRequests(response.data.returnRequests);
        } catch (error) {
            console.error('Error fetching return requests', error);
        }
    };

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
        { label: 'Order ID', key: 'order' },
        { label: 'Products', key: 'products' },
        { label: 'User', key: 'user.email' },
        { label: 'Reason', key: 'reason' },
        { label: 'Status', key: 'status' },
        { label: 'Actions', key: 'actions' }
    ];

    const renderProducts = (products) => {
        return products.map(product => product.name).join(', ');
    };

    return (
        <div className='container mx-auto max-w-screen-2xl px-4 mt-20'>
            <div className='flex flex-col items-center justify-center'>
                <DashboardHeader
                    title="Return Requests"
                    selectedItems={selectedReturnRequests}
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

                <AddReturnRequestModal open={addReturnRequestOpen} onClose={() => setAddReturnRequestOpen(false)} onAddSuccess={fetchReturnRequests} />
                <EditReturnRequestModal open={editReturnRequestOpen} onClose={() => setEditReturnRequestOpen(false)} returnRequest={selectedReturnRequest} onEditSuccess={fetchReturnRequests} />
                <DeleteModal
                    open={deleteReturnRequestOpen}
                    onClose={() => setDeleteReturnRequestOpen(false)}
                    items={selectedReturnRequests.map(id => returnRequests.find(request => request._id === id)).filter(request => request)}
                    onDeleteSuccess={fetchReturnRequests}
                    endpoint="/returns/delete-bulk"
                    title="Delete Return Requests"
                    message="Are you sure you want to delete the selected return requests?"
                />
            </div>
        </div>
    );
};

export default ReturnsPage;