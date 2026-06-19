import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

// Reutilizamos el componente SVG del logo para mantener la consistencia
const SynapLogo = () => (
  <svg
    className="w-12 h-12 mx-auto mb-2"
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M65 35 C 65 15, 35 15, 35 35 C 35 55, 65 45, 65 65 C 65 85, 35 85, 35 65"
      stroke="#00B4D8"
      strokeWidth="8"
      strokeLinecap="round"
    />
    <path
      d="M20 50 A 30 30 0 0 1 50 20"
      stroke="#0077B6"
      strokeWidth="6"
      strokeLinecap="round"
    />
    <path
      d="M80 50 A 30 30 0 0 1 50 80"
      stroke="#00B4D8"
      strokeWidth="6"
      strokeLinecap="round"
    />
    <circle cx="20" cy="50" r="6" fill="#0077B6" />
    <circle cx="80" cy="50" r="6" fill="#00B4D8" />
    <circle cx="35" cy="35" r="6" fill="#00B4D8" />
    <circle cx="65" cy="65" r="6" fill="#0077B6" />
  </svg>
);

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  // Estados del formulario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("collaborator");

  const [message, setMessage] = useState("");

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (isLogin) {
        // --- LÓGICA DE INICIO DE SESIÓN ---
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;

        // Redirección inteligente
        if (data.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", data.user.id)
            .single();

          if (profile?.role === "leader") {
            window.location.href = "/dashboard";
          } else {
            window.location.href = "/chat";
          }
        }
      } else {
        // --- LÓGICA DE REGISTRO ---
        if (!fullName.trim())
          throw new Error(
            "El nombre completo es obligatorio para registrarse.",
          );

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;

        if (data.user) {
          const { error: profileError } = await supabase
            .from("profiles")
            .upsert([
              {
                id: data.user.id,
                full_name: fullName,
                role: role,
              },
            ]);

          if (profileError) throw profileError;
        }

        setMessage("¡Registro exitoso! Ya puedes iniciar sesión.");
        setIsLogin(true);
      }
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#061121] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Efecto de luz de fondo sutil */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-md w-full bg-[#0b1b36] border border-cyan-900/50 rounded-2xl shadow-[0_0_40px_rgba(0,180,216,0.1)] p-8 relative z-10">
        <div className="text-center mb-8">
          <SynapLogo />
          <h1 className="text-3xl font-black text-white tracking-tight mt-2">
            SYNAP <span className="text-cyan-400">360</span>
          </h1>
          <p className="text-cyan-400/70 mt-2 text-sm">
            {isLogin
              ? "Inicia sesión en tu entorno de trabajo"
              : "Crea tu cuenta en la plataforma"}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-5">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Nombre Completo
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required={!isLogin}
                className="w-full px-4 py-3 bg-[#061121] border border-cyan-900/50 rounded-xl text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition placeholder-gray-600"
                placeholder="Ej. Mateo Zapata"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Correo Electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-[#061121] border border-cyan-900/50 rounded-xl text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition placeholder-gray-600"
              placeholder="correo@empresa.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-[#061121] border border-cyan-900/50 rounded-xl text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition placeholder-gray-600"
              placeholder="••••••••"
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Rol en el sistema
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 bg-[#061121] border border-cyan-900/50 rounded-xl text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
              >
                <option value="collaborator">Colaborador (Estudiante)</option>
                <option value="leader">Líder de Área (Administrador)</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-[#061121] font-black py-3 px-4 rounded-xl transition shadow-[0_0_15px_rgba(0,180,216,0.3)] disabled:opacity-50 mt-6"
          >
            {loading ? "Procesando..." : isLogin ? "Ingresar" : "Registrarse"}
          </button>
        </form>

        {message && (
          <div
            className={`mt-6 p-4 rounded-xl text-sm text-center font-medium border ${
              message.includes("❌")
                ? "bg-red-900/20 border-red-500/50 text-red-400"
                : "bg-cyan-900/20 border-cyan-500/50 text-cyan-300"
            }`}
          >
            {message}
          </div>
        )}

        <div className="mt-8 text-center border-t border-cyan-900/30 pt-6">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage("");
            }}
            className="text-sm text-gray-400 hover:text-cyan-400 transition"
          >
            {isLogin
              ? "¿No tienes cuenta? Regístrate aquí"
              : "¿Ya tienes cuenta? Inicia sesión"}
          </button>
        </div>
      </div>
    </div>
  );
}
