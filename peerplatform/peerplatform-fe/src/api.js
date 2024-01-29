import axios from "axios";
export const API_URL = "https://codesquad.onrender.com/";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-type": "application/json",
  },
});

export default class ApiService {
  static saveStripeInfo(data = {}) {
    const result = JSON.stringify(data);
    console.log(`Api Service has been triggered and contains data: ${result}`);
    return api.post(`${API_URL}/payments/save-stripe-info/`, data);
  }
}
