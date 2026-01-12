import axios from "axios";

const EMPLOYEE_BASE_URL = "https://trackray-management-service.onrender.com";

export const employeeApi = axios.create({
  baseURL: EMPLOYEE_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// GET all employees
export const getEmployees = async () => {
  const res = await employeeApi.get("/employees/");
  return res.data;
};

// GET employee by ID
export const getEmployeeById = async (id) => {
  const res = await employeeApi.get(`/employees/${id}`);
  return res.data;
};

// CREATE employee
export const createEmployee = async (data) => {
  const res = await employeeApi.post("/employees/", data);
  return res.data;
};
