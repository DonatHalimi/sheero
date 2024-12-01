import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FAQItem, GoBackButton, LoadingFaq } from '../../assets/CustomComponents';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Utils/Footer';
import { getFAQs } from '../../store/actions/dashboardActions';

const FAQs = () => {
    const { faqs, loading } = useSelector((state) => state.dashboard);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getFAQs())
    }, [dispatch])

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
                        <LoadingFaq />
                        : faqs.map((faq, index) => (
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