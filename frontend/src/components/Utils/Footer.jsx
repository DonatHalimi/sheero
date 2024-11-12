import { ContactMail, Email, Facebook, GitHub, Instagram, LinkedIn, Phone } from '@mui/icons-material';
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const footerLinks = {
        social: [
            { href: 'https://facebook.com', icon: <Facebook />, label: 'Facebook' },
            { href: 'https://instagram.com', icon: <Instagram />, label: 'Instagram' },
            { href: 'https://www.linkedin.com/in/donat-halimi-0719b0193/', icon: <LinkedIn />, label: 'LinkedIn' },
            { href: 'https://github.com/DonatHalimi/sheero', icon: <GitHub />, label: 'GitHub' },
        ],
        quick: [
            { to: '/', label: 'Home' },
            { to: '/about-us', label: 'About Us' },
            { to: '/contact-us', label: 'Contact' },
            { to: '/faqs', label: 'FAQs' },
        ],
        customerService: [
            { to: '/profile/me', label: 'My Account' },
            { to: '/profile/orders', label: 'Order Tracking' },
            { to: '/profile/address', label: 'Address' },
            { to: '/profile/wishlist', label: 'Wishlist' },
        ],
        contact: [
            { linkType: 'external', href: 'mailto:support@sheero.com', icon: <Email />, label: 'Email' },
            { linkType: 'external', href: 'tel:044221112', icon: <Phone />, label: 'Phone' },
            { linkType: 'internal', to: '/contact-us', icon: <ContactMail />, label: 'Contact' },
        ]
    };

    const currentYear = new Date().getFullYear();
    const displayYear = () => currentYear === 2024 ? '2024' : `2024 - ${currentYear}`;

    return (

        <footer className="bg-stone-600 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* Grid layout for footer sections */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                    {/* Brand Description and Social Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 select-none"><Link to="/">sheero</Link></h3>
                        <p className="text-gray-200 mb-2">
                            Your trusted online shopping destination for quality products and exceptional service.
                        </p>
                        <span className='text-gray-200 mb-2 mt-4'>Stay connected with us</span>
                        <div className="flex space-x-4">
                            {footerLinks.social.map(({ href, icon, label }) => (
                                <a key={label} href={href} target='_blank' aria-label={label} className="text-gray-200 hover:text-white" >
                                    {icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links Section */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 select-none">Quick Links</h3>
                        <ul className="space-y-2">
                            {footerLinks.quick.map(({ to, label }) => (
                                <li key={label}>
                                    <Link to={to} className="text-gray-200 hover:text-white hover:underline">{label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Customer Service Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 select-none">Customer Service</h3>
                        <ul className="space-y-2">
                            {footerLinks.customerService.map(({ to, label }) => (
                                <li key={label}>
                                    <Link to={to} className="text-gray-200 hover:text-white hover:underline">{label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Information */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 select-none">Contact Us</h3>
                        <p className="text-gray-200 mb-4">Have questions or need support? Reach out to us through the following channels:</p>
                        <div className="flex space-x-4 items-center">
                            {footerLinks.contact.map(({ linkType, href, to, icon, label }) => (
                                linkType === 'external' ? (
                                    <a key={label} href={href} aria-label={label} className="text-gray-200 hover:text-white flex items-center" >
                                        {icon}
                                        <span className="ml-1">{label}</span>
                                    </a>
                                ) : (
                                    <Link key={label} to={to} aria-label={label} className="text-gray-200 hover:text-white flex items-center" >
                                        {icon}
                                        <span className="ml-1">{label}</span>
                                    </Link>
                                )
                            ))}
                        </div>
                    </div>

                </div>

                {/* Footer bottom section with copyright */}
                <div className="mt-8 pt-8 border-t border-stone-700 text-center select-none">
                    <p className="text-gray-200 text-left md:text-center">
                        &copy; {displayYear()} sheero. All Rights Reserved. - <a href='https://github.com/DonatHalimi' target='_blank' className='underline'>Donat</a>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;