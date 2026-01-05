// components/DashboardSidebar.tsx
import { useState, type JSX } from "react";
import {
  FaLeaf,
  FaHome,
  FaSeedling,
  FaShoppingCart,
  FaUser,
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight,
  FaEdit,
} from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  logoutApiCall,
  getLoggedInUserName,
  getLoggedInUserRole,
} from "../service/AuthService";
import { RiEdit2Fill } from "react-icons/ri";
import { GiFlowerPot } from "react-icons/gi";

interface SidebarItem {
  name: string;
  icon: JSX.Element;
  path: string;
  roles?: string[];
  matchSubpaths?: boolean;
}

export default function DashboardSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const userName = getLoggedInUserName();
  const userRole = getLoggedInUserRole();

  const sidebarItems: SidebarItem[] = [
    {
      name: "Dashboard",
      icon: <FaHome className="text-lg" />,
      path: "/dashboard",
    },
    {
      name: "Plants",
      icon: <FaLeaf className="text-lg" />,
      path: "/plants",
    },
    {
      name: "Create Plant",
      icon: <FaEdit className="text-lg" />,
      path: "/plants/create",
      matchSubpaths: true,
    },
    {
      name: "Flower Meaning",
      icon: <FaSeedling className="text-lg" />,
      path: "/flower-meanings",
    },
    {
      name: "Edit Flower Meaning",
      icon: <RiEdit2Fill className="text-lg" />,
      path: "/flower-meanings/create",
      matchSubpaths: true,
    },
    {
      name: "Checkout Orders",
      icon: <FaShoppingCart className="text-lg" />,
      path: "/checkouts",
    },
    {
      name: "Profile",
      icon: <FaUser className="text-lg" />,
      path: "/user-profile",
    },
  ];

  const handleLogout = () => {
    logoutApiCall();
    navigate("/login");
  };

  const isActive = (item: SidebarItem) => {
    const path = item.path;
    if (item.matchSubpaths) {
      return (
        location.pathname === path || location.pathname.startsWith(path + "/")
      );
    }
    return location.pathname === path;
  };

  return (
    <div
      className={`bg-white shadow-xl border-r border-emerald-100 transition-all duration-300 flex flex-col ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="p-6 border-b border-emerald-100">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <Link to="/dashboard" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                <GiFlowerPot className="text-4xl text-white animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-emerald-900">
                  FloraWhisper
                </h1>
                <p className="text-xs text-emerald-600">Dashboard</p>
              </div>
            </Link>
          )}
          {isCollapsed && (
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto">
              <GiFlowerPot className="text-3xl text-white animate-pulse" />
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-emerald-50 text-emerald-600 transition-colors"
          >
            {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
          </button>
        </div>
      </div>

      {/* User Info */}
      {!isCollapsed && (
        <div className="p-4 border-b border-emerald-100">
          <div className="bg-emerald-50 rounded-xl p-4 text-center">
            <h3 className="font-semibold text-emerald-900 truncate">
              Hello, @{userName}
            </h3>
            <p className="text-xs pt-3 text-emerald-600 capitalize">
              {userRole?.replace("ROLE_", "").toLowerCase()}
            </p>
          </div>
        </div>
      )}

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item) => {
          // Check if user has required role for this item
          if (item.roles && userRole && !item.roles.includes(userRole)) {
            return null;
          }

          const active = isActive(item);

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 group ${
                active
                  ? "bg-emerald-500 text-white shadow-lg transform scale-105"
                  : "text-emerald-700 hover:bg-emerald-50 hover:text-emerald-900 hover:shadow-md"
              }`}
            >
              <div
                className={`flex-shrink-0 ${
                  active
                    ? "text-white"
                    : "text-emerald-500 group-hover:text-emerald-600"
                }`}
              >
                {item.icon}
              </div>
              {!isCollapsed && (
                <span className="font-medium whitespace-nowrap">
                  {item.name}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-emerald-100">
        <button
          onClick={handleLogout}
          className={`flex items-center space-x-3 w-full p-3 rounded-xl text-emerald-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <FaSignOutAlt className="text-lg group-hover:text-red-600" />
          {!isCollapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
}
