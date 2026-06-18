import readline from "node:readline";
import { fileURLToPath } from "node:url";

import { createRagChain } from "./ragChain.js";
import { catchAsync } from "../documentLoading.js";

const terminalChatInit = catchAsync(async () => {
  const chain = await createRagChain();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const endChat = () => {
    console.log("\nGoodbye!");
    rl.close();
  };

  const processTerminalQueries = () => {
    rl.question("\x1b[32mYou:\x1b[0m ", async (input) => {
      const trimmedInput = input.trim();

      if (trimmedInput.toLowerCase() === "exit") {
        endChat();
        return;
      }

      if (!trimmedInput) {
        processTerminalQueries();
        return;
      }

      process.stdout.write("\x1b[33mBot:\x1b[0m ");

      try {
        const stream = await chain.stream(trimmedInput);

        for await (const chunk of stream) {
          process.stdout.write(chunk);
        }

        console.log("\n");
      } catch (error) {
        console.error(`\nStream Error: ${error.message}\n`);
      }

      processTerminalQueries();
    });
  };
  processTerminalQueries();
});

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  terminalChatInit();
}
