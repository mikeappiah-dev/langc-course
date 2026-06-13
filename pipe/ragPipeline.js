import { Chroma } from "@langchain/community/vectorstores/chroma";
import {
  GoogleGenerativeAIEmbeddings,
  ChatGoogleGenerativeAI,
} from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

import { fileURLToPath } from "node:url";
import { configDotenv } from "dotenv";
import { COLLECTION_NAME, URL } from "./store/vectorStore.js";
import { catchAsync } from "../documentLoading.js";

configDotenv({ path: "./.env" });

const MODELS = {
  geminiChatModel: "gemini-3.5-flash",
  geminiEmbeddingModel: "gemini-embedding-2",
};

const QUERY = "I paid with MTN MoMo, how many days will my refund take?";

const main = catchAsync(async () => {
  const embeddingsModel = new GoogleGenerativeAIEmbeddings({
    model: MODELS.geminiEmbeddingModel,
    apiKey: process.env.GEMINI_API_KEY,
  });

  const llm = new ChatGoogleGenerativeAI({
    model: MODELS.geminiChatModel,
    apiKey: process.env.GEMINI_API_KEY,
    temperature: 0,
  });

  const vectorStore = await Chroma.fromExistingCollection(embeddingsModel, {
    collectionName: COLLECTION_NAME,
    url: URL,
  });

  // * will substitute for a rag chain later
  const context = JSON.stringify(
    (await vectorStore.similaritySearchWithScore(QUERY, 4))[0],
  );

  const prompt = `Answer the question based only on the context provided.
  
Context:
${context}

Question:
${QUERY}`;

  const response = await llm.invoke(prompt);

  console.log(response.text);
  // **/
});

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
