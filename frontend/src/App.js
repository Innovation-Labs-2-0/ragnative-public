import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import EmbedPage from "./components/Chat/EmbedPage";
import routes from "routes";
import ProtectedRoute from "utils/ProtectedRoute";
import React from "react";
import { PUBLIC_ROUTE_KEYS } from "utils/constants";

export default function App() {
  const renderPublicRoutes = (allRoutes) =>
    allRoutes
      .map((route) => {
        if (route.route && PUBLIC_ROUTE_KEYS.includes(route.key)) {
          return <Route path={route.route} element={route.component} key={route.key} />;
        }
        return null;
      })
      .filter(Boolean);

  const renderProtectedMainLayoutRoutes = (allRoutes) =>
    allRoutes
      .map((route) => {
        if (route.collapse) {
          return renderProtectedMainLayoutRoutes(route.collapse);
        }
        if (route.route && !PUBLIC_ROUTE_KEYS.includes(route.key)) {
          return <Route path={route.route} element={route.component} key={route.key} />;
        }
        return null;
      })
      .filter(Boolean);

  return (
    <Routes>
      <Route path="/embed/:botId/version/:botVersion" element={<EmbedPage />} />

      {renderPublicRoutes(routes)}

      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        {renderProtectedMainLayoutRoutes(routes)}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Route>
    </Routes>
  );
}
