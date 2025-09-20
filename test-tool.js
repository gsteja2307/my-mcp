#!/usr/bin/env node

/**
 * Test script for MCP tools
 * Usage: node test-tool.js <command> [tool-name]
 *
 * This script sends JSON-RPC requests to test MCP server tools.
 * Examples:
 *   node test-tool.js list         # Lists all available tools
 *   node test-tool.js list add     # Describes the 'add' tool specifically
 *   node test-tool.js initialize   # Sends initialize request (future feature) **  TODO
 */

import { spawn } from 'child_process';

const command = process.argv[2];
const toolName = process.argv[3];

if (!command) {
  console.error('Usage: node test-tool.js <command> [tool-name]');
  console.error('Commands:');
  console.error('  list         - List all tools');
  console.error('  list <tool>  - Describe specific tool');
  console.error('  initialize   - Initialize server (future)');
  process.exit(1);
}

let request;

if (command === 'list') {
  if (toolName) {
    // List specific tool
    request = JSON.stringify({
      "jsonrpc": "2.0",
      "id": 1,
      "method": "tools/list",
      "params": {
        "name": toolName,
        "arguments": {}
      }
    });
    console.log(`Describing MCP tool: ${toolName}`);
  } else {
    // List all tools
    request = JSON.stringify({
      "jsonrpc": "2.0",
      "id": 1,
      "method": "tools/list",
      "params": {}
    });
    console.log('Listing all available MCP tools');
  }
} else if (command === 'initialize') {
  request = JSON.stringify({
    "jsonrpc": "2.0",
    "id": 1,
    "method": "initialize",
    "params": {
      "protocolVersion": "2024-11-05",
      "capabilities": {},
      "clientInfo": {
        "name": "test-client",
        "version": "1.0.0"
      }
    }
  });
  console.log('Initializing MCP server');
} else {
  console.error(`Unknown command: ${command}`);
  process.exit(1);
}

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