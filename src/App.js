// import React, { useState } from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Home from "./components/Home";
// import TaskList from "./components/TaskList";
// import Timetable from "./components/Timetable";
// import Calendar from "./components/Calander";
// import UploadMaterial from "./components/uploadMaterial";
// import Login from "./components/Login";
// import Signup from "./components/Signup";
// import Navbar from "./components/Navbar";
// import Progress from "./components/Progress";
// import StartTask from "./components/StartTask";
// import "../src/assets/css/styles.css"; // Ensure correct CSS path


// function App() {
//   // Centralized task state
//   const [tasks, setTasks] = useState([]);

//   // Function to update task status (Completed or Incomplete)
//   const updateTaskStatus = (taskName, status) => {
//     setTasks((prevTasks) =>
//       prevTasks.map((task) =>
//         task.name === taskName ? { ...task, status: status } : task
//       )
//     );
//   };

//   return (
//     <Router>
//       <Navbar />
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/progress" element={<Progress tasks={tasks} />} />
//         <Route path="/tasklist" element={<TaskList tasks={tasks} setTasks={setTasks} />} />
//         <Route path="/calendar" element={<Calendar />} />
//         <Route path="/timetable" element={<Timetable tasks={tasks} />} />
//         <Route path="/upload" element={<UploadMaterial />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/start-task" element={<StartTask tasks={tasks} />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;


import React from "react";
import { TaskProvider } from "./TaskContext"; // 🔥 Provides task state globally
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import TaskList from "./components/TaskList";
import Timetable from "./components/Timetable";
import Calander from "./components/Calander";
import StartTask from "./components/StartTask";
import UploadMaterial from "./components/uploadMaterial";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Navbar from "./components/Navbar";
import Progress from "./components/Progress";
// import ForgotPassword from "./components/ForgotPassword"; // Uncomment if needed

import "../src/assets/css/styles.css"; // ✅ Ensure correct CSS path

function App() {
  return (
    <TaskProvider> {/* 🔥 Wrap the entire app inside TaskProvider */}
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/tasklist" element={<TaskList />} />
          <Route path="/Calander" element={<Calander />} />
          <Route path="/timetable" element={<Timetable />} />
          <Route path="/upload" element={<UploadMaterial />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/start-task" element={<StartTask />} />
          {/* <Route path="/forgot-password" element={<ForgotPassword />} /> Uncomment if needed */}
        </Routes>
      </Router>
    </TaskProvider>
  );
}

export default App;
