import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import { Home } from "./pages/Home";
import { Writings } from "./pages/Writings";
import { Books } from "./pages/Books";
import { Suggestions } from "./pages/Suggestions";
import { Polls } from "./pages/Polls";
import { Interviews } from "./pages/Interviews";
import { Login } from "./pages/Login";
import { Profile } from "./pages/Profile";
import { useStore } from "./store/useStore";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, isSessionLoading } = useStore();

  if (isSessionLoading) {
    return (
      <div className="max-w-md mx-auto mt-16 bg-white p-8 rounded-2xl shadow border border-pink-100 text-center text-gray-600">
        Oturum kontrol ediliyor...
      </div>
    );
  }

  if (!isAdmin) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

function App() {
  const {
    initializeSession,
    fetchWritings,
    fetchBooks,
    fetchSuggestions,
    fetchPolls,
    fetchInterviews,
    fetchAnnouncements,
  } = useStore();

  useEffect(() => {
    const bootstrap = async () => {
      await initializeSession();
      await Promise.all([
        fetchWritings(),
        fetchBooks(),
        fetchSuggestions(),
        fetchPolls(),
        fetchInterviews(),
        fetchAnnouncements(),
      ]);
    };

    void bootstrap();
  }, [
    initializeSession,
    fetchWritings,
    fetchBooks,
    fetchSuggestions,
    fetchPolls,
    fetchInterviews,
    fetchAnnouncements,
  ]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="writings" element={<Writings />} />
          <Route path="books" element={<Books />} />
          <Route path="suggestions" element={<Suggestions />} />
          <Route path="polls" element={<Polls />} />
          <Route path="interviews" element={<Interviews />} />
          <Route path="login" element={<Login />} />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
