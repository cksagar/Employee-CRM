import axios from "axios";

const API_BASE = "http://localhost:5000/api/employees";

export const getEmployees = () => axios.get(API_BASE);
export const addEmployee = (employee) => axios.post(API_BASE, employee);
export const updateEmployee = (id, updated) =>
  axios.put(`${API_BASE}/${id}`, updated);
export const deleteEmployee = (id) => axios.delete(`${API_BASE}/${id}`);
