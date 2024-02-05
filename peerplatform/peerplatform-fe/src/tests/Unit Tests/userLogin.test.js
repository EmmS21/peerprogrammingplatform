import React from "react";
import { render, screen } from "@testing-library/react";
import Login from "../../components/login_components/Login";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "../../context/AuthContext";

const login = (
  <Router>
    <AuthProvider>
      <Login />
    </AuthProvider>
  </Router>
);
beforeEach(() => {
  render(login);
});
describe("login", () => {
  test("Login page renders with no errors", () => {
    render(login);
  });
});
