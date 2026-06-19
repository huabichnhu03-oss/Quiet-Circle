import { Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Layout } from "@/components/Layout";

import { Home } from "@/pages/Home";
import CheckIn from "@/pages/CheckIn";
import Breathe from "@/pages/Breathe";
import Profile from "@/pages/Profile";
import Journals from "@/pages/Journals";
import NewJournalEntry from "@/pages/NewJournalEntry";
import Entries from "@/pages/Entries";
import Insights from "@/pages/Insights";
import Community from "@/pages/Community";
import CommunityPostDetail from "@/pages/CommunityPostDetail";
import NewPost from "@/pages/NewPost";
import Contacts from "@/pages/Contacts";
import AddContact from "@/pages/AddContact";
import Crisis from "@/pages/Crisis";
import Resources from "@/pages/Resources";
import Emergency from "@/pages/Emergency";
import AIChat from "@/pages/AIChat";
import Login from "@/pages/Login";
import Onboarding from "@/pages/Onboarding";
import AuthVerify from "@/pages/AuthVerify";

const STANDALONE_BG = "linear-gradient(145deg, #c8f5ea 0%, #dcd8f9 50%, #fde4d8 100%)";

function StandaloneWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] overflow-hidden flex items-start justify-center bg-gray-100">
      <div
        className="relative w-full max-w-[430px] h-[100dvh] flex flex-col overflow-y-auto overflow-x-hidden shadow-2xl"
        style={{ background: STANDALONE_BG }}
      >
        {children}
      </div>
    </div>
  );
}

function AuthGuard({ children }: { children: React.ReactNode }) {
  const [location, navigate] = useLocation();

  useEffect(() => {
    const onboarded = localStorage.getItem("onboarded");
    const isAuthRoute = location === "/login" || location === "/onboarding" || location.startsWith("/auth/");
    if (!onboarded && !isAuthRoute) {
      navigate("/login");
    }
  }, [location, navigate]);

  return <>{children}</>;
}

function Router() {
  return (
    <AuthGuard>
      <Switch>
        {/* Auth / onboarding — no Layout wrapper, full-screen */}
        <Route path="/login" component={Login} />
        <Route path="/onboarding" component={Onboarding} />
        <Route path="/auth/verify" component={AuthVerify} />

        {/* Standalone screens */}
        <Route path="/checkin" component={CheckIn} />
        <Route path="/breathe" component={() => (
          <StandaloneWrapper>
            <Breathe />
          </StandaloneWrapper>
        )} />
        <Route path="/journals/new" component={() => (
          <StandaloneWrapper>
            <NewJournalEntry />
          </StandaloneWrapper>
        )} />
        <Route path="/community/new" component={() => (
          <StandaloneWrapper>
            <NewPost />
          </StandaloneWrapper>
        )} />
        <Route path="/community/:id" component={CommunityPostDetail} />
        <Route path="/contacts/new" component={() => (
          <StandaloneWrapper>
            <AddContact />
          </StandaloneWrapper>
        )} />
        <Route path="/emergency" component={() => (
          <StandaloneWrapper>
            <Emergency />
          </StandaloneWrapper>
        )} />
        <Route path="/ai-chat" component={AIChat} />

        {/* Main app with bottom nav */}
        <Route>
          <Layout>
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/journals" component={Journals} />
              <Route path="/entries" component={Entries} />
              <Route path="/insights" component={Insights} />
              <Route path="/community" component={Community} />
              <Route path="/contacts" component={Contacts} />
              <Route path="/crisis" component={Crisis} />
              <Route path="/resources" component={Resources} />
              <Route path="/profile" component={Profile} />
              <Route component={NotFound} />
            </Switch>
          </Layout>
        </Route>
      </Switch>
    </AuthGuard>
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
