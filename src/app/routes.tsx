import { createBrowserRouter } from "react-router";
import HomePage from "./pages/HomePage";
import SportSelectionPage from "./pages/SportSelectionPage";
import BookingPage from "./pages/BookingPage";
import AtividadePage from "./pages/AtividadePage";
import ProfilePage from "./pages/ProfilePage";
import NotificationsPage from "./pages/NotificationsPage";
import SearchLocationPage from "./pages/SearchLocationPage";
import CreateUrgentEventPage from "./pages/CreateUrgentEventPage";
import AchievementsPage from "./pages/AchievementsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MapPage from "./pages/MapPage";
import BookingsPage from "./pages/BookingsPage";
import ActivityHistoryPage from "./pages/ActivityHistoryPage";
import WelcomePage from "./pages/WelcomePage";
import LandingPage from "./pages/LandingPage";
import Root from "./Root";

export const router = createBrowserRouter([
  { path: "/landing", Component: LandingPage },
  { path: "/welcome", Component: WelcomePage },
  { path: "/login", Component: LoginPage },
  { path: "/register", Component: RegisterPage },
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: HomePage },
      { path: "sport/:sportId", Component: SportSelectionPage },
      { path: "booking", Component: BookingPage },
      { path: "atividade/:atividadeId", Component: AtividadePage },
      { path: "atividade", Component: AtividadePage },
      { path: "profile", Component: ProfilePage },
      { path: "notifications", Component: NotificationsPage },
      { path: "search-location", Component: SearchLocationPage },
      { path: "create-urgent", Component: CreateUrgentEventPage },
      { path: "achievements", Component: AchievementsPage },
      { path: "bookings", Component: BookingsPage },
      { path: "history", Component: ActivityHistoryPage },
      { path: "map", Component: MapPage },
    ],
  },
]);
