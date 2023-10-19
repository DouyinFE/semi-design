import {
    Button,
    Tooltip,
    Table,
    TagGroup
} from "@douyinfe/semi-ui";
import { IconSemiLogo, IconHelpCircle } from "@douyinfe/semi-icons";
import React, { useMemo } from "react";

export default function TableTest() {
    const securityColumns = [
        {
            title: "行为名称",
            key: "001",
            width: 180,
            fixed: "left",
            dataIndex: "cnSensitiveGroup"
        },
        {
            // title: "222",
            title: (
                <div style={{ display: "inline-flex" }}>
                    <span>{"应用自身行为声明"}</span>
                    <Tooltip
                        content={
                            "指行为主体为“应用自身”的调用行为对应的个人信息在应用的隐私政策是否有声明，暂不包含第三方SDK的敏感行为声明一致性判断"
                        }
                    >
                        <IconHelpCircle
                            style={{
                                color: "#A9AEB8",
                                verticalAlign: "middle"
                            }}
                        />
                    </Tooltip>
                </div>
            ),
            width: 190,
            dataIndex: "pppiUndeclared",
            filters: [
                {
                    text: "未获取",
                    value: -1
                },
                {
                    text: "是",
                    value: 1
                },
                {
                    text: "否",
                    value: 2
                },
                {
                    text: "无需关注",
                    value: 3
                }
            ],
            onFilter: (value, record) => record.pppiUndeclared === value
        },
        {
            title: "风险点",
            width: 160,
            key: "006",
            dataIndex: "riskTags",
            // filters: riskTagsOptions,
            onFilter: (value, record) => {
                return record?.riskTags?.some?.((item) => item === value);
            },
            render: (text) => {
                if (Array.isArray(text)) {
                    const tagList = text.map((item) => ({
                        color: "white",
                        children: item
                    }));
                    const tagGroupStyle = {
                        display: "flex",
                        alignItems: "center"
                    };
                    return (
                        <div className="RiskGroundTags">
                            {tagList.length !== 0 ? (
                                <TagGroup
                                    maxTagCount={1}
                                    size="small"
                                    style={tagGroupStyle}
                                    tagList={tagList}
                                    avatarShape="circle"
                                    showPopover
                                />
                            ) : (
                                <div>-</div>
                            )}
                        </div>
                    );
                } else {
                    return <div>{text}</div>;
                }
            }
        }
    ];
    const resizable = useMemo(() => {
        return {
            onResizeStart: (curColumn) => {
                console.log("resizable-onResizeStart", curColumn);
            },
            onResizeStop: (curColumn) => {
                console.log("resizable-onResizeStop", curColumn);
            },
            onResize: (curColumn) => {
                console.log("resizable-onResize", curColumn);
            }
        };
    }, []);
    const tableDataSource = [
        {
            sensitiveGroupKey: "privacy_device_id",
            cnSensitiveGroup: "采集Device id",
            count: 12,
            description: "禁止无合理场景/高频/定期采集",
            effect: "安全合规风险",
            suggestions: "谨慎使用",
            problemBasis: "",
            historyCases: "",
            priority: "P0",
            relatedPermissions: ["android.permission.READ_PHONE_STATE"],
            belong: { exact: ["应用自身"], blur: [] },
            checkRes: 1,
            riskTags: [],
            problemTypes: [],
            pppiUndeclared: -1,
            key: 4
        },
        {
            sensitiveGroupKey: "privacy_build_serial",
            cnSensitiveGroup: "采集设备Serial",
            count: 7,
            description: "采集用户身份标志的设备Serial",
            effect: "安全合规风险",
            suggestions: "禁止使用",
            problemBasis: "",
            historyCases: "",
            priority: "P0",
            relatedPermissions: ["android.permission.READ_PHONE_STATE"],
            belong: { exact: ["应用自身"], blur: [] },
            checkRes: 1,
            riskTags: [],
            problemTypes: [],
            pppiUndeclared: -1,
            key: 8
        },
        {
            sensitiveGroupKey: "privacy_MEID",
            cnSensitiveGroup: "采集MEID",
            count: 7,
            description: "禁止无合理场景/高频/定期采集",
            effect: "安全合规风险",
            suggestions: "禁止使用",
            problemBasis: "",
            historyCases: "",
            priority: "P0",
            relatedPermissions: [],
            belong: { exact: ["应用自身"], blur: [] },
            checkRes: 1,
            riskTags: [],
            problemTypes: [],
            pppiUndeclared: -1,
            key: 13
        },
        {
            sensitiveGroupKey: "location",
            cnSensitiveGroup: "读取地理位置",
            count: 6,
            description: "谨慎读取地理位置信息",
            effect: "安全合规风险",
            suggestions: "管控",
            problemBasis: "",
            historyCases: "",
            priority: "P0",
            relatedPermissions: [
                "android.permission.ACCESS_FINE_LOCATION",
                "android.permission.ACCESS_COARSE_LOCATION"
            ],
            belong: { exact: ["高德地图 SDK"], blur: [] },
            checkRes: 1,
            riskTags: [],
            problemTypes: [],
            pppiUndeclared: -1,
            key: 6
        },
        {
            sensitiveGroupKey: "privacy_phone_info_getActiveSubscriptionInfoList",
            cnSensitiveGroup: "读取手机信息（SIM卡信息即ICCID）",
            count: 4,
            description: "谨慎高频或后台读取手机信息，部分手机会对此进行行为记录",
            effect: "安全合规风险",
            suggestions: "谨慎使用",
            problemBasis: "",
            historyCases: "",
            priority: "P0",
            relatedPermissions: [],
            belong: { exact: ["应用自身"], blur: [] },
            checkRes: 1,
            riskTags: [],
            problemTypes: [],
            pppiUndeclared: -1,
            key: 10
        },
        {
            sensitiveGroupKey: "privacy_imsi",
            cnSensitiveGroup: "采集IMSI",
            count: 3,
            description: "禁止无合理场景/高频/定期采集",
            effect: "安全合规风险",
            suggestions: "禁止使用",
            problemBasis: "",
            historyCases: "",
            priority: "P0",
            relatedPermissions: ["android.permission.READ_PHONE_STATE"],
            belong: { exact: ["应用自身"], blur: [] },
            checkRes: 1,
            riskTags: [],
            problemTypes: [],
            pppiUndeclared: -1,
            key: 3
        },
        {
            sensitiveGroupKey: "privacy_hardware_address",
            cnSensitiveGroup: "获取WLAN MAC地址",
            count: 3,
            description: "禁止无合理场景/高频/定期采集设备网卡MAC地址",
            effect: "安全合规风险",
            suggestions: "禁用",
            problemBasis: "",
            historyCases: "",
            priority: "P0",
            relatedPermissions: [],
            belong: { exact: ["应用自身"], blur: [] },
            checkRes: 1,
            riskTags: [],
            problemTypes: [],
            pppiUndeclared: -1,
            key: 5
        },
        {
            sensitiveGroupKey: "privacy_sensor_registerlistener",
            cnSensitiveGroup: "注册传感器监听器",
            count: 13,
            description: "监听用户设备传感器",
            effect: "安全合规风险",
            suggestions: "非合理场景禁止监听并获取用户设备传感器数据",
            problemBasis: "",
            historyCases: "",
            priority: "P1",
            relatedPermissions: [],
            belong: { exact: ["应用自身", "Bytedance 地理中台 SDK"], blur: [] },
            checkRes: 2,
            riskTags: ["高频"],
            problemTypes: ["high-frequency"],
            pppiUndeclared: -1,
            key: 9
        },
        {
            sensitiveGroupKey: "privacy_query_install_application",
            cnSensitiveGroup: "采集设备应用列表",
            count: 11,
            description: "业务自查，禁止非合理场景单个或批量采集第三方应用列表",
            effect: "安全合规风险",
            suggestions: "谨慎操作",
            problemBasis: "",
            historyCases: "",
            priority: "P1",
            relatedPermissions: [],
            belong: { exact: ["应用自身"], blur: [] },
            checkRes: 1,
            riskTags: [],
            problemTypes: [],
            pppiUndeclared: -1,
            key: 12
        },
        {
            sensitiveGroupKey: "privacy_getConnectionInfo",
            cnSensitiveGroup: "获取当前连接WiFi信息",
            count: 9,
            description: "使用此API会被记录为获取位置信息，后台使用高风险",
            effect: "安全合规风险",
            suggestions: "谨慎使用",
            problemBasis: "",
            historyCases: "",
            priority: "P1",
            relatedPermissions: [
                "android.permission.ACCESS_FINE_LOCATION",
                "android.permission.ACCESS_COARSE_LOCATION"
            ],
            belong: { exact: ["应用自身", "高德地图 SDK"], blur: [] },
            checkRes: 1,
            riskTags: [],
            problemTypes: [],
            pppiUndeclared: -1,
            key: 11
        },
        {
            sensitiveGroupKey: "privacy_bssid_ssid",
            cnSensitiveGroup: "采集SSID、BSSID",
            count: 7,
            description: "禁止无合理场景/高频/定期采集；隐私弹窗前禁止采集",
            effect: "安全合规风险",
            suggestions: "管控",
            problemBasis: "",
            historyCases: "",
            priority: "P1",
            relatedPermissions: [
                "android.permission.ACCESS_FINE_LOCATION",
                "android.permission.ACCESS_COARSE_LOCATION"
            ],
            belong: { exact: ["高德地图 SDK"], blur: [] },
            checkRes: 2,
            riskTags: ["高频"],
            problemTypes: ["high-frequency"],
            pppiUndeclared: -1,
            key: 1
        },
        {
            sensitiveGroupKey: "privacy_androidid",
            cnSensitiveGroup: "获取AndroidID",
            count: 7,
            description: "禁止同意隐私弹窗前等非合理场景/高频/定频获取AndroidID",
            effect: "安全合规风险",
            suggestions: "谨慎使用",
            problemBasis: "",
            historyCases: "",
            priority: "P1",
            relatedPermissions: [],
            belong: { exact: ["应用自身"], blur: [] },
            checkRes: 1,
            riskTags: [],
            problemTypes: [],
            pppiUndeclared: -1,
            key: 7
        },
        {
            sensitiveGroupKey: "wifi_info",
            cnSensitiveGroup: "获取网络信息",
            count: 5,
            description: "谨慎获取WiFi网络信息",
            effect: "安全合规风险",
            suggestions: "管控",
            problemBasis: "",
            historyCases: "",
            priority: "P2",
            relatedPermissions: [],
            belong: { exact: ["应用自身", "高德地图 SDK"], blur: [] },
            checkRes: 2,
            riskTags: ["高频"],
            problemTypes: ["high-frequency"],
            pppiUndeclared: -1,
            key: 2
        },
        {
            sensitiveGroupKey: "telephony",
            cnSensitiveGroup: "获取基站信息",
            count: 4,
            description: "谨慎获取基站信息",
            effect: "谨慎获取基站信息",
            suggestions: "管控",
            problemBasis: "",
            historyCases: "",
            priority: "P2",
            relatedPermissions: [
                "android.permission.ACCESS_FINE_LOCATION",
                "android.permission.ACCESS_COARSE_LOCATION"
            ],
            belong: { exact: ["高德地图 SDK"], blur: [] },
            checkRes: 2,
            riskTags: ["高频"],
            problemTypes: ["high-frequency"],
            pppiUndeclared: -1,
            key: 0
        }
    ];
    return (
        <div className="App">
            <Button icon={<IconSemiLogo />}>hello semi</Button>
            <Table
                className="ques-overview-tableForSecurity"
                rowKey={"key"}
                style={{ marginTop: "8px" }}
                resizable={resizable}
                onRow={() => ({ style: { height: 52 } })}
                columns={securityColumns}
                dataSource={tableDataSource}
            />
        </div>
    );
}
