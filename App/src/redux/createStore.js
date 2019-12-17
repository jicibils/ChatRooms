import { createStore, applyMiddleware, compose } from "redux";
import { createLogger } from "redux-logger";
import thunk from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import rootReducer from "./reducers";

const persistConfig = {
  key: "root",
  storage: storage,
  stateReconciler: autoMergeLevel2
};

const pReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(
  pReducer,
  {},
  compose(
    applyMiddleware(thunk),
    // applyMiddleware(createLogger())

    applyMiddleware(createLogger({ predicate: (getState, action) => false }))
  )
);
export const persistor = persistStore(store);
