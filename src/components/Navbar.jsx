import { Link } from "react-router-dom";
import { auth, db } from "../firebase";
import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import "../assets/css/navbar.css";

function Navbar() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <nav className="navbar">
      <div className="logo">StudyBuddy</div>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/tasklist">Task List</Link></li>
        <li><Link to="/calander">Calander</Link></li>
        <li><Link to="/timetable">Timetable</Link></li>
        <li><Link to="/upload">Upload Materials</Link></li>
        <li><Link to="/progress">Progress</Link></li>
        {user ? (
          <>
            <li><Link to="/start-task">Start Task</Link></li>  {/* ✅ Added Start Task Option */}
            <li>👤 {userData?.name}</li>
            <li><button onClick={handleLogout}>Logout</button></li>
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Sign Up</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
