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

export const TAG_FILTER_CACHE_KEY = "hhd-ui.tagFilter";

export type TagFilterType = "simple" | "advanced" | "expert";

export const TagFilters: { [key: string]: TagFilterType } = {
  simple: "simple",
  advanced: "advanced",
  expert: "expert",
};

const TagFilterDropdown: FC = ({}) => {
  const currentTagFilter = useSelector(selectTagFilter);
  const dispatch = useDispatch();

  const onClick = (tagFilter: TagFilterType) => () => {
    return dispatch(hhdSlice.actions.setTagFilter(tagFilter));
  };

  return (
    <Menu>
      <MenuButton as={Button} width={"5rem"} rightIcon={<ChevronDownIcon />}>
        Filter
      </MenuButton>
      <MenuList>
        <MenuOptionGroup
          title="Filter"
          type="radio"
          defaultValue={currentTagFilter}
        >
          <MenuItemOption value="simple" onClick={onClick("simple")}>
            Simple
          </MenuItemOption>
          <MenuItemOption value="advanced" onClick={onClick("advanced")}>
            Advanced
          </MenuItemOption>
          <MenuItemOption value="expert" onClick={onClick("expert")}>
            Expert
          </MenuItemOption>
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  );
};

export default TagFilterDropdown;
