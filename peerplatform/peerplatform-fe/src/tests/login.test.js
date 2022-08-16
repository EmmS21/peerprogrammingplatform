import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Login from '../components/login_components/Login';
import userEvent from '@testing-library/user-event';

test('renders without errors', async () => {
    render(<Login/>)
});
