import React from "react";
import { Button, DatePicker, Modal } from "@douyinfe/semi-ui";

function App() {
    const [focusing, setFocusing] = React.useState(false);
    const [value, setValue] = React.useState();

    const [showModal, setShowModal] = React.useState(false);

    return (
        <div className="App">
            <Button
                onClick={() => {
                    setShowModal(true);
                }}
            >复现demo-semi最新版</Button>

            <Modal visible={showModal} title="测试2" onCancel={() => setShowModal(false)}>
                <div className="App">
                    <div>
                        <button onClick={() => setFocusing(true)}>focus</button>
                        <button onClick={() => setFocusing(false)}>unfocus</button>
                    </div>

                    <p>time: {value?.toString()}</p>

                    <DatePicker
                        open={focusing}
                        // type="dateRange"
                        value={value}
                        // getPopupContainer={() => document.body}
                        onChange={(v) => setValue(v)}
                        triggerRender={() => <></>}
                        insetInput={{
                            // placeholder: {
                            //   dateStart: "开始时间",
                            //   dateEnd: "结束时间",
                            // },
                        }}
                        onBlur={() => {
                            setFocusing(false);
                        }}
                    />
                </div>
            </Modal>
        </div>
    );
}

export default App;
