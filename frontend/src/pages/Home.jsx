import React from 'react';
import CategoryNavbar from '../components/CategoryNavbar';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import ProductList from '../components/ProductList';
import Slideshow from '../components/Slideshow';

const Home = () => {
    return (
        <div className="pt-20 flex flex-col min-h-screen">
            <Navbar />
            <CategoryNavbar />
            <main className="flex-grow bg-neutral-50">
                <Slideshow />
                <ProductList />
            </main>
            <Footer />
        </div>
    );
};

export default Home;