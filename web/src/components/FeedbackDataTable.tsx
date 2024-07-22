import { DataTable } from "./DataTable";
import { FeedbackData } from "../hooks";

export function FeedbackDataTable({ data }: { data: FeedbackData }) {
  return (
    <DataTable
      fullWidth
      key={data.length}
      data={data}
      schema={[
        {
          cellRenderer: (row: FeedbackData) => (
            <div className="py-3">
              <div className="mb-2 font-semibold">{row.name}</div>
              <div className="text-sm">{row.description}</div>
            </div>
          ),
          headerName: "Name",
        },
        {
          cellRenderer: (row: FeedbackData) => (
            <div className="py-3">
              <div className="mb-2">{row.importance}</div>
            </div>
          ),
          headerName: "Importance",
        },
        {
          cellRenderer: (row: FeedbackData) => (
            <div className="py-3">
              <div className="mb-2">{row.type}</div>
            </div>
          ),
          headerName: "Type",
        },
        {
          cellRenderer: (row: FeedbackData) => (
            <div className="py-3">
              <div className="mb-2">{row.customer}</div>
            </div>
          ),
          headerName: "Customer",
        },
        {
          cellRenderer: (row: FeedbackData) => (
            <div className="py-3">
              <div className="mb-2">
                {new Date(row.date).toLocaleDateString()}
              </div>
            </div>
          ),
          headerName: "Date",
        },
      ]}
    />
  );
}
