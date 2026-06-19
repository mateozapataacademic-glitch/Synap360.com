import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";

// --- ÍCONOS SVG REUTILIZABLES ---
const Icons = {
  Logo: () => (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      className="w-8 h-8 text-cyan-400"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M65 35 C 65 15, 35 15, 35 35 C 35 55, 65 45, 65 65 C 65 85, 35 85, 35 65"
        stroke="currentColor"
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
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <circle cx="20" cy="50" r="6" fill="#0077B6" />
      <circle cx="80" cy="50" r="6" fill="currentColor" />
    </svg>
  ),
  Upload: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
      ></path>
    </svg>
  ),
  CRM: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      ></path>
    </svg>
  ),
  Logout: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
      ></path>
    </svg>
  ),
  User: () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
        clipRule="evenodd"
      ></path>
    </svg>
  ),
  PDF: () => (
    <svg
      className="w-16 h-16 text-red-500"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-1.149 17.069c-.439-.234-.849-.54-1.218-.91-.849-.849-1.266-1.956-1.266-3.159 0-1.203.417-2.31 1.266-3.159.369-.369.779-.675 1.218-.91.543-.291 1.14-.441 1.749-.441 1.62 0 3.036.96 3.666 2.406.186.423.282.888.282 1.365 0 1.203-.417 2.31-1.266 3.159-.369.369-.779.675-1.218.91-.543.291-1.14.441-1.749.441-.609 0-1.206-.15-1.749-.441v.001l.019-.001zm1.749-6.381c-.579 0-1.077.219-1.488.63-.411.411-.63.909-.63 1.488 0 .579.219 1.077.63 1.488.411.411.909.63 1.488.63.579 0 1.077-.219 1.488-.63.411-.411.63-.909.63-1.488 0-.579-.219-1.077-.63-1.488-.411-.411-.909-.63-1.488-.63z" />
    </svg>
  ),
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("conocimiento");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [collaborators, setCollaborators] = useState([]);
  const [loadingTeam, setLoadingTeam] = useState(true);

  const [allEvaluations, setAllEvaluations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  // Estados de Configuración y Perfil
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [userProfile, setUserProfile] = useState({
    full_name: "Cargando...",
    avatar_url: "",
  });
  const [editName, setEditName] = useState("");
  const [editAvatar, setEditAvatar] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  // Cargar perfil
  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        if (data) {
          setUserProfile(data);
          setEditName(data.full_name || "");
          setEditAvatar(data.avatar_url || "");
        }
      }
    };
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase
          .from("profiles")
          .update({ full_name: editName, avatar_url: editAvatar })
          .eq("id", user.id);
        if (error) throw error;
        setUserProfile({
          ...userProfile,
          full_name: editName,
          avatar_url: editAvatar,
        });
        setShowProfileModal(false);
        alert("¡Perfil actualizado con éxito!");
      }
    } catch (error) {
      alert("Error al actualizar: " + error.message);
    } finally {
      setSavingProfile(false);
    }
  };

  const fetchTeamProgress = useCallback(async () => {
    setLoadingTeam(true);
    try {
      const { data: users, error: usersError } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "collaborator");
      if (usersError) throw usersError;

      const { data: evals, error: evalsError } = await supabase
        .from("evaluations")
        .select("*")
        .order("created_at", { ascending: false });
      if (evalsError) throw evalsError;

      setAllEvaluations(evals);

      const teamData = users.map((user) => {
        const userEvals = evals.filter((e) => e.user_id === user.id);
        const average =
          userEvals.length > 0
            ? Math.round(
                userEvals.reduce((acc, curr) => acc + curr.score, 0) /
                  userEvals.length,
              )
            : 0;
        return { ...user, averageScore: average, testsTaken: userEvals.length };
      });
      setCollaborators(teamData);
    } catch (error) {
      console.error("Error al cargar el equipo:", error);
    } finally {
      setLoadingTeam(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "equipo") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchTeamProgress();
    }
  }, [activeTab, fetchTeamProgress]);

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setUploadMessage("");

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: docData, error: dbError } = await supabase
        .from("documents")
        .insert([
          {
            title: file.name,
            content: "Procesando con IA...",
            storage_path: filePath,
          },
        ])
        .select()
        .single();
      if (dbError) throw dbError;

      const { error: fnError } = await supabase.functions.invoke(
        "process-pdf",
        {
          body: {
            recordId: docData.id,
            storagePath: filePath,
            fileName: file.name,
          },
        },
      );
      if (fnError) throw fnError;

      setUploadMessage(
        "✅ Documento procesado y vectorizado correctamente por la IA.",
      );
      setFile(null);
    } catch (error) {
      setUploadMessage(`❌ Error: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Fecha desconocida";
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex h-screen overflow-hidden font-sans bg-[#061121]">
      {/* ================= BARRA LATERAL (SIDEBAR) ================= */}
      <aside className="w-64 bg-[#0b1b36] border-r border-cyan-900/50 flex flex-col justify-between hidden md:flex shrink-0 shadow-2xl z-20">
        <div>
          <div className="h-20 flex items-center px-6 border-b border-cyan-900/50 gap-3">
            <Icons.Logo />
            <span className="text-xl font-black text-white tracking-tight">
              SYNAP <span className="text-cyan-400">360</span>
            </span>
          </div>

          <nav className="p-4 space-y-2 mt-4">
            <p className="px-3 text-xs font-bold text-cyan-500/50 uppercase tracking-wider mb-2">
              Panel del Líder
            </p>
            <button
              onClick={() => setActiveTab("conocimiento")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === "conocimiento" ? "bg-gradient-to-r from-cyan-500/20 to-blue-600/10 text-cyan-400 border border-cyan-500/30" : "text-gray-400 hover:bg-cyan-900/30 hover:text-cyan-300"}`}
            >
              <Icons.Upload />
              <span
                className={`text-sm ${activeTab === "conocimiento" ? "font-bold" : "font-semibold"}`}
              >
                Base de Conocimiento
              </span>
            </button>
            <button
              onClick={() => setActiveTab("equipo")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === "equipo" ? "bg-gradient-to-r from-cyan-500/20 to-blue-600/10 text-cyan-400 border border-cyan-500/30" : "text-gray-400 hover:bg-cyan-900/30 hover:text-cyan-300"}`}
            >
              <Icons.CRM />
              <span
                className={`text-sm ${activeTab === "equipo" ? "font-bold" : "font-semibold"}`}
              >
                Listura Operativa
              </span>
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-cyan-900/50">
          <button
            onClick={() => {
              supabase.auth.signOut();
              window.location.href = "/";
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 border border-transparent transition"
          >
            <Icons.Logout />
            <span className="font-semibold text-sm">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* ================= CONTENIDO PRINCIPAL ================= */}
      <main
        className={`flex-1 flex flex-col relative transition-colors duration-500 ${isDarkMode ? "bg-[#061121]" : "bg-slate-50"}`}
      >
        {/* Topbar */}
        <header
          className={`h-20 flex items-center justify-between px-8 border-b transition-colors duration-500 ${isDarkMode ? "bg-[#0b1b36] border-cyan-900/50 shadow-[0_4px_30px_rgba(0,180,216,0.05)]" : "bg-white border-gray-200 shadow-sm"}`}
        >
          <div className="flex items-center gap-4">
            <h1
              className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}
            >
              {activeTab === "conocimiento"
                ? "Ingesta de Documentos (RAG)"
                : "Dashboard General de Progreso"}
            </h1>
          </div>

          <div className="flex items-center gap-6">
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
              onClick={() => setShowProfileModal(true)}
              className={`flex items-center gap-3 pl-3 pr-4 py-1.5 rounded-full border transition hover:shadow-md ${isDarkMode ? "bg-[#061121] border-cyan-900/50 hover:border-cyan-500/50" : "bg-white border-gray-200 hover:border-blue-300"}`}
            >
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shrink-0">
                {userProfile.avatar_url ? (
                  <img
                    src={userProfile.avatar_url}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Icons.User />
                )}
              </div>
              <div className="text-left hidden sm:block">
                <p
                  className={`text-sm font-bold leading-none ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}
                >
                  {userProfile.full_name.split(" ")[0]}
                </p>
                <p
                  className={`text-[10px] uppercase font-bold mt-0.5 ${isDarkMode ? "text-cyan-500" : "text-blue-600"}`}
                >
                  Líder
                </p>
              </div>
            </button>
          </div>
        </header>

        {/* Área de Trabajo Central */}
        <div className="flex-1 overflow-y-auto p-8 relative">
          {/* TAB 1: BASE DE CONOCIMIENTO (Estilo Mockup Upload) */}
          {activeTab === "conocimiento" && (
            <div className="max-w-4xl mx-auto">
              <div
                className={`p-6 rounded-3xl shadow-xl transition-colors duration-500 ${isDarkMode ? "bg-[#0b1b36] border border-cyan-900/50" : "bg-white border border-gray-100"}`}
              >
                <div className="text-center mb-8">
                  <h2
                    className={`text-2xl font-black mb-2 ${isDarkMode ? "text-white" : "text-gray-800"}`}
                  >
                    Sube un nuevo manual
                  </h2>
                  <p
                    className={`text-sm ${isDarkMode ? "text-cyan-400/70" : "text-gray-500"}`}
                  >
                    Selecciona un PDF (Máx 5MB) para vectorizar el conocimiento.
                  </p>
                </div>

                <form onSubmit={handleFileUpload} className="max-w-2xl mx-auto">
                  {/* Caja Drag & Drop Falsa (Estilo visual del mockup) */}
                  <label
                    className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-2xl cursor-pointer transition-colors ${isDarkMode ? "border-cyan-700/50 bg-[#061121]/50 hover:bg-[#061121]" : "border-blue-300 bg-blue-50/50 hover:bg-blue-50"}`}
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Icons.PDF/>
                      <p
                        className={`mt-4 text-sm font-bold ${isDarkMode ? "text-cyan-400" : "text-blue-600"}`}
                      >
                        {file
                          ? file.name
                          : "Haz clic para buscar el archivo PDF"}
                      </p>
                      {!file && (
                        <p
                          className={`text-xs mt-1 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
                        >
                          o arrástralo y suéltalo aquí
                        </p>
                      )}
                    </div>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setFile(e.target.files[0])}
                      className="hidden"
                    />
                  </label>

                  {/* Barra de progreso simulada (si está subiendo) */}
                  {uploading && (
                    <div className="mt-8">
                      <div className="flex justify-between text-xs font-bold mb-2">
                        <span
                          className={
                            isDarkMode ? "text-cyan-400" : "text-blue-600"
                          }
                        >
                          Procesando y Vectorizando...
                        </span>
                        <span
                          className={
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }
                        >
                          Procesando
                        </span>
                      </div>
                      <div
                        className={`w-full rounded-full h-2.5 overflow-hidden ${isDarkMode ? "bg-cyan-900/30" : "bg-blue-100"}`}
                      >
                        <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2.5 rounded-full w-full animate-pulse"></div>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={!file || uploading}
                    className={`w-full mt-8 py-4 rounded-xl font-black transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${isDarkMode ? "bg-cyan-500 hover:bg-cyan-400 text-[#061121] shadow-[0_0_15px_rgba(0,180,216,0.3)]" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
                  >
                    {uploading ? "Cargando..." : "Subir Documento"}
                  </button>
                </form>

                {uploadMessage && (
                  <div
                    className={`max-w-2xl mx-auto mt-6 p-4 rounded-xl font-semibold text-center text-sm border ${uploadMessage.includes("✅") ? (isDarkMode ? "bg-green-900/20 text-green-400 border-green-500/30" : "bg-green-50 text-green-700 border-green-200") : isDarkMode ? "bg-red-900/20 text-red-400 border-red-500/30" : "bg-red-50 text-red-700 border-red-200"}`}
                  >
                    {uploadMessage}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: CRM LISTURA OPERATIVA */}
          {activeTab === "equipo" && (
            <div className="max-w-6xl mx-auto">
              <div
                className={`p-8 rounded-3xl shadow-xl transition-colors duration-500 ${isDarkMode ? "bg-[#0b1b36] border border-cyan-900/50" : "bg-white border border-gray-100"}`}
              >
                {loadingTeam ? (
                  <div className="flex justify-center p-12">
                    <div
                      className={`w-10 h-10 border-4 border-t-transparent rounded-full animate-spin ${isDarkMode ? "border-cyan-500" : "border-blue-600"}`}
                    ></div>
                  </div>
                ) : collaborators.length === 0 ? (
                  <p
                    className={`text-center py-12 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
                  >
                    No hay colaboradores registrados en el sistema.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {collaborators.map((user) => (
                      <div
                        key={user.id}
                        onClick={() => setSelectedUser(user)}
                        className={`p-6 rounded-2xl border cursor-pointer transition transform hover:-translate-y-1 hover:shadow-lg ${isDarkMode ? "bg-[#061121] border-cyan-900/50 hover:border-cyan-500" : "bg-slate-50 border-gray-200 hover:border-blue-400"}`}
                      >
                        <div className="flex items-center gap-4 mb-5">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shadow-sm ${isDarkMode ? "bg-cyan-900/50 text-cyan-400" : "bg-blue-100 text-blue-600"}`}
                          >
                            {user.full_name
                              ? user.full_name.charAt(0).toUpperCase()
                              : "C"}
                          </div>
                          <div>
                            <h3
                              className={`font-bold text-lg leading-tight ${isDarkMode ? "text-white" : "text-gray-800"}`}
                            >
                              {user.full_name || "Colaborador"}
                            </h3>
                            <p
                              className={`text-xs mt-0.5 ${isDarkMode ? "text-cyan-400/70" : "text-gray-500"}`}
                            >
                              Exámenes: {user.testsTaken}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-end justify-between mb-2">
                          <span
                            className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
                          >
                            Listura Operativa
                          </span>
                          <span
                            className={`text-xl font-black ${user.averageScore >= 70 ? (isDarkMode ? "text-green-400" : "text-green-500") : user.averageScore > 0 ? (isDarkMode ? "text-yellow-400" : "text-yellow-500") : "text-gray-400"}`}
                          >
                            {user.averageScore}%
                          </span>
                        </div>
                        <div
                          className={`w-full rounded-full h-2.5 overflow-hidden ${isDarkMode ? "bg-cyan-900/30" : "bg-gray-200"}`}
                        >
                          <div
                            className={`h-2.5 rounded-full transition-all duration-1000 ${user.averageScore >= 70 ? "bg-green-500" : user.averageScore > 0 ? "bg-yellow-500" : "bg-gray-400"}`}
                            style={{ width: `${user.averageScore}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ================= MODALES ================= */}

      {/* Modal: Detalle Analítico del Colaborador */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div
            className={`w-full max-w-2xl max-h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-colors ${isDarkMode ? "bg-[#0b1b36] border border-cyan-500/30" : "bg-white"}`}
          >
            <div
              className={`p-6 border-b flex justify-between items-center ${isDarkMode ? "bg-[#061121] border-cyan-900/50" : "bg-gray-50 border-gray-200"}`}
            >
              <div>
                <h3
                  className={`text-2xl font-black ${isDarkMode ? "text-white" : "text-gray-800"}`}
                >
                  {selectedUser.full_name || "Colaborador"}
                </h3>
                <p
                  className={`text-sm mt-1 ${isDarkMode ? "text-cyan-400/70" : "text-gray-500"}`}
                >
                  Historial detallado de evaluaciones
                </p>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className={`p-2 rounded-full transition ${isDarkMode ? "text-gray-400 hover:bg-cyan-900/30" : "text-gray-400 hover:bg-gray-200"}`}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              {allEvaluations.filter((e) => e.user_id === selectedUser.id)
                .length === 0 ? (
                <p
                  className={`text-center py-8 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
                >
                  Este colaborador aún no ha realizado pruebas.
                </p>
              ) : (
                <div className="space-y-4">
                  {allEvaluations
                    .filter((e) => e.user_id === selectedUser.id)
                    .map((evalRecord, idx) => (
                      <div
                        key={evalRecord.id || idx}
                        className={`flex justify-between items-center p-5 rounded-2xl border transition ${isDarkMode ? "bg-[#061121] border-cyan-900/50 hover:border-cyan-700" : "bg-white border-gray-200 hover:bg-slate-50"}`}
                      >
                        <div>
                          <h4
                            className={`font-bold ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}
                          >
                            {evalRecord.context_tested || "Evaluación General"}
                          </h4>
                          <p
                            className={`text-xs mt-1 ${isDarkMode ? "text-cyan-400/50" : "text-gray-500"}`}
                          >
                            {formatDate(evalRecord.created_at)}
                          </p>
                        </div>
                        <div
                          className={`text-xl font-black px-4 py-2 rounded-full ${evalRecord.score >= 70 ? (isDarkMode ? "bg-green-900/30 text-green-400" : "bg-green-100 text-green-700") : isDarkMode ? "bg-red-900/30 text-red-400" : "bg-red-100 text-red-700"}`}
                        >
                          {evalRecord.score}%
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Editar Perfil */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div
            className={`w-full max-w-sm rounded-3xl shadow-2xl p-8 transform transition-all ${isDarkMode ? "bg-[#0b1b36] border border-cyan-500/30" : "bg-white"}`}
          >
            <div className="flex justify-between items-center mb-6">
              <h3
                className={`text-xl font-black ${isDarkMode ? "text-white" : "text-gray-800"}`}
              >
                Editar Perfil
              </h3>
              <button
                onClick={() => setShowProfileModal(false)}
                className={`p-2 rounded-full transition ${isDarkMode ? "text-gray-400 hover:bg-[#061121]" : "text-gray-400 hover:bg-gray-100"}`}
              >
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-5">
              <div>
                <label
                  className={`block text-xs font-bold mb-2 ${isDarkMode ? "text-cyan-400" : "text-gray-600"}`}
                >
                  NOMBRE COMPLETO
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  className={`w-full px-4 py-3 rounded-xl border focus:outline-none transition text-sm ${isDarkMode ? "bg-[#061121] border-cyan-900/50 text-white focus:border-cyan-400" : "bg-gray-50 border-gray-200 focus:border-blue-500 text-gray-800"}`}
                />
              </div>
              <div>
                <label
                  className={`block text-xs font-bold mb-2 ${isDarkMode ? "text-cyan-400" : "text-gray-600"}`}
                >
                  URL DE FOTO DE PERFIL (OPCIONAL)
                </label>
                <input
                  type="url"
                  value={editAvatar}
                  onChange={(e) => setEditAvatar(e.target.value)}
                  placeholder="https://ejemplo.com/mifoto.jpg"
                  className={`w-full px-4 py-3 rounded-xl border focus:outline-none transition text-sm ${isDarkMode ? "bg-[#061121] border-cyan-900/50 text-white placeholder-gray-600 focus:border-cyan-400" : "bg-gray-50 border-gray-200 focus:border-blue-500 text-gray-800"}`}
                />
              </div>
              <button
                type="submit"
                disabled={savingProfile}
                className={`w-full py-3.5 rounded-xl font-black transition mt-4 ${isDarkMode ? "bg-cyan-500 text-[#061121] hover:bg-cyan-400" : "bg-blue-600 text-white hover:bg-blue-700"}`}
              >
                {savingProfile ? "Guardando..." : "Guardar Cambios"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
