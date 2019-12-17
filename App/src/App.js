import React from "react";
import RootRoutes from "routes/rootRoutes";
import { store } from "./redux/createStore";
import startChat from "src/chat";

import "./App.scss";

// start socket
startChat(store);

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <RootRoutes />
      </div>
    );
  }
}

export default App;
