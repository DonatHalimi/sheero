import { Checkbox, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import useAxios from '../../axiosInstance';
import { ActionButton, BoldTableCell, BrownCreateOutlinedIcon, OutlinedBrownButton } from '../../components/Dashboard/CustomComponents';
import AddProductModal from '../../components/Modal/Product/AddProductModal';
import DeleteProductModal from '../../components/Modal/Product/DeleteProductModal';
import EditProductModal from '../../components/Modal/Product/EditProductModal';
import Pagination from '../../components/Pagination';
import { AuthContext } from '../../context/AuthContext';

const ITEMS_TO_SHOW = 3;

const truncateItems = (items, maxItems = ITEMS_TO_SHOW) => {
    if (items.length <= maxItems) {
        return items;
    }
    return [...items.slice(0, maxItems), '...'];
};

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [addProductOpen, setAddProductOpen] = useState(false);
    const [editProductOpen, setEditProductOpen] = useState(false);
    const [deleteProductOpen, setDeleteProductOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10;

    const { refreshToken } = useContext(AuthContext);
    const axiosInstance = useAxios(refreshToken);

    const fetchProducts = async () => {
        try {
            const response = await axiosInstance.get(`/products/get?page=${currentPage}&limit=${itemsPerPage}`);
            setProducts(response.data.products);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching products', error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [addProductOpen, editProductOpen, deleteProductOpen, currentPage, axiosInstance]);

    const refreshProducts = async () => {
        try {
            const response = await axiosInstance.get(`/products/get?page=${currentPage}&limit=${itemsPerPage}`);
            setProducts(response.data.products);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching products', error);
        }
    };

    const handleSelectProduct = (productId) => {
        setSelectedProducts((prevSelected) => {
            if (prevSelected.includes(productId)) {
                return prevSelected.filter(id => id !== productId);
            } else {
                return [...prevSelected, productId];
            }
        });
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedProducts(products.map(product => product._id));
        } else {
            setSelectedProducts([]);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <>
            <div className='container mx-auto max-w-screen-2xl px-4 mt-20'>
                <div className='flex flex-col items-center justify-center'>
                    <div className='flex items-center justify-between w-full mb-4'>
                        <Typography variant='h5'>Products</Typography>
                        <div>
                            <OutlinedBrownButton onClick={() => setAddProductOpen(true)} className='!mr-4'>Add Product</OutlinedBrownButton>
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
                    <TableContainer component={Paper} className='max-w-screen-2xl mx-auto'>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <BoldTableCell>
                                        <Checkbox
                                            checked={selectedProducts.length === products.length}
                                            onChange={handleSelectAll}
                                        />
                                    </BoldTableCell>
                                    <BoldTableCell>Name</BoldTableCell>
                                    <BoldTableCell>Description</BoldTableCell>
                                    <BoldTableCell>Details</BoldTableCell>
                                    <BoldTableCell>Price</BoldTableCell>
                                    <BoldTableCell>Sale Price</BoldTableCell>
                                    <BoldTableCell>Category</BoldTableCell>
                                    <BoldTableCell>Subcategory</BoldTableCell>
                                    <BoldTableCell>Inventory Count</BoldTableCell>
                                    <BoldTableCell>Dimensions</BoldTableCell>
                                    <BoldTableCell>Variants</BoldTableCell>
                                    <BoldTableCell>Discount</BoldTableCell>
                                    <BoldTableCell>Supplier</BoldTableCell>
                                    <BoldTableCell>Shipping</BoldTableCell>
                                    <BoldTableCell>Image</BoldTableCell>
                                    <BoldTableCell>Actions</BoldTableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {products.length > 0 ? (
                                    products.map((product) => (
                                        <TableRow key={product._id}>
                                            <TableCell>
                                                <Checkbox
                                                    checked={selectedProducts.includes(product._id)}
                                                    onChange={() => handleSelectProduct(product._id)}
                                                />
                                            </TableCell>
                                            <TableCell>{product?.name || 'N/A'}</TableCell>
                                            <TableCell>{product?.description || 'N/A'}</TableCell>
                                            <TableCell>
                                                {product?.details && product.details.length > 0 ? (
                                                    truncateItems(product.details.map((detail, index) => (
                                                        <div key={index}>
                                                            <Typography fontSize='small'>{`${detail.attribute}: ${detail.value}`}</Typography>
                                                        </div>
                                                    )), ITEMS_TO_SHOW).map((item, index) => (
                                                        <div key={index}>{item}</div>
                                                    ))
                                                ) : 'N/A'}
                                            </TableCell>
                                            <TableCell>{product?.price || '0'}</TableCell>
                                            <TableCell>{product?.salePrice || '0'}</TableCell>
                                            <TableCell>{product?.category?.name || 'N/A'}</TableCell>
                                            <TableCell>{product?.subcategory?.name || 'N/A'}</TableCell>
                                            <TableCell>{product?.inventoryCount || 'N/A'}</TableCell>
                                            <TableCell>
                                                {product?.dimensions ? `${product.dimensions.length} x ${product.dimensions.width} x ${product.dimensions.height} ${product.dimensions.unit}` : 'N/A'}
                                            </TableCell>
                                            <TableCell>
                                                {product?.variants && product.variants.length > 0 ? (
                                                    truncateItems(product.variants.map((variant, index) => (
                                                        <div key={index}>
                                                            <Typography fontSize='small'>{`Color: ${variant.color}, Size: ${variant.size}`}</Typography>
                                                        </div>
                                                    )), ITEMS_TO_SHOW).map((item, index) => (
                                                        <div key={index}>{item}</div>
                                                    ))
                                                ) : 'N/A'}
                                            </TableCell>
                                            <TableCell>
                                                {product?.discount ?
                                                    (product.discount.type === 'percentage'
                                                        ? `${product.discount.value}%`
                                                        : `${product.discount.value}`)
                                                    : 'N/A'}
                                            </TableCell>
                                            <TableCell>{product?.supplier?.name || 'N/A'}</TableCell>
                                            <TableCell>
                                                {product?.shipping ? `${product.shipping.weight} kg, ${product.shipping.cost}€, ${product.shipping.packageSize}` : 'None'}
                                            </TableCell>
                                            <TableCell><img className='rounded-md' src={`http://localhost:5000/${product?.image || ''}`} alt="" width={80} /></TableCell>
                                            <TableCell>
                                                <ActionButton onClick={() => { setSelectedProduct(product); setEditProductOpen(true); }}><BrownCreateOutlinedIcon /></ActionButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={14} align="center">
                                            No products found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {totalPages > 1 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    )}

                    <AddProductModal open={addProductOpen} onClose={() => setAddProductOpen(false)} onAddSuccess={refreshProducts} />
                    <EditProductModal open={editProductOpen} onClose={() => setEditProductOpen(false)} product={selectedProduct} onEditSuccess={refreshProducts} />
                    <DeleteProductModal open={deleteProductOpen} onClose={() => setDeleteProductOpen(false)} products={selectedProducts.map(id => products.find(product => product._id === id))} onDeleteSuccess={refreshProducts} />
                </div>
            </div>
        </>
    );
};

export default ProductsPage;