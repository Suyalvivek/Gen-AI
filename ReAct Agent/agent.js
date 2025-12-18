import { writeFileSync } from "node:fs";
import readline from "node:readline/promises";
import { ChatGroq } from "@langchain/groq";
import { createAgent, tool } from "langchain";
import { TavilySearch } from "@langchain/tavily";
import { MemorySaver } from "@langchain/langgraph";

import { z } from "zod";


async function runAgent() {
  const search = new TavilySearch({
    maxResults: 1,
  });
  const model = new ChatGroq({
    model: "openai/gpt-oss-120b",
  });
  const calendarEvents = tool(
    async ({ query }) => {
      return JSON.stringify([
        {
          title: "Team Meeting",
          date: "2024-06-15",
          time: "10:00 AM",
        },
      ]);
    },
    {
      name: "get-calendar-events",
      description: "Call this tool to get calendar events.",
      schema: z.object({
        query: z.string().describe("The search query for calendar events."),
      }),
    }
  );
  const checkPointer = new MemorySaver();


  const agent = createAgent({
    model: model,
    tools: [search, calendarEvents],
    checkpointer: checkPointer,
    // systemPrompt: `You are a helpful assistant.`,
  });



  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });


  while (true) {
    const userQuery = await rl.question("User: ");
    if (userQuery === "/bye") {
      break;
    }
      const result = await agent.invoke({
    messages: [
      {
        role: "system",
        content: `You are an AI assistant that helps people find information. You have access to the following tools:

1. Tavily Search: Useful for when you need to look up current information on the web.

2. get-calendar-events: Useful for when you need to find calendar events based on a query.

Use the tools as needed to answer the user's questions accurately.`,
      },
      {
        role: "user",
        content: `${userQuery}`,
      },
      
    ],
  },
  {
    configurable:{thread_id:1}
  }
);
  console.log(
    "LLM Response:",
    result.messages[result.messages.length - 1].content
  );

  }


  //draw graph  state
//   const drawableGraphGraphState = await agent.getGraphAsync();
//   const graphStateImage = await drawableGraphGraphState.drawMermaidPng();
//   const graphStateArrayBuffer = await graphStateImage.arrayBuffer();

//   const filePath = "./graphState.png";

//   writeFileSync(filePath, new Uint8Array(graphStateArrayBuffer));
  rl.close();

}
runAgent();
