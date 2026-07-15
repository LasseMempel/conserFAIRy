import { Routes, Route } from "react-router-dom"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AuthLayout } from "@/layouts/AuthLayout"
import { AppLayout } from "@/layouts/AppLayout"
import { AuthErrorPage } from "@/pages/auth-error"
import { AuthCallbackPage } from "@/pages/auth-callback"
import { DashboardPage } from "@/pages/DashboardPage"

export const iframeHeight = "800px"

export const description = "A sidebar with a header and a search form."

export function App() {
  return (
    <TooltipProvider>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="/auth/error" element={<AuthErrorPage />} />
        </Route>

        <Route element={<AppLayout />}>
          <Route path="/*" element={<DashboardPage />} />
        </Route>
      </Routes>
    </TooltipProvider>
  )
}

export default App