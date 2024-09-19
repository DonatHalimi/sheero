import { ContactMail, Email, Facebook, GitHub, Instagram, LinkedIn, Phone } from '@mui/icons-material';
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const socialLinks = [
        { href: 'https://facebook.com', icon: <Facebook />, label: 'Facebook' },
        { href: 'https://instagram.com', icon: <Instagram />, label: 'Instagram' },
        { href: 'https://www.linkedin.com/in/donat-halimi-0719b0193/', icon: <LinkedIn />, label: 'LinkedIn' },
        { href: 'https://github.com/DonatHalimi/sheero', icon: <GitHub />, label: 'GitHub' },
    ];

    const quickLinks = [
        { to: '/', label: 'Home' },
        { to: '/about-us', label: 'About Us' },
        { to: '/contact-us', label: 'Contact' },
        { to: '/faqs', label: 'FAQs' },
    ];

    const customerServiceLinks = [
        { to: '/profile', label: 'My Account' },
        { to: '/orders', label: 'Order Tracking' },
        { to: '/address', label: 'Address' },
        { to: '/wishlist', label: 'Wishlist' },
    ];

    const contactInfo = [
        { href: 'mailto:support@sheero.com', icon: <Email />, label: 'Email' },
        { href: 'tel:+1234567890', icon: <Phone />, label: 'Phone' },
        { to: '/contact-us', icon: <ContactMail />, label: 'Contact' },
    ];

    return (
        <footer className="bg-stone-600 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 select-none"><Link to="/">sheero</Link></h3>
                        <p className="text-gray-200 mb-2">
                            Your trusted online shopping destination for quality products and exceptional service.
                            <div className='mb-2' />
                            <span className='mt-4'>Stay connected with us</span>
                        </p>
                        <div className="flex space-x-4">
                            {socialLinks.map(({ href, icon, label }) => (
                                <a key={label} href={href} target='_blank' className="text-gray-200 hover:text-white" aria-label={label}>
                                    {icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 select-none">Quick Links</h3>
                        <ul className="space-y-2">
                            {quickLinks.map(({ to, label }) => (
                                <li key={label}>
                                    <Link to={to} className="text-gray-200 hover:text-white hover:underline">{label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 select-none">Customer Service</h3>
                        <ul className="space-y-2">
                            {customerServiceLinks.map(({ to, label }) => (
                                <li key={label}>
                                    <Link to={to} className="text-gray-200 hover:text-white hover:underline">{label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Us */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 select-none">Contact Us</h3>
                        <p className="text-gray-200 mb-4">Have questions or need support? Reach out to us through the following channels:</p>
                        <div className='mb-2' />
                        <div className="flex space-x-4 items-center">
                            {contactInfo.map(({ href, to, icon, label }) => (
                                <a key={label} href={href} to={to} className="text-gray-200 hover:text-white flex items-center" aria-label={label}>
                                    {icon}
                                    <span className="ml-1">{label}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-stone-700 text-center select-none">
                    <p className="text-gray-200">&copy; 2023 sheero. All Rights Reserved. - <a href='https://github.com/DonatHalimi' target='_blank' className='underline'>Donat</a></p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
