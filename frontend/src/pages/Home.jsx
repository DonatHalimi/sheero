import React from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import ProductList from '../pages/Product/ProductList';
import Slideshow from '../components/Slideshow';

const Home = () => {
    return (
        <>
            <div className='bg-white'>
                <Navbar />
            </div>

            <main className="flex-grow bg-neutral-50">
                <Slideshow />
                <ProductList />
            </main>
            <Footer />
        </>
    );
};

export default Home;