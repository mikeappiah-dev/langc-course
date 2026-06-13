import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

import { fileURLToPath } from "node:url";
import { catchAsync } from "../../documentLoading.js";

export const loadPdf = catchAsync(async () => {
  const loader = new PDFLoader("./docs/shopnova_store_policy.pdf");

  const documents = await loader.load();

  return documents.map((doc) => {
    return { ...doc, metadata: { source: doc.metadata.source } };
  });
});

if (process.argv[1] === fileURLToPath(import.meta.url))
  console.log(await loadPdf());
