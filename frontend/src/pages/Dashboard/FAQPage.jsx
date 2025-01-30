import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DashboardHeader, exportOptions, LoadingDataGrid } from '../../assets/CustomComponents';
import { exportToExcel, exportToJSON } from '../../assets/DataExport';
import DashboardTable from '../../components/Dashboard/DashboardTable';
import DeleteModal from '../../components/Modal/DeleteModal';
import AddFAQModal from '../../components/Modal/FAQ/AddFAQModal';
import EditFAQModal from '../../components/Modal/FAQ/EditFAQModal';
import FAQDetailsDrawer from '../../components/Modal/FAQ/FAQDetailsDrawer';
import { getFAQs } from '../../store/actions/dashboardActions';

const FAQPage = () => {
    const { faqs, loadingFaqs } = useSelector((state) => state.dashboard);
    const dispatch = useDispatch();

    const [selectedFaq, setSelectedFaq] = useState(null);
    const [selectedFaqs, setSelectedFaqs] = useState([]);
    const [addFaqOpen, setAddFaqOpen] = useState(false);
    const [editFaqOpen, setEditFaqOpen] = useState(false);
    const [deleteFaqOpen, setDeleteFaqOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [viewDetailsOpen, setViewDetailsOpen] = useState(false);

    const itemsPerPage = 5;

    useEffect(() => {
        dispatch(getFAQs());
    }, [dispatch]);

    useEffect(() => {
        const handleKeydown = (e) => {
            if (e.altKey && e.key === 'a') {
                setAddFaqOpen(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeydown);
        return () => {
            window.removeEventListener('keydown', handleKeydown);
        };
    }, [faqs]);

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

    const handleEditFromDrawer = (faq) => {
        setViewDetailsOpen(false);
        setSelectedFaq(faq);
        setEditFaqOpen(true);
    };

    const getSelectedFaqs = () => {
        return selectedFaqs
            .map((id) => faqs.find((faq) => faq._id === id))
            .filter((faq) => faq);
    };

    const handleDeleteSuccess = () => {
        dispatch(getFAQs());
        setSelectedFaqs([]);
    };

    const handleViewDetails = (faq) => {
        setSelectedFaq(faq);
        setViewDetailsOpen(true);
    };

    const closeDrawer = () => {
        setViewDetailsOpen(false);
        setSelectedFaq(null);
    };

    const columns = [
        { key: 'question', label: 'Question' },
        { key: 'answer', label: 'Answer' },
        { key: 'actions', label: 'Actions' }
    ];

    const handleExport = (data, format) => {
        format === 'excel' ? exportToExcel(data, 'faqs_data') : exportToJSON(data, 'faqs_data');
    }

    return (
        <div className='container mx-auto max-w-screen-2xl px-4 mt-20'>
            <div className='flex flex-col items-center justify-center'>
                {loadingFaqs ? (
                    <LoadingDataGrid />
                ) : (
                    <>
                        <DashboardHeader
                            title="FAQs"
                            selectedItems={selectedFaqs}
                            setAddItemOpen={setAddFaqOpen}
                            setDeleteItemOpen={setDeleteFaqOpen}
                            itemName="FAQ"
                            exportOptions={exportOptions(faqs, handleExport)}
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
                            onViewDetails={handleViewDetails}
                        />
                    </>
                )}

                <AddFAQModal open={addFaqOpen} onClose={() => setAddFaqOpen(false)} onAddSuccess={() => dispatch(getFAQs())} />
                <EditFAQModal open={editFaqOpen} onClose={() => setEditFaqOpen(false)} faq={selectedFaq} onViewDetails={handleViewDetails} onEditSuccess={() => dispatch(getFAQs())} />
                <FAQDetailsDrawer open={viewDetailsOpen} onClose={closeDrawer} faq={selectedFaq} onEdit={handleEditFromDrawer} />
                <DeleteModal
                    open={deleteFaqOpen}
                    onClose={() => setDeleteFaqOpen(false)}
                    items={getSelectedFaqs()}
                    onDeleteSuccess={handleDeleteSuccess}
                    endpoint="/faqs/delete-bulk"
                    title="Delete FAQs"
                    message="Are you sure you want to delete the FAQ items?"
                />
            </div>
        </div>
    );
};

export default FAQPage;