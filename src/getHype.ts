//this is where i will give the prompt fore the breeds
//this is where i will contact the Ai Api


////
// @ts-nocheck
import { OpenAIClient, AzureKeyCredential } from "@azure/openai";
import getPrompt from "./getPrompt";

export default async function getHype(breed, language, code) {
  // Azure OpenAI credentials
  const endpoint = "https://YOUR-RESOURCE-NAME.openai.azure.com/"; // Your Azure OpenAI resource endpoint
  const apiKey = "";
  const deploymentName = "ugrandojoai"; // The deployment name you created in Azure

  // Create the OpenAI client
  const client = new OpenAIClient(
    endpoint,
    new AzureKeyCredential(apiKey)
  );

  // Prepare the system message using the breed prompt
  const systemMessage = `${getPrompt(breed)}\n\n${
    `You are to give your answer as a valid JSON object. The text field will be the text that will actually be shown to the user. The animation is an enumerated type of animations. Your valid options are walk, run, playful, bark, sit, tilt, leap, howl, paw, beg, rollover, and wetDogShake. Choose the animation that best fits the tone of your response. Do not provide markdown, only text inside of these JSON fields. Limit yourself to about seven sentences or less.`
  }`;

  // Prepare the user message including the language and code
  const userMessage = `The programming language for this snippet is ${language}\n\n${code}`;

  try {
    // Call the Azure OpenAI API
    const response = await client.getChatCompletions(
      deploymentName,
      [
        { role: "system", content: systemMessage },
        { role: "user", content: userMessage }
      ],
      {
        temperature: 1.0, // Azure uses 0-1 scale, adjusting from 2.0
        topP: 0.95,
        maxTokens: 35, // Azure OpenAI may have different token limits than Gemini
      }
    );

    // Extract the JSON response
    const responseText = response.choices[0].message.content;
    
    // Parse the JSON, handling potential markdown formatting
    let jsonText = responseText;
    if (responseText.includes("```json")) {
      jsonText = responseText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
    }
    
    const obj = JSON.parse(jsonText);
    return obj;
  } catch (error) {
    console.error("Error calling Azure OpenAI:", error);
    throw error;
  }
}








/////
// //FOR THIS TO ACTUALLY WORK NEED THAT STUDENT THING RUNIING
// import getPrompt from "./getPrompt";

// export default async function getHype(breed, language, code) {
//   const systemPrompt = getPrompt(breed);

//   const finalPrompt = `
// ${systemPrompt}

// The programming language is ${language}.

// Here is the code:
// ${code}

// Respond in this format (only JSON):
// {
//   "animation": "bark | sit | rollover | run | etc",
//   "text": "Short message (max 7 sentences)"
// }
// `;

//   const response = await fetch(
//     "https://YOUR-RESOURCE-NAME.openai.azure.com/openai/deployments/YOUR-DEPLOYMENT-NAME/chat/completions?api-version=2024-03-01-preview",
//     {
//       method: "POST",
//       headers: {
//         "api-key": "YOUR_API_KEY",
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         messages: [
//           { role: "system", content: "You are a sprite dog AI that generates fun, short JSON messages for a VS Code extension." },
//           { role: "user", content: finalPrompt },
//         ],
//         temperature: 1.2,
//         max_tokens: 400,
//       }),
//     }
//   );

//   const result = await response.json();
//   const jsonText = result.choices[0].message.content
//     .replace("```json", "")
//     .replace("```", "")
//     .trim();

//   return JSON.parse(jsonText);
// }
