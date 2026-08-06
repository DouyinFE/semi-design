import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// 主题 CSS 显式导入，组件 CSS 只负责组件样式。
import '@douyinfe/semi-theme-default/css/token.css';
import '@douyinfe/semi-theme-default/css/global.css';
import '@douyinfe/semi-theme-default/css/animation.css';

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<App />
);
