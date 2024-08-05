import { Checkbox, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { ActionButton, BoldTableCell, BrownCreateOutlinedIcon, OutlinedBrownButton } from '../../assets/CustomComponents';
import useAxios from '../../axiosInstance';
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

    const ITEMS_TO_SHOW = 3;

    const truncateItems = (items, maxItems = ITEMS_TO_SHOW) => {
        if (items.length <= maxItems) {
            return items;
        }
        return [...items.slice(0, maxItems), '...'];
    };
    const pageCount = Math.ceil(products.length / itemsPerPage);
    const isPreviousDisabled = currentPage === 0;
    const isNextDisabled = currentPage >= pageCount - 1;
    const paginationEnabled = pageCount && pageCount > 1;

    const getCurrentPageItems = () => {
        const startIndex = currentPage * itemsPerPage;
        return products.slice(startIndex, startIndex + itemsPerPage);
    };

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    return (
        <>
            <div className='container mx-auto max-w-full mt-20'>
                <div className='w-full px-4'>
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
                    <TableContainer component={Paper} className='w-full mx-auto'>
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
                                    <BoldTableCell>SubSubcategory</BoldTableCell>
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
                                {getCurrentPageItems().length > 0 ? (
                                    getCurrentPageItems().map((product) => (
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
                                            <TableCell>{product?.subSubcategory?.name || 'N/A'}</TableCell>
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
                                        <TableCell colSpan={17} align="center">
                                            No product found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <AddProductModal open={addProductOpen} onClose={() => setAddProductOpen(false)} onAddSuccess={fetchProducts} />
                    <EditProductModal open={editProductOpen} onClose={() => setEditProductOpen(false)} product={selectedProduct} onEditSuccess={fetchProducts} />
                    <DeleteProductModal open={deleteProductOpen} onClose={() => setDeleteProductOpen(false)} products={selectedProducts.map(id => products.find(product => product._id === id))} onDeleteSuccess={fetchProducts} />

                    {products.length > 0 && paginationEnabled && (
                        <div className="w-full flex justify-start mt-6 mb-24">
                            <ReactPaginate
                                pageCount={pageCount}
                                pageRangeDisplayed={2}
                                marginPagesDisplayed={1}
                                onPageChange={handlePageClick}
                                containerClassName="inline-flex -space-x-px text-sm"
                                activeClassName="text-white bg-stone-400"
                                previousLinkClassName={`flex items-center justify-center px-1 h-10 text-gray-500 bg-white border border-e-0 border-gray-300 rounded-sm hover:bg-gray-100 hover:text-gray-700 ${isPreviousDisabled ? 'pointer-events-none text-gray-300' : ''}`}
                                nextLinkClassName={`flex items-center justify-center px-1 h-10 text-gray-500 bg-white border border-gray-300 rounded-sm hover:bg-gray-100 hover:text-gray-700 ${isNextDisabled ? 'pointer-events-none text-gray-300' : ''}`}
                                disabledClassName="text-gray-50 cursor-not-allowed"
                                activeLinkClassName="text-stone-600 font-extrabold"
                                previousLabel={<span className="flex items-center justify-center px-2 h-10 text-gray-500 hover:text-gray-700">Previous</span>}
                                nextLabel={<span className="flex items-center justify-center px-2 h-10 text-gray-500 hover:text-gray-700">Next</span>}
                                breakLabel={<span className="flex items-center justify-center px-4 h-10 text-gray-500 bg-white border border-gray-300">...</span>}
                                pageClassName="flex items-center justify-center px-1 h-10 text-gray-500 border border-gray-300 cursor-pointer bg-white"
                                pageLinkClassName="flex items-center justify-center px-3 h-10 text-gray-500 cursor-pointer"
                            />
                        </div>
                    )}
                </div>
            </div >
        </>
    );
};

export default ProductsPage;