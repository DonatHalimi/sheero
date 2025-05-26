import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Utils/Footer';
import Slideshow from '../../components/Utils/Slideshow';
import ProductList from '../Product/ProductList';

const Home = () => {
    return (
        <>
            <Navbar />

            <Slideshow />
            <ProductList />

            <Footer />
        </>
    );
};

export default Home;