import { Button, Space, Toast,MarkdownRender } from '@douyinfe/semi-ui';
import { IconGithubLogo } from '@douyinfe/semi-icons';

function App() {
    return (
        <MarkdownRender raw={`

            | 标题 |
            | - |
            | 内容 |
            
                `}/>
    );
}

export default App;
