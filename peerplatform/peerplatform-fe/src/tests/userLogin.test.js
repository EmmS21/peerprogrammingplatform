import React from 'react';
import { render, screen } from '@testing-library/react';
import Login from '../components/login_components/Login';
import Signup from '../components/signup_components/Signup';
import { BrowserRouter as Router } from "react-router-dom"
import { SnackbarProvider } from "notistack"
import Home from '../views/Home'
import { AuthProvider } from '../context/AuthContext';

const
test('Login page renders with no errors', () => {
    render(<Router>
            <AuthProvider>
                <SnackbarProvider>
                    <Login/>
                </SnackbarProvider>
            </AuthProvider>
           </Router>
           )
});
//test('use jsdom in this test file', () => {
//  const element = document.createElement('div');
//  expect(element).not.toBeNull();
//});
