import { OpenAI } from "https://deno.land/x/openai/mod.ts";

export const openAIReq = async (imgKeywords: string) => {
  try {
    const openAI = new OpenAI(Deno.env.get("OPENAI_API_KEY")!);
    const imgKeywordsStr = `
      ${Deno.env.get("AI_QUERY")}
      ${JSON.stringify(imgKeywords)}
    `;
    const completion = await openAI.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{"role": "system", "content": imgKeywordsStr}, {role: "user", content: "Hello world"}],
    });
    return { outcome: "success", data: completion.choices[0].message.content };
  } catch(err) {
    return { outcome: "fail", data: err };
  }
};
