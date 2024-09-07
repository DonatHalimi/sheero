import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BreadcrumbsComponent, ProductDetailCard, ProductSkeleton } from '../../assets/CustomComponents';
import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
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
                <ProductSkeleton />
                <Footer />
            </>
        );
    }

    const handleImageClick = () => {
        setImagePreviewOpen(true);
    };

    const { name, image, price, salePrice, discount } = product;

    const imageUrl = `http://localhost:5000/${image}`;
    const originalPrice = price || 0;
    const discountPercentage = discount?.value || 0;
    const discountedPrice = salePrice || originalPrice;

    return (
        <>
            <Navbar />
            <BreadcrumbsComponent product={product} />

            <ProductDetailCard
                imageUrl={imageUrl}
                name={name}
                discountPercentage={discountPercentage}
                originalPrice={originalPrice}
                discountedPrice={discountedPrice}
                product={product}
                imagePreviewOpen={imagePreviewOpen}
                handleImageClick={handleImageClick}
                setImagePreviewOpen={setImagePreviewOpen}
            />
            <Footer />
        </>
    );
};

export default ProductDetails;