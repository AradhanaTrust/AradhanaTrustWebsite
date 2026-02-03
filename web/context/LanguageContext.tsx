"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "kn";

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>("en");

    // Optional: Persist to localStorage
    useEffect(() => {
        const savedLang = localStorage.getItem("app-language") as Language;
        if (savedLang) setLanguage(savedLang);
    }, []);

    const toggleLanguage = () => {
        const newLang = language === "en" ? "kn" : "en";
        setLanguage(newLang);
        localStorage.setItem("app-language", newLang);
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
