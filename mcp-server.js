import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import fs from "fs";

const server = new Server(
  {
    name: "playwright-js-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// ✅ LIST TOOLS (Correct Way)
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "create_test",
        description: "Create a Playwright JS test file",
        inputSchema: {
          type: "object",
          properties: {
            filename: { type: "string" },
            testName: { type: "string" },
            url: { type: "string" },
          },
          required: ["filename", "testName", "url"],
        },
      },
    ],
  };
});

// ✅ CALL TOOL (Correct Way)
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "create_test") {
    const { filename, testName, url } = request.params.arguments;

    const content = `
import { test, expect } from '@playwright/test';

test('${testName}', async ({ page }) => {
  await page.goto('${url}');
  await expect(page).toHaveTitle(/./);
});
`;

    fs.writeFileSync(`tests/${filename}`, content);

    return {
      content: [
        {
          type: "text",
          text: "Playwright test created successfully.",
        },
      ],
    };
  }

  return {
    content: [{ type: "text", text: "Unknown tool" }],
  };
});

await server.connect(new StdioServerTransport());
