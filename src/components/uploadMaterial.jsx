// import React, { useState } from "react";

// const UploadMaterials = ({ tasks = [] }) => {  // Ensure tasks is always an array
//   const [selectedTask, setSelectedTask] = useState(null);
//   const [uploads, setUploads] = useState({});

//   // Function to handle file selection
//   const handleFileUpload = (topic, files) => {
//     setUploads((prevUploads) => ({
//       ...prevUploads,
//       [topic]: [...(prevUploads[topic] || []), ...files],
//     }));
//   };

//   // Drag and Drop Handlers
//   const handleDragOver = (e) => e.preventDefault();
//   const handleDrop = (e, topic) => {
//     e.preventDefault();
//     const files = Array.from(e.dataTransfer.files);
//     handleFileUpload(topic, files);
//   };

//   return (
//     <div className="upload-container">
//       <h2>Upload Study Materials</h2>
//       <div className="task-list">
//         {tasks?.length > 0 ? (  // Check if tasks exist
//           tasks.map((task) => (
//             <button key={task.name} onClick={() => setSelectedTask(task)}>
//               {task.name}
//             </button>
//           ))
//         ) : (
//           <p>No tasks available</p>  // Show message if no tasks
//         )}
//       </div>

//       {selectedTask && (
//         <div className="upload-section">
//           <h3>Upload for: {selectedTask.name}</h3>
//           {selectedTask.topics?.length > 0 ? (  // Check if topics exist
//             selectedTask.topics.map((topic) => (
//               <div key={topic} className="topic-upload">
//                 <h4>{topic}</h4>
//                 <div
//                   className="drop-zone"
//                   onDragOver={handleDragOver}
//                   onDrop={(e) => handleDrop(e, topic)}
//                 >
//                   Drag & Drop files here or <input type="file" multiple onChange={(e) => handleFileUpload(topic, e.target.files)} />
//                 </div>
//                 <ul>
//                   {(uploads[topic] || []).map((file, index) => (
//                     <li key={index}>{file.name}</li>
//                   ))}
//                 </ul>
//               </div>
//             ))
//           ) : (
//             <p>No topics available</p>  // Show message if no topics
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default UploadMaterials;


// import React, { useState } from "react";

// const UploadMaterials = ({ tasks = [] }) => {  // Ensure tasks is always an array
//   const [selectedTask, setSelectedTask] = useState(null);
//   const [uploads, setUploads] = useState({});

//   // Function to handle file selection
//   const handleFileUpload = (topic, files) => {
//     setUploads((prevUploads) => ({
//       ...prevUploads,
//       [topic]: [...(prevUploads[topic] || []), ...files],
//     }));
//   };

//   // Drag and Drop Handlers
//   const handleDragOver = (e) => e.preventDefault();
//   const handleDrop = (e, topic) => {
//     e.preventDefault();
//     const files = Array.from(e.dataTransfer.files);
//     handleFileUpload(topic, files);
//   };

//   return (
//     <div className="upload-container">
//       <h2>Upload Study Materials</h2>
//       <div className="task-list">
//         {tasks?.length > 0 ? (  // Check if tasks exist
//           tasks.map((task) => (
//             <button key={task.name} onClick={() => setSelectedTask(task)}>
//               {task.name}
//             </button>
//           ))
//         ) : (
//           <p>No tasks available</p>  // Show message if no tasks
//         )}
//       </div>

//       {selectedTask && (
//         <div className="upload-section">
//           <h3>Upload for: {selectedTask.name}</h3>
//           {selectedTask.topics?.length > 0 ? (  // Check if topics exist
//             selectedTask.topics.map((topic) => (
//               <div key={topic} className="topic-upload">
//                 <h4>{topic}</h4>
//                 <div
//                   className="drop-zone"
//                   onDragOver={handleDragOver}
//                   onDrop={(e) => handleDrop(e, topic)}
//                 >
//                   Drag & Drop files here or <input type="file" multiple onChange={(e) => handleFileUpload(topic, e.target.files)} />
//                 </div>
//                 <ul>
//                   {(uploads[topic] || []).map((file, index) => (
//                     <li key={index}>{file.name}</li>
//                   ))}
//                 </ul>
//               </div>
//             ))
//           ) : (
//             <p>No topics available</p>  // Show message if no topics
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default UploadMaterials;



import React, { useState, useEffect } from "react";
import { db } from "../firebase"; // Firestore import
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import "../assets/css/uploadMaterial.css"; // Ensure proper styling

const UploadMaterial = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [fileLink, setFileLink] = useState(""); // 🔹 Store File URL
  const [youtubeLink, setYoutubeLink] = useState("");

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

