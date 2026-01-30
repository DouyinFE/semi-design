import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// 不需要手动导入 global.scss！
// CSS 变量会自动通过 _base/base.scss 注入（跟 npm 包行为一致）

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<App />
);
