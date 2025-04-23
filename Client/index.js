// // const { GoogleGenAI } = require ("@google/genai")

// // require('dotenv').config();
// // const readline = require ('readline/promises');


// // const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });



// // const chatHistory =[];
// // const rl =readline.createInterface({
// //   input: process.stdin,
// //   output: process.stdout,  
// // });

// // async function chatLoop() {
// //     const question = await rl.question('You: ');
    
// //     chatHistory.push({
// //     role:  "user",
// //     parts:[
// //         {
// //             text:question,
// //             type:"text"
// //         }
// //     ]
// //     })
    
// //     const response = await ai.models.generateContent({
// //         model:"gemini-1.5-flash",
// //         content: chatHistory
// //     })
    
// //     console.log(response.candidates[ 0 ].content.parts[ 0 ])
    
// //     }
    
// //     chatLoop()

    
// import { GoogleGenAI } from "@google/genai";
// import {config} from 'dotenv';
// import readline  from 'readline/promises'
// import { Client } from "@modelcontextprotocol/sdk/client/index.js"
// import { SSEClientTransport } from "@modelcontextprotocol/client/sse.js"


// config()
// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
// const mcpClient = new Client({
//   name: "example-client",
//   version:"1.0.0",
// })

// const chatHistory = [];
// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

// mcpClient.connect(new SSEClientTransport( new URL ("http://localhost:3001/sse") ))
// .then(async () => {
//   console.log("Connected to MCP server")

//   const tools = (await mcpClient.listTools()).tools

//   console.log("Available Tools :", tools)
// })

// async function chatLoop() {
//   while (true) {
//     const question = await rl.question('You: ');

//     // Push user message
//     chatHistory.push({
//       role: "user",
//       parts: [{ text: question }]
//     });

//     const result = await ai.models.generateContent({
//       model: "gemini-1.5-flash",
//       contents: chatHistory
//     });

//     const aiResponse = result.candidates[0].content.parts[0].text;

//     console.log('AI:', aiResponse);

//     // Push AI response to history
//     chatHistory.push({
//       role: "model",
//       parts: [{ text: aiResponse }]
//     });
//   }
// }

// chatLoop();


import { GoogleGenAI } from "@google/genai";
import { config } from 'dotenv';
import readline from 'readline/promises';
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

config();
let tools = []
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const mcpClient = new Client({
  name: "example-client",
  version: "1.0.0",
});

const chatHistory = [];
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Connect to MCP server using SSEClientTransport
mcpClient.connect(new SSEClientTransport(new URL("http://localhost:3001/sse")))
  .then(async () => {
    console.log("Connected to MCP server");

    // List available tools after connection
    const tools = (await mcpClient.listTools()).tools;
    console.log("Available Tools:", tools);
  })
  .catch((error) => {
    console.error("Error connecting to MCP server:", error);
  });

async function chatLoop() {
  while (true) {
    const question = await rl.question('You: ');

    // Push user message to history
    chatHistory.push({
      role: "user",
      parts: [{ text: question }],
    });

    // Request AI response using GoogleGenAI
    const result = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: chatHistory,
    });

    const aiResponse = result.candidates[0].content.parts[0].text;
    console.log('AI:', aiResponse);

    // Push AI response to history
    chatHistory.push({
      role: "model",
      parts: [{ text: aiResponse }],
    });

    // Send AI response to MCP server (optional)
    try {
      await mcpClient.sendMessage({
        type: 'chat',
        message: aiResponse,
      });
      console.log('AI response sent to MCP server.');
    } catch (error) {
      console.error('Error sending message to MCP server:', error);
    }
  }
}

chatLoop();
