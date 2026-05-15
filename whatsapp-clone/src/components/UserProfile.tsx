import React from "react";

interface User {
  username: string;
  email: string;
  bio?: string;
  phoneNumber?: string;
  profilePicture?: string;
  isOnline?: boolean;
}

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  onUpdate: () => void;
  user: User;
}

const UserProfileModal: React.FC<
  UserProfileModalProps
> = ({
  isOpen,
  onClose,
  onLogout,
  onUpdate,
  user,
}) => {
  /*
    Don't render if closed
  */
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      {/* Modal box */}
      <div
        className="w-full max-w-md bg-white rounded-3xl shadow-xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            User Profile
          </h2>

          <button
            onClick={onClose}
            className="text-xl"
          >
            ✕
          </button>
        </div>

        {/* Profile image */}
        <div className="flex justify-center mb-6">
          <img
            src={
              `http://localhost:4500/Images/Profile/${user?.profilePicture}` ||
              "https://via.placeholder.com/150"
            }
            alt="profile"
            className="w-28 h-28 rounded-full object-cover border"
          />
        </div>

        {/* User details */}
        <div className="space-y-4">
          <div>
            <p className="text-gray-500 text-sm">
              Username
            </p>
            <p className="font-medium">
              {user.username}
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">
              Email
            </p>
            <p className="font-medium">
              {user.email}
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">
              Bio
            </p>
            <p className="font-medium">
              {user.bio || "No bio added"}
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">
              Phone Number
            </p>
            <p className="font-medium">
              {user.phoneNumber ||
                "No phone number"}
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">
              Status
            </p>
            <p className="font-medium">
              {user.isOnline
                ? "Online"
                : "Offline"}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={onUpdate}
            className="flex-1 bg-blue-500 text-white py-3 rounded-xl"
          >
            Update Profile
          </button>

          <button
            onClick={onLogout}
            className="flex-1 bg-red-500 text-white py-3 rounded-xl"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;