import React, { useState, useEffect } from "react";
import { db } from "../firebase"; // Firestore import
import { collection, getDocs } from "firebase/firestore";
import "../assets/css/timetable.css"; // Ensure a stylish UI

const Timetable = () => {
  const [tasks, setTasks] = useState([]);

  const today = new Date();
  const todayDate = today.toISOString().split("T")[0]; // Format YYYY-MM-DD
  const dayName = today.toLocaleDateString("en-US", { weekday: "long" }); // Get Day Name

  // 📌 Fetch tasks from Firestore
  useEffect(() => {
    const fetchTasks = async () => {
      const querySnapshot = await getDocs(collection(db, "tasks"));
      const fetchedTasks = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(fetchedTasks);
    };

    fetchTasks();
  }, []);

  // 📌 Filter and Sort Today's Tasks
  const todaysTasks = tasks
    .filter((task) => task.startDate === todayDate) // Match tasks for today
    .sort((a, b) => a.startTime.localeCompare(b.startTime)); // Sort tasks by Start Time

  return (
    <div className="timetable-container">
      <h2>📅 Daily Timetable</h2>
      <p><strong>{dayName}, {todayDate}</strong></p> {/* Show Current Day & Date */}

      <table className="timetable">
        <thead>
          <tr>
            <th>🕒 Start Time</th>
            <th>📌 Task Name</th>
            <th>📖 Subject</th>
            <th>⏳ Duration</th>
          </tr>
        </thead>
        <tbody>
          {todaysTasks.length === 0 ? (
            <tr>
              <td colSpan="4">No tasks scheduled for today.</td>
            </tr>
          ) : (
            todaysTasks.map((task, index) => (
              <tr key={index}>
                <td>{task.startTime}</td>
                <td>{task.name}</td>
                <td>{task.subject || "N/A"}</td>
                <td>{task.duration ? `${task.duration} hrs` : "N/A"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Timetable;
