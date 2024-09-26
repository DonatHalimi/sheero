import AddressesPage from '../pages/Dashboard/AddressesPage';
import CategoriesPage from '../pages/Dashboard/CategoriesPage';
import CitiesPage from '../pages/Dashboard/CitiesPage';
import ContactPage from '../pages/Dashboard/ContactPage';
import CountriesPage from '../pages/Dashboard/CountriesPage';
import DashboardContent from '../pages/Dashboard/DashboardContent';
import FAQPage from '../pages/Dashboard/FAQPage';
import OrdersPage from '../pages/Dashboard/OrdersPage';
import ProductsPage from '../pages/Dashboard/ProductsPage';
import ReviewsPage from '../pages/Dashboard/ReviewsPage';
import SlideshowPage from '../pages/Dashboard/SlideshowPage';
import SubcategoriesPage from '../pages/Dashboard/SubcategoriesPage';
import SubSubcategoriesPage from '../pages/Dashboard/SubSubcategoriesPage';
import SuppliersPage from '../pages/Dashboard/SuppliersPage';
import UsersPage from '../pages/Dashboard/UsersPage';

const pages = {
    addresses: AddressesPage,
    categories: CategoriesPage,
    cities: CitiesPage,
    contacts: ContactPage,
    countries: CountriesPage,
    faqs: FAQPage,
    images: SlideshowPage,
    main: DashboardContent,
    orders: OrdersPage,
    products: ProductsPage,
    reviews: ReviewsPage,
    subcategories: SubcategoriesPage,
    subSubcategories: SubSubcategoriesPage,
    suppliers: SuppliersPage,
    users: UsersPage,
};

export default pages;