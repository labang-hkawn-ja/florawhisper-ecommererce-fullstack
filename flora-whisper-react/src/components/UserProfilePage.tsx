import { useState, useEffect } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendar,
  FaEdit,
  FaSave,
  FaTimes,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { Fade } from "react-awesome-reveal";
import {
  getCurrentUserProfile,
  updateUserProfile,
  type UserProfileDto,
} from "../service/UserService";
import { AxiosError } from "axios";
import { changePasswordApiCall, logoutApiCall } from "../service/AuthService";

interface PasswordChange {
  currentPassword: string;
  newPassword: string;
}

export default function UserProfilePage() {
  const [user, setUser] = useState<UserProfileDto | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [editedUser, setEditedUser] = useState<
    Partial<UserProfileDto & { imgFile?: File }>
  >({});

  const [passwordData, setPasswordData] = useState<PasswordChange>({
    currentPassword: "",
    newPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
  });
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const response = await getCurrentUserProfile();
        const fetchedUser: UserProfileDto = response.data;
        setUser(fetchedUser);
        setEditedUser(fetchedUser);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleEdit = () => {
    setEditedUser({ ...user });
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const formData = new FormData();

      // Only include fields that have changed
      if (editedUser.username && editedUser.username !== user.username) {
        formData.append("username", editedUser.username);
      }
      if (editedUser.email && editedUser.email !== user.email) {
        formData.append("email", editedUser.email);
      }
      if (editedUser.firstName && editedUser.firstName !== user.firstName) {
        formData.append("firstName", editedUser.firstName);
      }
      if (editedUser.lastName && editedUser.lastName !== user.lastName) {
        formData.append("lastName", editedUser.lastName);
      }
      if (editedUser.phone && editedUser.phone !== user.phone) {
        formData.append("phone", editedUser.phone);
      }
      if (editedUser.imgFile) {
        formData.append("img", editedUser.imgFile);
      }

      if (Array.from(formData.entries()).length > 0) {
        await updateUserProfile(user.id, formData);
      }

      const response = await getCurrentUserProfile();
      const updatedUser: UserProfileDto = response.data;
      setUser(updatedUser);
      setEditedUser(updatedUser);

      setIsEditing(false);
    } catch (error: unknown) {
      console.error("Error updating user profile:", error);

      let errorMessage = "Failed to update profile";

      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.message || error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      setPasswordError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedUser({ ...user });
    setIsEditing(false);
    setPasswordError("");
  };

  const handleInputChange = (field: keyof UserProfileDto, value: string) => {
    setEditedUser((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePasswordChange = (field: keyof PasswordChange, value: string) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setPasswordError("");
  };

  const handleChangePassword = async () => {
    if (!user) return;

    if (!passwordData.currentPassword) {
      setPasswordError("Please enter your current password");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      await changePasswordApiCall(user.id, passwordData);

      setPasswordData({
        currentPassword: "",
        newPassword: "",
      });
      setIsChangingPassword(false);
      setPasswordError("");

      // Show success message
      setPasswordError(""); 
      logoutApiCall();
      alert("Password changed successfully!");
    } catch (error: unknown) {
      const err = error as AxiosError<{ error?: string; message?: string }>;
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to change password. Please check your current password.";
      setPasswordError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelPasswordChange = () => {
    setPasswordData({
      currentPassword: "",
      newPassword: "",
    });
    setPasswordError("");
    setIsChangingPassword(false);
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target?.result as string;
        const base64Data = base64String.split(",")[1];
        setEditedUser((prev) => ({
          ...prev,
          imgFile: file,
          img: base64Data, // Store Base64 data for preview
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-emerald-700">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-emerald-700">Failed to load user profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-15 min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Fade direction="down" duration={600}>
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-emerald-900 mb-4">
              Your Green Profile
            </h1>
            <p className="text-emerald-700 text-lg">
              Manage your personal information and plant preferences
            </p>
          </div>
        </Fade>

        {passwordError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-center">
            {passwordError}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Fade direction="left" duration={600}>
              <div className="bg-white rounded-3xl shadow-xl p-6 border border-emerald-100">
                {/* Profile Image */}
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <div className="w-32 h-32 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden border-4 border-emerald-200">
                      {editedUser.img || user.img ? (
                        <img
                          src={
                            editedUser.img
                              ? `data:image/jpeg;base64,${editedUser.img}`
                              : `data:image/jpeg;base64,${user.img}`
                          }
                          alt="Profile"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://via.placeholder.com/150?text=No+Image";
                          }}
                        />
                      ) : (
                        <FaUser className="text-4xl text-emerald-600" />
                      )}
                    </div>
                    {isEditing && (
                      <label className="absolute bottom-2 right-2 bg-emerald-600 text-white p-2 rounded-full cursor-pointer hover:bg-emerald-700 transition-colors">
                        <FaEdit className="text-sm" />
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                      </label>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-emerald-900">
                    {editedUser.firstName || user.firstName}{" "}
                    {editedUser.lastName || user.lastName}
                  </h2>
                  <p className="text-emerald-600">
                    @{editedUser.username || user.username}
                  </p>
                </div>

                {/* Member Since */}
                <div className="flex items-center justify-center gap-3 text-emerald-700 mb-6 p-3 bg-emerald-50 rounded-xl">
                  <FaCalendar className="text-emerald-600" />
                  <span>Member since {formatDate(user.createdAt)}</span>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  {!isEditing && !isChangingPassword ? (
                    <>
                      <button
                        onClick={handleEdit}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                      >
                        <FaEdit />
                        Edit Profile
                      </button>
                      <button
                        onClick={() => setIsChangingPassword(true)}
                        className="w-full border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <FaLock />
                        Change Password
                      </button>
                    </>
                  ) : isEditing ? (
                    <div className="space-y-3">
                      <button
                        onClick={handleSave}
                        disabled={loading}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {loading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <FaSave />
                        )}
                        {loading ? "Saving..." : "Save Changes"}
                      </button>
                      <button
                        onClick={handleCancel}
                        className="w-full border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <FaTimes />
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <button
                        onClick={handleChangePassword}
                        disabled={loading}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {loading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <FaLock />
                        )}
                        {loading ? "Changing..." : "Change Password"}
                      </button>
                      <button
                        onClick={handleCancelPasswordChange}
                        className="w-full border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <FaTimes />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </Fade>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <Fade direction="right" duration={600}>
              <div className="bg-white rounded-3xl shadow-xl p-6 border border-emerald-100">
                {isChangingPassword ? (
                  <>
                    <h3 className="text-2xl font-bold text-emerald-900 mb-6">
                      Change Password
                    </h3>

                    {passwordError && (
                      <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                        {passwordError}
                      </div>
                    )}

                    <div className="space-y-6">
                      {/* Current Password */}
                      <div>
                        <label className="block text-sm font-medium text-emerald-700 mb-2">
                          Current Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPasswords.current ? "text" : "password"}
                            value={passwordData.currentPassword}
                            onChange={(e) =>
                              handlePasswordChange(
                                "currentPassword",
                                e.target.value
                              )
                            }
                            className="w-full px-4 py-3 border text-emerald-600 border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 pr-12"
                            placeholder="Enter your current password"
                          />
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility("current")}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-600 hover:text-emerald-700"
                          >
                            {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                      </div>

                      {/* New Password */}
                      <div>
                        <label className="block text-sm font-medium text-emerald-700 mb-2">
                          New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPasswords.new ? "text" : "password"}
                            value={passwordData.newPassword}
                            onChange={(e) =>
                              handlePasswordChange(
                                "newPassword",
                                e.target.value
                              )
                            }
                            className="w-full px-4 py-3 border text-emerald-600 border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 pr-12"
                            placeholder="Enter new password"
                          />
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility("new")}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-600 hover:text-emerald-700"
                          >
                            {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-2xl font-bold text-emerald-900 mb-6">
                      Personal Information
                    </h3>

                    <div className="space-y-6">
                      {/* Username */}
                      <div>
                        <label className="block text-sm font-medium text-emerald-700 mb-2">
                          Username
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editedUser.username || ""}
                            onChange={(e) =>
                              handleInputChange("username", e.target.value)
                            }
                            className="w-full px-4 py-3 border text-emerald-600 border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                          />
                        ) : (
                          <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl">
                            <FaUser className="text-emerald-600" />
                            <span className="text-emerald-900">
                              @{user.username}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-medium text-emerald-700 mb-2">
                          Email Address
                        </label>
                        {isEditing ? (
                          <input
                            type="email"
                            value={editedUser.email || ""}
                            onChange={(e) =>
                              handleInputChange("email", e.target.value)
                            }
                            className="w-full px-4 py-3 border text-emerald-600 border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                          />
                        ) : (
                          <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl">
                            <FaEnvelope className="text-emerald-600" />
                            <span className="text-emerald-900">
                              {user.email}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* First Name & Last Name */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-emerald-700 mb-2">
                            First Name
                          </label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editedUser.firstName || ""}
                              onChange={(e) =>
                                handleInputChange("firstName", e.target.value)
                              }
                              className="w-full px-4 py-3 border text-emerald-600 border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                            />
                          ) : (
                            <div className="p-3 bg-emerald-50 rounded-xl">
                              <span className="text-emerald-900">
                                {user.firstName}
                              </span>
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-emerald-700 mb-2">
                            Last Name
                          </label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editedUser.lastName || ""}
                              onChange={(e) =>
                                handleInputChange("lastName", e.target.value)
                              }
                              className="w-full px-4 py-3 border text-emerald-600 border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                            />
                          ) : (
                            <div className="p-3 bg-emerald-50 rounded-xl">
                              <span className="text-emerald-900">
                                {user.lastName}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-sm font-medium text-emerald-700 mb-2">
                          Phone Number
                        </label>
                        {isEditing ? (
                          <input
                            type="tel"
                            value={editedUser.phone || ""}
                            onChange={(e) =>
                              handleInputChange("phone", e.target.value)
                            }
                            className="w-full px-4 py-3 border text-emerald-600 border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                          />
                        ) : (
                          <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl">
                            <FaPhone className="text-emerald-600" />
                            <span className="text-emerald-900">
                              {user.phone}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </Fade>
          </div>
        </div>
      </div>
    </div>
  );
}
