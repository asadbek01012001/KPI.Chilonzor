import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ProviderContainer } from "./containers/ProviderContainer";
import { configureStore } from "./store/configureStore";

import ReactDOM from "react-dom/client";
import RootContainer from "./containers/RootContainer";

import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/light_theme.scss";
import "./i18n";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

const store = configureStore();

// Apply persisted theme on first load
const persistedApp = JSON.parse(localStorage.getItem("persist:app") || "{}");
const savedTheme = persistedApp.theme ? JSON.parse(persistedApp.theme) : "dark";
document.documentElement.setAttribute("data-theme", savedTheme);

// Apply persisted language on first load
const savedLang = persistedApp.language
  ? JSON.parse(persistedApp.language)
  : localStorage.getItem("lang") || "uz";
localStorage.setItem("lang", savedLang);

root.render(
  <Provider store={store.store}>
    <ProviderContainer>
      <BrowserRouter>
        <RootContainer />
      </BrowserRouter>
    </ProviderContainer>
  </Provider>,
);
