import {
  Box,
  Center,
  Divider,
  Flex,
  FormLabel,
  Select,
  Stack,
} from "@chakra-ui/react";
import { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import hhdSlice, { selectTagFilter } from "../redux-modules/hhdSlice";
import { capitalize } from "lodash";

type DropdownProps = {};

export const TAG_FILTER_CACHE_KEY = "hhd-ui.tagFilter";

export type TagFilterType = "simple" | "advanced" | "expert";

const tagFilters: TagFilterType[] = ["simple", "advanced", "expert"];

export const TagFilters: { [key: string]: TagFilterType } = {
  simple: "simple",
  advanced: "advanced",
  export: "expert",
};

const TagFilterDropdown: FC<DropdownProps> = ({}) => {
  const currentTagFilter = useSelector(selectTagFilter);
  const dispatch = useDispatch();

  return (
    <>
      <Box margin="0 0.5rem" width="12rem">
        <Select
          id={`hhd-tag-filter`}
          onChange={(e) => {
            const newValue = e.target.value as TagFilterType | undefined;

            if (newValue && TagFilters[newValue]) {
              return dispatch(hhdSlice.actions.setTagFilter(newValue));
            }
          }}
          value={currentTagFilter}
        >
          {tagFilters.map((filter, idx: number) => {
            return (
              <option key={idx} value={filter}>
                {capitalize(filter)}
              </option>
            );
          })}
        </Select>
      </Box>
    </>
  );
};

export default TagFilterDropdown;
