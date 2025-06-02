import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import SavedProperties from "./pages/SavedProperties";
import PrivateRoute from "./components/PrivateRoute";
import NotFound from "./pages/NotFound";
import Chatbot from "./components/bot/ChatBot";
import Logo from "./assets/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { openChat } from "./features/chat/chatSlice";
import { useEffect } from "react";
import Recommended from "./pages/Recommended";
import Filters from "./pages/Filters";
import Footer from "./components/sections/Footer";

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { isOpen } = useSelector((state) => state.chat);
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) dispatch(openChat());
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full flex flex-col relative">
      {/* chatbot  */}
      {!isOpen && (
        <div
          onClick={() => dispatch(openChat())}
          className="fixed bottom-8 right-8 z-[9999] bg-pink-200 p-2 shadow-md shadow-gray-500 rounded-full cursor-pointer"
        >
          <img
            src={Logo}
            alt="Logo"
            className="w-12 h-12 rounded-full object-cover"
          />
        </div>
      )}

      {/* Message Bubble with Arrow Behind */}
      {!isOpen && (
        <div
          onClick={() => dispatch(openChat())}
          className="fixed bottom-10 right-28 z-[9999] flex items-center gap-0.5 cursor-pointer"
        >
          <div className="relative animate-bounce bg-white py-2 px-3 shadow-md rounded-md text-sm font-medium text-gray-800">
            👋 Hi {isAuthenticated && user ? user.name : "there!"}
            {/* Diamond Arrow */}
            <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rotate-45 shadow-md z-[-1]"></div>
          </div>
        </div>
      )}

      {isOpen && (
        <div className="w-full h-screen fixed top-0 left-0 z-[9999] bg-[#00000063] animate-fadeIn">
          <Chatbot />
        </div>
      )}

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/filters" element={<Filters />} />
          <Route path="/recommended" element={<Recommended />} />
          <Route path="/saved-properties" element={<SavedProperties />} />
          {/* Private Routes  */}
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            }
          />
          {/* Not Found Page  */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer/>
    </div>
  );
}

export default App;
