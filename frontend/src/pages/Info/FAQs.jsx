import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Button } from '@mui/material';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getExpandIconProps } from '../../assets/sx';
import { LoadingFaq } from '../../components/custom/LoadingSkeletons';
import { GoBackButton } from '../../components/custom/MUI';
import Navbar from '../../components/Navbar/Navbar';
import { FAQItem } from '../../components/Product/Items/FAQItem';
import Footer from '../../components/Utils/Footer';
import { getFAQs } from '../../store/actions/dashboardActions';

const FAQs = () => {
    const { faqs, loading } = useSelector((state) => state.dashboard);
    const dispatch = useDispatch();
    const [collapseCounter, setCollapseCounter] = useState(0);
    const [expandAll, setExpandAll] = useState(false);

    useEffect(() => {
        dispatch(getFAQs())
    }, [dispatch]);

    const handleToggleAll = () => {
        setExpandAll(!expandAll);
        setCollapseCounter(prev => prev + 1);
    };

    return (
        <>
            <Navbar />
            <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-brown-50 mt-4">
                <GoBackButton />
                <div className="bg-white text-bold text-stone-600 p-4 rounded-md shadow-sm mb-3 flex justify-between items-center px-2">
                    <h1 className="text-2xl font-bold font-semilight ml-2">Frequently Asked Questions</h1>
                    <Button
                        onClick={handleToggleAll}
                        className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-brown-600 hover:text-brown-800 bg-brown-50 hover:bg-brown-100 rounded-md transition-colors duration-200"
                    >
                        <motion.span {...getExpandIconProps(expandAll)}>
                            {expandAll ? <ExpandLess /> : <ExpandMore />}
                        </motion.span>
                        <span className="hidden sm:inline">
                            {expandAll ? 'Collapse All' : 'Expand All'}
                        </span>
                    </Button>
                </div>

                <div>
                    {loading ?
                        <LoadingFaq />
                        : faqs.map((faq, index) => (
                            <FAQItem
                                key={index}
                                question={faq.question}
                                answer={faq.answer}
                                shouldCollapse={collapseCounter}
                                expandAll={expandAll}
                            />
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