import { useState } from "react";
import { Button } from "@/components/ui/button";

const LanguageSwitcher = () => {
  const [selectedLang, setSelectedLang] = useState("pt");

  const languages = [
    { code: "en", flag: "🇺🇸", label: "English" },
    { code: "pt", flag: "🇧🇷", label: "Português" },
    { code: "es", flag: "🇪🇸", label: "Español" },
  ];

  return (
    <div className="flex items-center gap-2">
      {languages.map((lang) => (
        <Button
          key={lang.code}
          variant="ghost"
          size="sm"
          onClick={() => setSelectedLang(lang.code)}
          className={`text-2xl p-2 hover:bg-accent/10 transition-all duration-300 ${
            selectedLang === lang.code ? "ring-2 ring-accent" : ""
          }`}
          aria-label={lang.label}
        >
          {lang.flag}
        </Button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
