/// <reference types="react" />
/// <reference types="react-dom" />

declare module "react-live" {
  import { ComponentType, ReactNode } from "react";

  export interface LiveProviderProps {
    code?: string;
    scope?: Record<string, unknown>;
    noInline?: boolean;
    transformCode?: (code: string) => string;
    language?: string;
    disabled?: boolean;
    enableTypeScript?: boolean;
    children?: ReactNode;
  }

  export interface LiveEditorProps {
    className?: string;
    style?: React.CSSProperties;
    onChange?: (code: string) => void;
  }

  export interface LivePreviewProps {
    className?: string;
    style?: React.CSSProperties;
    Component?: ComponentType;
  }

  export interface LiveErrorProps {
    className?: string;
    style?: React.CSSProperties;
  }

  export const LiveProvider: ComponentType<LiveProviderProps>;
  export const LiveEditor: ComponentType<LiveEditorProps>;
  export const LivePreview: ComponentType<LivePreviewProps>;
  export const LiveError: ComponentType<LiveErrorProps>;
}
