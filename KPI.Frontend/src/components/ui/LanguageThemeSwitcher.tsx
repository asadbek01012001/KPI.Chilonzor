import "./assets/lang_theme_switcher.scss";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  appLanguageSelector,
  appThemeSelector,
  switchLanguage,
  switchTheme,
} from "../../reducers/appReducer";

const LANGS = [
  { code: "uz", label: "UZ" },
  { code: "ru", label: "RU" },
  { code: "en", label: "EN" },
];

export default function LanguageThemeSwitcher() {
  const dispatch = useDispatch();
  const { i18n } = useTranslation();
  const language = useSelector(appLanguageSelector);
  const theme = useSelector(appThemeSelector);

  const handleLang = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem("lang", code);
    dispatch(switchLanguage({ language: code }) as any);
  };

  const handleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    dispatch(switchTheme({ theme: next }) as any);
    document.documentElement.setAttribute("data-theme", next);
  };

  return (
    <div className="lts-wrapper">
      <div className="lts-lang-group">
        {LANGS.map((l) => (
          <button
            key={l.code}
            className={`lts-lang-btn${language === l.code ? " lts-lang-btn--active" : ""}`}
            onClick={() => handleLang(l.code)}
          >
            {l.label}
          </button>
        ))}
      </div>

      <button className="lts-theme-btn" onClick={handleTheme} title="Theme">
        {theme === "dark" ? (
          <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
          </svg>
        )}
      </button>
    </div>
  );
}
