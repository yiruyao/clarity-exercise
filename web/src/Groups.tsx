import { GroupsDataTable } from "./components/GroupsDataTable";
import { useGroupsQuery } from "./hooks";
import {validateFilter} from "../../shared/utils.ts";
import {FilterItemsMap} from "./components/FilterDropdown.tsx";

type Props = {
  filters?: FilterItemsMap;
};

export function Groups({ filters }: Props) {
  const validatedFilters = Object.fromEntries(
      Object.entries(filters).filter(([key, item]) => item !== undefined && validateFilter(item)))

  const {data, error, isLoading, isLoadingError} = useGroupsQuery({
    _: "Update this object to pass data to the /groups endpoint.",
    validatedFilters,
  });

  if (isLoading || !data) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return <GroupsDataTable data={data.data} />;
}
