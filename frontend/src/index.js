import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { SocketProvider } from './socket'

ReactDOM.render(
  <SocketProvider>
    <App />
  </SocketProvider>

  ,
  document.getElementById("root")
);
