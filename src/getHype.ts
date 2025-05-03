//this is where i will give the prompt fore the breeds
//this is where i will contact the Ai Api

//FOR THIS TO ACTUALLY WORK NEED THAT STUDENT THING RUNIING
import getPrompt from "./getPrompt";

export default async function getHype(breed, language, code) {
  const systemPrompt = getPrompt(breed);

  const finalPrompt = `
${systemPrompt}

The programming language is ${language}.

Here is the code:
${code}

Respond in this format (only JSON):
{
  "animation": "bark | sit | rollover | run | etc",
  "text": "Short message (max 7 sentences)"
}
`;

  const response = await fetch(
    "https://YOUR-RESOURCE-NAME.openai.azure.com/openai/deployments/YOUR-DEPLOYMENT-NAME/chat/completions?api-version=2024-03-01-preview",
    {
      method: "POST",
      headers: {
        "api-key": "YOUR_API_KEY",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: "You are a sprite dog AI that generates fun, short JSON messages for a VS Code extension." },
          { role: "user", content: finalPrompt },
        ],
        temperature: 1.2,
        max_tokens: 400,
      }),
    }
  );

  const result = await response.json();
  const jsonText = result.choices[0].message.content
    .replace("```json", "")
    .replace("```", "")
    .trim();

  return JSON.parse(jsonText);
}
