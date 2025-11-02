import { RouterProvider, createBrowserRouter } from "react-router-dom";
// using React Router v6.4+ and it's new data API (createBrowserRouter, loader, action) for defining complete structure of the app's routes

import EditEventPage from "./pages/EditEvent";
import ErrorPage from "./pages/Error";
import EventDetailPage, {
  loader as eventDetailLoader,
  action as deleteEventAction,
} from "./pages/EventDetail";
import EventsPage, { loader as eventsLoader } from "./pages/Events";
import EventsRootLayout from "./pages/EventsRoot";
import HomePage from "./pages/Home";
import NewEventPage from "./pages/NewEvent";
import RootLayout from "./pages/Root";
import { action as manipulateEventAction } from "./components/EventForm";
import NewsletterPage, { action as newsletterAction } from "./pages/Newsletter";
import AuthenticationPage, {
  action as authAction,
} from "./pages/Authentication";

const router = createBrowserRouter([
  // receives an array of objects which define different routes; a modern way of configuring routes (instead <Routes><Route/></Routes>).
  {
    path: "/",
    element: <RootLayout />, // shows Root.js component
    errorElement: <ErrorPage />, // shows Error.js component
    children: [
      { index: true, element: <HomePage /> }, // shows Home.js component
      // index: true - means that this route is showing on / (default child route).
      {
        path: "events",
        element: <EventsRootLayout />, // shows EventsRoot.js component
        // All routes starting with /events use <EventsRootLayout />
        children: [
          {
            index: true,
            element: <EventsPage />, // list of events, shows Events.js component
            loader: eventsLoader,
            // loader - function that feches events data before rendering the page, uses loader from Events.js
          },
          {
            path: ":eventId", //   /events/:eventId  - dinamic route for each event
            id: "event-detail",
            loader: eventDetailLoader,
            // loader - feches data for this event, uses loader from EventDetail.js
            children: [
              {
                index: true,
                element: <EventDetailPage />, // shows page of individual event, shows EventDetail.js
                action: deleteEventAction, // with possibility of deleting the event
              },
              {
                path: "edit",
                element: <EditEventPage />, // shows edit page for an event (EditEvent.js)
                action: manipulateEventAction, // with possibility of editing the event
              },
            ],
          },
          {
            path: "new",
            element: <NewEventPage />,
            // shows the form for adding a new event (NewEvent.js -> contains <EventForm>)
            action: manipulateEventAction, // backend mutation - saving new event
          },
        ],
      },
      {
        path: "auth",
        element: <AuthenticationPage />,
        // shows Authentication.js component - form for login is visible on http://localhost:3000/auth
        action: authAction,
      },
      {
        path: "newsletter",
        element: <NewsletterPage />, // form for applying for newsletter
        action: newsletterAction, // backend logic for saving email address
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
