import React, { useState } from "react";
import { db } from "../firebase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";

const TaskItem = ({ task, onDelete, onUpdate }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [taskDetails, setTaskDetails] = useState(task);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    const updatedTask = { ...taskDetails, [name]: value };
    setTaskDetails(updatedTask);
    
    try {
      const docRef = doc(db, "tasks", taskDetails.id);
      await updateDoc(docRef, { [name]: value });  // ✅ Update Firestore
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };
  
  const handleDelete = async () => {
    try {
      const docRef = doc(db, "tasks", taskDetails.id);
      await deleteDoc(docRef);  // ✅ Remove from Firestore
      onDelete(taskDetails.id);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleTopicChange = async (e) => {
    const updatedTopics = e.target.value.split(",");
    setTaskDetails({ ...taskDetails, topics: updatedTopics });
  
    try {
      const docRef = doc(db, "tasks", taskDetails.id);
      await updateDoc(docRef, { topics: updatedTopics });  // ✅ Update Firestore
    } catch (error) {
      console.error("Error updating topics:", error);
    }
  };

  const toggleCompletion = async () => {
    const updatedTask = { ...taskDetails, completed: !taskDetails.completed };
    setTaskDetails(updatedTask);
  
    try {
      const docRef = doc(db, "tasks", taskDetails.id);
      await updateDoc(docRef, { completed: updatedTask.completed });  // ✅ Update Firestore
    } catch (error) {
      console.error("Error updating completion status:", error);
    }
  };

  return (
    <li className="task-item">
      <div className="task-header">
        <span
          className={taskDetails.completed ? "completed" : ""}
          onClick={() => setShowDetails(!showDetails)}
        >
          {taskDetails.name}
        </span>
        <input type="checkbox" checked={taskDetails.completed} onChange={toggleCompletion} />
        <button onClick={handleDelete}>Delete</button>
      </div>

      {showDetails && (
        <div className="task-details">
          <input
            type="text"
            name="subject"
            placeholder="Task Subject"
            value={taskDetails.subject}
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="Task Topics (comma separated)"
            value={taskDetails.topics.join(",")}
            onChange={handleTopicChange}
          />
          <input type="date" name="startDate" value={taskDetails.startDate} onChange={handleChange} />
          <input type="date" name="endDate" value={taskDetails.endDate} onChange={handleChange} />
          <input type="text" name="timeDuration" placeholder="Time Duration (e.g. 2 hours)" value={taskDetails.timeDuration} onChange={handleChange} />
          <input type="time" name="startTime" value={taskDetails.startTime} onChange={handleChange} />
          <input type="time" name="endTime" value={taskDetails.endTime} onChange={handleChange} />
          <button onClick={() => onUpdate(taskDetails)}>Save</button>
        </div>
      )}
    </li>
  );
};

export default TaskItem;
