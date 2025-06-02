import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { LogOut, User } from "lucide-react";
  import Button from "../Button";
import Modal from "../Modal";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleShopClick = (shopName) => {
    // window.open(`http://${shopName}.localhost:5173`);
    window.location.href = `http://${shopName}.localhost:5173`;

  };

  const handleLogout = async () => {
    await logout();
    setShowLogoutModal(false);
  };
  console.log('document.cookie-->',document.cookie); // You may not see `HttpOnly` cookies, but others will show

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold">Dashboard</h1>
            <div className="relative">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
              >
                <User className="w-6 h-6" />
                <span className="text-sm font-medium">{user?.username}</span>
              </button>

              {showProfile && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border z-10">
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">Profile</h3>
                    <p className="text-sm text-gray-600 mb-3">Username: {user?.username}</p>

                    <div className="mb-4">
                      <h4 className="font-medium text-sm mb-2">Your Shops:</h4>
                      <div className="space-y-1">
                        {user?.shops?.map((shop, index) => (
                          <div key={index} className="text-sm text-gray-700 bg-gray-50 px-2 py-1 rounded">
                            {shop}
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button
                      variant="danger"
                      onClick={() => {
                        setShowProfile(false);
                        setShowLogoutModal(true);
                      }}
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome, {user?.username}!</h2>
          <p className="text-gray-600">Manage your shops and access their dashboards</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {user?.shops?.map((shop, index) => (
            <div
              key={index}
              onClick={() => handleShopClick(shop)}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border hover:border-blue-300"
            >
              <h3 className="text-lg font-semibold mb-2">{shop}</h3>
              <p className="text-gray-600 text-sm mb-4">Click to access shop dashboard</p>
              <div className="text-blue-500 text-sm font-medium">
                {shop}.localhost:5173 →
              </div>
            </div>
          ))}
        </div>
      </main>

      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Confirm Logout"
      >
        <p className="mb-4">Are you sure you want to logout?</p>
        <div className="flex gap-2 justify-end">
          <Button variant="secondary" onClick={() => setShowLogoutModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard