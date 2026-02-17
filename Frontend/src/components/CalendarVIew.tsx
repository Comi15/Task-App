import { CalendarEvent, TaskReturn } from "../types/types";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../styles/calendarView.css";

type CalendarProps = {
  arrayCopy: Array<TaskReturn>;
};

const localizer = momentLocalizer(moment);

const CalendarView = ({ arrayCopy }: CalendarProps) => {
  
  const events: Array<CalendarEvent> = arrayCopy.map((task) => ({
    title: `${task.title} - ${task.status}`,
    start: new Date(task.duedate as string),
    end: new Date(task.duedate as string),
    allDay: true, // Assuming tasks are all-day events
    status: task.status,
  }));

  const eventPropGetter = (event: CalendarEvent) => {
    const style = {
      backgroundColor:
        event.status === "Done"
          ? "green"
          : event.status === "In Progress"
            ? "yellow"
            : event.status === "QA"
              ? "blue"
              : "red", 
      borderRadius: "4px",
      color: "white",
      border: "none",
    };

    return { style };
  };

  const CustomToolbar = (toolbar: any) => {
    const currentMonth = moment(toolbar.date).format("MMMM YYYY");
    const goToToday = () => {
      toolbar.onNavigate("TODAY");
    };

    const goToPrevious = () => {
      toolbar.onNavigate("PREV");
    };

    const goToNext = () => {
      toolbar.onNavigate("NEXT");
    };

    return (
      <div
        style={{
          marginBottom: "16px",
          textAlign: "center",
          display: "flex",
          width: "100%",
        }}
      >
        <button className="calendar-button" onClick={goToPrevious}>
          Previous
        </button>
        <button className="calendar-button" onClick={goToToday}>
          Today
        </button>
        <button className="calendar-button" onClick={goToNext}>
          Next
        </button>
        <span style={{ marginLeft: "auto" }}>{currentMonth}</span>
      </div>
    );
  };

  return (
    <div className="calendar-view-container">
      <h2>Calendar View</h2>
      <Calendar
        localizer={localizer}
        events={events}
        eventPropGetter={eventPropGetter}
        startAccessor="start"
        endAccessor="end"
        defaultView="month"
        components={{
          toolbar: CustomToolbar,
        }}
        views={["month"]}
      />
    </div>
  );
};

export default CalendarView;
