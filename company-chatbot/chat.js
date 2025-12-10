import readline from "node:readline/promises";
import Groq from "groq-sdk";
import { read } from "node:fs";
import { vectorStore } from "./prepare.js";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function chat() {

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });


  while (true) {
        const question = await rl.question("Ask your question: ");
        if(question==="exit"){
            break;
        }

        // retrieval
        const relevantChunks = await vectorStore.similaritySearch(question,3)
        const context = relevantChunks.map((chunk=>chunk.pageContent)).join("\n\n");
        const SYSTEM_PROMPT = `You are an AI assistant helping employees of a company. Use the following context to answer the question.
        If you don't know the answer, just say that you don't know. Do not try to make up an answer.
        Context: ${context}
        `;
        // console.log(context);

        const userQuery = ` Question: ${question}
                             Relevant  context: ${context}
                            Answer: `


        const chatCompletion = await groq.chat.completions.create({
        messages: [
            {
            role: "system",
            content: SYSTEM_PROMPT,
            },
            {
            role: "user",
            content: `${question}`,
            },
        ],
        model: "openai/gpt-oss-20b",
        });
        console.log("Assistant : ",chatCompletion.choices[0]?.message?.content);
  }
  rl.close();
}


chat();