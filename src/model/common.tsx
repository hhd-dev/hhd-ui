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
  section: string;
}

export interface ContainerProps extends SettingProps {
  settings: ContainerSetting;
}

export interface ModeProps extends SettingProps {
  settings: ModeSetting;
}

export type Sections = Record<string, Record<string, ContainerSetting>>;

export interface State {
  [property: string]: State;
}

export function getSettingChain(settings: Sections, path: string) {
  const idx1 = path.indexOf(".");
  if (idx1 === -1) return [];
  const section = path.substring(0, idx1);
  const idx2 = path.indexOf(".", idx1 + 1);
  const name = path.substring(idx1 + 1, idx2 !== -1 ? idx2 : undefined);
  if (!name) return [];
  const other = idx2 !== -1 ? path.substring(idx2 + 1) : null;

  const set = settings[section][name];
  if (!other) return [set];

  return [set, ...traverseSetting(set, other)];
}

export function getSetting(settings: Sections, path: string) {
  const s = getSettingChain(settings, path);
  return s && s.length ? s[s.length - 1] : null;
}

function traverseSetting(
  setting: ContainerSetting | ModeSetting,
  path: string
): Setting[] {
  if (!path) return [setting];
  const idx = path.indexOf(".");

  const name = path.substring(0, idx !== -1 ? idx : undefined);
  const next = idx !== -1 ? path.substring(idx + 1) : null;

  let child;
  if (setting.type === "container") {
    child = setting.children[name];
  } else if (setting.type === "mode") {
    child = setting.modes[name];
  } else {
    return [];
  }

  if (!next) return [child];

  return [
    child,
    ...traverseSetting(child as ContainerSetting | ModeSetting, next),
  ];
}
