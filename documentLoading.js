import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import {
  ChatGoogleGenerativeAI,
  GoogleGenerativeAIEmbeddings,
} from "@langchain/google-genai";

dotenv.config();

const MODELS = {
  geminiChatModel: "gemini-3.5-flash",
  geminiEmbeddingModel: "gemini-embedding-2",
};

export const catchAsync =
  (fn) =>
  async (...args) => {
    try {
      return await fn(...args);
    } catch (err) {
      console.log(err);
    }
  };

const ragMain = catchAsync(async () => {
  loadPDF();

  const llm = new ChatGoogleGenerativeAI({
    model: MODELS.geminiChatModel,
    apiKey: process.env.GEMINI_API_KEY,
    temperature: 0,
  });

  const response = await llm.invoke("Say 'setup complete!' in one word");
  console.log(response.text);
});

// DOCUMENT LOADERS \\

const loadCSV = catchAsync(async () => {
  const loader = new CSVLoader("docs/csv.csv");
  const documents = await loader.load();
  console.log(`${documents.length} documents retrieved.\n`);
  console.log(documents);
});

const loadPDF = catchAsync(async () => {
  const loader = new PDFLoader("docs/pdf.pdf");
  const documents = await loader.load();
  console.log(documents);
});

if (process.argv[1] === fileURLToPath(import.meta.url)) ragMain();
