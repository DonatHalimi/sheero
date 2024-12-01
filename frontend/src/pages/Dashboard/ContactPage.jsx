import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DashboardHeader } from '../../assets/CustomComponents';
import DashboardTable from '../../components/Dashboard/DashboardTable';
import AddContactModal from '../../components/Modal/Contact/AddContactModal';
import DeleteModal from '../../components/Modal/DeleteModal';
import { getContacts } from '../../store/actions/dashboardActions';

const ContactPage = () => {
    const { contacts } = useSelector((state) => state.dashboard);
    const dispatch = useDispatch();

    const [selectedContact, setSelectedContact] = useState(null);
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [addContactOpen, setAddContactOpen] = useState(false);
    const [editContactOpen, setEditContactOpen] = useState(false);
    const [deleteContactOpen, setDeleteContactOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 5;

    useEffect(() => {
        dispatch(getContacts());
    }, [dispatch]);

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

    const columns = [
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'subject', label: 'Subject' },
        { key: 'message', label: 'Message' },
    ];

    return (
        <div className='container mx-auto max-w-screen-2xl px-4 mt-20'>
            <div className='flex flex-col items-center justify-center'>
                <DashboardHeader
                    title="Contacts"
                    selectedItems={selectedContacts}
                    setAddItemOpen={setAddContactOpen}
                    setDeleteItemOpen={setDeleteContactOpen}
                    itemName="Contact"
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
                />

                <AddContactModal open={addContactOpen} onClose={() => setAddContactOpen(false)} onAddSuccess={() => dispatch(getContacts())} />
                <DeleteModal
                    open={deleteContactOpen}
                    onClose={() => setDeleteContactOpen(false)}
                    items={selectedContacts.map(id => contacts.find(contact => contact._id === id)).filter(contact => contact)}
                    onDeleteSuccess={() => dispatch(getContacts())}
                    endpoint="/contact/delete-bulk"
                    title="Delete Contacts"
                    message="Are you sure you want to delete the selected contacts?"
                />
            </div>
        </div>
    );
};

export default ContactPage;
