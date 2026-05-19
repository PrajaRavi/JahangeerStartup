import { X } from "lucide-react";
import React, {
  useState,
  ChangeEvent,
} from "react";

interface User {
  _id: string;
  username: string;
  email: string;
  profilePicture: string;
  phoneNumber: string;
}

/*
  Enum values matching backend
*/
type GroupSetting =
  | "onlyAdminsCanSend"
  | "onlyAdminsCanEditInfo"
  | "approveNewMembers";

interface CreateGroupPayload {
  groupName: string;
  groupDescription: string;
  groupProfile: File | null;
  selectedUsers: User[];
  settings: GroupSetting[];
}

interface CreateGroupPageProps {
  users: User[];
  onCreateGroup: (
    payload: CreateGroupPayload
  ) => void;
  setSelectedOption: React.Dispatch<
    React.SetStateAction<string>
  >;
  
}

const CreateGroupPage: React.FC<
  CreateGroupPageProps
> = ({
  users,
  onCreateGroup,
  setSelectedOption,
}) => {
  const [step, setStep] =
    useState<number>(1);

  const [search, setSearch] =
    useState<string>("");

  const [selectedUsers, setSelectedUsers] =
    useState<User[]>([]);

  const [groupName, setGroupName] =
    useState<string>("");

  const [
    groupDescription,
    setGroupDescription,
  ] = useState<string>("");

  const [groupProfile, setGroupProfile] =
    useState<File | null>(null);

  const [groupPreview, setGroupPreview] =
    useState<string>("");

  /*
    Settings now stored as enum array
  */
  const [settings, setSettings] =
    useState<GroupSetting[]>([]);

  /*
    Select member
  */
  const handleSelectUser = (
    user: User
  ) => {
    const exists =
      selectedUsers.some(
        (u) => u._id === user._id
      );

    if (exists) return;

    setSelectedUsers((prev) => [
      ...prev,
      user,
    ]);
  };

  /*
    Remove member
  */
  const handleDeselectUser = (
    userId: string
  ) => {
    setSelectedUsers((prev) =>
      prev.filter(
        (u) => u._id !== userId
      )
    );
  };

  /*
    Group image preview
  */
  const handleProfileChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      e.target.files?.[0] || null;

    if (file) {
      setGroupProfile(file);
      setGroupPreview(
        URL.createObjectURL(file)
      );
    }
  };

  /*
    Toggle enum setting
  */
  const toggleSetting = (
    setting: GroupSetting
  ) => {
    setSettings((prev) => {
      const exists =
        prev.includes(setting);

      if (exists) {
        return prev.filter(
          (item) => item !== setting
        );
      }

      return [...prev, setting];
    });
  };

  /*
    Check if enabled
  */
  const isSettingEnabled = (
    setting: GroupSetting
  ) => {
    return settings.includes(
      setting
    );
  };

  /*
    Final payload
  */
  const handleCreateGroup = () => {
    onCreateGroup({
      groupName,
      groupDescription,
      groupProfile,
      selectedUsers,
      settings,
    });
  };

  const filteredUsers = users.filter(
(user) =>
      
      user.username
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      user.email
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full absolute top-0 left-0 z-30 glass flex justify-center p-4">
      <X
        size={30}
        className="absolute top-20 right-20 cursor-pointer"
        onClick={() =>
          setSelectedOption("")
        }
      />

      <div className="w-[60vw] bg-white rounded-3xl shadow-lg overflow-y-scroll">
        {/* STEP 1 */}
        {step === 1 && (
          <>
            <div className="p-4 border-b">
              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                className="w-full border rounded-xl p-3 outline-none"
              />
            </div>

            {selectedUsers.length >
              0 && (
              <div className="p-4 border-b flex gap-3 overflow-x-auto">
                {selectedUsers.map(
                  (user) => (
                    <div
                      key={user._id}
                      className="flex items-center gap-2 bg-gray-200 rounded-full px-3 py-2 shrink-0"
                    >
                      <img
                        src={`http://localhost:4500/Images/Profile/${user.profilePicture}`}
                        alt={
                          user.username
                        }
                        className="w-8 h-8 rounded-full"
                      />

                      <span>
                        {
                          user.username
                        }
                      </span>

                      <button
                        onClick={() =>
                          handleDeselectUser(
                            user._id
                          )
                        }
                      >
                        ✕
                      </button>
                    </div>
                  )
                )}
              </div>
            )}

            <div className="max-h-[450px] overflow-y-auto">
              {filteredUsers.map(
                (user) => {
                  const isSelected =
                    selectedUsers.some(
                      (u) =>
                        u._id ===
                        user._id
                    );

                  return (
                    <div
                      key={user._id}
                      onClick={() =>
                        isSelected
                          ? handleDeselectUser(
                              user._id
                            )
                          : handleSelectUser(
                              user
                            )
                      }
                      className={`flex items-center gap-4 p-4 border-b cursor-pointer ${
                        isSelected
                          ? "bg-green-50"
                          : ""
                      }`}
                    >
                      <img
                        src={`http://localhost:4500/Images/Profile/${user.profilePicture}`}
                        alt={
                          user.username
                        }
                        className="w-12 h-12 rounded-full"
                      />

                      <div>
                        <h3 className="font-semibold">
                          {
                            user.username
                          }
                        </h3>

                        <p className="text-sm text-gray-500">
                          {
                            user.email
                          }
                        </p>
                      </div>
                    </div>
                  );
                }
              )}
            </div>

            <div className="p-4 border-t">
              <button
                disabled={
                  selectedUsers.length ===
                  0
                }
                onClick={() =>
                  setStep(2)
                }
                className="w-full bg-black text-white py-3 rounded-xl"
              >
                Next (
                {
                  selectedUsers.length
                }
                )
              </button>
            </div>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <div className="p-5 border-b flex items-center gap-4">
              <button
                onClick={() =>
                  setStep(1)
                }
              >
                ←
              </button>

              <h1 className="text-2xl font-bold">
                Group Details
              </h1>
            </div>

            <div className="p-5 space-y-5">
              <div className="flex justify-center">
                <label className="cursor-pointer">
                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={
                      handleProfileChange
                    }
                  />

                  <img
                    src={
                      groupPreview ||
                      "https://via.placeholder.com/150"
                    }
                    alt="group"
                    className="w-24 h-24 rounded-full object-cover border"
                  />
                </label>
              </div>

              <input
                type="text"
                placeholder="Group name"
                value={groupName}
                onChange={(e) =>
                  setGroupName(
                    e.target.value
                  )
                }
                className="w-full border rounded-xl p-3"
              />

              <textarea
                placeholder="Group description"
                value={
                  groupDescription
                }
                onChange={(e) =>
                  setGroupDescription(
                    e.target.value
                  )
                }
                className="w-full border rounded-xl p-3 resize-none"
                rows={4}
              />

              {/* Enum settings */}
              <div className="space-y-4">
                <h2 className="font-bold text-lg">
                  Group Settings
                </h2>

                {[
                  "onlyAdminsCanSend",
                  "onlyAdminsCanEditInfo",
                  "approveNewMembers",
                ].map((setting) => (
                  <label
                    key={setting}
                    className="flex justify-between"
                  >
                    <span>
                      {setting}
                    </span>

                    <input
                      type="checkbox"
                      checked={isSettingEnabled(
                        setting as GroupSetting
                      )}
                      onChange={() =>
                        toggleSetting(
                          setting as GroupSetting
                        )
                      }
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Selected members */}
            <div className="border-t p-4">
              <h3 className="font-semibold mb-3">
                Selected Members
              </h3>

              <div className="flex gap-4 overflow-x-auto">
                {selectedUsers.map(
                  (user) => (
                    <div
                      key={user._id}
                      className="flex flex-col items-center shrink-0"
                    >
                      <img
                        src={`http://localhost:4500/Images/Profile/${user.profilePicture}`}
                        alt={
                          user.username
                        }
                        className="w-14 h-14 rounded-full"
                      />

                      <span className="text-sm mt-2">
                        {user.username.length >
                        7
                          ? user.username.slice(
                              0,
                              7
                            ) + "..."
                          : user.username}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="p-4 border-t">
              <button
                onClick={
                  handleCreateGroup
                }
                disabled={
                  !groupName.trim()
                }
                className="w-full bg-black text-white py-3 rounded-xl"
              >
                Create Group
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CreateGroupPage;