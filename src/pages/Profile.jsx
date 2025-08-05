import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Profile = () => {
  const { user } = useContext(AuthContext);
  return (
    <div className="p-6 text-dark">
      <h2 className="text-2xl font-bold">Hello, {user?.name}</h2>
      <p>{user?.isAdmin ? "Admin User" : "Regular User"}</p>
    </div>
  );
};
export default Profile;
