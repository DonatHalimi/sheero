import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DashboardHeader } from '../../assets/CustomComponents';
import DashboardTable from '../../components/Dashboard/DashboardTable';
import DeleteModal from '../../components/Modal/DeleteModal';
import AddFAQModal from '../../components/Modal/FAQ/AddFAQModal';
import EditFAQModal from '../../components/Modal/FAQ/EditFAQModal';
import { getFAQs } from '../../store/actions/dashboardActions';

const FAQPage = () => {
    const { faqs } = useSelector((state) => state.dashboard);
    const dispatch = useDispatch();

    const [selectedFaq, setSelectedFaq] = useState(null);
    const [selectedFaqs, setSelectedFaqs] = useState([]);
    const [addFaqOpen, setAddFaqOpen] = useState(false);
    const [editFaqOpen, setEditFaqOpen] = useState(false);
    const [deleteFaqOpen, setDeleteFaqOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 5;

    useEffect(() => {
        dispatch(getFAQs());
    }, [dispatch]);

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

                <AddFAQModal open={addFaqOpen} onClose={() => setAddFaqOpen(false)} onAddSuccess={() => dispatch(getFAQs())} />
                <EditFAQModal open={editFaqOpen} onClose={() => setEditFaqOpen(false)} faq={selectedFaq} onEditSuccess={() => dispatch(getFAQs())} />
                <DeleteModal
                    open={deleteFaqOpen}
                    onClose={() => setDeleteFaqOpen(false)}
                    items={selectedFaqs.map(id => faqs.find(faq => faq._id === id)).filter(faq => faq)}
                    onDeleteSuccess={() => dispatch(getFAQs())}
                    endpoint="/faqs/delete-bulk"
                    title="Delete FAQs"
                    message="Are you sure you want to delete the FAQ items?"
                />
            </div>
        </div>
    );
};

export default FAQPage;