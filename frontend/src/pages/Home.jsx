import React from 'react';
import CategoriesList from '../components/CategoriesList';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import ProductList from '../components/ProductList';
import Slideshow from '../components/Slideshow';

const Home = () => {
    return (
        <>
            <div className="pt-20">
                <Navbar />

                <CategoriesList />

                <Slideshow />

                <ProductList />

                <Footer />
            </div>
        </>
    );
};

export default Home;