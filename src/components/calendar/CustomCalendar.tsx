import { useState, useRef } from "react";
import type { DateSelectArg, EventClickArg } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { INITIAL_EVENTS, createEventId } from "../utils/EventUtils";
import { headerToolbar } from "./CalendarConfig";
import { exportToICal } from "./CalendarExport";
import { EventModal } from "./EventModal";

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
    exportToICal(events);
  };

  const myCustomButton = {
    exportButton: {
      text: "export",
      click: handleExport,
    },
  };

  // 处理日期选择（添加新日程）
  function handleDateSelect(selectInfo: DateSelectArg) {
    setMode("add");
    setCurrentSelection(selectInfo);
    setFormData({ title: "", description: "" }); // 重置表单
    setModalVisible(true);
  }

  // 处理事件点击（编辑/删除日程）
  function handleEventClick(clickInfo: EventClickArg) {
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
  function handleSave(data: { title: string; description: string }) {
    if (!data.title) {
      alert("请输入标题");
      return;
    }

    if (mode === "add" && currentSelection) {
      const calendarApi = currentSelection.view.calendar;
      calendarApi.unselect(); // 清除选择高亮

      calendarApi.addEvent({
        id: createEventId(),
        title: data.title,
        start: currentSelection.startStr,
        end: currentSelection.endStr,
        allDay: currentSelection.allDay,
        extendedProps: {
          description: data.description,
        },
      });
    } else if (mode === "edit" && currentEvent) {
      // 更新现有事件
      currentEvent.setProp("title", data.title);
      currentEvent.setExtendedProp("description", data.description);
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

      <EventModal
        visible={modalVisible}
        mode={mode}
        initialData={formData}
        onClose={handleCloseModal}
        onSave={handleSave}
        onDelete={mode === "edit" ? handleDelete : undefined}
      />
    </div>
  );
}
