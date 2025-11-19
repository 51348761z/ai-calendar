const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "YOUR_API_KEY_HERE";

export const getAISuggestion = async (
  title: string,
  description: string
): Promise<string> => {
  const lowerTitle = title.toLowerCase();
  const lowerDesc = description.toLowerCase();
  const combined = `${lowerTitle} ${lowerDesc}`;

  let specificPrompt = "";

  if (combined.includes("面试") || combined.includes("interview")) {
    specificPrompt =
      "这是一个面试日程。请给出需要准备哪些材料、复习提纲、面试注意事项、着装建议等方面的建议。";
  } else if (
    combined.includes("见面") ||
    combined.includes("meeting") ||
    combined.includes("约会")
  ) {
    specificPrompt =
      "这是一个见面日程。请给出需要准备哪些材料、沟通提纲、注意事项等方面的建议。";
  } else if (
    combined.includes("旅行") ||
    combined.includes("trip") ||
    combined.includes("自驾")
  ) {
    specificPrompt =
      "这是一个旅行或自驾日程。请给出需要准备哪些证件、装备、车辆检查（如果是自驾）、注意事项等方面的建议。";
  } else {
    specificPrompt = "请针对这个日程，给出相关的准备建议和注意事项。";
  }

  const finalPrompt = `
    日程标题：${title}
    日程描述：${description}
    
    任务：${specificPrompt}
    
    要求：
    1. 回答请控制在 300 字以内。
    2. 使用中文回答。
    3. 条理清晰，分点列出。
    4. 语气友好、专业。
  `;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: finalPrompt,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API Error:", errorData);
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    const suggestion =
      data.candidates?.[0]?.content?.parts?.[0]?.text.replace(/\*\*(.*?)\*\*/g,"$1") ||
      "抱歉，AI 暂时无法生成建议。";
    return `AI 建议：\n${suggestion}`;
  } catch (error) {
    console.error("Error fetching AI suggestion:", error);
    return "抱歉，获取 AI 建议时出现错误，请检查网络或 API Key 配置。";
  }
};
