import { Facebook, GitHub, Instagram, LinkedIn } from '@mui/icons-material';
import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-stone-600 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold mb-4">sheero</h3>
                        <p className="text-gray-200 mb-2">Your trusted online shopping destination for quality products and exceptional service. <br /><p className='mt-4'>Stay connected with us</p></p>
                        <div className="flex space-x-4">
                            <a href='https://facebook.com' target='_blank' className="text-gray-200 hover:text-white" aria-label="Facebook">
                                <Facebook />
                            </a>
                            <a href='https://instagram.com' target='_blank' className="text-gray-200 hover:text-white" aria-label="Instagram">
                                <Instagram />
                            </a>
                            <a href='https://www.linkedin.com/in/donat-halimi-0719b0193/' target='_blank' className="text-gray-200 hover:text-white" aria-label="LinkedIn">
                                <LinkedIn />
                            </a>
                            <a href='https://github.com/DonatHalimi/sheero' target='_blank' className="cursor-pointer text-gray-200 hover:text-white" aria-label='GitHub'>
                                <GitHub />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-gray-200 hover:text-white hover:underline">Home</a></li>
                            <li><a href="#" className="text-gray-200 hover:text-white hover:underline">Shop</a></li>
                            <li><a href="#" className="text-gray-200 hover:text-white hover:underline">About Us</a></li>
                            <li><a href="#" className="text-gray-200 hover:text-white hover:underline">Contact</a></li>
                            <li><a href="/faqs" className="text-gray-200 hover:text-white hover:underline">FAQs</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-gray-200 hover:text-white">My Account</a></li>
                            <li><a href="#" className="text-gray-200 hover:text-white">Order Tracking</a></li>
                            <li><a href="#" className="text-gray-200 hover:text-white">Wishlist</a></li>
                            <li><a href="#" className="text-gray-200 hover:text-white">Returns</a></li>
                            <li><a href="#" className="text-gray-200 hover:text-white">Shipping Info</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
                        <p className="text-gray-200 mb-4">Subscribe to our newsletter for the latest updates and offers.</p>
                        <form className="flex">
                            <input type="email" placeholder="Your email" className="bg-stone-700 text-white px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-stone-500 flex-grow" required />
                            <button type="submit" className="bg-stone-800 text-white px-4 py-2 rounded-r-md hover:bg-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-500">Subscribe</button>
                        </form>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-stone-700 text-center">
                    <p className="text-gray-200">&copy; 2023 sheero. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;