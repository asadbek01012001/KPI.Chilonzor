import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ProviderContainer } from "./containers/ProviderContainer";
import { configureStore } from "./store/configureStore";

import ReactDOM from "react-dom/client";
import RootContainer from "./containers/RootContainer";

import "bootstrap/dist/css/bootstrap.min.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

const store = configureStore();

root.render(
  <Provider store={store.store}>
    <ProviderContainer>
      <BrowserRouter>
        <RootContainer />
      </BrowserRouter>
    </ProviderContainer>
  </Provider>,
);
