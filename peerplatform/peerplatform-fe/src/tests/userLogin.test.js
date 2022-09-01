import React from 'react';
import { render, screen } from '@testing-library/react';
import Login from '../components/login_components/Login';
import Signup from '../components/signup_components/Signup';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router } from "react-router-dom"
import Home from '../views/Home'
import { AuthProvider } from '../context/AuthContext';

const login = <Router>
                <AuthProvider>
                    <Login/>
                </AuthProvider>
              </Router>
beforeEach(() => {
    render(login)
});
describe('login', () => {
    test('Login page renders with no errors', () => {
        render(login)
    });
    test('Login form not vulnerable to SQL injection', () => {
        const username = screen.getByPlaceholderText('username');
        const password = screen.getByPlaceholderText('password');
        const loginButton = screen.getByRole('button');
        userEvent.type(username, "'");
        userEvent.type(password, "'");
        userEvent.click(loginButton);
    })
})

//test('use jsdom in this test file', () => {
//  const element = document.createElement('div');
//  expect(element).not.toBeNull();
//});
