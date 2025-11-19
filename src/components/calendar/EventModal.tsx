import React, { useEffect, useState } from "react";

interface EventModalProps {
  visible: boolean;
  mode: "add" | "edit";
  initialData: { title: string; description: string };
  onClose: () => void;
  onSave: (data: { title: string; description: string }) => void;
  onDelete?: () => void;
}

const modalStyles: any = {
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
    width: "300px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  buttons: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
  },
};

export const EventModal: React.FC<EventModalProps> = ({
  visible,
  mode,
  initialData,
  onClose,
  onSave,
  onDelete,
}) => {
  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

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
            style={{ width: "100%", marginTop: "5px" }}
          />
        </label>

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
