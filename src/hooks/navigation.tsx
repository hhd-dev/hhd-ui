import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import hhdSlice, { selectSettings, selectState } from "../model/slice";
import { AppDispatch, RootState } from "../model/store";
import {
  ContainerSetting,
  ModeSetting,
  Sections,
  Setting,
  State,
} from "../model/common";
import { useShouldRenderChild } from "./conditionalRender";

export const useSectionNav = (section: string, choices: string[]) => {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(hhdSlice.actions.goSet({ section, choices }));
  }, [JSON.stringify(choices)]);

  const curr = useSelector(
    (state: RootState) => state.hhd.navigation.curr[section]
  );
  const setCurr = (curr: string) => {
    dispatch(hhdSlice.actions.goto({ section, curr }));
  };

  return { curr, setCurr };
};

export const useElementNav = (section: string, path: string) => {
  const dispatch = useDispatch<AppDispatch>();

  const focus = useSelector(
    (state: RootState) => state.hhd.navigation.curr[section] === path
  );
  const setFocus = () => {
    dispatch(hhdSlice.actions.goto({ section, curr: path }));
  };
  return { focus, setFocus };
};

export function useRootNav(section: string | null) {
  let set = useSelector(selectSettings);
  let state = useSelector(selectState);

  const qam = !section || section === "qam";
  const shouldRender = useShouldRenderChild(qam);
  const dispatch = useDispatch<AppDispatch>();

  if (section && section !== "qam") {
    const new_set: Sections = {};
    new_set[section] = set[section];
    set = new_set;
  }

  const choices = getSectionElements(set, state, shouldRender);
  useEffect(() => {
    dispatch(hhdSlice.actions.goSet({ section: section || "qam", choices }));
  }, [section, JSON.stringify(choices)]);
}

function getSectionElements(
  set: Sections,
  state: State,
  shouldRender: (s: Setting) => boolean
) {
  let out = [];
  for (const [section, cs] of Object.entries(set)) {
    for (const [name, v] of Object.entries(cs).filter(
      (c) => c[1].type === "container"
    )) {
      out.push(
        ...getFocusElements(
          v,
          state[section][name],
          `${section}.${name}`,
          shouldRender
        )
      );
    }
  }
  return out;
}

function getFocusElements(
  set: Setting,
  state: State,
  path: string,
  shouldRender: (s: Setting) => boolean
) {
  if (!shouldRender(set)) return [];

  const type = set.type;

  let out: string[] = [];
  switch (type) {
    case "bool":
    case "multiple":
    case "discrete":
    case "int":
    case "float":
    case "action":
      return [path];
    case "container":
      for (const [k, v] of Object.entries((set as ContainerSetting).children)) {
        out.push(
          ...getFocusElements(v, state[k], `${path}.${k}`, shouldRender)
        );
      }
      return out;
    case "mode":
      out = [path];
      const mode = state["mode"] as unknown as string;
      const data = (set as ModeSetting).modes[mode];
      if (data) {
        out.push(
          ...getFocusElements(
            data,
            state[mode],
            `${path}.${mode}`,
            shouldRender
          )
        );
      }
      return out;
  }

  return [];
}
