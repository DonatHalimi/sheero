import AddressesPage from '../pages/Dashboard/AddressesPage';
import CategoriesPage from '../pages/Dashboard/CategoriesPage';
import CitiesPage from '../pages/Dashboard/CitiesPage';
import CountriesPage from '../pages/Dashboard/CountriesPage';
import DashboardContent from '../pages/Dashboard/DashboardContent';
import FAQPage from '../pages/Dashboard/FAQPage';
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
    countries: CountriesPage,
    images: SlideshowPage,
    main: DashboardContent,
    products: ProductsPage,
    reviews: ReviewsPage,
    suppliers: SuppliersPage,
    subcategories: SubcategoriesPage,
    users: UsersPage,
    subSubcategories: SubSubcategoriesPage,
    faqs: FAQPage
};

export default pages;