import { NavLink, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
import LeadsPage from "./pages/LeadsPage";
import MayveeLogo from "./components/MayveeLogo";

export default function App() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <NavLink to="/" className="brand">
          <MayveeLogo />
        </NavLink>

        <nav className="nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            Home
          </NavLink>

          <a href="/#properties">
            Properties
          </a>

          <a href="/#sell">
            Sell
          </a>

          <a href="/#build">
            Build
          </a>

          <a href="/#about">
            About
          </a>

          <NavLink
            to="/assistant"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            Property Assistant
          </NavLink>

          <NavLink
            to="/leads"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            Leads
          </NavLink>
        </nav>
      </header>

      <Routes>
        <Route
          path="/"
          element={<HomePage />}
        />

        <Route
          path="/assistant"
          element={<ChatPage />}
        />

        <Route
          path="/leads"
          element={<LeadsPage />}
        />
      </Routes>
    </div>
  );
}