import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase"; // Firestore instance
import { collection, getDocs ,query, where} from "firebase/firestore";
import "../assets/css/calendar.css"; // Ensure correct CSS path

const Calander = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null); // Stores selected date for viewing tasks
  const navigate = useNavigate();
  
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // Fetch tasks from Firestore
  useEffect(() => {
    const user = auth.currentUser; // Get current user
  
    if (!user) {
      navigate("/login"); // Redirect if not logged in
      return;
    }
  
    const fetchTasks = async () => {
      try {
        const querySnapshot = await getDocs(
          query(collection(db, "tasks"), where("userId", "==", user.uid)) // Fetch tasks only for logged-in user
        );
        const tasksData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTasks(tasksData);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
  
    fetchTasks();
  }, [navigate]);
  

  // Generate days of the current month
  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const daysInMonth = getDaysInMonth(currentMonth, currentYear);

  // Function to format date from yyyy-mm-dd to dd-mm-yyyy
  const formatDate = (dateObj) => {
    if (!dateObj) return ""; // Handle undefined/null cases
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Organize tasks by date
  const tasksByDate = tasks.reduce((acc, task) => {
    if (!task.startDate) return acc; // Ensure task has a valid date
    const formattedDate = formatDate(new Date(task.startDate)); // Convert startDate
    if (!acc[formattedDate]) acc[formattedDate] = [];
    acc[formattedDate].push(task);
    return acc;
  }, {});

  // Get task status color
  const getTaskStatusColor = (task) => {
    if (task.completed) return "green"; // Completed 🟢
    if (task.halfDone) return "red"; // Half-done 🔴
    return "yellow"; // Pending 🟡
  };

  return (
    <div className="calendar-container">
      <h2>Calendar - {today.toLocaleString("default", { month: "long" })} {currentYear}</h2>

      {/* Calendar Grid */}
      <div className="calendar-grid">
        {[...Array(daysInMonth)].map((_, day) => {
          const dateObj = new Date(currentYear, currentMonth, day + 1);
          const date = formatDate(dateObj);
          const taskList = tasksByDate[date] || [];
          const taskColor = taskList.length ? getTaskStatusColor(taskList[0]) : "transparent";

          return (
            <div
              key={date}
              className="calendar-day"
              style={{ backgroundColor: taskColor }}
              onClick={() => setSelectedDate(date)}
            >
              {day + 1}
            </div>
          );
        })}
      </div>

      {/* Task Details on Date Selection */}
      {selectedDate && (
        <div className="task-details">
          <h3>Tasks for {selectedDate}</h3>
          {tasksByDate[selectedDate] && tasksByDate[selectedDate].length > 0 ? (
            <ul>
              {tasksByDate[selectedDate].map((task, index) => (
                <li key={index} style={{ color: getTaskStatusColor(task) }}>
                  {task.name} ({task.startTime} - {task.endTime})
                </li>
              ))}
            </ul>
          ) : (
            <p>No tasks for this date.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Calander;
