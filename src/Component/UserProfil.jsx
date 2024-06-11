import { useAuth } from "react-auth-kit";

const UserProfile = () => {
  const { authState } = useAuth();

  if (authState.status === "loading") {
    return <div>Loading...</div>;
  }

  if (authState.status === "authenticated") {
    return <div>Welcome, {authState.user.username}!</div>;
  }

  return <div>Please log in to view this page.</div>;
};

export default UserProfile;
