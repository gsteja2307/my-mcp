import {
  MCPServer
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new MCPServer({
  name: "add-server",
  version: "1.0.0",
})

server.registerTool(
  "add",
  {
    title: "Addition Tool",
    description: "Adds two numbers together",
    inputSchema: z.object({
      a: z.number(),
      b: z.number()
    }),
    outputSchema: z.object({
      content: z.array(z.object({
        type: z.string(),
        text: z.string()
      }))
    })
  },
  async ({ a, b }) => {
    return {
      content: [{
        type: "text",
        text: String(a + b)
      }]
    };
  },
)