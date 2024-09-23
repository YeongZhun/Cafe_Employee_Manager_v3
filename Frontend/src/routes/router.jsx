import { createBrowserRouter } from "react-router-dom";
import CafesPage from "../pages/CafesPage";
import EmployeesPage from "../pages/EmployeesPage";
import AddEditCafePage from "../pages/AddEditCafePage";
import EmployeesByCafePage from "../pages/EmployeesByCafePage";
import AddEditEmployeePage from '../pages/AddEditEmployeePage';

const router = createBrowserRouter([
    {
        path: "/",
        element: <CafesPage />,
    },
    {
        path: "/cafes",
        element: <CafesPage />,
    },
    {
        path: "/employees",
        element: <EmployeesPage />,
    },
    {
        path: "/employees-by-cafe",
        element: <EmployeesByCafePage />,
    },
    {
        path: "/cafe/add",
        element: <AddEditCafePage />,
    },
    {
        path: "/cafe/edit/:id",
        element: <AddEditCafePage />,
    },
    {
        path: "/employee/add",
        element: <AddEditEmployeePage />,
    },
    {
        path: "/employee/edit/:empId",
        element: <AddEditEmployeePage />,
    },
]);

export default router;
