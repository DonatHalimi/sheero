import { Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { ActionButton, BrownCreateOutlinedIcon, OutlinedBrownButton } from '../../assets/CustomComponents';
import useAxios from '../../axiosInstance';
import DashboardTable from '../../components/Dashboard/DashboardTable';
import AddProductModal from '../../components/Modal/Product/AddProductModal';
import DeleteProductModal from '../../components/Modal/Product/DeleteProductModal';
import EditProductModal from '../../components/Modal/Product/EditProductModal';
import { AuthContext } from '../../context/AuthContext';

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [addProductOpen, setAddProductOpen] = useState(false);
    const [editProductOpen, setEditProductOpen] = useState(false);
    const [deleteProductOpen, setDeleteProductOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 6;

    const { refreshToken } = useContext(AuthContext);
    const axiosInstance = useAxios(refreshToken);

    useEffect(() => {
        fetchProducts();
    }, [addProductOpen, editProductOpen, deleteProductOpen, currentPage, axiosInstance]);

    const fetchProducts = async () => {
        try {
            const response = await axiosInstance.get(`/products/get?page=${currentPage}&limit=${itemsPerPage}`);
            setProducts(response.data.products);
        } catch (error) {
            console.error('Error fetching products', error);
        }
    };

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

    const columns = [
        { key: 'name', label: 'Name' },
        { key: 'description', label: 'Description' },
        { key: 'details', label: 'Details', render: (item) => truncateItems(item.details.map(detail => `${detail.attribute}: ${detail.value}`)).join(', ') },
        { key: 'price', label: 'Price' },
        { key: 'salePrice', label: 'Sale Price', render: (item) => item.salePrice ? item.salePrice : 'N/A' },
        { key: 'category.name', label: 'Category' },
        { key: 'subcategory.name', label: 'Subcategory' },
        { key: 'subSubcategory.name', label: 'SubSubcategory' },
        { key: 'inventoryCount', label: 'Inventory Count' },
        { key: 'dimensions', label: 'Dimensions', render: (item) => item.dimensions ? `${item.dimensions.length} x ${item.dimensions.width} x ${item.dimensions.height} ${item.dimensions.unit}` : 'N/A' },
        { key: 'variants', label: 'Variants', render: (item) => truncateItems(item.variants.map(variant => `Color: ${variant.color}, Size: ${variant.size}`)).join(', ') },
        { key: 'discount', label: 'Discount', render: (item) => item.discount ? `${item.discount.value}${item.discount.type === 'percentage' ? '%' : ''}` : 'N/A' },
        { key: 'supplier.name', label: 'Supplier' },
        { key: 'shipping', label: 'Shipping', render: (item) => item.shipping ? `${item.shipping.weight} kg, ${item.shipping.cost}€, ${item.shipping.packageSize}` : 'None' },
        { key: 'image', label: 'Image', render: (item) => <img className='rounded-md' src={`http://localhost:5000/${item.image}`} alt="" width={80} /> },
        { key: 'actions', label: 'Actions' }
    ];

    const renderActionButtons = (product) => (
        <ActionButton onClick={() => { setSelectedProduct(product); setEditProductOpen(true); }}>
            <BrownCreateOutlinedIcon />
        </ActionButton>
    );

    const renderTableActions = () => (
        <div className='flex items-center justify-between w-full mb-4'>
            <Typography variant='h5'>Products</Typography>
            <div>
                <OutlinedBrownButton onClick={() => setAddProductOpen(true)} className='!mr-4'>
                    Add Product
                </OutlinedBrownButton>
                {selectedProducts.length > 0 && (
                    <OutlinedBrownButton
                        onClick={() => setDeleteProductOpen(true)}
                        disabled={selectedProducts.length === 0}
                    >
                        {selectedProducts.length > 1 ? 'Delete Selected Products' : 'Delete Product'}
                    </OutlinedBrownButton>
                )}
            </div>
        </div>
    );

    return (
        <div className='container mx-auto max-w-full mt-20'>
            <div className='w-full px-4'>
                <DashboardTable
                    columns={columns}
                    data={products}
                    selectedItems={selectedProducts}
                    onSelectItem={handleSelectProduct}
                    onSelectAll={handleSelectAll}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={handlePageClick}
                    renderActionButtons={renderActionButtons}
                    renderTableActions={renderTableActions}
                    containerClassName="max-w-full"
                />

                <AddProductModal open={addProductOpen} onClose={() => setAddProductOpen(false)} onAddSuccess={fetchProducts} />
                <EditProductModal open={editProductOpen} onClose={() => setEditProductOpen(false)} product={selectedProduct} onEditSuccess={fetchProducts} />
                <DeleteProductModal open={deleteProductOpen} onClose={() => setDeleteProductOpen(false)} products={selectedProducts.map(id => products.find(product => product._id === id))} onDeleteSuccess={fetchProducts} />
            </div>
        </div>
    );
};

export default ProductsPage;