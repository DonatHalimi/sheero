import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {FAQSection} from '../assets/CustomComponents';

const FAQs = () => {
    const faqData = [
        {
            question: "What is your return policy?",
            answer: "We offer a 30-day return policy for all unused items in their original packaging."
        },
        {
            question: "How long does shipping take?",
            answer: "Shipping typically takes 3-5 business days for domestic orders and 7-14 business days for international orders."
        },
        {
            question: "Do you offer international shipping?",
            answer: "Yes, we ship to most countries worldwide. Shipping costs and delivery times may vary depending on the destination."
        },
        {
            question: "How can I track my order?",
            answer: "Once your order is shipped, you'll receive a tracking number via email. You can use this number to track your package on our website or the carrier's website."
        },
        {
            question: "What payment methods do you accept?",
            answer: "We accept major credit cards (Visa, MasterCard, American Express), PayPal, and Apple Pay."
        },
    ];

    return (
        <>
            <Navbar />
            <FAQSection faqData={faqData} />
            <div className='mt-40'></div>
            <Footer />
        </>
    );
};

export default FAQs;