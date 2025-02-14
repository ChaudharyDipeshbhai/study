import { createContext, useContext, useState, useEffect } from "react";
import { db } from "./firebase"; // Firestore database
import { collection, onSnapshot } from "firebase/firestore";

// Create context
const TaskContext = createContext();

// Custom hook to use TaskContext
export const useTaskContext = () => useContext(TaskContext);

// Task Provider component
export const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]); // Store tasks

    // Fetch tasks from Firestore in real-time
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "tasks"), (snapshot) => {
            const taskData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setTasks(taskData);
        });

        return () => unsubscribe(); // Cleanup listener on unmount
    }, []);

    return (
        <TaskContext.Provider value={{ tasks }}>
            {children}
        </TaskContext.Provider>
    );
};
