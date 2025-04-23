// import express from "express";
// import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
// import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
// import { z as Zod } from "zod";  

// const server = new McpServer({
//   name: "example-server",
//   version: "1.0.0"
// });

// // ... set up server resources, tools, and prompts ...

// const app = express();

// server.tool("addTwoNumbers",
//   "Add Two Numbers",
//   {
//     a:Zod.number(),
//     b:Zod.number()

//   },
//   async {arg} => {
//     const { a,b } = arg;
//     return [
//       {
//         type: "text"
//         text: `The sum of ${a} and ${b} is ${a+b}`
//       }
//     ]
//   }
// );

// const transports= {};

// app.get("/sse", async (req , res ) => {
//   const transport = new SSEServerTransport('/messages', res);
//   transports[transport.sessionId] = transport;
//   res.on("close", () => {
//     delete transports[transport.sessionId];
//   });
//   await server.connect(transport);
// });

// app.post("/messages", async (req , res ) => {
//   const sessionId = req.query.sessionId ;
//   const transport = transports[sessionId];
//   if (transport) {
//     await transport.handlePostMessage(req, res);
//   } else {
//     res.status(400).send('No transport found for sessionId');
//   }
// });

// app.listen(3001 , () => {
//     console.log("Sever s running on http://localhost:3001");
// });
import express from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { z as Zod } from "zod";  // ✅ Added import for Zod

const server = new McpServer({
  name: "example-server",
  version: "1.0.0"
});

// Setup server resources, tools, and prompts

const app = express();

server.tool(
  "addTwoNumbers",
  "Add Two Numbers",
  {
    a: Zod.number(),
    b: Zod.number()
  },
  async (arg) => {   // ✅ Correct parentheses
    const { a, b } = arg;   // ✅ Correct destructuring
    return [
      {
        type: "text",
        text: `The sum of ${a} and ${b} is ${a + b}`  // ✅ Added commas
      }
    ];
  }
);

const transports = {};

app.get("/sse", async (req, res) => {
  const transport = new SSEServerTransport('/messages', res);
  transports[transport.sessionId] = transport;
  res.on("close", () => {
    delete transports[transport.sessionId];
  });
  await server.connect(transport);
});

app.post("/messages", async (req, res) => {
  const sessionId = req.query.sessionId;
  const transport = transports[sessionId];
  if (transport) {
    await transport.handlePostMessage(req, res);
  } else {
    res.status(400).send('No transport found for sessionId');
  }
});

app.listen(3001, () => {
  console.log("Server is running on http://localhost:3001");
});
