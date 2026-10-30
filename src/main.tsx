import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import RouterProviderApp from "./routes.tsx";
import AuthProvider from "./contexts/AuthContext.tsx";
import { register } from "swiper/element-bundle";
import { Toaster } from "react-hot-toast";

register();

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Toaster position="bottom-right" reverseOrder={false} />
    <AuthProvider>
      <RouterProviderApp />
    </AuthProvider>
  </StrictMode>,
);
