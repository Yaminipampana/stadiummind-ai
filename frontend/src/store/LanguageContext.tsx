import React, { createContext, useContext, useState, useEffect } from "react";

export type LanguageCode = "en" | "es" | "fr" | "hi" | "ar" | "pt";

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
  isRtl: boolean;
}

const translations: Record<LanguageCode, Record<string, string>> = {
  en: {
    nav_home: "Home",
    nav_dashboard: "Dashboard",
    nav_chat: "AI Chat",
    nav_map: "Stadium Map",
    nav_volunteer: "Volunteers",
    nav_emergency: "SOS Center",
    nav_sustainability: "Green Portal",
    nav_accessibility: "Accessibility",
    chat_title: "AI Assistant",
    chat_desc: "Ground-level operations guidance utilizing live telemetry datasets.",
    chat_placeholder: "Ask about restrooms wait times, accessibility assistance...",
    chat_send: "Send",
    chat_listening: "Listening to voice input...",
    chat_suggested_queries: "Suggested Telemetry Queries",
    login_btn: "Login",
    logout_btn: "Logout",
    welcome_msg: "Hi! How can I assist you with stadium navigation, gate wait times, or volunteer support services today?"
  },
  es: {
    nav_home: "Inicio",
    nav_dashboard: "Panel",
    nav_chat: "Chat de IA",
    nav_map: "Mapa Estadio",
    nav_volunteer: "Voluntarios",
    nav_emergency: "Centro SOS",
    nav_sustainability: "Portal Verde",
    nav_accessibility: "Accesibilidad",
    chat_title: "Asistente de IA",
    chat_desc: "Orientação de operações a nível de solo com dados de telemetría en vivo.",
    chat_placeholder: "Pregunte por tiempos de espera de baños, ayuda de accesibilidad...",
    chat_send: "Enviar",
    chat_listening: "Escuchando entrada de voz...",
    chat_suggested_queries: "Consultas de telemetría sugeridas",
    login_btn: "Iniciar sesión",
    logout_btn: "Cerrar sesión",
    welcome_msg: "¡Hola! ¿Cómo puedo ayudarle hoy con la navegación del estadio, tiempos de espera o servicios de soporte?"
  },
  fr: {
    nav_home: "Accueil",
    nav_dashboard: "Tableau",
    nav_chat: "Assistant IA",
    nav_map: "Plan Stade",
    nav_volunteer: "Bénévoles",
    nav_emergency: "Centre SOS",
    nav_sustainability: "Portail Vert",
    nav_accessibility: "Accessibilité",
    chat_title: "Assistant IA",
    chat_desc: "Guidage opérationnel au sol basé sur des données de télémétrie en temps réel.",
    chat_placeholder: "Demander pour les files d'attente, l'assistance handicap...",
    chat_send: "Envoyer",
    chat_listening: "Écoute de l'entrée vocale...",
    chat_suggested_queries: "Suggestions de requêtes de télémétrie",
    login_btn: "Se connecter",
    logout_btn: "Déconnexion",
    welcome_msg: "Bonjour ! Comment puis-je vous aider aujourd'hui avec la navigation, l'attente aux portes ou l'assistance ?"
  },
  hi: {
    nav_home: "मुख्य पृष्ठ",
    nav_dashboard: "डैशबोर्ड",
    nav_chat: "एआई चैट",
    nav_map: "स्टेडियम नक्शा",
    nav_volunteer: "स्वयंसेवक",
    nav_emergency: "आपातकालीन केंद्र",
    nav_sustainability: "हरित पोर्टल",
    nav_accessibility: "सुगम्यता",
    chat_title: "एआई सहायक",
    chat_desc: "लाइव टेलीमेट्री डेटासेट का उपयोग करके जमीनी स्तर का संचालन मार्गदर्शन।",
    chat_placeholder: "शौचालय प्रतीक्षा समय, सुगम्यता सहायता के बारे में पूछें...",
    chat_send: "भेजें",
    chat_listening: "आवाज सुन रहा है...",
    chat_suggested_queries: "सुझाए गए टेलीमेट्री प्रश्न",
    login_btn: "लॉगिन",
    logout_btn: "लॉगआउट",
    welcome_msg: "नमस्ते! आज मैं स्टेडियम नेविगेशन, गेट प्रतीक्षा समय या स्वयंसेवक सहायता सेवाओं में आपकी क्या मदद कर सकता हूँ?"
  },
  ar: {
    nav_home: "الرئيسية",
    nav_dashboard: "لوحة التحكم",
    nav_chat: "مساعد الذكاء الاصطناعي",
    nav_map: "خريطة الملعب",
    nav_volunteer: "المتطوعون",
    nav_emergency: "مركز الطوارئ",
    nav_sustainability: "البوابة الخضراء",
    nav_accessibility: "إمكانية الوصول",
    chat_title: "مساعد الذكاء الاصطناعي",
    chat_desc: "توجيه العمليات الميدانية باستخدام بيانات التوجيه والتحليل المباشر.",
    chat_placeholder: "اسأل عن وقت الانتظار في دورات المياه، أو المساعدة الخاصة...",
    chat_send: "إرسال",
    chat_listening: "جاري الاستماع للمدخل الصوتي...",
    chat_suggested_queries: "الاستعلامات المقترحة",
    login_btn: "تسجيل الدخول",
    logout_btn: "تسجيل الخروج",
    welcome_msg: "مرحباً! كيف يمكنني مساعدتك اليوم في التنقل داخل الملعب، أوقات الانتظار، أو خدمات الدعم؟"
  },
  pt: {
    nav_home: "Início",
    nav_dashboard: "Painel",
    nav_chat: "Chat de IA",
    nav_map: "Mapa do Estádio",
    nav_volunteer: "Voluntários",
    nav_emergency: "Centro SOS",
    nav_sustainability: "Portal Verde",
    nav_accessibility: "Acessibilidade",
    chat_title: "Assistente de IA",
    chat_desc: "Orientação de operações no solo utilizando telemetria ao vivo.",
    chat_placeholder: "Pergunte sobre tempo de fila de banheiros, assistência de acessibilidade...",
    chat_send: "Enviar",
    chat_listening: "Ouvindo entrada de voz...",
    chat_suggested_queries: "Consultas de telemetria sugeridas",
    login_btn: "Entrar",
    logout_btn: "Sair",
    welcome_msg: "Olá! Como posso ajudar você hoje com rotas no estádio, tempos de fila nos portões ou suporte de voluntários?"
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem("stadiummind_lang");
    return (saved as LanguageCode) || "en";
  });

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem("stadiummind_lang", lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || translations["en"][key] || key;
  };

  const isRtl = language === "ar";

  useEffect(() => {
    // Dynamic document body class and direction management
    document.documentElement.dir = isRtl ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language, isRtl]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRtl }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export default LanguageContext;
