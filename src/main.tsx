
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.scss";
import SessionsContextProvider from "./components/context/SessionsContext.tsx";


ReactDOM.createRoot(document.getElementById("root")!).render(
  <SessionsContextProvider>
    <App />
    </SessionsContextProvider>)
