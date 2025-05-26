import { ExpandMore, QuestionAnswerOutlined } from "@mui/icons-material";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getExpandIconProps, getMotionDivProps } from "../../../assets/sx";

export const FAQItem = ({ question, answer, shouldCollapse, expandAll }) => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (shouldCollapse) {
            setIsOpen(expandAll);
        }
    }, [shouldCollapse, expandAll]);

    return (
        <div className="mb-4">
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={isOpen ? {} : { scale: 1.02 }}
                whileTap={isOpen ? {} : { scale: 0.98 }}
                className={`flex justify-between items-center w-full p-4 text-left bg-white rounded-md transition-shadow duration-200 ${isOpen ? 'shadow' : 'shadow hover:shadow-lg'}`}
            >
                <span className="flex items-center text-brown-800 font-semibold">
                    <QuestionAnswerOutlined className="mr-2 text-brown-600" />
                    {question}
                </span>
                <motion.span {...getExpandIconProps(isOpen)}>
                    <ExpandMore className="text-brown-600" />
                </motion.span>
            </motion.button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div {...getMotionDivProps(isOpen)} className='bg-white rounded-b-md shadow-md mt-1 overflow-hidden'>
                        <div className="p-4 text-brown-700">
                            <p>{answer}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};