import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { MainLayout } from "./layouts/MainLayout"
import { AuthGuard } from "./components/guards/AuthGuard"
import { SplashScreen } from "./components/ui/SplashScreen"
import { ErrorBoundary } from "./components/ErrorBoundary"
import { AuthProvider, useAuth } from "./providers/AuthProvider"

// Code Splitting (Lazy Loading)
const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })))
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })))
const POS = lazy(() => import('./pages/POS').then(m => ({ default: m.POS })))
const Products = lazy(() => import('./pages/Products').then(m => ({ default: m.Products })))
const Inventory = lazy(() => import('./pages/Inventory').then(m => ({ default: m.Inventory })))
const Customers = lazy(() => import('./pages/Customers').then(m => ({ default: m.Customers })))
const Suppliers = lazy(() => import('./pages/Suppliers').then(m => ({ default: m.Suppliers })))
const CashRegisterPage = lazy(() => import('./pages/CashRegisterPage').then(m => ({ default: m.CashRegisterPage })))
const Employees = lazy(() => import('./pages/Employees').then(m => ({ default: m.Employees })))
const Reports = lazy(() => import('./pages/Reports').then(m => ({ default: m.Reports })))
const SettingsPage = lazy(() => import('./pages/SettingsPage').then(m => ({ default: m.SettingsPage })))
const NotFound = lazy(() => import('./pages/NotFound').then(m => ({ default: m.NotFound })))

function AppRoutes() {
  const { session } = useAuth()

  return (
    <Suspense fallback={<SplashScreen />}>
      <Routes>
        <Route 
          path="/login" 
          element={session ? <Navigate to="/" replace /> : <Login />} 
        />
        
        <Route path="/" element={
          <AuthGuard>
            <MainLayout />
          </AuthGuard>
        }>
          <Route index element={<Dashboard />} />
          <Route path="vant" element={<POS />} />
          <Route path="pwodwi" element={<Products />} />
          <Route path="envante" element={<Inventory />} />
          <Route path="kliyan" element={<Customers />} />
          <Route path="founise" element={<Suppliers />} />
          <Route path="kes" element={<CashRegisterPage />} />
          <Route path="anplwaye" element={<Employees />} />
          <Route path="rapo" element={<Reports />} />
          <Route path="paramet" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
