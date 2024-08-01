import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import QuestionAnswerIconOutlined from '@mui/icons-material/QuestionAnswerOutlined';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="mb-4">
            <motion.button
                className="flex justify-between items-center w-full py-4 px-6 text-left bg-white rounded-md shadow-md hover:shadow-lg transition-shadow duration-200"
                onClick={() => setIsOpen(!isOpen)}
                whileHover={isOpen ? {} : { scale: 1.02 }}
                whileTap={isOpen ? {} : { scale: 0.98 }}
            >
                <span className="flex items-center text-brown-800 font-semibold">
                    <QuestionAnswerIconOutlined className="mr-2 text-brown-600" />
                    {question}
                </span>
                <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <ExpandMoreIcon className="text-brown-600" />
                </motion.span>
            </motion.button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-b-md shadow-md mt-1 overflow-hidden"
                    >
                        <div className="p-6 text-brown-700">
                            <p>{answer}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

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
            <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-brown-50 mt-24">
                <h1 className="text-3xl font-bold text-brown-900 mb-8 text-left">Frequently Asked Questions</h1>
                <div>
                    {faqData.map((faq, index) => (
                        <FAQItem key={index} question={faq.question} answer={faq.answer} />
                    ))}
                </div>
            </div>
            <div className='mt-40'></div>
            <Footer />
        </>
    );
};

export default FAQs;