import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// 主题 CSS 在 App.tsx 中显式导入，组件 CSS 只负责组件样式。

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<App />
);
