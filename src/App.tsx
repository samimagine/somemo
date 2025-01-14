import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  NavLink,
} from "react-router-dom";

import Home from "./pages/Home/Home";
import User from "./pages/User/User";
import Memo from "./pages/Memo/Memo";
import Some from "./pages/Some/Some";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuthStore } from "./store/authStore";

const App: React.FC = () => {
  const username = useAuthStore((state) => state.username);
  const logout = useAuthStore((state) => state.logout);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <div className="flex flex-row h-screen">
                <aside className="w-64 bg-gray-800 text-white">
                  <div className="p-4 text-lg font-bold border-b border-gray-700">
                    Somemo
                    {username && (
                      <p className="text-sm font-medium mt-2">
                        Welcome, {username}
                      </p>
                    )}
                  </div>
                  <nav>
                    <ul className="space-y-2 p-4">
                      <li>
                        <NavLink
                          to="/"
                          className={({ isActive }) =>
                            `block py-2 px-3 rounded ${
                              isActive ? "bg-gray-700" : "hover:bg-gray-700"
                            }`
                          }
                        >
                          Home
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/profile"
                          className={({ isActive }) =>
                            `block py-2 px-3 rounded ${
                              isActive ? "bg-gray-700" : "hover:bg-gray-700"
                            }`
                          }
                        >
                          User Profile
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/memo"
                          className={({ isActive }) =>
                            `block py-2 px-3 rounded ${
                              isActive ? "bg-gray-700" : "hover:bg-gray-700"
                            }`
                          }
                        >
                          Memo
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/some"
                          className={({ isActive }) =>
                            `block py-2 px-3 rounded ${
                              isActive ? "bg-gray-700" : "hover:bg-gray-700"
                            }`
                          }
                        >
                          Some
                        </NavLink>
                      </li>
                    </ul>
                  </nav>

                  <div className="p-4 border-t border-gray-700">
                    <button
                      onClick={logout}
                      className="w-full bg-red-500 text-white py-2 px-3 rounded hover:bg-red-600"
                    >
                      Logout
                    </button>
                  </div>
                </aside>
                <main className="flex-1 bg-gray-100 p-8">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/profile" element={<User />} />
                    <Route path="/memo" element={<Memo />} />
                    <Route path="/some" element={<Some />} />
                  </Routes>
                </main>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
