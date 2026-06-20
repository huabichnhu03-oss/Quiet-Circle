import { Switch, Route, useLocation, Redirect } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthTokenBridge } from "@/components/AuthTokenBridge";
import { useUser } from "@clerk/react";
import { isOnboarded, markOnboarded } from "@/lib/auth-fetch";
import { useClerkReady } from "@/hooks/use-clerk-ready";
import { ThemeProvider } from "@/hooks/use-theme";
import NotFound from "@/pages/not-found";
import { PhoneShell } from "@/components/PhoneShell";
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
import SignalActive from "@/pages/SignalActive";
import CompanionAlert from "@/pages/CompanionAlert";
import AIChat from "@/pages/AIChat";
import Login from "@/pages/Login";
import SignUpPage from "@/pages/SignUp";
import Onboarding from "@/pages/Onboarding";
import Notifications from "@/pages/Notifications";


function StandaloneWrapper({
  children,
  scrollable = true,
}: {
  children: React.ReactNode;
  scrollable?: boolean;
}) {
  return <PhoneShell scrollable={scrollable}>{children}</PhoneShell>;
}

function isPublicAuthRoute(location: string) {
  return (
    location === "/login" ||
    location === "/sign-up" ||
    location.startsWith("/login/") ||
    location.startsWith("/sign-up/") ||
    location === "/onboarding"
  );
}

function AuthGuard({ children }: { children: React.ReactNode }) {
  const [location, navigate] = useLocation();
  const { authReady, isLoaded, isSignedIn, userId } = useClerkReady();
  const { user } = useUser();
  const onPublicRoute = isPublicAuthRoute(location);
  const isAdmin = user?.publicMetadata?.role === "admin";
  const hasAccess = isAdmin || isOnboarded(userId);

  const isGuest = !isLoaded || !isSignedIn;

  useEffect(() => {
    if (isAdmin && userId) {
      markOnboarded(userId);
    }
  }, [isAdmin, userId]);

  useEffect(() => {
    if (!onPublicRoute && isGuest) {
      navigate("/login");
      return;
    }

    if (!authReady) return;

    if (isSignedIn && onPublicRoute && location !== "/onboarding") {
      navigate(hasAccess ? "/" : "/onboarding");
      return;
    }

    if (isSignedIn && !hasAccess && !onPublicRoute) {
      navigate("/onboarding");
    }
  }, [authReady, isSignedIn, isGuest, userId, location, navigate, onPublicRoute, hasAccess]);

  if (!isLoaded && !onPublicRoute) {
    return null;
  }

  if (isGuest && !onPublicRoute) {
    return <Redirect to="/login" />;
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
        <Route path="/journals/:id/edit" component={() => (
          <StandaloneWrapper>
            <NewJournalEntry />
          </StandaloneWrapper>
        )} />
        <Route path="/community/new" component={() => (
          <StandaloneWrapper>
            <NewPost />
          </StandaloneWrapper>
        )} />
        <Route path="/community/:id/edit" component={() => (
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
        <Route path="/contacts/:id/edit" component={() => (
          <StandaloneWrapper>
            <AddContact />
          </StandaloneWrapper>
        )} />
        <Route path="/emergency/active/:contactId" component={() => (
          <StandaloneWrapper scrollable={false}>
            <SignalActive />
          </StandaloneWrapper>
        )} />
        <Route path="/companion/alert/:contactId" component={() => (
          <StandaloneWrapper scrollable={false}>
            <CompanionAlert />
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
              <Route path="/notifications" component={Notifications} />
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
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthTokenBridge />
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
