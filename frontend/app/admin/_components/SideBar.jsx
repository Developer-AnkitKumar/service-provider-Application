import Link from "next/link";

const Sidebar = ({ sidebarOpen, setSidebarOpen, currentPage, setCurrentPage }) => {
  const menuItems = [
    { title: "Dashboard", icon: "📊", href: "/admin/dashboard" },
    { title: "Bookings", icon: "📋", href: "/admin/bookings" },
    { title: "Customers", icon: "👥", href: "/admin/customers" },
    { title: "Services", icon: "🛠️", href: "/admin/services" },
    { title: "Providers", icon: "👨‍💼", href: "/admin/providers" },
    { title: "Logout", icon: "🚪", href: "/login" },
  ];

  function logout(){
    localStorage.removeItem("user");

  }
  return (
    <div
      className={`${
        sidebarOpen ? "w-64" : "w-20"
      } fixed top-0 left-0 h-screen bg-blue-800 text-white transition-all duration-300 ease-in-out z-50`}
    >
      <div className="p-4 flex items-center justify-between">
        {sidebarOpen && <h1 className="text-xl font-bold">ServicePro</h1>}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-blue-700"
        >
          {sidebarOpen ? "◀" : "▶"}
        </button>
      </div>

      <nav className="mt-6">
        {menuItems.map((item) => (
          <Link key={item.title} href={item.href}>
            <button
              className={`flex items-center w-full p-4 ${
                item.title === currentPage ? "bg-blue-700" : "hover:bg-blue-700"
              } transition-colors duration-200 rounded-md`}
              onClick={() => {
                if(item.title=="Logout"){
                  logout();
                  return 
                }
                setCurrentPage(item.title)}}
            >
              <span className="mr-3 text-xl">{item.icon}</span>
              {sidebarOpen && <span className="text-lg">{item.title}</span>}
            </button>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
