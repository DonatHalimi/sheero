import React from 'react';
import DashboardPage from '../../components/Dashboard/DashboardPage';
import ContactDetailsDrawer from '../../components/Dashboard/Modal/Contact/ContactDetailsDrawer';
import ContactForm from '../../components/Dashboard/Modal/Contact/ContactForm';
import { getContacts } from '../../store/actions/dashboardActions';

const ContactPage = () => {
    const itemsSelector = (state) => state.dashboard.contacts;
    const loadingSelector = (state) => state.dashboard.loadingContacts;

    const columns = [
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'subject', label: 'Subject' },
        { key: 'message', label: 'Message' },
        { key: 'actions', label: 'Actions' }
    ];

    const handleExport = (contact) => ({
        ...contact,
        userId: contact.userId ? contact.userId.email : 'N/A'
    });

    return (
        <DashboardPage
            title="Contacts"
            columns={columns}
            itemsSelector={itemsSelector}
            loadingSelector={loadingSelector}
            fetchAction={getContacts}
            entityName="contact"
            FormComponent={ContactForm}
            DetailsDrawerComponent={ContactDetailsDrawer}
            formItemProp="contact"
            detailsItemProp="contact"
            transformFunction={handleExport}
            showEditButton={false}
        />
    );
};

export default ContactPage;