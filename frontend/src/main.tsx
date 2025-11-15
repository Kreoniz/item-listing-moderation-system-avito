import "@/index.css";
import { MainLayout } from "@/layouts/main-layout";
import { ItemPage } from "@/pages/item-page";
import { MainPage } from "@/pages/main-page.tsx";
import { NotFoundPage } from "@/pages/not-found-page";
import { StatsPage } from "@/pages/stats-page";
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
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
