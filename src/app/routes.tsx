import { createBrowserRouter } from "react-router";
import HomePage from "./pages/HomePage";
import SportSelectionPage from "./pages/SportSelectionPage";
import BookingPage from "./pages/BookingPage";
import LobbyPage from "./pages/LobbyPage";
import ProfilePage from "./pages/ProfilePage";
import NotificationsPage from "./pages/NotificationsPage";
import SearchLocationPage from "./pages/SearchLocationPage";
import CreateUrgentEventPage from "./pages/CreateUrgentEventPage";
import Root from "./Root";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: HomePage },
      { path: "sport/:sportId", Component: SportSelectionPage },
      { path: "booking", Component: BookingPage },
      { path: "lobby/:lobbyId", Component: LobbyPage },
      { path: "profile", Component: ProfilePage },
      { path: "notifications", Component: NotificationsPage },
      { path: "search-location", Component: SearchLocationPage },
      { path: "create-urgent", Component: CreateUrgentEventPage },
    ],
  },
]);
