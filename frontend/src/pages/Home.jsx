import React from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar/Navbar';
import Slideshow from '../components/Slideshow';
import ProductList from './Product/ProductList';

const Home = () => {
    return (
        <>
            <Navbar />

            <Slideshow />
            <ProductList />

            <Footer />
        </>
    );
};

export default Home;