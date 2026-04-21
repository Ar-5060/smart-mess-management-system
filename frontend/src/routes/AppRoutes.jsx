import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import RegisterPage from "../pages/auth/RegisterPage";
import CreateMessPage from "../pages/mess/CreateMessPage";
import MemberManagementPage from "../pages/member/MemberManagementPage";
import MealEntryPage from "../pages/meal/MealEntryPage";
import ExpensePage from "../pages/expense/ExpensePage";
import RentPage from "../pages/rent/RentPage";
import MonthlySummaryPage from "../pages/summary/MonthlySummaryPage";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/create-mess" element={<CreateMessPage />} />
      <Route path="/members" element={<MemberManagementPage />} />
      <Route path="/meals" element={<MealEntryPage />} />
      <Route path="/expenses" element={<ExpensePage />} />
      <Route path="/rent" element={<RentPage />} />
      <Route path="/summary" element={<MonthlySummaryPage />} />
    </Routes>
  );
}

export default AppRoutes;