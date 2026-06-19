import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import Landing from "./components/Landing";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import Chat from "./components/Chat";

// Componente envoltorio para poder usar la navegación de react-router
function LandingWrapper() {
  const navigate = useNavigate();
  return <Landing onLoginClick={() => navigate("/auth")} />;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* 🚀 La Landing Page ahora es la fachada principal */}
        <Route path="/" element={<LandingWrapper />} />

        {/* 🚀 El Login/Registro se movió a su propia ruta */}
        <Route path="/auth" element={<Auth />} />

        {/* Rutas de trabajo (protegidas por tu Auth actual) */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chat" element={<Chat />} />

        {/* Fallback: Cualquier ruta rara redirige a la Landing */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
