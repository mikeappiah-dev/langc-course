import { ChromaClient } from "chromadb";
import { catchAsync } from "./documentLoading.js";
import { fileURLToPath } from "node:url";
import { fileURLToPath } from "node:url";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { QUERY, DOCUMENTS } from "./docs/documentsQuery.js";

const runChroma = catchAsync(async () => {
  const client = new ChromaClient({ port: 8000 });
  const collection = await client.getOrCreateCollection({
    name: "testCollection",
  });

  await uploadDocuments(collection);
  return await collection.query({ queryTexts: [QUERY], nResults: 2 });
});

const uploadDocuments = async (collection) =>
  await collection.upsert({
    ids: DOCUMENTS.map((doc) => doc.id),
    documents: DOCUMENTS.map((doc) => doc.document),
    metadatas: DOCUMENTS.map((doc) => doc.metadata),
  });

if (process.argv[1] === fileURLToPath(import.meta.url))
  console.log(await runChroma());
