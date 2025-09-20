import {
  McpServer
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "add-server",
  version: "1.0.0",
})
//register a new tool called subraction
server.registerTool(
  "add",
  {
    title: "Addition Tool",
    description: "Adds two numbers together",
    // inputSchema: z.object({
    //   a: z.number(),
    //   b: z.number()
    // }),
    inputSchema: {
      a: z.number(),
      b: z.number()
    },
    // outputSchema: z.object({
    //   content: z.array(z.object({
    //     type: z.string(),
    //     text: z.string()
    //   }))
    // })
  },
  async ({ a, b }) => {
    return {
      content: [{
        type: "text",
        text: String(a + b)
      }]
    };
  },
);

const transport = new StdioServerTransport();

await server.connect(transport);