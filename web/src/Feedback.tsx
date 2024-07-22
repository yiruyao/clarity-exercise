import { FeedbackDataTable } from "./components/FeedbackDataTable";
import { useFeedbackQuery } from "./hooks";
import {FilterItemsMap} from "./components/FilterDropdown.tsx";
import { validateFilter } from '../../shared/utils';

type Props = {
  filters: FilterItemsMap;
};

export function Feedback({filters}: Props) {
  const validatedFilters = Object.fromEntries(
      Object.entries(filters).filter(([key, item]) => validateFilter(item)))


  const { data, error, isLoading } = useFeedbackQuery({ filters: validatedFilters });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return <div>No data available</div>;
  }
  return <FeedbackDataTable data={data.data} />;
}
