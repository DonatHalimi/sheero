import { Box, Button, Card, CardContent, CardMedia, Container, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Utils/Footer';

const AboutUs = () => {
  return (
    <>
      <Navbar />
      <Container maxWidth="lg" className="py-12">
        <Box className="text-center mb-12">
          <Typography variant="h4" component="h1" className="text-4xl font-semibold text-gray-800 mb-4">
            About Us
          </Typography>
          <Typography variant="body1" className="text-lg text-gray-600">
            At sheero, we believe in delivering the best products for our customers. Learn more about our mission and values.
          </Typography>
        </Box>

        {/* Mission Section */}
        <Box className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Box className="flex flex-col justify-center">
            <Typography variant="h5" className="text-3xl font-semibold text-gray-800 mb-4">
              Our Mission
            </Typography>
            <Typography variant="body1" className="text-lg text-gray-600 !mt-2">
              Our mission is to provide high-quality products at unbeatable prices, making online shopping easy and accessible for everyone. We strive to deliver excellence in both products and customer service.
            </Typography>
            <Button variant="contained" color="primary" className="!mt-4 w-fit self-start">
              <Link to="/" className="text-white no-underline">Shop Now</Link>
            </Button>
          </Box>
          <Box>
            <Card>
              <CardMedia
                component="img"
                alt="Our mission"
                height="300"
                image="https://via.placeholder.com/600x400"
                className="object-cover"
              />
            </Card>
          </Box>
        </Box>

        {/* Our Story Section */}
        <Box className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Box>
            <Card>
              <CardMedia
                component="img"
                alt="Our Story"
                height="300"
                image="https://via.placeholder.com/600x400"
                className="object-cover"
              />
            </Card>
          </Box>
          <Box className="flex flex-col justify-center">
            <Typography variant="h5" className="text-3xl font-semibold text-gray-800 mb-4">
              Our Story
            </Typography>
            <Typography variant="body1" className="text-lg text-gray-600 !mt-2">
              Founded in 2023, sheero began with a vision to revolutionize the e-commerce space. We started as a small startup and have grown into a trusted platform for thousands of customers worldwide. Our success is rooted in our passion for quality and customer satisfaction.
            </Typography>
          </Box>
        </Box>

        {/* Values Section */}
        <Box className="text-center mb-16">
          <Typography variant="h5" className="text-3xl font-semibold text-gray-800 !mb-4">
            Our Core Values
          </Typography>
          <Box className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Value 1 */}
            <Card className="hover:shadow-xl transition-shadow">
              <CardContent>
                <Typography variant="h6" className="text-xl font-semibold text-gray-800 mb-2">
                  Quality Products
                </Typography>
                <Typography variant="body1" className="text-gray-600">
                  We guarantee that all products meet the highest standards of quality and durability.
                </Typography>
              </CardContent>
            </Card>

            {/* Value 2 */}
            <Card className="hover:shadow-xl transition-shadow">
              <CardContent>
                <Typography variant="h6" className="text-xl font-semibold text-gray-800 mb-2">
                  Customer Commitment
                </Typography>
                <Typography variant="body1" className="text-gray-600">
                  Our customers are our top priority. We are dedicated to providing exceptional service at every stage.
                </Typography>
              </CardContent>
            </Card>

            {/* Value 3 */}
            <Card className="hover:shadow-xl transition-shadow">
              <CardContent>
                <Typography variant="h6" className="text-xl font-semibold text-gray-800 mb-2">
                  Innovation
                </Typography>
                <Typography variant="body1" className="text-gray-600">
                  We embrace creativity and innovation to bring you the latest and most cutting-edge products.
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Call to Action */}
        <Box className="text-center">
          <Typography variant="h6" className="text-2xl font-semibold text-gray-800 !mb-4">
            Ready to start your shopping journey with us?
          </Typography>
          <Button variant="contained" color="primary" size="large" className="mb-4">
            <Link to="/" className="text-white no-underline">Explore Our Products</Link>
          </Button>
        </Box>
      </Container>

      <Footer />
    </>
  );
};

export default AboutUs;