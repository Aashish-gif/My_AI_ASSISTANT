// const { GoogleGenAI } = require ("@google/genai")

// require('dotenv').config();
// const readline = require ('readline/promises');


// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });



// const chatHistory =[];
// const rl =readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,  
// });

// async function chatLoop() {
//     const question = await rl.question('You: ');
    
//     chatHistory.push({
//     role:  "user",
//     parts:[
//         {
//             text:question,
//             type:"text"
//         }
//     ]
//     })
    
//     const response = await ai.models.generateContent({
//         model:"gemini-1.5-flash",
//         content: chatHistory
//     })
    
//     console.log(response.candidates[ 0 ].content.parts[ 0 ])
    
//     }
    
//     chatLoop()

    
const { GoogleGenAI } = require("@google/genai");
require('dotenv').config();
const readline = require('readline/promises');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const chatHistory = [];
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function chatLoop() {
  while (true) {
    const question = await rl.question('You: ');

    // Push user message
    chatHistory.push({
      role: "user",
      parts: [{ text: question }]
    });

    const result = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: chatHistory
    });

    const aiResponse = result.candidates[0].content.parts[0].text;

    console.log('AI:', aiResponse);

    // Push AI response to history
    chatHistory.push({
      role: "model",
      parts: [{ text: aiResponse }]
    });
  }
}

chatLoop();

