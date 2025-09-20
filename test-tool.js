#!/usr/bin/env node

/**
 * Test script for MCP tools
 * Usage: node test-tool.js <tool-name> [additional-params]
 *
 * This script sends JSON-RPC requests to test MCP server tools.
 * Examples:
 *   node test-tool.js add          # Lists the 'add' tool
 *   node test-tool.js subtract     # Lists the 'subtract' tool
 *   node test-tool.js list         # Lists all available tools
 */

import { spawn } from 'child_process';

const toolName = process.argv[2];

if (!toolName) {
  console.error('Usage: node test-tool.js <tool-name>');
  console.error('Example: node test-tool.js add');
  process.exit(1);
}

// Create the JSON-RPC request
const request = JSON.stringify({
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/list",
  "params": {
    "name": toolName,
    "arguments": {}
  }
});

console.log(`Testing MCP tool: ${toolName}`);
console.log(`Sending request: ${request}`);
console.log('---');

// Spawn the MCP server process
const mcpProcess = spawn('node', ['mcp.js'], {
  stdio: ['pipe', 'pipe', 'pipe']
});

// Send the request
mcpProcess.stdin.write(request + '\n');
mcpProcess.stdin.end();

// Handle response
mcpProcess.stdout.on('data', (data) => {
  const response = data.toString().trim();
  try {
    const parsed = JSON.parse(response);
    console.log('Response:');
    console.log(JSON.stringify(parsed, null, 2));
  } catch (error) {
    console.log('Raw response:');
    console.log(response);
  }
});

mcpProcess.stderr.on('data', (data) => {
  console.error('Error:', data.toString());
});

mcpProcess.on('close', (code) => {
  if (code !== 0) {
    console.error(`Process exited with code ${code}`);
  }
});