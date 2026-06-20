import { Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
import { useAuth } from "@clerk/react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthTokenBridge } from "@/components/AuthTokenBridge";
import { isOnboarded } from "@/lib/auth-fetch";
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
import SignUpPage from "@/pages/SignUp";
import Onboarding from "@/pages/Onboarding";

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
  const { isLoaded, isSignedIn, userId } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;

    const isAuthRoute =
      location === "/login" ||
      location === "/sign-up" ||
      location.startsWith("/login/") ||
      location.startsWith("/sign-up/") ||
      location === "/onboarding";

    if (!isSignedIn && !isAuthRoute) {
      navigate("/login");
      return;
    }

    if (isSignedIn && isAuthRoute && location !== "/onboarding") {
      navigate(isOnboarded(userId) ? "/" : "/onboarding");
      return;
    }

    if (isSignedIn && !isOnboarded(userId) && !isAuthRoute) {
      navigate("/onboarding");
    }
  }, [isLoaded, isSignedIn, userId, location, navigate]);

  if (!isLoaded) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center text-slate-500">
        Loading…
      </div>
    );
  }

  return <>{children}</>;
}

function Router() {
  return (
    <AuthGuard>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/login/*" component={Login} />
        <Route path="/sign-up" component={SignUpPage} />
        <Route path="/sign-up/*" component={SignUpPage} />
        <Route path="/onboarding" component={Onboarding} />

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
        <AuthTokenBridge />
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
