import { fileURLToPath } from "node:url";

import { Chroma } from "@langchain/community/vectorstores/chroma";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

import { collectionName } from "./vectorStore.js";
import { catchAsync } from "../documentLoading.js";
import { QUERY } from "../docs/documentsQuery.js";
import { configDotenv } from "dotenv";

configDotenv();

const MODELS = {
  geminiEmbeddingModel: "gemini-embedding-2",
};

const runLangChainSimilarityWithScores = async () => {
  const vectorStore = await queryVectorStore();
  return await vectorStore.similaritySearchWithScore(QUERY, 3);
};

const queryVectorStore = async () => {
  const embeddingsModel = new GoogleGenerativeAIEmbeddings({
    model: MODELS.geminiEmbeddingModel,
    apiKey: process.env.GEMINI_API_KEY,
  });

  const vectorStore = await Chroma.fromExistingCollection(embeddingsModel, {
    collectionName: collectionName,
    url: "http://localhost:8000",
  });

  return vectorStore;
};

if (process.argv[1] === fileURLToPath(import.meta.url))
  console.log(await runLangChainSimilarityWithScores());
