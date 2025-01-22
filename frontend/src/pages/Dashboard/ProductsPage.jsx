import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DashboardHeader, DashboardImage, LoadingDataGrid } from '../../assets/CustomComponents';
import DashboardTable from '../../components/Dashboard/DashboardTable';
import DeleteModal from '../../components/Modal/DeleteModal';
import ImagePreviewModal from '../../components/Modal/ImagePreviewModal';
import AddProductModal from '../../components/Modal/Product/AddProductModal';
import EditProductModal from '../../components/Modal/Product/EditProductModal';
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
    const itemsPerPage = 6;

    useEffect(() => {
        dispatch(getProducts());
    }, [dispatch]);

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

    const getSelectedProducts = () => {
        return selectedProducts
            .map((id) => products.find((product) => product._id === id))
            .filter((product) => product);
    };

    const handleDeleteSuccess = () => {
        dispatch(getProducts());
        setSelectedProducts([]);
    };

    const columns = [
        { key: 'name', label: 'Name' },
        {
            key: 'image',
            label: 'Image',
            render: (item) => <DashboardImage item={item} handleImageClick={handleImageClick} />
        },
        { key: 'description', label: 'Description' },
        { key: 'details', label: 'Details', render: (item) => truncateItems(item.details.map(detail => `${detail.attribute}: ${detail.value}`)).join(', ') || 'N/A' },
        { key: 'price', label: 'Price' },
        { key: 'salePrice', label: 'Sale Price', render: (item) => item.salePrice ? item.salePrice : 'N/A' },
        { key: 'discount', label: 'Discount', render: (item) => item.discount ? `${item.discount.value}${item.discount.type === 'percentage' ? '%' : ''}` : 'N/A' },
        { key: 'category.name', label: 'Category' },
        { key: 'subcategory.name', label: 'Subcategory' },
        { key: 'subSubcategory.name', label: 'SubSubcategory' },
        { key: 'inventoryCount', label: 'Inventory Count' },
        { key: 'dimensions', label: 'Dimensions', render: (item) => item.dimensions ? `${item.dimensions.length} x ${item.dimensions.width} x ${item.dimensions.height} ${item.dimensions.unit}` : 'N/A' },
        { key: 'variants', label: 'Variants', render: (item) => truncateItems(item.variants.map(variant => `Color: ${variant.color}, Size: ${variant.size}`)).join(', ') },
        { key: 'supplier.name', label: 'Supplier' },
        { key: 'shipping', label: 'Shipping', render: (item) => item.shipping ? `${item.shipping.weight} kg, ${item.shipping.cost}€, ${item.shipping.packageSize}` : 'None' },
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
                            selectedItems={selectedProducts}
                            setAddItemOpen={setAddProductOpen}
                            setDeleteItemOpen={setDeleteProductOpen}
                            itemName="Product"
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
                        />
                    </>
                )}

                <AddProductModal open={addProductOpen} onClose={() => setAddProductOpen(false)} onAddSuccess={() => dispatch(getProducts())} />
                <EditProductModal open={editProductOpen} onClose={() => setEditProductOpen(false)} product={selectedProduct} onEditSuccess={() => dispatch(getProducts())} />
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