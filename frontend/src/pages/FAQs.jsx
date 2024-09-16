import React from 'react';
import { FAQSection } from '../assets/CustomComponents';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar/Navbar';

const FAQs = () => {
    return (
        <>
            <Navbar />
            <FAQSection />
            <div className='mt-40'></div>
            <Footer />
        </>
    );
};

export default FAQs;