import type { EChartsOption } from "echarts";
export interface Grid3DOption {
    boxWidth?: number;
    boxHeight?: number;
    boxDepth?: number;
    viewControl?: {
        projection?: "perspective" | "orthographic";
        autoRotate?: boolean;
        distance?: number;
    };
    light?: {
        main?: {
            intensity?: number;
            shadow?: boolean;
        };
        ambient?: {
            intensity?: number;
        };
    };
}
export interface Axis3DOption {
    type?: "category" | "value" | "time" | "log";
    data?: (string | number)[];
    name?: string;
    min?: number;
    max?: number;
}
export interface Bar3DSeriesOption {
    type: "bar3D";
    data: [number, number, number][] | {
        value: [number, number, number];
    }[];
    shading?: "lambert" | "color" | "realistic";
    label?: object;
    emphasis?: object;
    itemStyle?: object;
}
export interface EChartsGLOption extends Omit<EChartsOption, "series"> {
    xAxis3D?: Axis3DOption;
    yAxis3D?: Axis3DOption;
    zAxis3D?: Axis3DOption;
    grid3D?: Grid3DOption;
    series?: Bar3DSeriesOption[] | EChartsOption["series"];
}
