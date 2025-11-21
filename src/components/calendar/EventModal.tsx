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
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 className="modal-header">
          {mode === "add" ? "添加新日程" : "编辑日程"}
        </h3>

        <div className="form-group">
          <label className="form-label">标题</label>
          <input
            type="text"
            className="form-input"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="请输入日程标题"
          />
        </div>

        <div className="form-group">
          <label className="form-label">描述</label>
          <textarea
            className="form-textarea"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="添加详细描述..."
          />
        </div>

        <button onClick={handleAskAI} disabled={loading} className="ai-button">
          {loading ? "AI 正在思考..." : "✨ 让 AI 给你的日程提点建议"}
        </button>

        {suggestion && (
          <div className="suggestion-box">
            <strong>💡 AI 建议：</strong>
            <div style={{ marginTop: "5px" }}>
              {suggestion.replace("AI 建议：\n", "")}
            </div>
          </div>
        )}

        <div className="modal-footer">
          {mode === "edit" && onDelete && (
            <button onClick={onDelete} className="btn btn-danger">
              删除
            </button>
          )}
          <button onClick={onClose} className="btn btn-secondary">
            取消
          </button>
          <button onClick={() => onSave(formData)} className="btn btn-primary">
            保存
          </button>
        </div>
      </div>
    </div>
  );
};
