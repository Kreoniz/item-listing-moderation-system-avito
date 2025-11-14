import "@/index.css";
import { MainLayout } from "@/layouts/MainLayout";
import { ItemPage } from "@/pages/ItemPage";
import { MainPage } from "@/pages/MainPage.tsx";
import { StatsPage } from "@/pages/StatsPage";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Navigate to="/list" replace />} />
          <Route path="/list" element={<MainPage />} />
          <Route path="/item/:id" element={<ItemPage />} />
          <Route path="/stats" element={<StatsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
