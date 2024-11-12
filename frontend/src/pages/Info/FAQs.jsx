import React, { useEffect, useState } from 'react';
import { FAQItem, FaqSkeleton, GoBackButton } from '../../assets/CustomComponents';
import useAxios from '../../axiosInstance';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Utils/Footer';

const FAQs = () => {
    const [faqData, setFaqData] = useState([]);
    const [loading, setLoading] = useState(true);

    const axiosInstance = useAxios();

    useEffect(() => {
        const fetchFAQs = async () => {
            try {
                const response = await axiosInstance.get('/faqs/get');
                setFaqData(response.data);
            } catch (error) {
                console.error('Error fetching FAQs:', error);
            } finally {
                setLoading(false);
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
                    {loading ?
                        <FaqSkeleton />
                        : faqData.map((faq, index) => (
                            <FAQItem key={index} question={faq.question} answer={faq.answer} />
                        ))
                    }
                </div>
            </div>

            <div className='mt-20' />
            <Footer />
        </>
    );
};

export default FAQs;