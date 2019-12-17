import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/createStore";
import { PersistGate } from "redux-persist/lib/integration/react";
import { SnackbarProvider } from "notistack";

ReactDOM.render(
  <Provider store={store}>
    {/* <PersistGate loading={<LoadingView />} persistor={persistor}> */}
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <SnackbarProvider maxSnack={1}>
          <App />
        </SnackbarProvider>
      </BrowserRouter>
    </PersistGate>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
