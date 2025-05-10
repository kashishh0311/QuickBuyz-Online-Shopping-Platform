import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale
);

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("/api/v1/admin/getDashboardAnalytics");
        console.log("API Response:", response.data.data); // Debug log
        setAnalytics(response.data.data);
      } catch (error) {
        const errorMsg =
          error.response?.data?.message || "Failed to fetch analytics";
        setError(errorMsg);
        toast.error(errorMsg, {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: true,
          style: {
            backgroundColor: "#fef2f2",
            color: "#b91c1c",
            border: "1px solid #b91c1c",
          },
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  // Bar Chart Data for Order Status Breakdown
  const orderStatusData = analytics
    ? {
        labels: analytics.orderStatusBreakdown.map((item) => item.status),
        datasets: [
          {
            label: "Orders by Status",
            data: analytics.orderStatusBreakdown.map((item) => item.count),
            backgroundColor: [
              "#000000",
              "#333333",
              "#666666",
              "#999999",
              "#cccccc",
            ],
            borderColor: ["#000000"],
            borderWidth: 1,
          },
        ],
      }
    : {};

  // Doughnut Chart Data for Top Product Sales
  const topProductsSalesData = analytics
    ? {
        labels: analytics.topProducts.map((item) => item.name),
        datasets: [
          {
            label: "Sales by Product (₹)",
            data: analytics.topProducts.map((item) => item.totalSales),
            backgroundColor: [
              "#000000",
              "#333333",
              "#666666",
              "#999999",
              "#cccccc",
            ],
            borderColor: ["#ffffff"],
            borderWidth: 2,
          },
        ],
      }
    : {};

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8">
          Dashboard Overview
        </h1>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-500 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="p-4 bg-gray-50 border border-gray-500 text-gray-700 rounded-lg">
            Loading analytics...
          </div>
        )}

        {/* Analytics Cards */}
        {analytics && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition transform hover:-translate-y-1">
              <h2 className="text-lg font-semibold text-gray-700">
                Total Products
              </h2>
              <p className="text-3xl font-bold text-black">
                {analytics.totalProducts ?? "N/A"}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition transform hover:-translate-y-1">
              <h2 className="text-lg font-semibold text-gray-700">
                Total Orders
              </h2>
              <p className="text-3xl font-bold text-black">
                {analytics.totalOrders ?? "N/A"}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition transform hover:-translate-y-1">
              <h2 className="text-lg font-semibold text-gray-700">
                Total Users
              </h2>
              <p className="text-3xl font-bold text-black">
                {analytics.totalUsers ?? "0"}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition transform hover:-translate-y-1">
              <h2 className="text-lg font-semibold text-gray-700">
                Total Revenue
              </h2>
              <p className="text-3xl font-bold text-black">
                ₹
                {analytics.totalRevenue
                  ? analytics.totalRevenue.toFixed(2)
                  : "0.00"}
              </p>
            </div>
          </div>
        )}

        {/* Additional Analytics Sections */}
        {analytics && (
          <div className="space-y-12">
            {/* Order Status Breakdown (Bar Chart) */}
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Order Status Breakdown
              </h2>
              {analytics.orderStatusBreakdown.length > 0 ? (
                <div className="flex justify-center">
                  <div className="w-full max-w-2xl">
                    <Bar
                      data={orderStatusData}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: { display: false },
                          tooltip: { enabled: true },
                        },
                        scales: {
                          x: { title: { display: true, text: "Status" } },
                          y: { title: { display: true, text: "Order Count" } },
                        },
                      }}
                    />
                  </div>
                </div>
              ) : (
                <p className="text-gray-600">No order status data available.</p>
              )}
            </div>

            {/* Top Products Sales (Doughnut Chart) */}
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Top Products by Sales Value
              </h2>
              {analytics.topProducts.length > 0 ? (
                <div className="flex justify-center">
                  <div className="w-full max-w-md">
                    <Doughnut
                      data={topProductsSalesData}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: { position: "top" },
                          tooltip: { enabled: true },
                        },
                      }}
                    />
                  </div>
                </div>
              ) : (
                <p className="text-gray-600">
                  No product sales data available.
                </p>
              )}
            </div>

            {/* Top Products Table */}
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Top 5 Best-Selling Products
              </h2>
              {analytics.topProducts.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price (₹)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantity Sold
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total Sales (₹)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {analytics.topProducts.map((product, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {product.name || "Unknown Product"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₹
                            {typeof product.price === "number"
                              ? product.price.toFixed(2)
                              : "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {product.totalQuantity || "0"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₹
                            {product.totalSales
                              ? product.totalSales.toFixed(2)
                              : "0.00"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-600">
                  No product sales data available.
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Toast Container */}
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar
        style={{ width: "400px" }}
      />
    </div>
  );
};

export default Dashboard;
