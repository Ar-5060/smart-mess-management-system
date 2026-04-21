import { NavLink } from "react-router-dom";

const navItems = [
  { path: "/", label: "Home" },
  { path: "/register", label: "Register" },
  { path: "/create-mess", label: "Create Mess" },
  { path: "/members", label: "Members" },
  { path: "/meals", label: "Meals" },
  { path: "/expenses", label: "Expenses" },
  { path: "/rent", label: "Rent" },
  { path: "/summary", label: "Summary" },
];

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar__container">
        <NavLink to="/" className="navbar__brand-link">
          <div className="navbar__brand">
            <div className="navbar__logo">SM</div>

            <div className="navbar__brand-text">
              <h1 className="navbar__title">Smart Mess</h1>
              <p className="navbar__subtitle">Management System</p>
            </div>
          </div>
        </NavLink>

        <nav className="navbar__menu">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                isActive
                  ? "navbar__link navbar__link--active"
                  : "navbar__link"
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="navbar__status">
          <span className="navbar__status-dot"></span>
          <span className="navbar__status-text">Dashboard</span>
        </div>
      </div>
    </header>
  );
}

export default Navbar;