import axios from "axios";

const VITE_API_URL = "http://localhost:3000"; //
// const VITE_API_URL = process.env.VITE_API_URL; //

export const fetchCafes = async () => {
    const response = await axios.get(`${VITE_API_URL}/cafes`);
    return response.data;
};

export const fetchCafesByLocation = async (location) => {
    const response = await axios.get(
        `${VITE_API_URL}/cafes?location=${location}`
    );
    return response.data;
};

export const fetchEmployees = async () => {
    const response = await axios.get(`${VITE_API_URL}/employees`);
    return response.data;
};

export const fetchEmployeesByCafe = async (cafeName) => {
    const response = await axios.get(
        `${VITE_API_URL}/employees?cafe=${encodeURIComponent(cafeName)}`
    );
    return response.data;
};

export const fetchCafe = async (id) => {
    const response = await axios.get(`${VITE_API_URL}/cafe/${id}`);
    return response.data;
};

export const fetchEmployee = async (empId) => {
    const response = await axios.get(`${VITE_API_URL}/employee/${empId}`);
    return response.data;
};

export const createCafe = async (cafe) => {
    const response = await axios.post(`${VITE_API_URL}/cafe`, cafe);
    return response.data;
};

export const updateCafe = async (id, cafe) => {
    const response = await axios.put(`${VITE_API_URL}/cafe/${id}`, cafe);
    return response.data;
};

export const createEmployee = async (employee) => {
    const response = await axios.post(`${VITE_API_URL}/employee`, employee);
    return response.data;
};

export const updateEmployee = async (empId, employee) => {
    const response = await axios.put(
        `${VITE_API_URL}/employee/${empId}`,
        employee
    );
    return response.data;
};

export const deleteCafe = async (id) => {
    await axios.delete(`${VITE_API_URL}/cafe/${id}`);
};

export const deleteEmployee = async (id) => {
    await axios.delete(`${VITE_API_URL}/employee/${id}`);
};
