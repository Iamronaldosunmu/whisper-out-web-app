import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { NextUIProvider } from '@nextui-org/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import ProtectedRoute from './ProtectedRoute.jsx';
import { AuthProvider, AuthContext } from './config/AuthContext.jsx';

import './index.css';
import store from './state/store.js';

import SplashScreen from './screens/SplashScreen.jsx';
import SignupPage from './screens/SignupPage.jsx';
import ConfirmationPage from './screens/ConfirmationPage';
import FinishSignUp from './screens/FinishSignUp';
import Home from './screens/Home';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <NextUIProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<SplashScreen />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/confirmation" element={<ConfirmationPage />} />
            <Route path="/finishSignUp" element={<FinishSignUp />} />
            {/* Protect home route */}
            <Route path="/home" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }

            />
          </Routes>

        </AuthProvider>
        </NextUIProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
