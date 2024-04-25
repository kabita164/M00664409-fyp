import { pipeline, env } from "@xenova/transformers";
env.allowLocalModels = false;

export const analyseSentiment = async (text) => {
  const strippedContent = text.replace(/(<([^>]+)>)/gi, ""); // Remove HTML tags

  try {
    const classifier = await pipeline(
      "sentiment-analysis",
      "Xenova/distilbert-base-multilingual-cased-sentiments-student"
    );
    const results = await classifier(strippedContent);
    return results.length > 0 ? results[0] : null;
    // result example: { label: 'NEGATIVE', score: 0.9999 } }
  } catch (error) {
    console.error("Error in sentiment analysis:", error);
    return null;
  }
};

export const interpretSentiment = (sentiment) => {
  const POSITIVE_THRESHOLD = 0.5;
  const VERY_POSITIVE_THRESHOLD = 0.8;
  const NEGATIVE_THRESHOLD = 0.5;
  const VERY_NEGATIVE_THRESHOLD = 0.8;

  const { label, score } = sentiment;

  if (label.toLowerCase() === "positive") {
    if (score > VERY_POSITIVE_THRESHOLD) {
      return { moodScore: 5, label: "Very Positive", icon: "fa-face-smile-beam", color: "#4caf50" };
    } else if (score > POSITIVE_THRESHOLD) {
      return { moodScore: 4, label: "Positive", icon: "fa-smile", color: "#8bc34a" };
    }
  } else if (label.toLowerCase() === "negative") {
    if (score > VERY_NEGATIVE_THRESHOLD) {
      return { moodScore: 1, label: "Very Negative", icon: "fa-face-tired", color: "#f44336" };
    } else if (score > NEGATIVE_THRESHOLD) {
      return { moodScore: 2, label: "Negative", icon: "fa-face-frown-open", color: "#ff9800" };
    }
  }

  // Neutral as default
  return { moodScore: 3, label: "Neutral", icon: "fa-face-meh", color: "#9e9e9e" };
};




