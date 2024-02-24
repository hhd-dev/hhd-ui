import {
  Menu,
  MenuButton,
  MenuList,
  MenuItemOption,
  Button,
  MenuOptionGroup,
} from "@chakra-ui/react";
import { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import hhdSlice, { selectTagFilter } from "../redux-modules/hhdSlice";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { capitalize } from "lodash";

export const TAG_FILTER_CACHE_KEY = "hhd-ui.tagFilter";

export type TagFilterType = "advanced" | "expert";

export const TagFilters: { [key: string]: TagFilterType } = {
  advanced: "advanced",
  expert: "expert",
};

const LabelMap = {
  advanced: "Simple",
  expert: "Advanced",
};

const TagFilterDropdown: FC = ({}) => {
  const currentTagFilter = useSelector(selectTagFilter);
  const dispatch = useDispatch();

  const onClick = (tagFilter: TagFilterType) => () => {
    return dispatch(hhdSlice.actions.setTagFilter(tagFilter));
  };

  return (
    <Menu>
      <MenuButton
        margin="0 0 0 1rem"
        as={Button}
        rightIcon={<ChevronDownIcon />}
      >
        {LabelMap[currentTagFilter]}
      </MenuButton>
      <MenuList>
        <MenuOptionGroup
          title="Filter"
          type="radio"
          defaultValue={currentTagFilter}
        >
          <MenuItemOption value="advanced" onClick={onClick("advanced")}>
            Simple
          </MenuItemOption>
          <MenuItemOption value="expert" onClick={onClick("expert")}>
            Advanced
          </MenuItemOption>
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  );
};

export default TagFilterDropdown;
