import dotenv from "dotenv";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

dotenv.config();

const catchAsync =
  (fn) =>
  async (...args) => {
    try {
      return await fn(...args);
    } catch (err) {
      console.log(err);
    }
  };

const ragMain = catchAsync(async () => {
  const llm = new ChatGoogleGenerativeAI({
    model: "gemini-3.5-flash",
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

ragMain();
loadPDF();
