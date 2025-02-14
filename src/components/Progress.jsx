// import React, { useState } from "react";
// import { Pie } from "react-chartjs-2";
// import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

// Chart.register(ArcElement, Tooltip, Legend);

// function Progress({ tasks }) {
//   const [selectedTask, setSelectedTask] = useState(null); // State to track selected task

//   // Calculate Overall Progress
//   const totalTasks = tasks.length;
//   const completedTasks = tasks.filter((task) => task.status === "completed").length;
//   const incompleteTasks = totalTasks - completedTasks;

//   // Overall Progress Data (Pie Chart)
//   const overallData = {
//     labels: ["Completed Tasks", "Incomplete Tasks"],
//     datasets: [
//       {
//         data: [completedTasks, incompleteTasks],
//         backgroundColor: ["#4CAF50", "#FF4C4C"], // Green for completed, Red for incomplete
//       },
//     ],
//   };

//   // Function to handle task selection
//   const handleTaskClick = (task) => {
//     setSelectedTask(task);
//   };

//   return (
//     <div className="progress-container">
//       <h2>📊 Overall Progress</h2>
//       {totalTasks > 0 ? <Pie data={overallData} /> : <p>No tasks available</p>}

//       <h2>📌 Task-Specific Progress</h2>
//       <div className="task-list">
//         {tasks.length > 0 ? (
//           tasks.map((task, index) => (
//             <button key={index} className="task-button" onClick={() => handleTaskClick(task)}>
//               {task.name}
//             </button>
//           ))
//         ) : (
//           <p>No tasks available</p>
//         )}
//       </div>

//       {selectedTask && (
//         <div className="task-progress">
//           <h3>
//             {selectedTask.name} -{" "}
//             {selectedTask.topics.length > 0
//               ? ((selectedTask.topics.filter((t) => t.completed).length / selectedTask.topics.length) * 100).toFixed(2)
//               : 0}
//             % Complete
//           </h3>
//           <Pie
//             data={{
//               labels: ["Completed Topics", "Incomplete Topics"],
//               datasets: [
//                 {
//                   data: [
//                     selectedTask.topics.filter((topic) => topic.completed).length,
//                     selectedTask.topics.length - selectedTask.topics.filter((topic) => topic.completed).length,
//                   ],
//                   backgroundColor: ["#4CAF50", "#FF9800"], // Green for completed, Orange for incomplete
//                 },
//               ],
//             }}
//           />
//         </div>
//       )}
//     </div>
//   );
// }

// export default Progress;


import React, { useState, useEffect } from "react";
import { db } from "../firebase"; // Firestore import
import { collection, getDocs } from "firebase/firestore";
import "../assets/css/progress.css"; // Ensure proper styling

const Progress = () => {
  const [tasks, setTasks] = useState([]);

  // 📌 Fetch tasks from Firestore
  useEffect(() => {
    const fetchTasks = async () => {
      const querySnapshot = await getDocs(collection(db, "tasks"));
      const fetchedTasks = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // Sort tasks by newest first (based on startDate)
      fetchedTasks.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
      setTasks(fetchedTasks);
    };

    fetchTasks();
  }, []);

  return (
    <div className="progress-container">
      <h2>📈 Your Progress</h2>

      {tasks.length === 0 ? (
        <p>No tasks available. Start learning now!</p>
      ) : (
        <div className="progress-grid">
          {tasks.map((task) => {
            const progress = task.completed ? 100 : 50; // Example: 100% if completed, 50% otherwise
            return (
              <div key={task.id} className="progress-item">
                <div className="progress-circle" style={{ "--progress": progress }}>
                  <span>{progress}%</span>
                </div>
                <p>{task.name}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Progress;
