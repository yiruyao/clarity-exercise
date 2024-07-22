import { openai } from "../config/openaiConfig";
import {Feedback, FeedbackGroup} from "../../shared/types";

export type FeedbackIdsGroup = {
    name: string;
    description: string;
    feedbackIds: number[];
};

const instructions = "Group the following feedback based on the description " +
    "and return the IDs of the feedbacks in each group and a summary of each group." +
    "The response should be in JSON format as an array of FeedbackGroup objects with properties name, description, and feedbackIds:\\n\n";
export const groupFeedback = async (feedbackList: Feedback[]): Promise<FeedbackGroup[]> => {
    try {
        const prompt = `${instructions}\n${feedbackList.map(fb => `ID: ${fb.id}, Description: ${fb.description}`).join('\n')}`;
        const response = await openai.chat.completions.create({
            messages: [{role: "user", content: prompt}],
            model: "gpt-4o-mini",
        });
        const responseContent = response.choices[0].message.content;
        // Parse response into FeedbackGroups
        // Remove the first and last lines
        const cleanedResponse = responseContent.split('\n').slice(1, -1).join('\n').trim();
        const feedbackIdsGroups: FeedbackIdsGroup[] = JSON.parse(cleanedResponse);
        return feedbackIdsGroups.map(feedbackIds =>
            ({
                name: feedbackIds.name,
                description: feedbackIds.description,
                feedback:  feedbackIds.feedbackIds.map(id => feedbackList.find(feedback => feedback.id === id)).filter(Boolean) as Feedback[],
            })
        )

    } catch (error) {
        console.error('Error grouping feedback:', error);
        return []
    }
};