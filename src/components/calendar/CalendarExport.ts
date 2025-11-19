import type { EventApi } from "@fullcalendar/core";

export const exportToICal = (events: EventApi[]) => {
  let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//AI Calendar//EN\n";

  events.forEach((event) => {
    icsContent += "BEGIN:VEVENT\n";
    icsContent += `UID:${event.id}\n`;
    icsContent += `DTSTAMP:${
      new Date().toISOString().replace(/[-:]/g, "").split(".")[0]
    }Z\n`;

    if (event.allDay) {
      icsContent += `DTSTART;VALUE=DATE:${event.startStr.replace(/-/g, "")}\n`;
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
