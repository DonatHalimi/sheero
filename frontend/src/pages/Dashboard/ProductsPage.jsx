import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DashboardHeader, DashboardImage, exportOptions, formatDetails, formatDimensions, formatDiscount, formatName, formatReviews, formatShipping, formatSupplier, formatVariants, LoadingDataGrid } from '../../assets/CustomComponents';
import { exportToExcel, exportToJSON } from '../../assets/DataExport';
import DashboardTable from '../../components/Dashboard/DashboardTable';
import DeleteModal from '../../components/Modal/DeleteModal';
import ImagePreviewModal from '../../components/Modal/ImagePreviewModal';
import AddProductModal from '../../components/Modal/Product/AddProductModal';
import EditProductModal from '../../components/Modal/Product/EditProductModal';
import ProductDetailsDrawer from '../../components/Modal/Product/ProductDetailsDrawer';
import { getProducts } from '../../store/actions/productActions';

const ProductsPage = () => {
    const { products, loading } = useSelector((state) => state.products);
    const dispatch = useDispatch();

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [addProductOpen, setAddProductOpen] = useState(false);
    const [editProductOpen, setEditProductOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deletionContext, setDeletionContext] = useState(null);
    const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [viewDetailsOpen, setViewDetailsOpen] = useState(false);

    const itemsPerPage = 6;

    useEffect(() => {
        dispatch(getProducts());
    }, [dispatch]);

    useEffect(() => {
        const handleKeydown = (e) => {
            if (e.altKey && e.key === 'a') {
                setAddProductOpen(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeydown);
        return () => {
            window.removeEventListener('keydown', handleKeydown);
        };
    }, [products]);

    const handleSelectProduct = (newSelection) => {
        setSelectedProducts(newSelection);
    };

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    const handleImageClick = (imageUrl) => {
        setSelectedProduct(imageUrl);
        setImagePreviewOpen(true);
    };

    const handleEdit = (product) => {
        setSelectedProduct(product);
        setEditProductOpen(true);
    };

    const handleEditFromDrawer = (product) => {
        setViewDetailsOpen(false);
        setSelectedProduct(product);
        setEditProductOpen(true);
    };

    const handleDeleteSuccess = () => {
        dispatch(getProducts());
        setSelectedProducts([]);
    };

    const handleViewDetails = (product) => {
        setSelectedProduct(product);
        setViewDetailsOpen(true);
    };

    const closeDrawer = () => {
        setViewDetailsOpen(false);
        setSelectedProduct(null);
    };

    const handleBulkDelete = () => {
        if (selectedProducts.length > 0) {
            setDeletionContext({
                endpoint: '/products/delete-bulk',
                data: { ids: selectedProducts },
            });
            setDeleteModalOpen(true);
        }
    };

    const handleSingleDelete = (product) => {
        setDeletionContext({
            endpoint: `/products/delete/${product._id}`,
            data: null,
        });
        setDeleteModalOpen(true);
    };

    const columns = [
        { key: 'name', label: 'Name' },
        {
            key: 'image',
            label: 'Image',
            render: (item) => <DashboardImage item={item} handleImageClick={handleImageClick} />
        },
        { key: 'description', label: 'Description' },
        { key: 'price', label: 'Price', render: (item) => `€  ${item.price.toFixed(2)}` },
        { key: 'salePrice', label: 'Sale Price', render: (item) => item.salePrice ? `€  ${item.salePrice.toFixed(2)}` : 'N/A' },
        { key: 'category.name', label: 'Category' },
        { key: 'subcategory.name', label: 'Subcategory' },
        { key: 'subSubcategory.name', label: 'SubSubcategory' },
        { key: 'inventoryCount', label: 'Inventory Count' },
        { key: 'actions', label: 'Actions' }
    ];

    const handleExport = (data, format) => {

        const flattenedProducts = data.map((product) => ({
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
        }))

        format === 'excel' ? exportToExcel(flattenedProducts, 'products_data') : exportToJSON(data, 'products_data');
    }

    return (
        <div className='container mx-auto max-w-full mt-20'>
            <div className='w-full px-4'>
                {loading ? (
                    <LoadingDataGrid />
                ) : (
                    <>
                        <DashboardHeader
                            title="Products"
                            selectedItems={selectedProducts}
                            setAddItemOpen={setAddProductOpen}
                            setDeleteItemOpen={handleBulkDelete}
                            itemName="Product"
                            exportOptions={exportOptions(products, handleExport)}
                        />

                        <DashboardTable
                            columns={columns}
                            data={products}
                            selectedItems={selectedProducts}
                            onSelectItem={handleSelectProduct}
                            itemsPerPage={itemsPerPage}
                            currentPage={currentPage}
                            onPageChange={handlePageClick}
                            onEdit={handleEdit}
                            containerClassName="max-w-full"
                            onViewDetails={handleViewDetails}
                            onDelete={handleSingleDelete}
                        />
                    </>
                )}

                <AddProductModal open={addProductOpen} onClose={() => setAddProductOpen(false)} onAddSuccess={() => dispatch(getProducts())} />
                <EditProductModal open={editProductOpen} onClose={() => setEditProductOpen(false)} product={selectedProduct} onViewDetails={handleViewDetails} onEditSuccess={() => dispatch(getProducts())} />
                <ProductDetailsDrawer open={viewDetailsOpen} onClose={closeDrawer} product={selectedProduct} onEdit={handleEditFromDrawer} />

                <DeleteModal
                    open={deleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                    deletionContext={deletionContext}
                    onDeleteSuccess={handleDeleteSuccess}
                    title={deletionContext?.endpoint.includes('bulk') ? 'Delete Products' : 'Delete Product'}
                    message={deletionContext?.endpoint.includes('bulk')
                        ? 'Are you sure you want to delete the selected products?'
                        : 'Are you sure you want to delete this product?'
                    }
                />
                <ImagePreviewModal open={imagePreviewOpen} onClose={() => setImagePreviewOpen(false)} imageUrl={selectedProduct} />
            </div>
        </div>
    );
};

export default ProductsPage;