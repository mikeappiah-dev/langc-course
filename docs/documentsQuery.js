import { Document } from "@langchain/core/documents";

export const QUERY =
  "Find an edible green plant with a flowering head or a crisp fruit that grows on trees.";

export const DOCUMENTS = [
  {
    id: "item_1",
    document:
      "Apples are crisp fruits that grow on trees and are usually red, green, or yellow.",
    metadata: { type: "fruit", color: "red" },
  },
  {
    id: "item_2",
    document:
      "Bananas are tropical, curved fruits with a thick yellow skin and soft sweet flesh.",
    metadata: { type: "fruit", color: "yellow" },
  },
  {
    id: "item_3",
    document:
      "Broccoli is an edible green plant in the cabbage family with a large flowering head.",
    metadata: { type: "vegetable", color: "green" },
  },
  {
    id: "item_4",
    document:
      "Carrots are sweet, orange root vegetables that are highly nutritious and crunchy.",
    metadata: { type: "vegetable", color: "orange" },
  },
];

export const LANGC_DOCUMENTS = [
  new Document({
    pageContent:
      "Apples are crisp fruits that grow on trees and are usually red, green, or yellow.",
    metadata: { id: "item_1", type: "fruit", color: "red" },
  }),
  new Document({
    pageContent:
      "Bananas are tropical, curved fruits with a thick yellow skin and soft sweet flesh.",
    metadata: { id: "item_2", type: "fruit", color: "yellow" },
  }),
  new Document({
    pageContent:
      "Broccoli is an edible green plant in the cabbage family with a large flowering head.",
    metadata: { id: "item_3", type: "vegetable", color: "green" },
  }),
  new Document({
    pageContent:
      "Carrots are sweet, orange root vegetables that are highly nutritious and crunchy.",
    metadata: { id: "item_4", type: "vegetable", color: "orange" },
  }),
];
