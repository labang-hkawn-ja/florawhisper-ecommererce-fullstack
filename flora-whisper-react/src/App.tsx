import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { isAdmin, isCustomer, isLoggedIn } from "./service/AuthService";
import type { ReactElement } from "react";
import Header from "./components/Header";
import RegisterPage from "./components/RegisterPage";
import LoginPage from "./components/LoginPage";
import HeroSection from "./components/HeroSection";
import Dashboard from "./components/Dashboard";
import Home from "./components/Home";
import UserProfilePage from "./components/UserProfilePage";
import Footer from "./components/Footer";
import PlantDetailsPage from "./components/PlantDetails";
import { CartProvider } from "./components/CartContext";
import CartViewPage from "./components/CartViewPage";
import FlowerLanguageDetails from "./components/FLowerLanguageDetail";
import FlowerLanguagePage from "./components/FlowerLanguagePage";
import OrderHistory from "./components/OrderHistory";
import DashboardLayout from "./components/DashboardLayout";
import CreateUpdatePlantPage from "./components/PlantCreateUpdatePage";
import PlantsTablePage from "./components/PlantTablePage";
import FlowerLanguageCreateUpdatePage from "./components/FlowerLanguageCreateUpdate";
import FlowerLanguageTablePage from "./components/FlowerLanguageTable";
import CheckoutTablePage from "./components/CheckoutTablePage";
import CheckoutUpdatePage from "./components/CheckoutUpdatePage";
import CheckoutPage from "./components/CheckoutPage";

export default function App() {
  const beLogin = isLoggedIn();
  const beAdmin = isAdmin();
  const beCustomer = isCustomer();

  const AuthenticatedRoute = ({ children }: { children: ReactElement }) => {
    if (!beLogin) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <CartProvider>
      <BrowserRouter>
        {(!beLogin || beCustomer) && <Header />}

        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          {beAdmin && (
            <Route
              path="/dashboard"
              element={
                <AuthenticatedRoute>
                  <DashboardLayout>
                    <Dashboard />
                  </DashboardLayout>
                </AuthenticatedRoute>
              }
            />
          )}
          {beAdmin && (
            <Route
              path="/plants"
              element={
                <AuthenticatedRoute>
                  <DashboardLayout>
                    <PlantsTablePage />
                  </DashboardLayout>
                </AuthenticatedRoute>
              }
            />
          )}
          {beAdmin && (
            <Route
              path="/plants/create"
              element={
                <AuthenticatedRoute>
                  <DashboardLayout>
                    <CreateUpdatePlantPage />
                  </DashboardLayout>
                </AuthenticatedRoute>
              }
            />
          )}
          {beAdmin && (
            <Route
              path="/plants/update/:id"
              element={
                <AuthenticatedRoute>
                  <DashboardLayout>
                    <CreateUpdatePlantPage />
                  </DashboardLayout>
                </AuthenticatedRoute>
              }
            />
          )}
          {beAdmin && (
            <Route
              path="/flower-meanings"
              element={
                <AuthenticatedRoute>
                  <DashboardLayout>
                    <FlowerLanguageTablePage />
                  </DashboardLayout>
                </AuthenticatedRoute>
              }
            />
          )}
          {beAdmin && (
            <Route
              path="/flower-meanings/create"
              element={
                <AuthenticatedRoute>
                  <DashboardLayout>
                    <FlowerLanguageCreateUpdatePage />
                  </DashboardLayout>
                </AuthenticatedRoute>
              }
            />
          )}
          {beAdmin && (
            <Route
              path="/checkouts"
              element={
                <AuthenticatedRoute>
                  <DashboardLayout>
                    <CheckoutTablePage />
                  </DashboardLayout>
                </AuthenticatedRoute>
              }
            />
          )}
          {beAdmin && (
            <Route
              path="/checkout/update/:id"
              element={
                <AuthenticatedRoute>
                  <DashboardLayout>
                    <CheckoutUpdatePage />
                  </DashboardLayout>
                </AuthenticatedRoute>
              }
            />
          )}

          {beAdmin && (
            <Route
              path="/flower-meanings/update/:id"
              element={
                <AuthenticatedRoute>
                  <DashboardLayout>
                    <FlowerLanguageCreateUpdatePage />
                  </DashboardLayout>
                </AuthenticatedRoute>
              }
            />
          )}
          <Route
            path="/flower-language"
            element={
              <AuthenticatedRoute>
                <FlowerLanguagePage />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/flower-language/:id"
            element={
              <AuthenticatedRoute>
                <FlowerLanguageDetails />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <AuthenticatedRoute>
                <OrderHistory />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/add-to-cart"
            element={
              <AuthenticatedRoute>
                <CartViewPage />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <AuthenticatedRoute>
                <CheckoutPage />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/plant"
            element={
              <AuthenticatedRoute>
                <HeroSection />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/plants/:id"
            element={
              <AuthenticatedRoute>
                <HeroSection />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/plant-detail/:id"
            element={
              <AuthenticatedRoute>
                <PlantDetailsPage />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/"
            element={
              <AuthenticatedRoute>
                {beAdmin ? (
                  <DashboardLayout>
                    <Dashboard />
                  </DashboardLayout>
                ) : (
                  <Home />
                )}
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/user-profile"
            element={
              <AuthenticatedRoute>
                {beAdmin ? (
                  <DashboardLayout>
                    <UserProfilePage />
                  </DashboardLayout>
                ) : (
                  <UserProfilePage />
                )}
              </AuthenticatedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {(!beLogin || beCustomer) && <Footer />}
      </BrowserRouter>
    </CartProvider>
  );
}
