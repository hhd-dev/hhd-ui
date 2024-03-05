export interface Setting {
  type: string;
  tags: string[];
  title: string;
  hint: string | undefined;
}

export interface BoolSetting extends Setting {
  type: "bool";
  default: boolean;
}

export interface DiscreteSetting extends Setting {
  type: "float" | "int";
  options: number[];
  default: number | undefined;
}

export interface MultipleSetting extends Setting {
  type: "multiple";
  options: Record<string, string>;
  default: string | undefined;
}

export interface NumberSetting<A, T extends string> extends Setting {
  type: T;
  unit: string | undefined;
  min: A | undefined;
  max: A | undefined;
  step: A | undefined;
  default: A | undefined;
}

export interface ContainerSetting extends Setting {
  type: "container";
  children: Record<string, Setting>;
}

export interface ModeSetting extends Setting {
  type: "mode";
  modes: Record<string, ContainerSetting>;
  default: string | undefined;
}

export interface SettingProps {
  settings: Setting;
  path: string;
}

export interface ContainerProps extends SettingProps {
  settings: ContainerSetting;
  qam: boolean;
}

export interface ModeProps extends SettingProps {
  settings: ModeSetting;
  qam: boolean;
}

export type Sections = Record<string, Record<string, ContainerSetting>>;

export interface State {
  [property: string]: State;
}
