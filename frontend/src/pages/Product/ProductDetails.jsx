import FavoriteIcon from '@mui/icons-material/FavoriteBorderOutlined';
import { Breadcrumbs, Link, Skeleton, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { AddToCartButton, BrownShoppingCartIcon, HomeIcon, WishlistButton } from '../../assets/CustomComponents';
import NoImage from '../../assets/not-found.jpg';
import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar';
import ProductDetailsTabs from '../../components/ProductDetailsTabs';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/products/get/${id}`);
                setProduct(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching product:', error);
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <>
                <Navbar />
                <div className='container mx-auto px-4 max-w-5xl relative top-6 right-4'>
                    <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 4, fontSize: '14px' }}>
                        <Link component={RouterLink} to="/" color="inherit" underline="none">
                            <HomeIcon color="primary" />
                        </Link>
                        <Skeleton width={120} />
                    </Breadcrumbs>
                </div>
                <div className="container mx-auto px-4 py-4 mb-8 bg-white mt-8 rounded-md max-w-5xl">
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="flex flex-col items-center md:w-1/2">
                            <Skeleton variant="rectangular" width="100%" height={320} />
                        </div>
                        <div className="md:w-1/2">
                            <Skeleton variant="text" width="80%" height={40} />
                            <Skeleton variant="text" width="40%" height={30} style={{ marginTop: '16px' }} />
                            <Skeleton variant="text" width="60%" height={30} />
                            <Skeleton variant="text" width="20%" height={30} />
                            <div className="mt-4 flex items-center space-x-4">
                                <Skeleton variant="rectangular" width={140} height={40} />
                                <Skeleton variant="rectangular" width={60} height={40} />
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    const { name, image, price, salePrice, discount } = product;

    const imageUrl = `http://localhost:5000/${image}`;
    const originalPrice = price || 0;
    const discountPercentage = discount?.value || 0;
    const discountedPrice = salePrice || originalPrice;

    return (
        <>
            <Navbar />
            <div className='container mx-auto px-4 max-w-5xl relative top-6 right-4'>
                <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 4, fontSize: '14px' }}>
                    <Link component={RouterLink} to="/" color="inherit" underline="none">
                        <HomeIcon color="primary" />
                    </Link>
                    {product.category && (
                        <Link component={RouterLink} to={`/products/category/${product.category._id}`} color="inherit" underline="none" className='hover:underline'>
                            {product.category.name}
                        </Link>
                    )}
                    {product.subcategory && (
                        <Link component={RouterLink} to={`/products/subcategory/${product.subcategory._id}`} color="inherit" underline="none" className='hover:underline'>
                            {product.subcategory.name}
                        </Link>
                    )}
                    {product.subSubcategory && (
                        <Link component={RouterLink} to={`/products/subSubcategory/${product.subSubcategory._id}`} color="inherit" underline="none" className='hover:underline'>
                            {product.subSubcategory.name}
                        </Link>
                    )}
                    <Typography color="text.primary" style={{ fontSize: '14px' }}>{product.name}</Typography>
                </Breadcrumbs>
            </div>
            <div className="container mx-auto px-4 py-4 mb-8 bg-white mt-8 rounded-md max-w-5xl">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex flex-col items-center md:w-1/2">
                        <img
                            src={imageUrl}
                            alt={name}
                            className="w-full h-80 object-cover rounded"
                            onError={(e) => { e.target.onerror = null; e.target.src = NoImage; }}
                        />
                    </div>
                    <div className="md:w-1/2">
                        <h1 className="text-2xl">{name}</h1>
                        <div className="mt-4 flex flex-col">
                            {discountPercentage > 0 ? (
                                <>
                                    <span className="text-gray-500 line-through text-sm">
                                        {originalPrice.toFixed(2)} €
                                    </span>
                                    <span className="text-2xl font-bold text-stone-600">
                                        {discountedPrice.toFixed(2)} €
                                    </span>
                                    <div className="flex items-center mt-1">
                                        <span className="text-sm font-semibold text-stone-600">
                                            You save {(originalPrice - discountedPrice).toFixed(2)}€
                                        </span>
                                        <span className="ml-2 text-sm font-semibold text-stone-600 bg-stone-100 rounded-md px-1">
                                            -{discountPercentage}%
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <span className="text-2xl font-bold">
                                    {originalPrice.toFixed(2)} €
                                </span>
                            )}
                        </div>
                        <div className="mt-4 flex items-center space-x-4">
                            <AddToCartButton>
                                <BrownShoppingCartIcon /> Add To Cart
                            </AddToCartButton>
                            <WishlistButton>
                                <FavoriteIcon />
                            </WishlistButton>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container mx-auto px-4 bg-white mt-8 mb-8 rounded-md max-w-5xl">
                <div className="mt-4">
                    <ProductDetailsTabs product={product} />
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ProductDetails;