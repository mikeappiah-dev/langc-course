import { catchAsync } from "../documentLoading.js";
import { fileURLToPath } from "node:url";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { LANGC_DOCUMENTS } from "../docs/documentsQuery.js";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { configDotenv } from "dotenv";

configDotenv();

export const collectionName = "Vector_Collection";

const MODELS = {
  geminiEmbeddingModel: "gemini-embedding-2",
};

const createVectorStore = catchAsync(async () => {
  const embeddingsModel = new GoogleGenerativeAIEmbeddings({
    model: MODELS.geminiEmbeddingModel,
    apiKey: process.env.GEMINI_API_KEY,
  });

  const vectorstore = await Chroma.fromDocuments(
    LANGC_DOCUMENTS,
    embeddingsModel,
    {
      collectionName: collectionName,
      url: "http://localhost:8000",
    },
  );
});

if (process.argv[1] === fileURLToPath(import.meta.url))
  await createVectorStore();
