import { Chroma } from "@langchain/community/vectorstores/chroma";
import {
  GoogleGenerativeAIEmbeddings,
  ChatGoogleGenerativeAI,
} from "@langchain/google-genai";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import {
  RunnableSequence,
  RunnablePassthrough,
} from "@langchain/core/runnables";

import { fileURLToPath } from "node:url";
import { configDotenv } from "dotenv";
import { COLLECTION_NAME, URL } from "./store/vectorStore.js";
import { catchAsync } from "../documentLoading.js";
import { StringOutputParser } from "@langchain/core/output_parsers";

configDotenv({ path: "./.env" });

const MODELS = {
  geminiChatModel: "gemini-3.5-flash",
  geminiEmbeddingModel: "gemini-embedding-2",
  metaLlama: "nousresearch/hermes-3-llama-3.1-405b:free",
};

const embeddingsModel = new GoogleGenerativeAIEmbeddings({
  model: MODELS.geminiEmbeddingModel,
  apiKey: process.env.GEMINI_API_KEY,
});

const llm = new ChatGoogleGenerativeAI({
  model: MODELS.geminiChatModel,
  apiKey: process.env.GEMINI_API_KEY,
  temperature: 0,
  // configuration: {
  //   baseURL: "https://openrouter.ai/api/v1",
  // },
});

const formatRetrivedDocs = (docs) => {
  return docs
    .map((doc) => {
      return doc.pageContent;
    })
    .join("\n\n");
};

export const createRagChain = catchAsync(async () => {
  const retriever = (
    await Chroma.fromExistingCollection(embeddingsModel, {
      collectionName: COLLECTION_NAME,
      url: URL,
    })
  ).asRetriever({ k: 3 });

  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      `You are a helpful and empathetic Customer Support Assistant. Your only job is to answer the user's questions based strictly on the provided company policy documents.

Guidelines:
1. **Be Grounded:** Answer ONLY using the facts and policies provided in the retrieved context. Do not use your own pre-trained knowledge, and never guess or make things up.
2. **Be Concise & Clear:** Keep your answers brief, easy to read, and free of corporate jargon.
3. **Be Empathetic:** Acknowledge the user's situation politely before providing policy information. 
4. **Fallback:** If the answer cannot be found in the provided context, say exactly: "I cannot find that information in our current policies. Please contact our support team at [Insert Email/Phone] for further assistance."

When sharing a policy, try to reference it naturally or provide the specific detail requested.

<policy_context>
{context}
</policy_context>`,
    ],
    ["human", "{question}"],
  ]);

  const chain = RunnableSequence.from([
    {
      context: retriever.pipe(formatRetrivedDocs),
      question: new RunnablePassthrough(),
    },
    prompt,
    llm,
    new StringOutputParser(),
  ]);
  return chain;
});

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const chain = await createRagChain();
  const response = await chain.invoke(
    "What is the main topic of the document?",
  );
  console.log(response);
}
