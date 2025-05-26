import { useState } from 'react';
import { useSelector } from 'react-redux';
import { DashboardHeader, DashboardImage, exportOptions } from '../../components/custom/Dashboard';
import { LoadingDataGrid } from '../../components/custom/LoadingSkeletons';
import { formatDetails, formatDimensions, formatDiscount, formatName, formatReviews, formatShipping, formatSupplier, formatVariants } from '../../components/custom/utils';
import DashboardTable from '../../components/Dashboard/DashboardTable';
import DeleteModal from '../../components/Dashboard/Modal/DeleteModal';
import ImagePreviewModal from '../../components/Dashboard/Modal/ImagePreviewModal';
import AddProductModal from '../../components/Dashboard/Modal/Product/AddProductModal';
import EditProductModal from '../../components/Dashboard/Modal/Product/EditProductModal';
import ProductDetailsDrawer from '../../components/Dashboard/Modal/Product/ProductDetailsDrawer';
import useDashboardPage from '../../hooks/useDashboardPage';
import { getProducts } from '../../store/actions/productActions';

const ProductsPage = () => {
    const { products, loading } = useSelector((state) => state.products);

    const dashboard = useDashboardPage({
        fetchAction: getProducts,
        entityName: 'product',
        itemsPerPage: 6
    });

    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreviewOpen, setImagePreviewOpen] = useState(false);

    const handleImageClick = (imageUrl) => {
        setSelectedImage(imageUrl);
        setImagePreviewOpen(true);
    };

    const transformProductForExport = (product) => ({
        ...product,
        dimensions: formatDimensions(product.dimensions),
        discount: formatDiscount(product.discount),
        category: formatName(product.category),
        subcategory: formatName(product.subcategory),
        subSubcategory: formatName(product.subSubcategory),
        variants: formatVariants(product.variants),
        supplier: formatSupplier(product.supplier),
        details: formatDetails(product.details),
        reviews: formatReviews(product.reviews),
        shipping: formatShipping(product.shipping),
    });

    const handleExport = dashboard.createExportHandler('products_data', transformProductForExport);

    const columns = [
        { key: '_id', label: 'Product ID' },
        { key: 'image', label: 'Image', render: (item) => <DashboardImage item={item} handleImageClick={handleImageClick} /> },
        { key: 'description', label: 'Description' },
        { key: 'price', label: 'Price', render: (item) => `€  ${item.price.toFixed(2)}` },
        { key: 'salePrice', label: 'Sale Price', render: (item) => item.salePrice ? `€  ${item.salePrice.toFixed(2)}` : 'N/A' },
        { key: 'category.name', label: 'Category' },
        { key: 'subcategory.name', label: 'Subcategory' },
        { key: 'subSubcategory.name', label: 'SubSubcategory' },
        { key: 'inventoryCount', label: 'Inventory Count' },
        { key: 'actions', label: 'Actions' }
    ];

    return (
        <div className='container mx-auto max-w-full mt-20'>
            <div className='w-full px-4'>
                {loading ? (
                    <LoadingDataGrid />
                ) : (
                    <>
                        <DashboardHeader
                            title="Products"
                            selectedItems={dashboard.selectedItems}
                            setAddItemOpen={dashboard.openAddForm}
                            setDeleteItemOpen={dashboard.handleBulkDelete}
                            itemName="Product"
                            exportOptions={exportOptions(products, handleExport)}
                        />

                        <DashboardTable
                            columns={columns}
                            data={products}
                            selectedItems={dashboard.selectedItems}
                            onSelectItem={dashboard.handleSelectItems}
                            itemsPerPage={dashboard.itemsPerPage}
                            currentPage={dashboard.currentPage}
                            onEdit={dashboard.openEditForm}
                            containerClassName="max-w-full"
                            onViewDetails={dashboard.handleViewDetails}
                            onDelete={dashboard.handleSingleDelete}
                        />
                    </>
                )}

                <AddProductModal
                    open={dashboard.formModalOpen && !dashboard.isEditing}
                    onClose={() => dashboard.setFormModalOpen(false)}
                    onAddSuccess={dashboard.handleFormSuccess}
                />

                <EditProductModal
                    open={dashboard.formModalOpen && dashboard.isEditing}
                    onClose={() => dashboard.setFormModalOpen(false)}
                    product={dashboard.selectedItem}
                    onViewDetails={dashboard.handleViewDetails}
                    onEditSuccess={dashboard.handleFormSuccess}
                />

                <ProductDetailsDrawer
                    open={dashboard.viewDetailsOpen}
                    onClose={dashboard.closeDrawer}
                    product={dashboard.selectedItem}
                    onEdit={dashboard.handleEditFromDrawer}
                />

                <DeleteModal
                    open={dashboard.deleteModalOpen}
                    onClose={() => dashboard.setDeleteModalOpen(false)}
                    deletionContext={dashboard.deletionContext}
                    onDeleteSuccess={dashboard.handleDeleteSuccess}
                    title={dashboard.deletionContext?.endpoint.includes('bulk') ? 'Delete Products' : 'Delete Product'}
                    message={dashboard.deletionContext?.endpoint.includes('bulk')
                        ? 'Are you sure you want to delete the selected products?'
                        : 'Are you sure you want to delete this product?'
                    }
                />

                <ImagePreviewModal open={imagePreviewOpen} onClose={() => setImagePreviewOpen(false)} imageUrl={selectedImage} />
            </div>
        </div>
    );
};

export default ProductsPage;