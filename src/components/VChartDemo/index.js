import React from "react";
// import { isMobile } from "react-device-detect";
import { charts } from "./data/index";
import { VChart } from "@visactor/react-vchart";
import { initVChartSemiTheme } from '@visactor/vchart-semi-theme';

typeof window !== 'undefined' && initVChartSemiTheme();

const chartHeight = 400;

const Charts = () => {
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', columnGap: 30, rowGap: 30, padding: '30px 0 30px 30px', height: 900, overflow: 'auto' }}>
            {charts.map((chart, i) => {
                return (
                    <div
                        key={i}
                        className="card"
                        style={{
                            width: 'calc(50% - 30px)',
                            display: "inline-block",
                            boxSizing: "border-box"
                        }}
                    >
                        <div
                            className="chartContainer"
                            style={{ outline: `1px solid #404349` }}
                        >
                            <VChart
                                spec={{
                                    height: chartHeight,
                                    ...chart.spec,
                                }}
                                option={{
                                    ...chart.option,
                                    // mode: isMobile ? "mobile-browser" : "desktop-browser",
                                    mode: "desktop-browser",
                                    onError: null,
                                    logLevel: 5,
                                }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>

    );
};

export default Charts;
