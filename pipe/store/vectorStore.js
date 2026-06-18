import { Chroma } from "@langchain/community/vectorstores/chroma";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

import { fileURLToPath } from "node:url";
import { configDotenv } from "dotenv";

import { catchAsync } from "../../documentLoading.js";
import { loadPdf } from "../documentLoaders/pdfLoader.js";

configDotenv({ path: "../.env" });

export const COLLECTION_NAME = "Test_Collection_v2";

export const URL = "http://localhost:8000";

const MODELS = {
  geminiEmbeddingModel: "gemini-embedding-2",
};

const createVectorStore = catchAsync(async () => {
  const lodedDocs = await loadPdf();

  const recursiveTextSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 600,
    chunkOverlap: 80,
  });

  const documents = await recursiveTextSplitter.splitDocuments(lodedDocs);

  const embeddingsModel = new GoogleGenerativeAIEmbeddings({
    model: MODELS.geminiEmbeddingModel,
    apiKey: process.env.GEMINI_API_KEY,
  });

  const vectorStore = await Chroma.fromDocuments(documents, embeddingsModel, {
    collectionName: COLLECTION_NAME,
    url: URL,
  });

  return vectorStore;
});

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log(await createVectorStore());
}
