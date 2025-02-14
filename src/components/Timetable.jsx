import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db ,auth} from "../firebase"; // ✅ Import Firestore
import { collection, getDocs } from "firebase/firestore";
import { checkAuth } from "../helpers"; // ✅ Import checkAuth from helpers.js
import "../assets/css/timetable.css"; // ✅ Ensure correct CSS path
import { query, where } from "firebase/firestore";

const Timetable = () => {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  const today = new Date();
  const todayDate = today.toISOString().split("T")[0]; // ✅ Format YYYY-MM-DD
  const dayName = today.toLocaleDateString("en-US", { weekday: "long" }); // ✅ Get Day Name

  // ✅ Use checkAuth to restrict access
  useEffect(() => {
    if (!checkAuth()) {
      navigate("/login");
      return;
    }

    // ✅ Fetch tasks from Firestore
    const fetchTasks = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return; // ✅ Prevents running if no user is logged in
  
        const q = query(collection(db, "tasks"), where("userId", "==", user.uid)); // ✅ Fetch only logged-in user's tasks
        const querySnapshot = await getDocs(q);
        const fetchedTasks = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
  
        setTasks(fetchedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [navigate]);

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
