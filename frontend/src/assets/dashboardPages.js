import AddressesPage from '../pages/Dashboard/AddressesPage';
import CategoriesPage from '../pages/Dashboard/CategoriesPage';
import CitiesPage from '../pages/Dashboard/CitiesPage';
import CountriesPage from '../pages/Dashboard/CountriesPage';
import DashboardContent from '../pages/Dashboard/DashboardContent';
import ProductsPage from '../pages/Dashboard/ProductsPage';
import ReviewsPage from '../pages/Dashboard/ReviewsPage';
import SubcategoriesPage from '../pages/Dashboard/SubcategoriesPage';
import SuppliersPage from '../pages/Dashboard/SuppliersPage';
import UsersPage from '../pages/Dashboard/UsersPage';

const pages = {
    main: DashboardContent,
    addresses: AddressesPage,
    categories: CategoriesPage,
    cities: CitiesPage,
    countries: CountriesPage,
    products: ProductsPage,
    reviews: ReviewsPage,
    subcategories: SubcategoriesPage,
    suppliers: SuppliersPage,
    users: UsersPage,
};

export default pages;