import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Services from "@/pages/services";
import SoftwareCatalog from "@/pages/software-catalog";
import PrototypeBuilder from "@/pages/prototype-builder";
import Dashboard from "@/pages/dashboard";
import Admin from "@/pages/admin";
import Contact from "@/pages/contact";
import NotFound from "@/pages/not-found";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import LoadingSpinner from "@/components/ui/loading-spinner";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <Switch>
          {!isAuthenticated ? (
            <>
              <Route path="/" component={Landing} />
              <Route path="/services" component={Services} />
              <Route path="/logiciels" component={SoftwareCatalog} />
              <Route path="/contact" component={Contact} />
            </>
          ) : (
            <>
              <Route path="/" component={Home} />
              <Route path="/services" component={Services} />
              <Route path="/logiciels" component={SoftwareCatalog} />
              <Route path="/prototype" component={PrototypeBuilder} />
              <Route path="/tableau-de-bord" component={Dashboard} />
              <Route path="/admin" component={Admin} />
              <Route path="/contact" component={Contact} />
            </>
          )}
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
