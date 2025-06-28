import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider, useDispatch } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import App from './App';
import './index.css';
import { loadUser } from './store/actions/authActions';
import { getCategories } from './store/actions/categoryActions';
import { getProducts } from './store/actions/productActions';
import { getImages } from './store/actions/slideshowActions';
import store from './store/store';
import theme from './utils/theme/theme';

const Main = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
    dispatch(getCategories());
    dispatch(getImages());
    dispatch(getProducts());
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <Main />
  </Provider>
);