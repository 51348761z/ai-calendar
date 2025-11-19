import React, { useState, useRef } from "react";
import dayGridPlugin from "@fullcalendar/daygrid";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { INITIAL_EVENTS, createEventId } from "../utils/EventUtils";

const headerToolbar = {
  left: "prev,next today exportButton",
  center: "title",
  right: "dayGridMonth,timeGridWeek,timeGridDay",
};

// 简单的弹窗样式
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

export function CustomCalendar() {
  const [modalVisible, setModalVisible] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");

  // 用于存储当前选中的日期信息（添加模式）或事件对象（编辑模式）
  const [currentSelection, setCurrentSelection] = useState<any>(null);
  const [currentEvent, setCurrentEvent] = useState<any>(null);

  // 表单数据
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const calendarRef = useRef<FullCalendar>(null);

  const handleExport = () => {
    const api = calendarRef.current?.getApi();
    if (!api) return;

    const events = api.getEvents();
    let icsContent =
      "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//AI Calendar//EN\n";

    events.forEach((event) => {
      icsContent += "BEGIN:VEVENT\n";
      icsContent += `UID:${event.id}\n`;
      icsContent += `DTSTAMP:${
        new Date().toISOString().replace(/[-:]/g, "").split(".")[0]
      }Z\n`;

      if (event.allDay) {
        icsContent += `DTSTART;VALUE=DATE:${event.startStr.replace(
          /-/g,
          ""
        )}\n`;
        if (event.endStr) {
          icsContent += `DTEND;VALUE=DATE:${event.endStr.replace(/-/g, "")}\n`;
        }
      } else {
        if (event.start) {
          icsContent += `DTSTART:${
            event.start.toISOString().replace(/[-:]/g, "").split(".")[0]
          }Z\n`;
        }
        if (event.end) {
          icsContent += `DTEND:${
            event.end.toISOString().replace(/[-:]/g, "").split(".")[0]
          }Z\n`;
        }
      }

      icsContent += `SUMMARY:${event.title}\n`;
      if (event.extendedProps?.description) {
        icsContent += `DESCRIPTION:${event.extendedProps.description}\n`;
      }
      icsContent += "END:VEVENT\n";
    });

    icsContent += "END:VCALENDAR";

    const blob = new Blob([icsContent], {
      type: "text/calendar;charset=utf-8",
    });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", "calendar.ics");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const myCustomButton = {
    exportButton: {
      text: "export",
      click: handleExport,
    },
  };

  // 处理日期选择（添加新日程）
  function handleDateSelect(selectInfo) {
    setMode("add");
    setCurrentSelection(selectInfo);
    setFormData({ title: "", description: "" }); // 重置表单
    setModalVisible(true);
  }

  // 处理事件点击（编辑/删除日程）
  function handleEventClick(clickInfo) {
    setMode("edit");
    setCurrentEvent(clickInfo.event);
    setFormData({
      title: clickInfo.event.title,
      description: clickInfo.event.extendedProps?.description || "",
    });
    setModalVisible(true);
  }

  // 关闭弹窗
  function handleCloseModal() {
    setModalVisible(false);
    setCurrentSelection(null);
    setCurrentEvent(null);
  }

  // 保存（添加或更新）
  function handleSave() {
    if (!formData.title) {
      alert("请输入标题");
      return;
    }

    if (mode === "add" && currentSelection) {
      const calendarApi = currentSelection.view.calendar;
      calendarApi.unselect(); // 清除选择高亮

      calendarApi.addEvent({
        id: createEventId(),
        title: formData.title,
        start: currentSelection.startStr,
        end: currentSelection.endStr,
        allDay: currentSelection.allDay,
        extendedProps: {
          description: formData.description,
        },
      });
    } else if (mode === "edit" && currentEvent) {
      // 更新现有事件
      currentEvent.setProp("title", formData.title);
      currentEvent.setExtendedProp("description", formData.description);
    }

    handleCloseModal();
  }

  // 删除事件
  function handleDelete() {
    if (mode === "edit" && currentEvent) {
      if (confirm(`确定要删除 '${currentEvent.title}' 吗?`)) {
        currentEvent.remove();
        handleCloseModal();
      }
    }
  }

  return (
    <div style={{ position: "relative" }}>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={headerToolbar}
        events={INITIAL_EVENTS}
        selectable={true}
        select={handleDateSelect}
        eventClick={handleEventClick}
        customButtons={myCustomButton}
        height="80vh"
      />

      {/* 自定义弹窗 (Pop-up) */}
      {modalVisible && (
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
              {mode === "edit" && (
                <button
                  onClick={handleDelete}
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
                <button
                  onClick={handleCloseModal}
                  style={{ cursor: "pointer" }}
                >
                  取消
                </button>
                <button onClick={handleSave} style={{ cursor: "pointer" }}>
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
