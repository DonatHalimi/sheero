import DashboardPage from '../../components/Dashboard/DashboardPage';
import FAQDetailsDrawer from '../../components/Dashboard/Modal/FAQ/FAQDetailsDrawer';
import FAQForm from '../../components/Dashboard/Modal/FAQ/FAQForm';
import { getFAQs } from '../../store/actions/dashboardActions';

const FAQPage = () => {
    const itemsSelector = (state) => state.dashboard.faqs;
    const loadingSelector = (state) => state.dashboard.loadingFaqs;

    const columns = [
        { key: 'question', label: 'Question' },
        { key: 'answer', label: 'Answer' },
        { key: 'actions', label: 'Actions' }
    ];

    const handleExport = (faq) => ({
        ...faq,
        question: faq.question,
    });

    return (
        <DashboardPage
            title="FAQs"
            columns={columns}
            itemsSelector={itemsSelector}
            loadingSelector={loadingSelector}
            fetchAction={getFAQs}
            entityName="faq"
            FormComponent={FAQForm}
            DetailsDrawerComponent={FAQDetailsDrawer}
            transformFunction={handleExport}
            formItemProp="faq"
            detailsItemProp="faq"
        />
    );
};

export default FAQPage;