import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { store } from './strore.js';
import { fetchUser } from './features/user/AuthSlice.js';

store.dispatch(fetchUser());

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App/>
      </Provider>
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
    </BrowserRouter>
  </StrictMode>,
)
