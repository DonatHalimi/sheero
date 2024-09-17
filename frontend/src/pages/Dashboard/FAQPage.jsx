import React, { useContext, useEffect, useState } from 'react';
import { DashboardHeader } from '../../assets/CustomComponents';
import useAxios from '../../axiosInstance';
import DashboardTable from '../../components/Dashboard/DashboardTable';
import DeleteModal from '../../components/Modal/DeleteModal';
import AddFAQModal from '../../components/Modal/FAQ/AddFAQModal';
import EditFAQModal from '../../components/Modal/FAQ/EditFAQModal';
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
            const response = await axiosInstance.get('/faqs/get');
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

    const handleEdit = (faq) => {
        setSelectedFaq(faq);
        setEditFaqOpen(true);
    };

    const columns = [
        { key: 'question', label: 'Question' },
        { key: 'answer', label: 'Answer' },
        { key: 'actions', label: 'Actions' }
    ];

    return (
        <div className='container mx-auto max-w-screen-2xl px-4 mt-20'>
            <div className='flex flex-col items-center justify-center'>
                <DashboardHeader
                    title="FAQs"
                    selectedItems={selectedFaqs}
                    setAddItemOpen={setAddFaqOpen}
                    setDeleteItemOpen={setDeleteFaqOpen}
                    itemName="FAQ"
                />

                <DashboardTable
                    columns={columns}
                    data={faqs}
                    selectedItems={selectedFaqs}
                    onSelectItem={handleSelectFaq}
                    onSelectAll={handleSelectAll}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={handlePageClick}
                    onEdit={handleEdit}
                />

                <AddFAQModal open={addFaqOpen} onClose={() => setAddFaqOpen(false)} onAddSuccess={fetchFAQs} />
                <EditFAQModal open={editFaqOpen} onClose={() => setEditFaqOpen(false)} faq={selectedFaq} onEditSuccess={fetchFAQs} />
                <DeleteModal
                    open={deleteFaqOpen}
                    onClose={() => setDeleteFaqOpen(false)}
                    items={selectedFaqs.map(id => faqs.find(faq => faq._id === id)).filter(faq => faq)}
                    onDeleteSuccess={fetchFAQs}
                    endpoint="/faqs/delete-bulk"
                    title="Delete FAQs"
                    message="Are you sure you want to delete the FAQ items?"
                />
            </div>
        </div>
    );
};

export default FAQPage;