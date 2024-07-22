import bodyParser from "body-parser";
import express, { Request, Response } from "express";
import json from "./data.json";
import {Feedback, FeedbackData, FeedbackGroup, FilterItemsMap, FilterType, Operator} from '../../shared/types';
import {validateFilter} from "../../shared/utils";
import {groupFeedback} from "~/openaiService";

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
  res.status(200).json({ data: filterFeedback(query.filters) });
}

// Type guard to check if a key is a valid keyof Feedback
function isFeedbackKey(key: string): key is keyof Feedback {
  return ['id', 'name', 'description', 'importance', 'type', 'customer', 'date'].includes(key);
}

function isString(value: any): value is string {
  return typeof value === 'string';
}

async function groupHandler(
  req: Request,
  res: Response<{ data: FeedbackGroup[] }>
) {
  const { query } = req.body as {query: {filters: FilterItemsMap}}
  const filteredFeedback = filterFeedback(query.filters)
  /**
   * TODO(part-2): Implement filtering + grouping
   */

  // const pythonRes = await fetch("http://127.0.0.1:8000/", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     Accept: "application/json",
  //   },
  //   body: JSON.stringify({ feedback }),
  // });
  //
  // const pythonData = (await pythonRes.json()) as { feedback: Feedback[] };

  const aiGroups = await groupFeedback(filteredFeedback);

  res.status(200).json({
    data: aiGroups,
  });
}

function filterFeedback(filters: FilterItemsMap): FeedbackData {
  let filteredFeedback = feedback
  console.log("filters are ", filters)
  if (filters !== undefined && Object.entries(filters).length > 0) {
    // Build a list of predicates based on the filters
    const predicates: ((item: typeof feedback[0]) => boolean)[] = [];

    Object.values(filters).forEach(filterItem => {
      if (validateFilter(filterItem)) {
        const field = filterItem.type === FilterType.KEYWORD ?
            'description' : filterItem.type.toString()
        const values = (filterItem.input.values ?? []).map(s => s.toLowerCase())

        if (isFeedbackKey(field)) {
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
    return filteredFeedback
  }
  return feedback
}
