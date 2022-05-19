import axios from "axios";

const instance = axios.create({
  baseURL: "https://multi-client-mern.herokuapp.com/api/v1/", //"http://localhost:8000/api/v1/", //
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
