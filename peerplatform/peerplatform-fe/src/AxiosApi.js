import axios from "axios";

const AxiosInstance = axios.create({
  baseURL: "https://codesquad.onrender.com/api/",
  timeout: 5000,
  headers: {
    Authorization: "JWT" + localStorage.getItem("access_token"),
    "Content-Type": "application/json",
    accept: "application/json",
  },
});

export default AxiosInstance;
