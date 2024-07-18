import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import useAxios from '../../axiosInstance';
import { ActionButton, BoldTableCell, BrownCreateOutlinedIcon, BrownDeleteOutlinedIcon, OutlinedBrownButton } from '../../components/Dashboard/CustomComponents';
import AddProductModal from '../../components/Modal/Product/AddProductModal';
import DeleteProductModal from '../../components/Modal/Product/DeleteProductModal';
import EditProductModal from '../../components/Modal/Product/EditProductModal';
import Pagination from '../../components/Pagination';
import { AuthContext } from '../../context/AuthContext';

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
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

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <>
            <div className='flex flex-col items-center justify-center p-4 mt-24'>
                <div className='flex justify-between w-full mb-4 px-14'>
                    <Typography variant='h5'>Products</Typography>
                    <OutlinedBrownButton onClick={() => setAddProductOpen(true)}>Add Product</OutlinedBrownButton>
                </div>
                <TableContainer component={Paper} className='max-w-screen-2xl mx-auto'>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <BoldTableCell>Name</BoldTableCell>
                                <BoldTableCell>Description</BoldTableCell>
                                <BoldTableCell>Price</BoldTableCell>
                                <BoldTableCell>Sale Price</BoldTableCell>
                                <BoldTableCell>Category</BoldTableCell>
                                <BoldTableCell>Subcategory</BoldTableCell>
                                <BoldTableCell>Inventory Count</BoldTableCell>
                                <BoldTableCell>Dimensions</BoldTableCell>
                                <BoldTableCell>Variants</BoldTableCell>
                                <BoldTableCell>Image</BoldTableCell>
                                <BoldTableCell>Actions</BoldTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {products.length > 0 ? (
                                products.map((product) => (
                                    <TableRow key={product._id}>
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell>{product.description}</TableCell>
                                        <TableCell>{product.price}</TableCell>
                                        <TableCell>{product.salePrice ? product.salePrice : "0"}</TableCell>
                                        <TableCell>{product.category.name}</TableCell>
                                        <TableCell>{product.subcategory.name}</TableCell>
                                        <TableCell>{product.inventoryCount}</TableCell>
                                        <TableCell>{product.dimensions ? `${product.dimensions.length} x ${product.dimensions.width} x ${product.dimensions.height} ${product.dimensions.unit}` : ''}</TableCell>
                                        <TableCell>
                                            {product.variants.map((variant, index) => (
                                                <div key={index}>
                                                    <Typography>{`Color: ${variant.color}, Size: ${variant.size}`}</Typography>
                                                </div>
                                            ))}
                                        </TableCell>
                                        <TableCell><img className='rounded-md' src={`http://localhost:5000/${product.image}`} alt="" width={80} /></TableCell>
                                        <TableCell>
                                            <ActionButton onClick={() => { setSelectedProduct(product); setEditProductOpen(true); }}><BrownCreateOutlinedIcon /></ActionButton>
                                            <ActionButton onClick={() => { setSelectedProduct(product); setDeleteProductOpen(true); }}><BrownDeleteOutlinedIcon /></ActionButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={11} align="center">
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
                <DeleteProductModal open={deleteProductOpen} onClose={() => setDeleteProductOpen(false)} product={selectedProduct} onDeleteSuccess={refreshProducts} />
            </div>
        </>
    );
};

export default ProductsPage;
