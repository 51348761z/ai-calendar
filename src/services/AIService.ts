export const getAISuggestion = async (title: string, description: string): Promise<string> => {
  // 模拟 AI 延迟
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const lowerTitle = title.toLowerCase();
  const lowerDesc = description.toLowerCase();
  const combined = `${lowerTitle} ${lowerDesc}`;

  if (combined.includes("面试") || combined.includes("interview")) {
    return "AI 建议：\n1. 准备好简历和作品集。\n2. 提前了解公司背景和职位要求。\n3. 准备好自我介绍和常见面试问题的回答。\n4. 穿着得体，保持自信。\n5. 提前规划路线，确保准时到达。";
  } else if (combined.includes("见面") || combined.includes("meeting") || combined.includes("约会")) {
    return "AI 建议：\n1. 确认见面时间和地点。\n2. 如果是商务会面，准备好名片和会议议程。\n3. 如果是私人约会，可以准备一个小礼物。\n4. 注意仪表仪容。";
  } else if (combined.includes("旅行") || combined.includes("trip") || combined.includes("自驾")) {
    return "AI 建议：\n1. 检查车辆状况（油量、轮胎、刹车等）。\n2. 准备好导航和离线地图。\n3. 带上必要的证件（驾照、身份证）。\n4. 准备急救包、水和零食。\n5. 查看目的地的天气预报。";
  } else if (combined.includes("会议") || combined.includes("conference")) {
    return "AI 建议：\n1. 整理会议发言提纲。\n2. 检查演示文稿（PPT）是否无误。\n3. 提前测试会议设备（麦克风、摄像头）。\n4. 准备好记录会议纪要的工具。";
  } else {
    return `AI 建议：\n这是一个关于 "${title}" 的日程。\n建议您提前做好规划，预留充足的时间。如果需要特定准备，请根据具体情况列出清单。`;
  }
};
