import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { db,auth } from "../firebase"; // Firestore import
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import "../assets/css/uploadMaterial.css"; // Ensure proper styling
import { checkAuth } from "../helpers";
import { query, where } from "firebase/firestore";

const UploadMaterial = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [fileLink, setFileLink] = useState(""); // 🔹 Store File URL
  const [youtubeLink, setYoutubeLink] = useState("");

  // 📌 Fetch tasks from Firestore
  const navigate = useNavigate();

useEffect(() => {
  if (!checkAuth()) {
    navigate("/login");
    return;
  }

  const fetchTasks = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(collection(db, "tasks"), where("userId", "==", user.uid)); // ✅ Fetch tasks only for the logged-in user
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

  fetchTasks(); // ✅ Call the function inside useEffect
}, [navigate]); // ✅ Add dependencies (so it re-runs if `navigate` changes)


  // 📌 Upload File Link to Firestore
  const uploadFileLink = async () => {
    if (!selectedTask || !fileLink.trim()) {
      alert("Please select a task and provide a valid file link!");
      return;
    }

    const taskRef = doc(db, "tasks", selectedTask.id);
    await updateDoc(taskRef, {
      materials: selectedTask.materials ? [...selectedTask.materials, fileLink] : [fileLink],
    });

    alert("File link saved successfully!");
    setFileLink("");
  };

  // 📌 Upload YouTube Link to Firestore
  const uploadYoutubeLink = async () => {
    if (!selectedTask || !youtubeLink.trim()) {
      alert("Please select a task and enter a YouTube link!");
      return;
    }

    const taskRef = doc(db, "tasks", selectedTask.id);
    await updateDoc(taskRef, {
      materials: selectedTask.materials ? [...selectedTask.materials, youtubeLink] : [youtubeLink],
    });

    alert("YouTube link uploaded successfully!");
    setYoutubeLink("");
  };

  return (
    <div className="upload-container">
      <h2>📂 Upload Study Materials</h2>

      {/* 🔽 Task Selection */}
      <select onChange={(e) => setSelectedTask(tasks.find(task => task.id === e.target.value))}>
        <option value="">Select a Task</option>
        {tasks.map((task) => (
          <option key={task.id} value={task.id}>
            {task.name}
          </option>
        ))}
      </select>

      {/* 🔼 File Upload (Link Only) */}
      <input
        type="text"
        placeholder="Paste file link (Google Drive, Dropbox, etc.)"
        value={fileLink}
        onChange={(e) => setFileLink(e.target.value)}
      />
      <button onClick={uploadFileLink}>Save File Link</button>

      {/* 🎥 YouTube Video Upload */}
      <input
        type="text"
        placeholder="Paste YouTube video link"
        value={youtubeLink}
        onChange={(e) => setYoutubeLink(e.target.value)}
      />
      <button onClick={uploadYoutubeLink}>Save YouTube Link</button>
    </div>
  );
};

export default UploadMaterial;

