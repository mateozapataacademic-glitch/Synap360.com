import { useState, useRef, useEffect } from "react";
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
  Home: () => (
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
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      ></path>
    </svg>
  ),
  Chat: () => (
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
        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
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
  AITutor: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="w-5 h-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
        fill="#00B4D8"
      />
      <path
        d="M8 10V12M16 10V12M7 16H17 M12 6V7"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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
};

export default function Chat() {
  // Estados del Chat
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "¡Hola! Soy Synap 360. He procesado los manuales exitosamente y estoy listo para responder tus dudas operativas.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const messagesEndRef = useRef(null);

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

  const [recentTopics, setRecentTopics] = useState([]);
  const [currentTestTopic, setCurrentTestTopic] =
    useState("Onboarding General");

  // Cargar datos del perfil al iniciar
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

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => scrollToBottom(), [messages]);

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
      alert("Error al actualizar el perfil: " + error.message);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMessage = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("chat-ia", {
        body: { query: userMessage },
      });
      if (error) throw error;
      const iaReply =
        data.reply ||
        data.answer ||
        data.response ||
        data.mensaje ||
        data.text ||
        JSON.stringify(data);
      setMessages((prev) => [...prev, { role: "assistant", content: iaReply }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `❌ Error del servidor: ${error.message}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateTest = async (type) => {
    setLoading(true);
    setEvaluation(null);
    setScore(null);
    setAnswers({});

    try {
      let testContext = "";
      let topicName = "";

      if (type === "context") {
        const lastUserMsg = [...messages]
          .reverse()
          .find((m) => m.role === "user");
        testContext = lastUserMsg ? lastUserMsg.content : "Conceptos básicos";
        topicName = lastUserMsg
          ? "Contexto: " + (lastUserMsg.content.substring(0, 30) + "...")
          : "Conversación General";
      } else {
        const { data: docs } = await supabase.from("documents").select("title");
        if (docs && docs.length > 0) {
          const uniqueTitles = [
            ...new Set(docs.map((doc) => doc.title).filter(Boolean)),
          ];
          let availableTitles = uniqueTitles;
          if (
            recentTopics.length >= 2 &&
            recentTopics[recentTopics.length - 1] ===
              recentTopics[recentTopics.length - 2]
          ) {
            availableTitles = uniqueTitles.filter(
              (t) => t !== recentTopics[recentTopics.length - 1],
            );
            if (availableTitles.length === 0) availableTitles = uniqueTitles;
          }
          const selectedTitle =
            availableTitles[Math.floor(Math.random() * availableTitles.length)];
          setRecentTopics((prev) => [...prev.slice(-1), selectedTitle]);
          testContext = selectedTitle;
          topicName = `Test de Documento: ${selectedTitle.substring(0, 25)}...`;
        } else {
          testContext = "Manuales operativos generales";
          topicName = "Test Aleatorio General";
        }
      }

      setCurrentTestTopic(topicName);
      const { data, error } = await supabase.functions.invoke(
        "generate-evaluation",
        { body: { context: testContext } },
      );
      if (error) throw error;

      const shuffledQuestions = data.questions.map((q) => {
        const originalOptions = q.options || q.opciones || {};
        const correctText =
          originalOptions[q.correctAnswer || q.respuestaCorrecta];
        const shuffledTexts = Object.values(originalOptions).sort(
          () => Math.random() - 0.5,
        );
        const newOptions = {};
        let newCorrectKey = "";
        shuffledTexts.forEach((text, index) => {
          const key = String.fromCharCode(65 + index);
          newOptions[key] = text;
          if (text === correctText) newCorrectKey = key;
        });
        return { ...q, options: newOptions, correctAnswer: newCorrectKey };
      });
      setEvaluation(shuffledQuestions);
    } catch (error) {
      alert(`Error al generar la prueba: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (qId, key) =>
    setAnswers((prev) => ({ ...prev, [qId]: key }));

  const handleSubmitEvaluation = async () => {
    let correctCount = 0;
    evaluation.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) correctCount++;
    });
    const finalScore = Math.round((correctCount / evaluation.length) * 100);
    setScore(finalScore);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from("evaluations")
          .insert([
            {
              user_id: user.id,
              score: finalScore,
              context_tested: currentTestTopic,
            },
          ]);
        alert(`¡Evaluación guardada con éxito! Puntaje: ${finalScore}/100`);
      }
    } catch (error) {
      alert(`Error guardando nota: ${error.message}`);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden font-sans bg-[#061121]">
      {/* ================= BARRA LATERAL (SIDEBAR) ================= */}
      <aside className="w-64 bg-[#0b1b36] border-r border-cyan-900/50 flex flex-col justify-between hidden md:flex shrink-0 shadow-2xl z-20">
        <div>
          {/* Logo Brand */}
          <div className="h-20 flex items-center px-6 border-b border-cyan-900/50 gap-3">
            <Icons.Logo />
            <span className="text-xl font-black text-white tracking-tight">
              SYNAP <span className="text-cyan-400">360</span>
            </span>
          </div>

          {/* Menú de Navegación */}
          <nav className="p-4 space-y-2 mt-4">
            <p className="px-3 text-xs font-bold text-cyan-500/50 uppercase tracking-wider mb-2">
              Plataforma
            </p>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-600/10 text-cyan-400 border border-cyan-500/30 transition">
              <Icons.Chat />
              <span className="font-bold text-sm">Tutor IA</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-cyan-900/30 hover:text-cyan-300 transition group">
            </button>
          </nav>
        </div>

        {/* Cierre de sesión */}
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
        {/* Topbar (Barra Superior) */}
        <header
          className={`h-20 flex items-center justify-between px-8 border-b transition-colors duration-500 ${isDarkMode ? "bg-[#0b1b36] border-cyan-900/50 shadow-[0_4px_30px_rgba(0,180,216,0.05)]" : "bg-white border-gray-200 shadow-sm"}`}
        >
          <div className="flex items-center gap-4">
            <h1
              className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}
            >
              Entrenamiento Operativo
            </h1>
          </div>

          <div className="flex items-center gap-6">
            {/* Toggle de Tema Claro/Oscuro */}
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

            {/* Perfil de Usuario */}
            <button
              onClick={() => setShowProfileModal(true)}
              className={`flex items-center gap-3 pl-3 pr-4 py-1.5 rounded-full border transition hover:shadow-md ${isDarkMode ? "bg-[#061121] border-cyan-900/50 hover:border-cyan-500/50" : "bg-white border-gray-200 hover:border-blue-300"}`}
            >
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shrink-0">
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
                  Colaborador
                </p>
              </div>
            </button>
          </div>
        </header>

        {/* Área de Chat Central */}
        <div className="flex-1 overflow-hidden p-6 flex justify-center gap-6 relative">
          {/* El ChatBox */}
          <div
            className={`w-full max-w-3xl border rounded-2xl shadow-xl flex flex-col h-full z-10 transition-colors duration-500 ${isDarkMode ? "bg-[#0b1b36] border-cyan-900/50" : "bg-white border-gray-200"}`}
          >
            <div
              className={`px-6 py-4 flex justify-between items-center border-b transition-colors duration-500 ${isDarkMode ? "border-cyan-900/50" : "border-gray-100"}`}
            >
              <span
                className={`text-sm font-bold ${isDarkMode ? "text-cyan-400" : "text-blue-600"}`}
              >
                Interacción RAG
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleGenerateTest("context")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition border ${isDarkMode ? "bg-cyan-900/30 border-cyan-700 text-cyan-300 hover:bg-cyan-800" : "bg-white border-blue-200 text-blue-600 hover:bg-blue-50"}`}
                >
                  Test de Conversación
                </button>
                <button
                  onClick={() => handleGenerateTest("random")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition shadow-md ${isDarkMode ? "bg-cyan-500 text-[#061121] hover:bg-cyan-400" : "bg-blue-600 text-white hover:bg-blue-700"}`}
                >
                  Test Aleatorio
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((msg, index) => {
                const isUser = msg.role === "user";
                return (
                  <div
                    key={index}
                    className={`flex flex-col ${isUser ? "items-end" : "items-start"} w-full`}
                  >
                    <span
                      className={`text-[11px] font-medium mb-1 px-12 ${isDarkMode ? "text-cyan-400/50" : "text-gray-400"}`}
                    >
                      {isUser
                        ? userProfile.full_name.split(" ")[0]
                        : "AI Tutor"}
                    </span>
                    <div
                      className={`flex gap-3 max-w-[85%] ${isUser ? "flex-row-reverse" : "flex-row"}`}
                    >
                      <div
                        className={`w-9 h-9 flex-shrink-0 rounded-full flex items-center justify-center overflow-hidden shadow-sm ${isUser ? (isDarkMode ? "bg-cyan-900/50" : "bg-gray-200") : isDarkMode ? "bg-[#0b1b36] border border-cyan-900/50" : "bg-white border border-gray-100"}`}
                      >
                        {isUser ? (
                          userProfile.avatar_url ? (
                            <img
                              src={userProfile.avatar_url}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Icons.User />
                          )
                        ) : (
                          <Icons.AITutor />
                        )}
                      </div>
                      <div
                        className={`rounded-2xl p-4 text-sm leading-relaxed shadow-sm ${isUser ? (isDarkMode ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-tr-sm" : "bg-blue-600 text-white rounded-tr-sm") : isDarkMode ? "bg-[#061121] border border-cyan-900/50 text-gray-300 rounded-tl-sm" : "bg-gray-100 text-gray-800 rounded-tl-sm"}`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  </div>
                );
              })}
              {loading && !evaluation && (
                <div className="flex flex-col items-start w-full">
                  <div
                    className={`rounded-2xl rounded-tl-sm p-4 ml-12 shadow-sm flex items-center space-x-2 h-12 ${isDarkMode ? "bg-[#061121] border border-cyan-900/50" : "bg-gray-100"}`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full animate-bounce ${isDarkMode ? "bg-cyan-500" : "bg-gray-400"}`}
                    ></div>
                    <div
                      className={`w-2 h-2 rounded-full animate-bounce delay-75 ${isDarkMode ? "bg-cyan-500" : "bg-gray-400"}`}
                    ></div>
                    <div
                      className={`w-2 h-2 rounded-full animate-bounce delay-150 ${isDarkMode ? "bg-cyan-500" : "bg-gray-400"}`}
                    ></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form
              onSubmit={handleSendMessage}
              className={`p-4 border-t flex gap-3 items-center transition-colors duration-500 ${isDarkMode ? "bg-[#0b1b36] border-cyan-900/50" : "bg-white border-gray-200"}`}
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  evaluation
                    ? "🔒 Completa la prueba primero..."
                    : "Escribe tu duda técnica..."
                }
                className={`flex-1 px-5 py-3.5 rounded-2xl focus:outline-none transition disabled:opacity-50 text-sm ${isDarkMode ? "bg-[#061121] border border-cyan-900/50 text-white placeholder-gray-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 disabled:bg-[#030812]" : "bg-gray-100 border-transparent text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:bg-white disabled:bg-gray-50"}`}
                disabled={loading || evaluation !== null}
              />
              <button
                type="submit"
                disabled={loading || !input.trim() || evaluation !== null}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md flex-shrink-0 ${isDarkMode ? "bg-cyan-500 hover:bg-cyan-400 text-[#061121]" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
              >
                <svg
                  className="w-5 h-5 ml-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                </svg>
              </button>
            </form>
          </div>

          {/* Panel de Evaluación */}
          {evaluation && (
            <div
              className={`w-full max-w-md border rounded-2xl p-6 h-full overflow-y-auto z-10 custom-scrollbar transition-colors duration-500 ${isDarkMode ? "bg-[#0b1b36] border-cyan-500/30 shadow-[0_0_30px_rgba(0,180,216,0.15)]" : "bg-white border-gray-200 shadow-xl"}`}
            >
              <h3
                className={`text-xl font-black mb-6 text-center border-b pb-4 ${isDarkMode ? "text-white border-cyan-900/50" : "text-gray-800 border-gray-100"}`}
              >
                Test de{" "}
                <span
                  className={isDarkMode ? "text-cyan-400" : "text-blue-600"}
                >
                  Conocimiento
                </span>
              </h3>
              {score === null ? (
                <div className="space-y-6">
                  {evaluation.map((q, i) => (
                    <div
                      key={q.id}
                      className={`p-5 rounded-2xl border ${isDarkMode ? "bg-[#061121] border-cyan-900/50" : "bg-slate-50 border-gray-100"}`}
                    >
                      <p
                        className={`font-semibold mb-4 text-sm leading-relaxed ${isDarkMode ? "text-white" : "text-gray-800"}`}
                      >
                        <span
                          className={
                            isDarkMode ? "text-cyan-400" : "text-blue-600"
                          }
                        >
                          {i + 1}.
                        </span>{" "}
                        {q.text || q.question || "¿?"}
                      </p>
                      <div className="space-y-2">
                        {Object.entries(q.options || {}).map(([key, val]) => (
                          <label
                            key={key}
                            className={`flex items-center p-3 rounded-xl cursor-pointer transition border text-sm ${answers[q.id] === key ? (isDarkMode ? "bg-cyan-900/40 border-cyan-400 text-white" : "bg-blue-50 border-blue-500 text-blue-800 shadow-sm") : isDarkMode ? "bg-[#0b1b36] border-cyan-900/50 hover:bg-cyan-900/20 text-gray-300" : "bg-white border-gray-200 hover:bg-gray-50 text-gray-600"}`}
                          >
                            <input
                              type="radio"
                              name={`q-${q.id}`}
                              value={key}
                              checked={answers[q.id] === key}
                              onChange={() => handleOptionSelect(q.id, key)}
                              className={`mr-3 ${isDarkMode ? "text-cyan-500 focus:ring-cyan-500 bg-[#061121] border-cyan-700" : "text-blue-600 focus:ring-blue-500"}`}
                            />
                            <span>
                              <strong
                                className={`mr-1 ${isDarkMode ? "text-cyan-400" : "text-gray-800"}`}
                              >
                                {key})
                              </strong>{" "}
                              {val}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={handleSubmitEvaluation}
                    disabled={Object.keys(answers).length < evaluation.length}
                    className={`w-full font-black py-3.5 rounded-xl transition mt-6 shadow-lg disabled:opacity-50 ${isDarkMode ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(0,180,216,0.3)]" : "bg-blue-600 text-white"}`}
                  >
                    Entregar Prueba
                  </button>
                </div>
              ) : (
                <div className="text-center py-12">
                  <h4
                    className={`text-2xl font-black mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}
                  >
                    ¡Prueba Finalizada!
                  </h4>
                  <div
                    className={`text-7xl font-black mb-6 ${score >= 70 ? (isDarkMode ? "text-green-400 drop-shadow-md" : "text-green-500") : isDarkMode ? "text-red-400 drop-shadow-md" : "text-red-500"}`}
                  >
                    {score}%
                  </div>
                  <p
                    className={`mb-8 text-sm px-4 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
                  >
                    {score >= 70
                      ? "¡Excelente trabajo!"
                      : "Te sugerimos repasar el material."}
                  </p>
                  <button
                    onClick={() => {
                      setEvaluation(null);
                      setScore(null);
                    }}
                    className={`font-bold transition px-6 py-2.5 rounded-full ${isDarkMode ? "text-cyan-400 hover:bg-cyan-900/30" : "text-blue-600 bg-blue-50"}`}
                  >
                    Volver al Tutor IA
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* ================= MODAL DE PERFIL ================= */}
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
