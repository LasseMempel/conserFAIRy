import { Routes, Route } from "react-router-dom"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { DataCard } from "@/components/data-card"
import { AuthErrorPage } from "@/pages/auth-error"
import { AuthCallbackPage } from "@/pages/auth-callback"

export const iframeHeight = "800px"

export const description = "A sidebar with a header and a search form."

export function App() {
  const cardData = [
    {
      title: "Card 1",
      description: "First card content",
      content: <p>Card content goes here.</p>,
    },
    {
      title: "Card 2",
      description: "Second card content",
      content: <p>Card content goes here.</p>,
    },
    {
      title: "Card 3",
      description: "Third card content",
      content: <p>Card content goes here.</p>,
    },
  ]

  const mainCardData = {
    title: "Main Content",
    description: "Primary content area",
    content: <p>Main content goes here.</p>,
    className: "md:min-h-min",
  }

  return (
    <TooltipProvider>
      <Routes>
        {/* Auth callback page - handles successful OAuth redirect */}
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        {/* Auth error page - full screen, no sidebar */}
        <Route path="/auth/error" element={<AuthErrorPage />} />
        
        {/* Main app layout with sidebar */}
        <Route path="/*" element={
          <div className="[--header-height:calc(--spacing(14))]">
            <SidebarProvider className="flex flex-col">
              <SiteHeader />
              <div className="flex flex-1">
                <AppSidebar />
                <SidebarInset>
                  <div className="flex flex-1 flex-col gap-4 p-4">
                    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                      {cardData.map((card, index) => (
                        <DataCard
                          key={index}
                          title={card.title}
                          description={card.description}
                          content={card.content}
                        />
                      ))}
                    </div>
                    <DataCard
                      title={mainCardData.title}
                      description={mainCardData.description}
                      content={mainCardData.content}
                      className={mainCardData.className}
                    />
                  </div>
                </SidebarInset>
              </div>
            </SidebarProvider>
          </div>
        } />
      </Routes>
    </TooltipProvider>
  )
}

export default App
