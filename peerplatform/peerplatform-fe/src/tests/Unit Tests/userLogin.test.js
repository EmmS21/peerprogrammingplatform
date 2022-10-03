import React from 'react';
import { render, screen } from '@testing-library/react';
import Login from '../../components/login_components/Logingin';
import Signup from '../../components/signup_components/Signup';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router } from "react-router-dom"
import Home from '../../views/Home'
import { AuthProvider } from '../../context/AuthContext';

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
    test('Login form not vulnerable to SQL injection', async () => {
        const errorAlert = jest.spyOn(window, 'alert');
        const username = screen.getByPlaceholderText('username');
        const password = screen.getByPlaceholderText('password');
        const loginButton = screen.getByRole('button');
        userEvent.type(username, "'");
        userEvent.type(password, "'");
        userEvent.click(loginButton);
        expect(errorAlert).toHaveBeenCalledTimes(1)
//        const errorTag = await screen.getByTestId('loginError');
//        await expect(errorTag.textContent).toBe('Username or password is incorrect');
    });
    test('User can enter username', () => {
        const username = screen.getByPlaceholderText('username');
        userEvent.type(username, 'testing');
        expect(username.value).toEqual('testing');
    });
    test('User can enter password', () => {
        const password = screen.getByPlaceholderText('password');
        userEvent.type(password, 'passwordTest');
        expect(password.value).toEqual('passwordTest');
    });
    test('Cannot click login button if no values', () => {
        const username = screen.getByPlaceholderText('username');
        const password = screen.getByPlaceholderText('password');
        const loginButton = screen.getByRole('button');
        userEvent.click(loginButton);
        expect(loginButton).toHaveProperty('disabled', true);
    });
    test('Cannot click login if username not entered', () => {
        const username = screen.getByPlaceholderText('username');
        const password = screen.getByPlaceholderText('password');
        const loginButton = screen.getByRole('button');
        userEvent.type(password, 'testing');
        userEvent.click(loginButton);
        expect(loginButton).toHaveProperty('disabled', true);
    });
    test('Cannot click login if password not entered', () => {
        const username = screen.getByPlaceholderText('username');
        const password = screen.getByPlaceholderText('password');
        const loginButton = screen.getByRole('button');
        userEvent.type(username, 'testing');
        userEvent.click(loginButton);
        expect(loginButton).toHaveProperty('disabled', true);
    });
    test('Cannot login with invalid details', () => {
        const username = screen.getByPlaceholderText('username');
        const password = screen.getByPlaceholderText('password');
        const loginButton = screen.getByRole('button');
        userEvent.type(username, 'testing');
    })
})
