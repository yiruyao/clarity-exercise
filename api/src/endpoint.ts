import bodyParser from "body-parser";
import express, { Request, Response } from "express";
import json from "./data.json";
import {FilterItemsMap, FilterType, Operator} from '../../shared/types';
import {validateFilter} from "../../shared/utils";

type Feedback = {
  id: number;
  name: string;
  description: string;
  importance: "High" | "Medium" | "Low";
  type: "Sales" | "Customer" | "Research";
  customer: "Loom" | "Ramp" | "Brex" | "Vanta" | "Notion" | "Linear" | "OpenAI";
  date: string;
};

type FeedbackData = Feedback[];

export const router = express.Router();
router.use(bodyParser.json());

router.post("/query", queryHandler);
router.post("/groups", groupHandler);

const feedback: FeedbackData = json as any;

function queryHandler(req: Request, res: Response<{ data: FeedbackData }>) {
  const { query } = req.body as {query: {filters: FilterItemsMap}}
  /**
   * TODO(part-1): Implement query handling
   */

  let filteredFeedback = feedback

  if (Object.entries(query.filters).length > 0) {
    // Build a list of predicates based on the filters
    const predicates: ((item: typeof feedback[0]) => boolean)[] = [];

    Object.values(query.filters).forEach(filterItem => {
      if (validateFilter(filterItem)) {
        const field = filterItem.type === FilterType.KEYWORD ?
            'description' : filterItem.type.toString()
        const values = (filterItem.input.values ?? []).map(s => s.toLowerCase())

          if (isFeedbackKey(field)) {
            console.log("values are: ", values)
            console.log("field is: ", field)
            switch (filterItem.operators.value) {
              case Operator.IS:
                predicates.push(item => isString(item[field]) && values.includes((item[field] as string).toLowerCase()));
                break;
              case Operator.ISNOT:
                predicates.push(item => isString(item[field]) && !values.includes((item[field] as string).toLowerCase()));
                break;
              case Operator.CONTAINS:
                predicates.push(item => isString(item[field]) && values.some(keyword => (item[field] as string).toLowerCase().includes(keyword)));
                break;
              case Operator.NOTCONTAINS:
                predicates.push(item => isString(item[field]) && values.every(keyword => !(item[field] as string).toLowerCase().includes(keyword)));
                break;
              case Operator.AFTER:
                // assuming date comparison with the first value for now
                predicates.push(item => new Date(item[field]) > new Date(values[0]));
                break;
              case Operator.BEFORE:
                // assuming date comparison with the first value for now
                predicates.push(item => new Date(item[field]) < new Date(values[0]));
                break;
              default:
                break;
            }
          }
      } else {
        console.log("invalid filter:", filterItem)
      }
    });

    // Apply the predicates to filter the data
    filteredFeedback = feedback.filter(item => predicates.every(predicate => predicate(item)));
    // filteredFeedback = feedback.filter(item => isString(item['importance']) && ['high', 'medium'].includes(item[field] as string));
  }
  res.status(200).json({ data: filteredFeedback });
}

// Type guard to check if a key is a valid keyof Feedback
function isFeedbackKey(key: string): key is keyof Feedback {
  return ['id', 'name', 'description', 'importance', 'type', 'customer', 'date'].includes(key);
}

function isString(value: any): value is string {
  return typeof value === 'string';
}

type FeedbackGroup = {
  name: string;
  feedback: Feedback[];
};

async function groupHandler(
  req: Request,
  res: Response<{ data: FeedbackGroup[] }>
) {
  const body = req;

  /**
   * TODO(part-2): Implement filtering + grouping
   */

  const pythonRes = await fetch("http://127.0.0.1:8000/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ feedback }),
  });

  const pythonData = (await pythonRes.json()) as { feedback: Feedback[] };

  res.status(200).json({
    data: [
      {
        name: "All feedback",
        feedback: pythonData.feedback,
      },
    ],
  });
}
