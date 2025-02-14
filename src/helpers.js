import { auth } from "./firebase"; // Import Firebase authentication

export const checkAuth = () => {
  const user = auth.currentUser;
  if (!user) {
    alert("You need to be logged in to access this feature.");
    return false; // Stop the action if the user is not logged in
  }
  return true; // Allow action if the user is logged in
};
