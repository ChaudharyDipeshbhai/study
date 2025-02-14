import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { checkAuth } from "../helpers";

const StartTask = ({ tasks = [], updateTaskStatus }) => {
  const [activeTask, setActiveTask] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const navigate = useNavigate();

  useEffect(()=>{
    if (!checkAuth()) {
      navigate('/login');
    }
  },[navigate]);

  // Function to start the task timer and update Firestore
  const startTask = async (task) => {
    setActiveTask(task);
    setTimeLeft(task.duration ? task.duration * 60 : 0);
    setIsRunning(true);

    // ✅ Save running task state in Firestore
    const taskRef = doc(db, "tasks", task.id);
    await updateDoc(taskRef, {
      isRunning: true,
      startTimeStamp: new Date().toISOString(),
    });
  };

  // Function to pause or resume the timer
  const toggleTimer = async () => {
    setIsRunning((prev) => !prev);

    // ✅ Update Firestore when pausing/resuming
    if (activeTask) {
      const taskRef = doc(db, "tasks", activeTask.id);
      await updateDoc(taskRef, {
        isRunning: !isRunning,
      });
    }
  };

  // Timer countdown logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (timeLeft === 0 && activeTask) {
      handleTaskCompletion();
    }
  }, [isRunning, timeLeft, activeTask]);

  // Load active running task from Firestore on mount
  useEffect(() => {
    const fetchRunningTask = async () => {
      const user = auth.currentUser;
      if (!user) return;

      for (const task of tasks) {
        const taskRef = doc(db, "tasks", task.id);
        const taskSnap = await getDoc(taskRef);
        if (taskSnap.exists() && taskSnap.data().isRunning) {
          setActiveTask(task);
          setIsRunning(true);
          // Resume the timer based on saved timestamp
          const savedStartTime = new Date(taskSnap.data().startTimeStamp);
          const elapsedSeconds = Math.floor((new Date() - savedStartTime) / 1000);
          setTimeLeft(task.duration * 60 - elapsedSeconds);
          break;
        }
      }
    };
    fetchRunningTask();
  }, [tasks]);

  // Function to handle task completion and update Firestore
  const handleTaskCompletion = async () => {
    setIsRunning(false);
    const isCompleted = window.confirm(
      `Did you complete the task: "${activeTask.name}"? Click OK for Completed, Cancel for Incomplete.`
    );

    // ✅ Update Firestore
    const taskRef = doc(db, "tasks", activeTask.id);
    await updateDoc(taskRef, {
      isRunning: false,
      completed: isCompleted,
    });

    // Update task status in Task List & Calendar
    updateTaskStatus(activeTask.name, isCompleted ? "completed" : "incomplete");

    // Reset after completion
    setActiveTask(null);
    setTimeLeft(0);

    // Redirect to task list after finishing
    navigate("/tasklist");
  };

  return (
    <div className="start-task-container">
      <h2>Start Task</h2>

      <ul>
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <li key={task.id}>
              {task.name} - {task.duration ? `${task.duration} min` : "No duration"}
              <button onClick={() => startTask(task)}>Start</button>
            </li>
          ))
        ) : (
          <p>No tasks available. Please add tasks in the Task List.</p>
        )}
      </ul>

      {activeTask && (
        <div className="task-timer">
          <h3>Working on: {activeTask.name}</h3>
          <p>
            Time Left: {Math.floor(timeLeft / 60)}:
            {timeLeft % 60 < 10 ? "0" : ""}
            {timeLeft % 60}
          </p>
          <button onClick={toggleTimer}>{isRunning ? "Pause" : "Resume"}</button>
        </div>
      )}
    </div>
  );
};

export default StartTask;
