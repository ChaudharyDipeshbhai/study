import React, { useState } from "react";
import Timetable from "./Timetable";
import Calendar from "./Calendar";
import StartTask from "./StartTask";

const TaskManager = () => {
  // 1️⃣ Centralized Task State
  const [tasks, setTasks] = useState([
    { name: "Math Homework", subject: "Math", startDate: "2025-02-14", startTime: "10:00", duration: 60, completed: false },
    { name: "Science Project", subject: "Science", startDate: "2025-02-14", startTime: "12:00", duration: 90, completed: false },
    { name: "Coding Practice", subject: "Programming", startDate: "2025-02-15", startTime: "15:00", duration: 120, completed: false }
  ]);

  // 2️⃣ Function to Update Task Status
  const updateTaskStatus = (taskName, status) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.name === taskName ? { ...task, completed: status === "completed" } : task
      )
    );
  };

  return (
    <div>
      <h1>Task Manager</h1>

      {/* Pass task data and status update function */}
      <Timetable tasks={tasks} />
      <Calendar tasks={tasks} />
      <StartTask tasks={tasks} updateTaskStatus={updateTaskStatus} />
    </div>
  );
};

export default TaskManager;