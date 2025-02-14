import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import "../assets/css/styles.css"; // Ensure correct path
// import Timetable from "../components/Timetable"; // Import Timetable Component. time table ma kai thayu to aa ek vakhat check karvu padse

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTaskName, setNewTaskName] = useState("");
  const [newTopic, setNewTopic] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const fetchTasks = async () => {
          const q = query(collection(db, "tasks"), where("userId", "==", user.uid));
          const querySnapshot = await getDocs(q);
          const taskList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setTasks(taskList);
        };
  
        fetchTasks();
      } else {
        setTasks([]); // Clear tasks when no user is logged in
      }
    });
  
    return () => unsubscribe();
  }, []);
  

  const handleAddTask = async () => {
    if (newTaskName.trim() == "") return;
    try {
      const user = auth.currentUser;
      if (!user) {
        alert("You need to be logged in to add tasks.");
        return;
      } 
      
      const docRef = await addDoc(collection(db, "tasks"), {
          name: newTaskName,
          subject: "",
          topics: [],
          startDate: "",
          endDate: "",
          duration: "",
          startTime: "",
          endTime: "",
          completed: false,
          showDetails: false,
          isEditing: false,
          priority: "Medium",
          tags: [],
          reminder: false,
          userId: user.uid,
        },
      );
      setTasks([...tasks, { id: docRef.id, name: newTaskName, completed: false, topics: [] }]);
      setNewTaskName("");
    }
    catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const toggleTaskDetails = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].showDetails = !updatedTasks[index].showDetails;
    setTasks(updatedTasks);
  };

  const handleTaskDetailChange = async (index, field, value) => {
    const updatedTasks = [...tasks];
    updatedTasks[index][field] = value;
    setTasks(updatedTasks);
  
    try {
      const docRef = doc(db, "tasks", updatedTasks[index].id);
      await updateDoc(docRef, { [field]: value });  // ✅ Update Firestore
    } catch (error) {
      console.error("Error updating task detail:", error);
    }
  };

  const handleSaveTask = async (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].isEditing = false;
    setTasks(updatedTasks);
  
    try {
      const docRef = doc(db, "tasks", updatedTasks[index].id);
      await updateDoc(docRef, updatedTasks[index]);  // ✅ Save entire task to Firestore
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const handleEditTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].isEditing = true;
    setTasks(updatedTasks);
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteDoc(doc(db, "tasks", taskId));
      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };
  

  const toggleCompletion = async (index) => {
    try{
      const updatedTasks = [...tasks];
      const task = updatedTasks[index];
      const docRef = doc(db, "tasks", task.id);
      await updateDoc(docRef, { completed: !task.completed });
      updatedTasks[index].completed = !task.completed;
      setTasks(updatedTasks);
    }catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleAddTopic = (index) => {
    if (newTopic.trim() !== "") {
      const updatedTasks = [...tasks];
      updatedTasks[index].topics.push(newTopic.trim());
      setTasks(updatedTasks);
      setNewTopic(""); // Clear input after adding topic
    }
  };

  return (
    <div className="task-container">
      <h2>Task List</h2>

      <div className="task-form">
        <input
          type="text"
          placeholder="Enter task name"
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
        />
        <button onClick={handleAddTask}>Add Task</button>
      </div>

      <ul className="task-list">
        {tasks.map((task, index) => (
          <li key={index} className={`task-item ${task.completed ? "completed" : ""}`}>
            <div className="task-header">
              <span className="task-name" onClick={() => toggleTaskDetails(index)}>
                {task.name}
              </span>
            </div>

            {task.showDetails && (
              <div className="task-details">
                {task.isEditing ? (
                  <>
                    <label>Subject:</label>
                    <input
                      type="text"
                      value={task.subject}
                      onChange={(e) => handleTaskDetailChange(index, "subject", e.target.value)}
                    />

                    <label>Topics:</label>
                    <div className="topic-input">
                      <input
                        type="text"
                        placeholder="Enter topic"
                        value={newTopic}
                        onChange={(e) => setNewTopic(e.target.value)}
                      />
                      <button onClick={() => handleAddTopic(index)}>Add Topic</button>
                    </div>
                    <ul className="topic-list">
                      {task.topics.map((topic, i) => (
                        <li key={i}>{topic}</li>
                      ))}
                    </ul>

                    <label>Task Start Date:</label>
                    <input
                      type="date"
                      value={task.startDate}
                      onChange={(e) => handleTaskDetailChange(index, "startDate", e.target.value)}
                    />

                    <label>Task End Date:</label>
                    <input
                      type="date"
                      value={task.endDate}
                      onChange={(e) => handleTaskDetailChange(index, "endDate", e.target.value)}
                    />

                    <label>Duration (hours):</label>
                    <input
                      type="number"
                      value={task.duration}
                      onChange={(e) => handleTaskDetailChange(index, "duration", e.target.value)}
                    />

                    <label>Start Time:</label>
                    <input
                      type="time"
                      value={task.startTime}
                      onChange={(e) => handleTaskDetailChange(index, "startTime", e.target.value)}
                    />

                    <label>End Time:</label>
                    <input
                      type="time"
                      value={task.endTime}
                      onChange={(e) => handleTaskDetailChange(index, "endTime", e.target.value)}
                    />

                    <label>Priority:</label>
                    <select
                      value={task.priority}
                      onChange={(e) => handleTaskDetailChange(index, "priority", e.target.value)}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>

                    <label>Tags:</label>
                    <input
                      type="text"
                      value={task.tags.join(", ")}
                      onChange={(e) => handleTaskDetailChange(index, "tags", e.target.value.split(", "))}
                    />

                    <label>
                      <input
                        type="checkbox"
                        checked={task.reminder}
                        onChange={(e) => handleTaskDetailChange(index, "reminder", e.target.checked)}
                      />
                      Set Reminder
                    </label>

                    <button onClick={() => handleSaveTask(index)}>Save Task</button>
                  </>
                ) : (
                  <>
                    <p><strong>Subject:</strong> {task.subject}</p>
                    <p><strong>Topics:</strong> {task.topics ? task.topics.join(", ") : "No topics"}</p>
                    <p><strong>Start Date:</strong> {task.startDate}</p>
                    <p><strong>End Date:</strong> {task.endDate}</p>
                    <p><strong>Duration:</strong> {task.duration} hours</p>
                    <p><strong>Start Time:</strong> {task.startTime}</p>
                    <p><strong>End Time:</strong> {task.endTime}</p>
                    <p><strong>Priority:</strong> {task.priority}</p>
                    <p><strong>Tags:</strong> {task.tags.join(", ")}</p>
                    <p><strong>Reminder Set:</strong> {task.reminder ? "Yes" : "No"}</p>

                    {!task.completed && (
                      <>
                        <button onClick={() => handleEditTask(index)}>Edit Task</button>
                        <button onClick={() => handleDeleteTask(index)}>Delete</button>
                      </>
                    )}

                    <label>
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleCompletion(index)}
                        disabled={task.completed}
                      />
                      Mark as Completed
                    </label>
                  </>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;