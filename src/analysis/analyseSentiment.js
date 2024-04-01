import { pipeline, env } from "@xenova/transformers";
env.allowLocalModels = false;

export const analyseSentiment = async (text) => {
  const strippedContent = text.replace(/(<([^>]+)>)/gi, ""); // Remove HTML tags

  try {
    const classifier = await pipeline(
      "sentiment-analysis",
      "Xenova/distilbert-base-uncased-finetuned-sst-2-english"
    );
    const results = await classifier(strippedContent);
    return results.length > 0 ? results[0] : null;
  } catch (error) {
    console.error("Error in sentiment analysis:", error);
    return null;
  }
};

export const interpretSentiment = (label, score) => {
  if (label === "POSITIVE") {
    if (score > 0.9) return "Very Positive";
    if (score > 0.5) return "Positive";
    return "Somewhat Positive"; // Neutral
  } else if (label === "NEGATIVE") {
    if (score > 0.9) return "Very Negative";
    if (score > 0.5) return "Negative";
    return "Somewhat Negative"; // Neutral
  }
  return "Neutral"; // Default case
};
