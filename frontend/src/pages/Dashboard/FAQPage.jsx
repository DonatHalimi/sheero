import { Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { ActionButton, BrownCreateOutlinedIcon, OutlinedBrownButton } from '../../assets/CustomComponents';
import useAxios from '../../axiosInstance';
import DashboardTable from '../../components/Dashboard/DashboardTable';
import AddFAQModal from '../../components/Modal/FAQ/AddFAQModal';
import EditFAQModal from '../../components/Modal/FAQ/EditFAQModal';
import DeleteModal from '../../components/Modal/DeleteModal';
import { AuthContext } from '../../context/AuthContext';

const FAQPage = () => {
    const [faqs, setFaqs] = useState([]);
    const [selectedFaq, setSelectedFaq] = useState(null);
    const [selectedFaqs, setSelectedFaqs] = useState([]);
    const [addFaqOpen, setAddFaqOpen] = useState(false);
    const [editFaqOpen, setEditFaqOpen] = useState(false);
    const [deleteFaqOpen, setDeleteFaqOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 5;

    const { refreshToken } = useContext(AuthContext);
    const axiosInstance = useAxios(refreshToken);

    useEffect(() => {
        fetchFAQs();
    }, [addFaqOpen, editFaqOpen, deleteFaqOpen, axiosInstance]);

    const fetchFAQs = async () => {
        try {
            const response = await axiosInstance.get('/faq/get');
            setFaqs(response.data);
        } catch (error) {
            console.error('Error fetching FAQ items', error);
        }
    };

    const handleSelectFaq = (faqId) => {
        const id = Array.isArray(faqId) ? faqId[0] : faqId;

        setSelectedFaqs((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((selectedId) => selectedId !== id)
                : [...prevSelected, id]
        );
    };

    const handleSelectAll = (e) => {
        setSelectedFaqs(e.target.checked ? faqs.map(faq => faq._id) : []);
    };

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    const columns = [
        { key: 'question', label: 'Question' },
        { key: 'answer', label: 'Answer' },
        { key: 'actions', label: 'Actions' }
    ];

    const renderActionButtons = (faq) => (
        <ActionButton onClick={() => { setSelectedFaq(faq); setEditFaqOpen(true); }}>
            <BrownCreateOutlinedIcon />
        </ActionButton>
    );

    const renderTableActions = () => (
        <div className='flex items-center justify-between w-full mb-4'>
            <Typography variant='h5'>FAQs</Typography>
            <div>
                <OutlinedBrownButton onClick={() => setAddFaqOpen(true)} className='!mr-4'>
                    Add FAQ
                </OutlinedBrownButton>
                {selectedFaqs.length > 0 && (
                    <OutlinedBrownButton
                        onClick={() => setDeleteFaqOpen(true)}
                        disabled={selectedFaqs.length === 0}
                    >
                        {selectedFaqs.length > 1 ? 'Delete Selected FAQ items' : 'Delete FAQ item'}
                    </OutlinedBrownButton>
                )}
            </div>
        </div>
    );

    return (
        <div className='container mx-auto max-w-screen-2xl px-4 mt-20'>
            <div className='flex flex-col items-center justify-center'>
                <DashboardTable
                    columns={columns}
                    data={faqs}
                    selectedItems={selectedFaqs}
                    onSelectItem={handleSelectFaq}
                    onSelectAll={handleSelectAll}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={handlePageClick}
                    renderActionButtons={renderActionButtons}
                    renderTableActions={renderTableActions}
                />

                <AddFAQModal open={addFaqOpen} onClose={() => setAddFaqOpen(false)} onAddSuccess={fetchFAQs} />
                <EditFAQModal open={editFaqOpen} onClose={() => setEditFaqOpen(false)} faq={selectedFaq} onEditSuccess={fetchFAQs} />
                <DeleteModal
                    open={deleteFaqOpen}
                    onClose={() => setDeleteFaqOpen(false)}
                    items={selectedFaqs.map(id => faqs.find(faq => faq._id === id)).filter(faq => faq)}
                    onDeleteSuccess={fetchFAQs}
                    endpoint="/faq/delete-bulk"
                    title="Delete FAQs"
                    message="Are you sure you want to delete the FAQ items?"
                />
            </div>
        </div>
    );
};

export default FAQPage;