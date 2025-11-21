import { useState, useRef } from "react";
import type {
  DateSelectArg,
  EventClickArg,
  EventApi,
} from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { INITIAL_EVENTS, createEventId } from "../utils/EventUtils";
import { headerToolbar } from "./CalendarConfig";
import { exportToICal } from "./CalendarExport";
import { EventModal } from "./EventModal";
import "./CalendarStyles.css";

/**
 * CustomCalendar 组件
 *
 * 这是一个基于 FullCalendar 的自定义日历组件。
 * 支持功能：
 * 1. 查看日历（月视图、周视图、日视图）。
 * 2. 点击日期添加新日程。
 * 3. 点击日程进行编辑或删除。
 * 4. 导出日程为 iCalendar (.ics) 文件。
 * 5. 集成 AI 建议功能（在 EventModal 中实现）。
 */
export function CustomCalendar() {
  const [modalVisible, setModalVisible] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");

  // 用于存储当前选中的事件对象（编辑模式）
  const [currentEvent, setCurrentEvent] = useState<EventApi | null>(null);

  // 表单数据
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    start: "",
    end: "",
    allDay: false,
  });

  const calendarRef = useRef<FullCalendar>(null);

  /**
   * 处理导出按钮点击事件
   * 获取当前日历的所有事件并导出为 .ics 文件
   */
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

  /**
   * 处理日期选择事件（添加新日程）
   */
  function handleDateSelect(selectInfo: DateSelectArg) {
    setMode("add");
    setFormData({
      title: "",
      description: "",
      start: selectInfo.startStr,
      end: selectInfo.endStr,
      allDay: selectInfo.allDay,
    });
    setModalVisible(true);
  }

  /**
   * 处理事件点击事件（编辑/删除日程）
   */
  function handleEventClick(clickInfo: EventClickArg) {
    setMode("edit");
    setCurrentEvent(clickInfo.event);
    setFormData({
      title: clickInfo.event.title,
      description: clickInfo.event.extendedProps?.description || "",
      start: clickInfo.event.startStr,
      end: clickInfo.event.endStr || "",
      allDay: clickInfo.event.allDay,
    });
    setModalVisible(true);
  }

  /**
   * 关闭弹窗并重置状态
   */
  function handleCloseModal() {
    setModalVisible(false);
    setCurrentEvent(null);
  }

  /**
   * 保存日程（添加或更新）
   */
  function handleSave(data: {
    title: string;
    description: string;
    start: string;
    end: string;
    allDay: boolean;
  }) {
    if (!data.title) {
      alert("请输入标题");
      return;
    }

    const calendarApi = calendarRef.current?.getApi();
    if (!calendarApi) return;

    if (mode === "add") {
      calendarApi.addEvent({
        id: createEventId(),
        title: data.title,
        start: data.start,
        end: data.end,
        allDay: data.allDay,
        extendedProps: {
          description: data.description,
        },
      });
    } else if (mode === "edit" && currentEvent) {
      // 更新现有事件
      currentEvent.setProp("title", data.title);
      currentEvent.setStart(data.start);
      currentEvent.setEnd(data.end);
      currentEvent.setAllDay(data.allDay);
      currentEvent.setExtendedProp("description", data.description);
    }

    handleCloseModal();
  }

  /**
   * 自定义事件渲染内容
   * 显示标题
   */
  const renderEventContent = (eventInfo: any) => {
    const { event, timeText } = eventInfo;

    return (
      <div className="custom-event-content">
        <div className="event-info">
          {timeText && <span className="event-time">{timeText}</span>}
          <span className="event-title">{event.title}</span>
        </div>
      </div>
    );
  };

  /**
   * 删除日程
   */
  function handleDelete() {
    if (mode === "edit" && currentEvent) {
      if (confirm(`确定要删除 '${currentEvent.title}' 吗?`)) {
        currentEvent.remove();
        handleCloseModal();
      }
    }
  }

  return (
    <div className="calendar-container">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        eventContent={renderEventContent}
        headerToolbar={headerToolbar}
        events={INITIAL_EVENTS}
        selectable={true}
        select={handleDateSelect}
        eventClick={handleEventClick}
        customButtons={myCustomButton}
        longPressDelay={100} // 缩短长按时间，优化移动端体验
        eventLongPressDelay={100}
        selectLongPressDelay={100}
        height="100%"
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
