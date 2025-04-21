import React from 'react';
import { formatDate } from '../../assets/CustomComponents';
import DashboardPage from '../../components/Dashboard/DashboardPage';
import SubSubcategoryDetailsDrawer from '../../components/Dashboard/Modal/SubSubcategory/SubSubcategoryDetailsDrawer';
import SubSubcategoryForm from '../../components/Dashboard/Modal/SubSubcategory/SubSubcategoryForm';
import { getSubSubcategories } from '../../store/actions/dashboardActions';

const SubSubcategoriesPage = () => {
    const itemsSelector = (state) => state.dashboard.subSubcategories;
    const loadingSelector = (state) => state.dashboard.loadingSubSubcategories;

    const columns = [
        { label: 'Name', key: 'name' },
        { label: 'Subcategory', key: 'subcategory.name' },
        { key: 'createdAt', label: 'Created At', render: (item) => formatDate(item.createdAt) },
        { key: 'updatedAt', label: 'Updated At', render: (item) => formatDate(item.updatedAt) },
        { label: 'Actions', key: 'actions' }
    ];

    const handleExport = (subSubcategory) => ({
        ...subSubcategory,
        category: subSubcategory.category ? subSubcategory.category.name : 'N/A',
    });

    return (
        <DashboardPage
            title="SubSubcategories"
            columns={columns}
            itemsSelector={itemsSelector}
            loadingSelector={loadingSelector}
            fetchAction={getSubSubcategories}
            entityName="subSubcategory"
            FormComponent={SubSubcategoryForm}
            DetailsDrawerComponent={SubSubcategoryDetailsDrawer}
            transformFunction={handleExport}
            formItemProp="subSubcategory"
            detailsItemProp="subSubcategory"
        />
    );
};

export default SubSubcategoriesPage;