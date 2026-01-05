import { useState, useEffect, type JSX } from "react";
import {
  FaLeaf,
  FaUser,
  FaShoppingCart,
  FaChartLine,
  FaSeedling,
  FaDollarSign,
  FaCalendarAlt,
  FaTags,
  FaLanguage,
  FaStar,
} from "react-icons/fa";
import { Fade } from "react-awesome-reveal";
import { Link } from "react-router-dom";
import {
  isLoggedIn,
  getLoggedInUserName,
  getLoggedInUserRole,
  isBankUser,
} from "../service/AuthService";

import type { PlantDto } from "../dto/PlantDto";
import type { FlowerLanguageDto } from "../dto/FlowerLanguageDto";
import {
  getAllCategoriesApiCall,
  getAllFlowerMeaningsApiCall,
  getAllOrdersApiCall,
  getAllPlantsApiCall,
  type CheckoutResponseDto,
} from "../service/FloraService";

interface DashboardStats {
  totalPlants: number;
  totalFlowers: number;
  totalCategories: number;
  totalOrders: number;
  revenue: number;
}

interface TopPlant {
  id: number;
  name: string;
  checkoutCount: number;
  imageUrl?: string;
}

interface RecentActivity {
  id: number;
  type: "order" | "flower_added" | "plant_added";
  title: string;
  description: string;
  time: string;
  icon: JSX.Element;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPlants: 0,
    totalFlowers: 0,
    totalCategories: 0,
    totalOrders: 0,
    revenue: 0,
  });
  const [topPlants, setTopPlants] = useState<TopPlant[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [isBank, setIsBank] = useState(false);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);

      try {
        // Fetch all data from your actual APIs
        const [
          plantsResponse,
          flowersResponse,
          categoriesResponse,
          ordersResponse,
        ] = await Promise.all([
          getAllPlantsApiCall(),
          getAllFlowerMeaningsApiCall(),
          getAllCategoriesApiCall(),
          getAllOrdersApiCall(),
        ]);

        const plants: PlantDto[] = plantsResponse.data || [];
        const flowers: FlowerLanguageDto[] = flowersResponse.data || [];
        const categories = categoriesResponse.data || [];
        const orders: CheckoutResponseDto[] = ordersResponse.data || [];

        // Calculate total revenue from orders
        const totalRevenue = calculateTotalRevenue(orders);

        // Calculate total orders
        const totalOrders = orders.length;

        // Find top 3 most checked out plants
        const topCheckedOutPlants = findTopCheckedOutPlants(orders, plants);

        setStats({
          totalPlants: plants.length,
          totalFlowers: flowers.length,
          totalCategories: categories.length,
          totalOrders: totalOrders,
          revenue: totalRevenue,
        });

        setTopPlants(topCheckedOutPlants);

        // Generate recent activities from the data
        const activities = generateRecentActivities(flowers, orders, plants);
        setRecentActivities(activities);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
        // Fallback to actual counts even if some APIs fail
        setStats({
          totalPlants: 0,
          totalFlowers: 0,
          totalCategories: 0,
          totalOrders: 0,
          revenue: 0,
        });
        setTopPlants([]);
        setRecentActivities([]);
      }

      setLoading(false);
    };

    if (isLoggedIn()) {
      setUserName(getLoggedInUserName() || "");
      setUserRole(getLoggedInUserRole() || "");
      setIsBank(isBankUser());
    }

    loadDashboardData();
  }, []);

  // Calculate total revenue from orders
  const calculateTotalRevenue = (orders: CheckoutResponseDto[]): number => {
    return orders.reduce((sum: number, order: CheckoutResponseDto) => {
      return sum + (order.totalAmount || 0);
    }, 0);
  };

  // Find top 3 most checked out plants
  const findTopCheckedOutPlants = (
    orders: CheckoutResponseDto[],
    plants: PlantDto[]
  ): TopPlant[] => {
    const plantCheckoutCount: { [key: number]: number } = {};

    // Count checkouts for each plant
    orders.forEach((order: CheckoutResponseDto) => {
      if (order.plants && Array.isArray(order.plants)) {
        order.plants.forEach((plant: PlantDto) => {
          const plantId = plant.plantId;
          if (plantId) {
            plantCheckoutCount[plantId] =
              (plantCheckoutCount[plantId] || 0) + 1;
          }
        });
      }

      // Also check plantQuantities map
      if (order.plantQuantities && order.plantQuantities instanceof Map) {
        order.plantQuantities.forEach((quantity: number, plantId: number) => {
          plantCheckoutCount[plantId] =
            (plantCheckoutCount[plantId] || 0) + quantity;
        });
      } else if (
        order.plantQuantities &&
        typeof order.plantQuantities === "object"
      ) {
        // Handle case where plantQuantities is a plain object
        Object.entries(order.plantQuantities).forEach(([plantId, quantity]) => {
          const id = parseInt(plantId);
          plantCheckoutCount[id] =
            (plantCheckoutCount[id] || 0) + (quantity as number);
        });
      }
    });

    // Create array of plants with checkout counts
    const plantsWithCounts = plants.map((plant: PlantDto) => ({
      id: plant.plantId!,
      name: plant.name || "Unknown Plant",
      checkoutCount: plantCheckoutCount[plant.plantId!] || 0,
      imageUrl: plant.imageUrl,
    }));

    // Sort by checkout count descending and take top 3
    return plantsWithCounts
      .filter((plant) => plant.checkoutCount > 0) // Only show plants that have been checked out
      .sort((a, b) => b.checkoutCount - a.checkoutCount)
      .slice(0, 3);
  };

  // Generate recent activities from actual data
  const generateRecentActivities = (
    flowers: FlowerLanguageDto[],
    orders: CheckoutResponseDto[],
    plants: PlantDto[]
  ): RecentActivity[] => {
    const activities: RecentActivity[] = [];

    // Add recent orders (most recent first)
    const recentOrders = orders
      .sort(
        (a, b) =>
          new Date(b.orderDate || 0).getTime() -
          new Date(a.orderDate || 0).getTime()
      )
      .slice(0, 2)
      .map((order: CheckoutResponseDto, index: number) => ({
        id: order.id || index + 1,
        type: "order" as const,
        title: "New Order",
        description: `Order ${order.orderCode || `#${order.id}`} - $${
          order.totalAmount?.toFixed(2) || "0.00"
        }`,
        time: formatTime(order.orderDate),
        icon: <FaShoppingCart className="text-emerald-600" />,
      }));

    // Add recent flower meanings (use id for sorting if no createdAt)
    const recentFlowers = flowers
      .sort((a, b) => (b.id || 0) - (a.id || 0)) // Sort by ID descending (assuming newer ones have higher IDs)
      .slice(0, 1)
      .map((flower: FlowerLanguageDto, index: number) => ({
        id: flower.id || index + 100,
        type: "flower_added" as const,
        title: "Flower Meaning Added",
        description: `${flower.name || "Unknown"} meaning added`,
        time: "Recently",
        icon: <FaLanguage className="text-purple-500" />,
      }));

    // Add recent plants (use plantId for sorting if no createdAt)
    const recentPlants = plants
      .sort((a, b) => (b.plantId || 0) - (a.plantId || 0)) // Sort by plantId descending
      .slice(0, 1)
      .map((plant: PlantDto, index: number) => ({
        id: plant.plantId || index + 200,
        type: "plant_added" as const,
        title: "New Plant Added",
        description: `${plant.name} added to collection`,
        time: "Recently",
        icon: <FaLeaf className="text-green-500" />,
      }));

    activities.push(...recentOrders, ...recentFlowers, ...recentPlants);

    return activities.slice(0, 4);
  };

  // Format time for activities
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatTime = (timestamp: any): string => {
    if (!timestamp) return "Recently";

    try {
      const now = new Date();
      const activityTime = new Date(timestamp);
      const diffInHours = Math.floor(
        (now.getTime() - activityTime.getTime()) / (1000 * 60 * 60)
      );

      if (diffInHours < 1) return "Just now";
      if (diffInHours < 24) return `${diffInHours} hours ago`;
      if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} days ago`;
      return activityTime.toLocaleDateString();
    } catch (error) {
      console.error("Error formatting time:", error);
      return "Recently";
    }
  };

  const StatCard = ({
    title,
    value,
    icon,
  }: {
    title: string;
    value: string | number;
    icon: JSX.Element;
  }) => (
    <Fade direction="up" duration={600} triggerOnce>
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-emerald-600 text-sm font-medium mb-1">{title}</p>
            <p className="text-3xl font-bold text-emerald-900">{value}</p>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
            {icon}
          </div>
        </div>
      </div>
    </Fade>
  );

  const QuickActionCard = ({
    title,
    description,
    icon,
    link,
    color = "emerald",
  }: {
    title: string;
    description: string;
    icon: JSX.Element;
    link: string;
    color?: "emerald" | "teal" | "amber" | "purple" | "blue";
  }) => {
    const colorClasses = {
      emerald: "bg-emerald-500 hover:bg-emerald-600",
      teal: "bg-teal-500 hover:bg-teal-600",
      amber: "bg-amber-500 hover:bg-amber-600",
      purple: "bg-purple-500 hover:bg-purple-600",
      blue: "bg-blue-500 hover:bg-blue-600",
    };

    return (
      <Fade direction="up" duration={600} triggerOnce>
        <Link
          to={link}
          className="block bg-white rounded-2xl shadow-lg p-6 border border-emerald-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
        >
          <div className="flex items-start justify-between mb-4">
            <div
              className={`p-3 rounded-xl text-white ${colorClasses[color]} transition-colors`}
            >
              {icon}
            </div>
          </div>
          <h3 className="text-lg font-semibold text-emerald-900 mb-2 group-hover:text-emerald-700 transition-colors">
            {title}
          </h3>
          <p className="text-emerald-600 text-sm">{description}</p>
        </Link>
      </Fade>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-emerald-700">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-6">
      {/* Header */}
      <Fade direction="down" duration={600}>
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-emerald-900 mb-2">
                Welcome back, {userName}!
              </h1>
              <p className="text-emerald-700 text-lg">
                Here's what's happening in your floral world today
              </p>
              {userRole && (
                <div className="inline-block mt-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                  {userRole.replace("ROLE_", "")}
                </div>
              )}
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex items-center gap-4 text-emerald-700">
                <FaCalendarAlt />
                <span>
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Fade>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Plants"
          value={stats.totalPlants}
          icon={<FaLeaf className="text-2xl" />}
        />
        <StatCard
          title="Flower Meanings"
          value={stats.totalFlowers}
          icon={<FaLanguage className="text-2xl" />}
        />
        <StatCard
          title="Categories"
          value={stats.totalCategories}
          icon={<FaTags className="text-2xl" />}
        />
        {isBank && (
          <>
            <StatCard
              title="Total Orders"
              value={stats.totalOrders}
              icon={<FaShoppingCart className="text-2xl" />}
            />
            <StatCard
              title="Total Revenue"
              value={`$${stats.revenue.toLocaleString()}`}
              icon={<FaDollarSign className="text-2xl" />}
            />
            <StatCard
              title="Active Collection"
              value={`${stats.totalPlants + stats.totalFlowers} items`}
              icon={<FaChartLine className="text-2xl" />}
            />
          </>
        )}
      </div>

      {/* Top Plants & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top Plants */}
        <div className="lg:col-span-1">
          <Fade direction="left" duration={600}>
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-100 h-full">
              <h2 className="text-2xl font-bold text-emerald-900 mb-6">
                Popular Plants
              </h2>
              <div className="space-y-4">
                {topPlants.length > 0 ? (
                  topPlants.map((plant, index) => (
                    <div
                      key={plant.id}
                      className="flex items-center gap-4 p-4 rounded-xl border border-emerald-50 hover:bg-emerald-50 transition-colors"
                    >
                      <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                        {index === 0 ? (
                          <FaStar className="text-yellow-500 text-xl" />
                        ) : index === 1 ? (
                          <FaStar className="text-gray-400 text-xl" />
                        ) : (
                          <FaStar className="text-amber-600 text-xl" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-emerald-900">
                          {plant.name}
                        </h3>
                        <p className="text-emerald-600 text-sm">
                          {plant.checkoutCount}{" "}
                          {plant.checkoutCount === 1 ? "checkout" : "checkouts"}
                        </p>
                      </div>
                      <div className="text-emerald-400 font-bold">
                        #{index + 1}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-emerald-600 py-4">
                    No checkout data available
                  </div>
                )}
              </div>
            </div>
          </Fade>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <Fade direction="up" duration={600}>
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-100 h-full">
              <h2 className="text-2xl font-bold text-emerald-900 mb-6">
                Quick Actions
              </h2>
              <div className="space-y-4">
                <QuickActionCard
                  title="Browse Plants"
                  description="Explore our collection of beautiful plants"
                  icon={<FaLeaf className="text-2xl" />}
                  link="/plants"
                  color="emerald"
                />
                <QuickActionCard
                  title="Flower Meanings"
                  description="Discover the language of flowers"
                  icon={<FaLanguage className="text-2xl" />}
                  link="/flower-meanings"
                  color="purple"
                />
                <QuickActionCard
                  title="My Profile"
                  description="Update your personal information"
                  icon={<FaUser className="text-2xl" />}
                  link="/user-profile"
                  color="blue"
                />
                {isBank && (
                  <QuickActionCard
                    title="Order Management"
                    description="View and manage orders"
                    icon={<FaShoppingCart className="text-2xl" />}
                    link="/orders"
                    color="amber"
                  />
                )}
              </div>
            </div>
          </Fade>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-1">
          <Fade direction="right" duration={600}>
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-100 h-full">
              <h2 className="text-2xl font-bold text-emerald-900 mb-6">
                Recent Activity
              </h2>
              <div className="space-y-4">
                {recentActivities.length > 0 ? (
                  recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-4 p-4 rounded-xl border border-emerald-50 hover:bg-emerald-50 transition-colors"
                    >
                      <div className="p-2 bg-emerald-100 rounded-lg">
                        {activity.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-emerald-900">
                          {activity.title}
                        </h3>
                        <p className="text-emerald-600 text-sm">
                          {activity.description}
                        </p>
                        <p className="text-emerald-400 text-xs mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-emerald-600 py-4">
                    No recent activities
                  </div>
                )}
              </div>
            </div>
          </Fade>
        </div>
      </div>

      {/* Welcome Message for New Users */}
      {stats.totalPlants === 0 && stats.totalFlowers === 0 && (
        <Fade direction="up" duration={600}>
          <div className="mt-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-8 text-white text-center">
            <FaSeedling className="text-4xl mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">
              Welcome to FloraWhisper! 🌿
            </h3>
            <p className="text-emerald-100 mb-4">
              Start your floral journey by exploring our plant collection and
              discovering the language of flowers.
            </p>
            <Link
              to="/flower-meanings"
              className="inline-block bg-white text-emerald-600 px-6 py-3 rounded-xl font-semibold hover:bg-emerald-50 transition-colors"
            >
              Explore Flower Meanings
            </Link>
          </div>
        </Fade>
      )}
    </div>
  );
}
