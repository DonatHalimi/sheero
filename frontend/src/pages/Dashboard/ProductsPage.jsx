import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DashboardHeader, DashboardImage, exportOptions, LoadingDataGrid } from '../../assets/CustomComponents';
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
    const [deleteProductOpen, setDeleteProductOpen] = useState(false);
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


    const handleSelectProduct = (productId) => {
        const id = Array.isArray(productId) ? productId[0] : productId;

        setSelectedProducts((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((selectedId) => selectedId !== id)
                : [...prevSelected, id]
        );
    };

    const handleSelectAll = (e) => {
        setSelectedProducts(e.target.checked ? products.map(product => product._id) : []);
    };

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    const truncateItems = (items, maxItems = 3) => {
        if (items.length <= maxItems) {
            return items;
        }
        return [...items.slice(0, maxItems), '...'];
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

    const getSelectedProducts = () => {
        return selectedProducts
            .map((id) => products.find((product) => product._id === id))
            .filter((product) => product);
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

    const formatDimensions = (dimensions) => {
        return `${dimensions.length ? dimensions.length + ' x ' : ''}${dimensions.width ? dimensions.width + ' x ' : ''}${dimensions.height ? dimensions.height : ''} ${dimensions.unit}`;
    };

    const formatDiscount = (discount) => {
        return discount ? `${discount.value} ${discount.type}` : 'No Discount';
    };

    const formatName = (name) => {
        return name?.name || 'Not Found';
    };

    const formatVariants = (variants) => {
        return variants.length ? variants.map(variant => variant.name).join(', ') : 'No Variants';
    };

    const formatSupplier = (supplier) => {
        return `${supplier?.name || 'No Supplier'} (${supplier?.contactInfo?.email || 'No Email'})`;
    };

    const formatDetails = (details) => {
        return details.length ? details.join(', ') : 'No Details';
    };

    const formatReviews = (reviews) => {
        return reviews.length
            ? reviews.join(', ')
            : 'No Reviews';
    };

    const formatShipping = (shipping) => {
        return `${shipping?.packageSize || 'Unknown Size'} | ${shipping?.cost ? '€' + shipping.cost : 'No Cost'} | Dimensions: ${shipping?.dimensions ? formatDimensions(shipping.dimensions) : 'No Dimensions'}`;
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
                            setDeleteItemOpen={setDeleteProductOpen}
                            itemName="Product"
                            exportOptions={exportOptions(products, handleExport)}
                        />

                        <DashboardTable
                            columns={columns}
                            data={products}
                            selectedItems={selectedProducts}
                            onSelectItem={handleSelectProduct}
                            onSelectAll={handleSelectAll}
                            itemsPerPage={itemsPerPage}
                            currentPage={currentPage}
                            onPageChange={handlePageClick}
                            onEdit={handleEdit}
                            containerClassName="max-w-full"
                            onViewDetails={handleViewDetails}
                        />
                    </>
                )}

                <AddProductModal open={addProductOpen} onClose={() => setAddProductOpen(false)} onAddSuccess={() => dispatch(getProducts())} />
                <EditProductModal open={editProductOpen} onClose={() => setEditProductOpen(false)} product={selectedProduct} onViewDetails={handleViewDetails} onEditSuccess={() => dispatch(getProducts())} />
                <ProductDetailsDrawer open={viewDetailsOpen} onClose={closeDrawer} product={selectedProduct} onEdit={handleEditFromDrawer} />
                <DeleteModal
                    open={deleteProductOpen}
                    onClose={() => setDeleteProductOpen(false)}
                    items={getSelectedProducts()}
                    onDeleteSuccess={handleDeleteSuccess}
                    endpoint="/products/delete-bulk"
                    title="Delete Products"
                    message="Are you sure you want to delete the selected products?"
                />
                <ImagePreviewModal open={imagePreviewOpen} onClose={() => setImagePreviewOpen(false)} imageUrl={selectedProduct} />
            </div>
        </div>
    );
};

export default ProductsPage;