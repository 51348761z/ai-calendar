import React, { useEffect, useState } from "react";
import { getAISuggestion } from "../../services/AIService";

interface EventModalProps {
  visible: boolean;
  mode: "add" | "edit";
  initialData: { title: string; description: string };
  onClose: () => void;
  onSave: (data: { title: string; description: string }) => void;
  onDelete?: () => void;
}

// 弹窗样式定义
const modalStyles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  content: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    width: "400px",
    maxHeight: "80vh",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  buttons: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
  },
  suggestionBox: {
    marginTop: "10px",
    padding: "10px",
    backgroundColor: "#f0f8ff",
    borderRadius: "4px",
    border: "1px solid #d6e9ff",
    fontSize: "14px",
    whiteSpace: "pre-wrap",
  },
};

/**
 * EventModal 组件
 *
 * 用于添加或编辑日程的模态框。
 * 包含标题、描述输入框，以及 AI 建议功能。
 */
export const EventModal: React.FC<EventModalProps> = ({
  visible,
  mode,
  initialData,
  onClose,
  onSave,
  onDelete,
}) => {
  const [formData, setFormData] = useState(initialData);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData(initialData);
    setSuggestion(null); // 打开新事件时重置建议
  }, [initialData]);

  /**
   * 调用 AI 服务获取建议
   */
  const handleAskAI = async () => {
    if (!formData.title) {
      alert("请先输入日程标题");
      return;
    }
    setLoading(true);
    try {
      const result = await getAISuggestion(
        formData.title,
        formData.description
      );
      setSuggestion(result);
    } catch (error) {
      console.error("AI request failed", error);
      setSuggestion("抱歉，AI 暂时无法提供建议。");
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.content}>
        <h3>{mode === "add" ? "添加新日程" : "编辑日程"}</h3>

        <label>
          标题:
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            style={{ width: "100%", marginTop: "5px" }}
          />
        </label>

        <label>
          描述:
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            style={{ width: "100%", marginTop: "5px", minHeight: "80px" }}
          />
        </label>

        <button
          onClick={handleAskAI}
          disabled={loading}
          style={{
            marginTop: "5px",
            padding: "8px",
            backgroundColor: "#1890ff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "AI 正在思考..." : "✨ 让 AI 给你的日程提点建议"}
        </button>

        {suggestion && (
          <div style={modalStyles.suggestionBox}>
            <strong>💡 AI 建议：</strong>
            <div style={{ marginTop: "5px" }}>
              {suggestion.replace("AI 建议：\n", "")}
            </div>
          </div>
        )}

        <div style={modalStyles.buttons}>
          {mode === "edit" && onDelete && (
            <button
              onClick={onDelete}
              style={{
                backgroundColor: "#ff4d4f",
                color: "white",
                border: "none",
                padding: "5px 10px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              删除
            </button>
          )}
          <div style={{ marginLeft: "auto", display: "flex", gap: "10px" }}>
            <button onClick={onClose} style={{ cursor: "pointer" }}>
              取消
            </button>
            <button
              onClick={() => onSave(formData)}
              style={{ cursor: "pointer" }}
            >
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
