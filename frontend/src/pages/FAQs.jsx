import React, { useEffect, useState } from 'react';
import { FAQItem, GoBackButton } from '../assets/CustomComponents';
import useAxios from '../axiosInstance';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar/Navbar';

const FAQs = () => {
    const [faqData, setFaqData] = useState([]);
    const axiosInstance = useAxios();

    useEffect(() => {
        const fetchFAQs = async () => {
            try {
                const response = await axiosInstance.get('/faqs/get');
                setFaqData(response.data);
            } catch (error) {
                console.error('Error fetching FAQs:', error);
            }
        };

        fetchFAQs();
    }, []);

    return (
        <>
            <Navbar />

            <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-brown-50 mt-4">
                <GoBackButton />
                <div className="bg-white text-bold text-stone-600 p-4 rounded-md shadow-sm mb-3 flex justify-between items-center px-2">
                    <h1 className="text-2xl font-bold font-semilight ml-2">Frequently Asked Questions</h1>
                </div>

                <div>
                    {faqData.map((faq, index) => (
                        <FAQItem key={index} question={faq.question} answer={faq.answer} />
                    ))}
                </div>
            </div>

            <div className='mt-20'></div>
            <Footer />
        </>
    );
};

export default FAQs;