import { Button, Space, Toast } from '@douyinfe/semi-ui';
import { IconGithubLogo } from '@douyinfe/semi-icons';

function App() {
    return (
        <div style={{ padding: 24 }}>
            <h1>Semi Design Playground</h1>
            <Space>
                <Button 
                    type="primary" 
                    icon={<IconGithubLogo />}
                    onClick={() => Toast.success('Hello from Semi!')}
                >
                    Click Me
                </Button>
                <Button type="secondary">Secondary</Button>
                <Button type="tertiary">Tertiary</Button>
            </Space>
        </div>
    );
}

export default App;
