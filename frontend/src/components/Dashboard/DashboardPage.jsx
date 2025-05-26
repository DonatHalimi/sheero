import { useSelector } from 'react-redux';
import DashboardTable from '../../components/Dashboard/DashboardTable';
import DeleteModal from '../../components/Dashboard/Modal/DeleteModal';
import useDashboardPage from '../../hooks/useDashboardPage';
import { getApiEndpoint } from '../../utils/getApiEndpoint';
import { DashboardHeader, exportOptions } from '../custom/Dashboard';
import { LoadingDataGrid } from '../custom/LoadingSkeletons';

/**
 * A component for displaying a list of items in a dashboard with keyboard navigation.
 *
 * @param {Object} props Component props
 * @param {string} props.title The title of the page
 * @param {Object[]} props.columns The columns to display in the table
 * @param {function} props.itemsSelector Selector for selecting the items from the state
 * @param {function} props.loadingSelector Selector for the loading state from the state
 * @param {function} props.fetchAction The action creator for fetching the items
 * @param {string} props.entityName The name of the entity
 * @param {React.ComponentType} props.FormComponent The component to display in the form modal
 * @param {React.ComponentType} props.DetailsDrawerComponent The component to display in the details drawer
 * @param {number} [props.itemsPerPage=100] The number of items to display per page
 * @param {function} [props.transformFunction] A function to transform the items before exporting
 * @param {string} [props.formItemProp='item'] The prop name to use for passing the selected entity to the form
 * @param {string} [props.detailsItemProp='item'] The prop name to use for passing the selected entity to the details drawer
 * @param {boolean} [props.showAddButton=true] Whether to show the add button
 * @param {boolean} [props.showEditButton=true] Whether to show the edit button
 */
const DashboardPage = ({
    title,
    columns,
    itemsSelector,
    loadingSelector,
    fetchAction,
    entityName,
    FormComponent,
    DetailsDrawerComponent,
    itemsPerPage = 100,
    transformFunction,
    formItemProp = 'item',
    detailsItemProp = 'item',
    showAddButton = true,
    showEditButton = true
}) => {
    const items = useSelector(itemsSelector);
    const loading = useSelector(loadingSelector);

    const dashboard = useDashboardPage({ fetchAction, entityName, itemsPerPage, showAddButton, showEditButton });
    const itemNameCapitalized = entityName.charAt(0).toUpperCase() + entityName.slice(1);

    const itemNamePlural = getApiEndpoint(entityName).replace('/', '');
    const handleExport = dashboard.createExportHandler(`${itemNamePlural}_data`, transformFunction);

    return (
        <div className="container mx-auto max-w-screen-2xl px-4 mt-20">
            <div className="flex flex-col items-center justify-center">
                {loading ? (
                    <LoadingDataGrid />
                ) : (
                    <>
                        <DashboardHeader
                            title={title}
                            selectedItems={dashboard.selectedItems}
                            setAddItemOpen={showAddButton ? dashboard.openAddForm : undefined}
                            setDeleteItemOpen={dashboard.handleBulkDelete}
                            itemName={itemNameCapitalized}
                            exportOptions={exportOptions(items, handleExport)}
                            showAddButton={showAddButton}
                        />
                        <DashboardTable
                            columns={columns}
                            data={items}
                            selectedItems={dashboard.selectedItems}
                            onSelectItem={dashboard.handleSelectItems}
                            itemsPerPage={dashboard.itemsPerPage}
                            currentPage={dashboard.currentPage}
                            onPageChange={(event) => dashboard.setCurrentPage(event.selected)}
                            onEdit={showEditButton ? dashboard.openEditForm : undefined}
                            onViewDetails={dashboard.handleViewDetails}
                            onDelete={dashboard.handleSingleDelete}
                            showEditButton={showEditButton}
                            focusedItemIndex={dashboard.focusedItemIndex}
                            setFocusedItemIndex={dashboard.setFocusedItemIndex}
                            setItems={dashboard.setItems}
                        />
                    </>
                )}

                {FormComponent && (
                    <FormComponent
                        open={dashboard.formModalOpen}
                        onClose={() => dashboard.setFormModalOpen(false)}
                        {...{ [formItemProp]: dashboard.selectedItem }}
                        onViewDetails={dashboard.isEditing ? dashboard.handleViewDetails : undefined}
                        onSuccess={dashboard.handleFormSuccess}
                        isEdit={dashboard.isEditing}
                    />
                )}

                {DetailsDrawerComponent && (
                    <DetailsDrawerComponent
                        open={dashboard.viewDetailsOpen}
                        onClose={dashboard.closeDrawer}
                        {...{ [detailsItemProp]: dashboard.selectedItem }}
                        onEdit={showEditButton ? dashboard.handleEditFromDrawer : undefined}
                        onDelete={dashboard.handleDeleteFromDrawer}
                    />
                )}

                <DeleteModal
                    open={dashboard.deleteModalOpen}
                    onClose={() => dashboard.setDeleteModalOpen(false)}
                    deletionContext={dashboard.deletionContext}
                    onDeleteSuccess={dashboard.handleDeleteSuccess}
                    title={dashboard.deletionContext?.endpoint.includes('bulk')
                        ? `Delete ${itemNamePlural}`
                        : `Delete ${itemNameCapitalized}`
                    }
                    message={dashboard.deletionContext?.endpoint.includes('bulk')
                        ? `Are you sure you want to delete the selected ${itemNamePlural}?`
                        : `Are you sure you want to delete this ${entityName}?`
                    }
                />
            </div>
        </div>
    );
};

export default DashboardPage;