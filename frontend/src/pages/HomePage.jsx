import { Link } from "react-router-dom";
import PageHeader from "../components/common/PageHeader";
import Card from "../components/common/Card";
import Button from "../components/common/Button";

function HomePage() {
  const savedUserId = localStorage.getItem("userId");
  const savedMessId = localStorage.getItem("messId");

  const quickActions = [
    {
      title: "Register User",
      description: "Create manager, member, or owner account.",
      path: "/register",
      buttonText: "Go to Register",
      accent: "violet",
    },
    {
      title: "Create Mess",
      description: "Create a mess and assign the registered manager.",
      path: "/create-mess",
      buttonText: "Create Mess",
      accent: "blue",
    },
    {
      title: "Manage Members",
      description: "Add members and activate or deactivate them.",
      path: "/members",
      buttonText: "Open Members",
      accent: "cyan",
    },
    {
      title: "Meal Entry",
      description: "Create daily meal entries and check meal history.",
      path: "/meals",
      buttonText: "Open Meals",
      accent: "emerald",
    },
    {
      title: "Expense Management",
      description: "Track bazar, utilities, and other shared expenses.",
      path: "/expenses",
      buttonText: "Open Expenses",
      accent: "orange",
    },
    {
      title: "Rent Management",
      description: "Record rent payments and view monthly collection.",
      path: "/rent",
      buttonText: "Open Rent",
      accent: "pink",
    },
    {
      title: "Monthly Summary",
      description: "See full monthly settlement and member balances.",
      path: "/summary",
      buttonText: "Open Summary",
      accent: "indigo",
    },
  ];

  const workflowSteps = [
    { step: "Step 1", title: "Register a manager" },
    { step: "Step 2", title: "Create a mess" },
    { step: "Step 3", title: "Add members" },
    { step: "Step 4", title: "Enter meals" },
    { step: "Step 5", title: "Add expenses" },
    { step: "Step 6", title: "Record rent" },
    { step: "Step 7", title: "Check summary" },
  ];

  const getPrimaryAction = () => {
    if (!savedUserId) {
      return {
        title: "Start by registering a manager",
        description:
          "Create the first account so you can connect a mess and continue setup.",
        path: "/register",
        buttonText: "Register Now",
      };
    }

    if (!savedMessId) {
      return {
        title: "Your next step is creating a mess",
        description:
          "You already have a saved user. Now create a mess and link the manager account.",
        path: "/create-mess",
        buttonText: "Create Mess",
      };
    }

    return {
      title: "Your workspace is ready",
      description:
        "You already have a saved user and mess. Continue with members, meals, expenses, rent, or summary.",
      path: "/members",
      buttonText: "Manage Members",
    };
  };

  const primaryAction = getPrimaryAction();

  return (
    <div style={styles.page}>
      <div style={styles.wrapper}>
        <PageHeader
          title="Smart Mess Dashboard"
          subtitle="A clean workspace to manage members, meals, expenses, rent, and monthly settlement from one place."
        />

        <div className="dashboard-hero-grid">
          <Card className="dashboard-hero-card">
            <div className="dashboard-hero">
              <div className="dashboard-eyebrow">Smart workflow</div>

              <h2 className="dashboard-hero-title">
                Smart Mess Management and Shared Expense Tracking System
              </h2>

              <p className="dashboard-hero-text">
                Run your full mess workflow from one dashboard — registration,
                mess setup, member handling, daily meals, shared expenses, rent
                collection, and monthly settlement.
              </p>

              <div className="dashboard-hero-actions">
                <Link to={primaryAction.path} style={styles.linkReset}>
                  <Button variant="primary">{primaryAction.buttonText}</Button>
                </Link>

                <Link to="/summary" style={styles.linkReset}>
                  <Button variant="dark">View Summary</Button>
                </Link>
              </div>

              <div className="dashboard-next-step">
                <span className="dashboard-next-step__label">Recommended</span>
                <h3 className="dashboard-next-step__title">
                  {primaryAction.title}
                </h3>
                <p className="dashboard-next-step__text">
                  {primaryAction.description}
                </p>
              </div>
            </div>
          </Card>

          <Card title="Workspace Snapshot" className="dashboard-side-card">
            <div className="dashboard-stats">
              <div className="dashboard-stat-tile">
                <span className="dashboard-stat-tile__label">Saved User ID</span>
                <strong className="dashboard-stat-tile__value">
                  {savedUserId || "Not saved"}
                </strong>
              </div>

              <div className="dashboard-stat-tile">
                <span className="dashboard-stat-tile__label">Saved Mess ID</span>
                <strong className="dashboard-stat-tile__value">
                  {savedMessId || "Not saved"}
                </strong>
              </div>

              <div className="dashboard-stat-mini-grid">
                <div className="dashboard-mini-card">
                  <span className="dashboard-mini-card__number">7</span>
                  <span className="dashboard-mini-card__label">
                    Core Modules
                  </span>
                </div>

                <div className="dashboard-mini-card">
                  <span className="dashboard-mini-card__number">1</span>
                  <span className="dashboard-mini-card__label">Dashboard</span>
                </div>
              </div>
            </div>

            <p className="soft-note">
              These values are saved in localStorage after registration and mess
              creation, so your forms can auto-fill IDs across pages.
            </p>
          </Card>
        </div>

        <div className="dashboard-section-header">
          <div>
            <h2 className="dashboard-section-title">Quick Actions</h2>
            <p className="dashboard-section-subtitle">
              Jump directly into any part of the system.
            </p>
          </div>
        </div>

        <div className="dashboard-card-grid">
          {quickActions.map((item) => (
            <Card
              key={item.path}
              className={`dashboard-action-card dashboard-action-card--${item.accent}`}
            >
              <div className="dashboard-action-card__top">
                <div className="dashboard-action-card__icon">
                  {item.title[0]}
                </div>
                <span className="dashboard-action-card__tag">Module</span>
              </div>

              <div className="dashboard-action-card__body">
                <h3 className="dashboard-action-card__title">{item.title}</h3>
                <p className="dashboard-action-card__text">
                  {item.description}
                </p>
              </div>

              <Link to={item.path} style={styles.linkReset}>
                <Button variant="primary">{item.buttonText}</Button>
              </Link>
            </Card>
          ))}
        </div>

        <Card title="Suggested Workflow">
          <div className="workflow-grid">
            {workflowSteps.map((item, index) => (
              <div
                key={item.title}
                className={`workflow-card ${index === 0 ? "active" : ""}`}
              >
                <div className="workflow-step">{item.step}</div>
                <div className="workflow-title">{item.title}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Project Showcase">
          <div className="showcase-video-section">
            <div className="showcase-video-content">
              <div className="showcase-video-badge">Project Demo</div>
              <h3 className="showcase-video-title">
                Watch the Smart Mess Management workflow
              </h3>
              <p className="showcase-video-text">
                This video presents the full system flow, including registration,
                mess creation, member management, meal entry, expense tracking,
                rent management, and monthly summary.
              </p>
            </div>

            <div className="showcase-video-frame">
              <video
                className="showcase-video"
                controls
                autoPlay
                muted
                loop
                playsInline
                poster="/video-thumbnail.jpg"
                preload="metadata"
              >
                <source src="/workflow.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "calc(100vh - 70px)",
    padding: "30px 16px",
    backgroundColor: "transparent",
  },
  wrapper: {
    maxWidth: "1280px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  linkReset: {
    textDecoration: "none",
  },
};

export default HomePage;