// routes/AnimatedRoutes.jsx
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import Dashboard from "../Pages/Dashboard";
import Delivery from "../Pages/DeliveryAss";
import Inventory from "../Pages/InventoryMang";
import AI from "../Pages/AICap";
import PndL from "../Pages/PndL";
import CaptionChatbot from "../Pages/caption_chatbot";

export default function AnimatedRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} /> {/* this will be for /dashboard */}
        <Route path="delivery" element={<Delivery />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="ai-caption" element={<AI />} />
        <Route path="ai-caption/caption-generator" element={<CaptionChatbot />} />
        <Route path="profitNloss" element={<PndL />} />
      </Route>
    </Routes>
  );
}