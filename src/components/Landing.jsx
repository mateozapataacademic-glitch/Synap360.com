import { useState } from "react";

// Componente SVG que recrea el logo de Synap 360 con los nodos y circuitos
const SynapLogo = () => (
  <svg
    className="w-10 h-10 mr-3 shrink-0"
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

export default function Landing({ onLoginClick }) {
  // 🚀 ESTADO DEL TEMA: true = Oscuro (por defecto), false = Claro
  const [isDarkMode, setIsDarkMode] = useState(true);

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-500 ${isDarkMode ? "bg-[#061121] text-white selection:bg-cyan-500" : "bg-slate-50 text-gray-900 selection:bg-blue-500"}`}
    >
      {/* Navegación Superior */}
      <nav
        className={`fixed w-full z-50 backdrop-blur-md border-b px-6 py-4 flex justify-between items-center transition-colors duration-500 ${isDarkMode ? "bg-[#061121]/90 border-cyan-900/30" : "bg-white/90 border-gray-200 shadow-sm"}`}
      >
        <div className="flex items-center">
          <SynapLogo />
          <span
            className={`text-2xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-gray-900"}`}
          >
            SYNAP{" "}
            <span className={isDarkMode ? "text-cyan-400" : "text-blue-600"}>
              360
            </span>
          </span>
        </div>

        {/* Enlaces de Pestañas */}
        <div
          className={`hidden md:flex space-x-8 text-sm font-bold transition-colors ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
        >
          <a
            href="#inicio"
            className={`transition ${isDarkMode ? "hover:text-cyan-400" : "hover:text-blue-600"}`}
          >
            Inicio
          </a>
          <a
            href="#como-funciona"
            className={`transition ${isDarkMode ? "hover:text-cyan-400" : "hover:text-blue-600"}`}
          >
            Cómo Funciona
          </a>
          <a
            href="#nosotros"
            className={`transition ${isDarkMode ? "hover:text-cyan-400" : "hover:text-blue-600"}`}
          >
            Nosotros
          </a>
          <a
            href="#planes"
            className={`transition ${isDarkMode ? "hover:text-cyan-400" : "hover:text-blue-600"}`}
          >
            Planes
          </a>
        </div>

        {/* Controles (Toggle + Login) */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-full transition ${isDarkMode ? "text-cyan-400 bg-cyan-900/30 hover:bg-cyan-900/60" : "text-gray-500 bg-gray-100 hover:bg-gray-200"}`}
            title="Cambiar Tema"
          >
            {isDarkMode ? (
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>

          <button
            onClick={onLoginClick}
            className={`px-6 py-2.5 rounded-full font-bold transition shadow-md ${isDarkMode ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-[0_0_15px_rgba(0,180,216,0.4)]" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
          >
            Iniciar Sesión
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="inicio"
        className="pt-32 pb-20 px-6 text-center relative overflow-hidden"
      >
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none transition-colors duration-500 ${isDarkMode ? "bg-cyan-600/20" : "bg-blue-400/20"}`}
        ></div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div
            className={`inline-block border text-xs font-bold px-4 py-1.5 rounded-full mb-6 transition-colors ${isDarkMode ? "bg-cyan-900/40 border-cyan-500/30 text-cyan-300" : "bg-blue-100 border-blue-200 text-blue-700"}`}
          >
             EL FUTURO DEL ONBOARDING CORPORATIVO
          </div>
          <h1
            className={`text-5xl md:text-7xl font-black mb-6 leading-tight ${isDarkMode ? "text-white" : "text-gray-900"}`}
          >
            Gestión del conocimiento con{" "}
            <span
              className={`text-transparent bg-clip-text bg-gradient-to-r ${isDarkMode ? "from-cyan-400 to-blue-500" : "from-blue-600 to-cyan-500"}`}
            >
              Inteligencia Artificial
            </span>
          </h1>
          <p
            className={`text-xl mb-10 max-w-2xl mx-auto leading-relaxed ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            Transforma tus manuales estáticos en tutores RAG interactivos.
            Acelera el aprendizaje, evalúa en tiempo real y obtén métricas
            exactas de listura operativa.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={onLoginClick}
              className={`px-8 py-4 rounded-xl text-lg font-black transition ${isDarkMode ? "bg-cyan-500 hover:bg-cyan-400 text-[#061121] shadow-[0_0_20px_rgba(0,180,216,0.3)]" : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg"}`}
            >
              Comenzar Prueba
            </button>
            <a
              href="#como-funciona"
              className={`px-8 py-4 rounded-xl text-lg font-bold transition border ${isDarkMode ? "bg-[#0b1b36] border-cyan-800 hover:border-cyan-500 text-white" : "bg-white border-gray-300 hover:border-blue-400 text-gray-700 shadow-sm"}`}
            >
              Descubrir Más
            </a>
          </div>
        </div>
      </section>

      {/* Cómo Funciona */}
      <section id="como-funciona" className="py-24 px-6 max-w-6xl mx-auto">
        <h2
          className={`text-3xl font-bold text-center mb-16 ${isDarkMode ? "text-white" : "text-gray-900"}`}
        >
          Arquitectura robusta en{" "}
          <span className={isDarkMode ? "text-cyan-400" : "text-blue-600"}>
            3 simples pasos
          </span>
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div
            className={`p-8 rounded-2xl border transition group ${isDarkMode ? "bg-[#0b1b36] border-cyan-900/50 hover:border-cyan-500/50" : "bg-white border-gray-100 hover:border-blue-300 shadow-xl"}`}
          >
            <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">
              📄
            </div>
            <h3
              className={`text-xl font-bold mb-3 ${isDarkMode ? "text-white" : "text-gray-900"}`}
            >
              1. Ingesta Vectorial
            </h3>
            <p
              className={`text-sm leading-relaxed ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
            >
              Carga tus PDFs técnicos. Nuestro sistema extrae, fragmenta y
              almacena el conocimiento en bases de datos vectoriales seguras.
            </p>
          </div>
          <div
            className={`p-8 rounded-2xl border transition group ${isDarkMode ? "bg-[#0b1b36] border-cyan-900/50 hover:border-cyan-500/50" : "bg-white border-gray-100 hover:border-blue-300 shadow-xl"}`}
          >
            <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">
              🤖
            </div>
            <h3
              className={`text-xl font-bold mb-3 ${isDarkMode ? "text-white" : "text-gray-900"}`}
            >
              2. Tutoría Contextual
            </h3>
            <p
              className={`text-sm leading-relaxed ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
            >
              El colaborador resuelve dudas con un chat IA que no alucina;
              responde estrictamente basado en la documentación de tu empresa.
            </p>
          </div>
          <div
            className={`p-8 rounded-2xl border transition group ${isDarkMode ? "bg-[#0b1b36] border-cyan-900/50 hover:border-cyan-500/50" : "bg-white border-gray-100 hover:border-blue-300 shadow-xl"}`}
          >
            <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">
              📊
            </div>
            <h3
              className={`text-xl font-bold mb-3 ${isDarkMode ? "text-white" : "text-gray-900"}`}
            >
              3. CRM Operativo
            </h3>
            <p
              className={`text-sm leading-relaxed ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
            >
              Genera evaluaciones automáticas y visualiza el progreso exacto de
              tu equipo mediante dashboards de listura gerencial.
            </p>
          </div>
        </div>
      </section>

      {/* Sección Nosotros */}
      <section
        id="nosotros"
        className={`py-24 border-y transition-colors duration-500 ${isDarkMode ? "bg-gradient-to-b from-[#061121] to-[#0b1b36] border-cyan-900/30" : "bg-gradient-to-b from-blue-50 to-white border-blue-100"}`}
      >
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2
            className={`text-3xl font-bold mb-6 ${isDarkMode ? "text-white" : "text-gray-900"}`}
          >
            Nuestra{" "}
            <span className={isDarkMode ? "text-cyan-400" : "text-blue-600"}>
              Misión
            </span>
          </h2>
          <p
            className={`text-lg leading-relaxed max-w-3xl mx-auto ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
          >
            Synap 360 nace de la necesidad de modernizar el entrenamiento
            corporativo. Creemos que la información vital de una empresa no debe
            ser un obstáculo, sino un motor. Nuestro equipo combina análisis de
            calidad (QA) y desarrollo de software avanzado para entregar una
            herramienta B2B que garantiza precisión, seguridad de datos y una
            experiencia de usuario impecable.
          </p>
        </div>
      </section>

      {/* Planes de Precios */}
      <section id="planes" className="py-24 px-6 max-w-6xl mx-auto">
        <h2
          className={`text-3xl font-bold text-center mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}
        >
          Licenciamiento{" "}
          <span className={isDarkMode ? "text-cyan-400" : "text-blue-600"}>
            Escalable
          </span>
        </h2>
        <p
          className={`text-center mb-16 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
        >
          Paga solo por el volumen de operación que tu empresa necesita.
          (Valores en COP)
        </p>

        <div className="grid md:grid-cols-3 gap-8 items-center">
          {/* Starter */}
          <div
            className={`p-8 rounded-2xl border transition ${isDarkMode ? "bg-[#0b1b36] border-cyan-900/50" : "bg-white border-gray-200 shadow-lg"}`}
          >
            <h3
              className={`text-xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}
            >
              Starter
            </h3>
            <p
              className={`mb-6 text-sm ${isDarkMode ? "text-cyan-400/70" : "text-gray-500"}`}
            >
              Para equipos emergentes
            </p>
            <div
              className={`text-4xl font-black mb-6 ${isDarkMode ? "text-white" : "text-gray-900"}`}
            >
              $79.900
              <span className="text-lg font-normal text-gray-500">/mes</span>
            </div>
            <ul
              className={`space-y-4 mb-8 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
            >
              <li className="flex items-center gap-2">
                <span
                  className={isDarkMode ? "text-cyan-500" : "text-blue-500"}
                >
                  ✓
                </span>{" "}
                Hasta 50 colaboradores
              </li>
              <li className="flex items-center gap-2">
                <span
                  className={isDarkMode ? "text-cyan-500" : "text-blue-500"}
                >
                  ✓
                </span>{" "}
                5 Manuales Operativos
              </li>
              <li className="flex items-center gap-2">
                <span
                  className={isDarkMode ? "text-cyan-500" : "text-blue-500"}
                >
                  ✓
                </span>{" "}
                Evaluaciones básicas
              </li>
            </ul>
            <button
              onClick={onLoginClick}
              className={`w-full py-3 rounded-xl font-bold transition border ${isDarkMode ? "bg-cyan-900/50 hover:bg-cyan-800 border-cyan-700 text-white" : "bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700"}`}
            >
              Elegir Starter
            </button>
          </div>

          {/* Pro */}
          <div
            className={`p-8 rounded-2xl border transform md:-translate-y-4 relative transition ${isDarkMode ? "bg-gradient-to-b from-cyan-900 to-[#0b1b36] border-cyan-500 shadow-[0_0_30px_rgba(0,180,216,0.2)]" : "bg-gradient-to-b from-blue-600 to-blue-800 border-blue-400 shadow-2xl"}`}
          >
            <div
              className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-black px-4 py-1 rounded-full ${isDarkMode ? "bg-cyan-500 text-[#061121]" : "bg-cyan-300 text-blue-900"}`}
            >
              MÁS POPULAR
            </div>
            <h3 className="text-xl font-bold text-white mb-2 mt-2">Pro</h3>
            <p
              className={`mb-6 text-sm ${isDarkMode ? "text-cyan-300" : "text-blue-200"}`}
            >
              El CRM completo de listura
            </p>
            <div className="text-4xl font-black text-white mb-6">
              $149.900
              <span
                className={`text-lg font-normal ${isDarkMode ? "text-cyan-500" : "text-blue-300"}`}
              >
                /mes
              </span>
            </div>
            <ul
              className={`space-y-4 mb-8 text-sm ${isDarkMode ? "text-gray-100" : "text-white"}`}
            >
              <li className="flex items-center gap-2">
                <span className="text-cyan-400">✓</span> Hasta 200 colaboradores
              </li>
              <li className="flex items-center gap-2">
                <span className="text-cyan-400">✓</span> Manuales Ilimitados
              </li>
              <li className="flex items-center gap-2">
                <span className="text-cyan-400">✓</span> Dashboard Analítico RAG
              </li>
              <li className="flex items-center gap-2">
                <span className="text-cyan-400">✓</span> Soporte prioritario
              </li>
            </ul>
            <button
              onClick={onLoginClick}
              className={`w-full py-3 rounded-xl font-black transition shadow-lg ${isDarkMode ? "bg-cyan-400 hover:bg-cyan-300 text-[#061121]" : "bg-white hover:bg-gray-50 text-blue-700"}`}
            >
              Elegir Pro
            </button>
          </div>

          {/* Enterprise */}
          <div
            className={`p-8 rounded-2xl border transition ${isDarkMode ? "bg-[#0b1b36] border-cyan-900/50" : "bg-white border-gray-200 shadow-lg"}`}
          >
            <h3
              className={`text-xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}
            >
              Enterprise
            </h3>
            <p
              className={`mb-6 text-sm ${isDarkMode ? "text-cyan-400/70" : "text-gray-500"}`}
            >
              Seguridad y control total
            </p>
            <div
              className={`text-4xl font-black mb-6 ${isDarkMode ? "text-white" : "text-gray-900"}`}
            >
              A medida
            </div>
            <ul
              className={`space-y-4 mb-8 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
            >
              <li className="flex items-center gap-2">
                <span
                  className={isDarkMode ? "text-cyan-500" : "text-blue-500"}
                >
                  ✓
                </span>{" "}
                Colaboradores Ilimitados
              </li>
              <li className="flex items-center gap-2">
                <span
                  className={isDarkMode ? "text-cyan-500" : "text-blue-500"}
                >
                  ✓
                </span>{" "}
                Instancia DB dedicada
              </li>
              <li className="flex items-center gap-2">
                <span
                  className={isDarkMode ? "text-cyan-500" : "text-blue-500"}
                >
                  ✓
                </span>{" "}
                SSO y Roles Avanzados
              </li>
            </ul>
            <button
              onClick={onLoginClick}
              className={`w-full py-3 rounded-xl font-bold transition border ${isDarkMode ? "bg-transparent hover:bg-white/5 border-gray-600 text-white" : "bg-white hover:bg-gray-50 border-gray-300 text-gray-700"}`}
            >
              Contactar Ventas
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className={`py-12 text-center text-sm transition-colors duration-500 border-t ${isDarkMode ? "bg-[#030812] border-cyan-900/30 text-gray-500" : "bg-slate-100 border-gray-200 text-gray-500"}`}
      >
        <div className="flex justify-center items-center gap-2 mb-4">
          <SynapLogo />
        </div>
        <p>© 2026 Synap 360. Plataforma de evaluación impulsada por IA.</p>
        <div className="mt-4 space-x-6">
          <a
            href="#"
            className={`transition ${isDarkMode ? "hover:text-cyan-400" : "hover:text-blue-600"}`}
          >
            Términos de Servicio
          </a>
          <a
            href="#"
            className={`transition ${isDarkMode ? "hover:text-cyan-400" : "hover:text-blue-600"}`}
          >
            Políticas de Privacidad
          </a>
          <a
            href="#"
            className={`transition ${isDarkMode ? "hover:text-cyan-400" : "hover:text-blue-600"}`}
          >
            Contacto
          </a>
        </div>
      </footer>
    </div>
  );
}
