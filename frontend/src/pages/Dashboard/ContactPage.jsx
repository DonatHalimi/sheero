import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DashboardHeader, exportOptions, LoadingDataGrid } from '../../assets/CustomComponents';
import { exportToExcel, exportToJSON } from '../../assets/DataExport';
import DashboardTable from '../../components/Dashboard/DashboardTable';
import AddContactModal from '../../components/Modal/Contact/AddContactModal';
import ContactDetailsDrawer from '../../components/Modal/Contact/ContactDetailsDrawer';
import DeleteModal from '../../components/Modal/DeleteModal';
import { getContacts } from '../../store/actions/dashboardActions';

const ContactPage = () => {
    const { contacts, loadingContacts } = useSelector((state) => state.dashboard);
    const dispatch = useDispatch();

    const [selectedContacts, setSelectedContacts] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [addContactOpen, setAddContactOpen] = useState(false);
    const [deleteContactOpen, setDeleteContactOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [viewDetailsOpen, setViewDetailsOpen] = useState(false);

    const itemsPerPage = 5;

    useEffect(() => {
        dispatch(getContacts());
    }, [dispatch]);

    useEffect(() => {
        const handleKeydown = (e) => {
            if (e.altKey && e.key === 'a') {
                setAddContactOpen(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeydown);
        return () => {
            window.removeEventListener('keydown', handleKeydown);
        };
    }, [contacts]);

    const handleSelectContact = (contactId) => {
        const id = Array.isArray(contactId) ? contactId[0] : contactId;

        setSelectedContacts((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((selectedId) => selectedId !== id)
                : [...prevSelected, id]
        );
    };

    const handleSelectAll = (e) => {
        setSelectedContacts(e.target.checked ? contacts.map(contact => contact._id) : []);
    };

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    const getSelectedContacts = () => {
        return selectedContacts
            .map((id) => contacts.find((contact) => contact._id === id))
            .filter((contact) => contact);
    };

    const handleDeleteSuccess = () => {
        dispatch(getContacts());
        setSelectedContacts([]);
    };

    const handleViewDetails = (contact) => {
        setSelectedContact(contact);
        setViewDetailsOpen(true);
    };

    const closeDrawer = () => {
        setViewDetailsOpen(false);
        setSelectedContact(null);
    };

    const columns = [
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'subject', label: 'Subject' },
        { key: 'message', label: 'Message' },
        { key: 'actions', label: 'Actions' }
    ];

    const handleExport = (data, format) => {
        const flattenedContacts = data.map(contact => ({
            ...contact,
            userId: contact.userId ? contact.userId.email : 'N/A'
        }))

        format === 'excel' ? exportToExcel(flattenedContacts, 'contacts_data') : exportToJSON(data, 'contacts_data');
    }

    return (
        <div className='container mx-auto max-w-screen-2xl px-4 mt-20'>
            <div className='flex flex-col items-center justify-center'>
                {loadingContacts ? (
                    <LoadingDataGrid />
                ) : (
                    <>
                        <DashboardHeader
                            title="Contacts"
                            selectedItems={selectedContacts}
                            setAddItemOpen={setAddContactOpen}
                            setDeleteItemOpen={setDeleteContactOpen}
                            itemName="Contact"
                            exportOptions={exportOptions(contacts, handleExport)}
                        />

                        <DashboardTable
                            columns={columns}
                            data={contacts}
                            selectedItems={selectedContacts}
                            onSelectItem={handleSelectContact}
                            onSelectAll={handleSelectAll}
                            itemsPerPage={itemsPerPage}
                            currentPage={currentPage}
                            onPageChange={handlePageClick}
                            onViewDetails={handleViewDetails}
                        />
                    </>
                )}

                <AddContactModal open={addContactOpen} onClose={() => setAddContactOpen(false)} onAddSuccess={() => dispatch(getContacts())} />
                <ContactDetailsDrawer open={viewDetailsOpen} onClose={closeDrawer} contact={selectedContact} />
                <DeleteModal
                    open={deleteContactOpen}
                    onClose={() => setDeleteContactOpen(false)}
                    items={getSelectedContacts()}
                    onDeleteSuccess={handleDeleteSuccess}
                    endpoint="/contact/delete-bulk"
                    title="Delete Contacts"
                    message="Are you sure you want to delete the selected contacts?"
                />
            </div>
        </div>
    );
};

export default ContactPage;
