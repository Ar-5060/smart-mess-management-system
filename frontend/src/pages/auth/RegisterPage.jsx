import { useState } from "react";
import { Link } from "react-router-dom";
import { registerUser } from "../../api/authApi";
import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import InputField from "../../components/common/InputField";
import Button from "../../components/common/Button";
import AlertMessage from "../../components/common/AlertMessage";
import getErrorMessage from "../../utils/getErrorMessage";

const initialForm = {
  name: "",
  email: "",
  password: "",
  phone: "",
  role: "MEMBER",
};

const roleOptions = [
  {
    label: "Member",
    value: "MEMBER",
    description: "Join a mess and use the system as a regular member.",
  },
  {
    label: "Manager",
    value: "MANAGER",
    description: "Create and manage mess setup, members, and operations.",
  },
  {
    label: "Owner",
    value: "OWNER",
    description: "Use the system with owner-level account access.",
  },
];

function RegisterPage() {
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [savedUserId, setSavedUserId] = useState(
    localStorage.getItem("userId") || ""
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleSelect = (role) => {
    setFormData((prev) => ({
      ...prev,
      role,
    }));
  };

  const resetMessages = () => {
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);

    try {
      const response = await registerUser(formData);
      const data = response.data;

      setSuccessMessage(data?.message || "User registered successfully.");

      if (data?.userId) {
        localStorage.setItem("userId", String(data.userId));
        setSavedUserId(String(data.userId));
      }

      setFormData(initialForm);
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error, "Registration failed. Please try again.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.wrapper}>
        <PageHeader
          title="Register User"
          subtitle="Create a clean, secure account for Smart Mess Management and continue with mess setup."
        />

        <AlertMessage type="success" message={successMessage} />
        <AlertMessage type="error" message={errorMessage} />

        <div className="register-layout">
          <Card className="register-hero-card">
            <div className="register-hero">
              <div className="dashboard-eyebrow">Account Setup</div>

              <h2 className="register-hero__title">
                Create your account and start managing your mess system
              </h2>

              <p className="register-hero__text">
                Register as a manager, member, or owner. After registration,
                your saved user ID can be used in the next steps like creating a
                mess and managing members.
              </p>

              <div className="register-side-info">
                <div className="register-side-info__item">
                  <span className="register-side-info__label">Saved User ID</span>
                  <strong className="register-side-info__value">
                    {savedUserId || "Not saved yet"}
                  </strong>
                </div>

                <div className="register-side-info__item">
                  <span className="register-side-info__label">Recommended Next Step</span>
                  <strong className="register-side-info__value">
                    Create a mess after manager registration
                  </strong>
                </div>
              </div>

              <div className="register-side-actions">
                <Link to="/create-mess" style={styles.linkReset}>
                  <Button variant="primary">Go to Create Mess</Button>
                </Link>

                <Link to="/" style={styles.linkReset}>
                  <Button variant="dark">Back to Dashboard</Button>
                </Link>
              </div>
            </div>
          </Card>

          <Card title="Registration Form" className="register-form-card">
            <form onSubmit={handleSubmit} style={styles.form}>
              <div className="register-form-section">
                <div className="register-form-section__header">
                  <h3 className="register-form-section__title">
                    Personal Information
                  </h3>
                  <p className="register-form-section__text">
                    Enter the basic details for the new account.
                  </p>
                </div>

                <InputField
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  required
                />

                <div className="two-column">
                  <InputField
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    required
                  />

                  <InputField
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div className="register-form-section">
                <div className="register-form-section__header">
                  <h3 className="register-form-section__title">
                    Account Security
                  </h3>
                  <p className="register-form-section__text">
                    Set a password and choose the account role.
                  </p>
                </div>

                <InputField
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  required
                />

                <div className="role-picker">
                  {roleOptions.map((role) => (
                    <button
                      key={role.value}
                      type="button"
                      className={`role-card ${
                        formData.role === role.value ? "role-card--active" : ""
                      }`}
                      onClick={() => handleRoleSelect(role.value)}
                    >
                      <span className="role-card__title">{role.label}</span>
                      <span className="role-card__text">
                        {role.description}
                      </span>
                    </button>
                  ))}
                </div>

                <InputField
                  label="Selected Role"
                  name="role"
                  type="select"
                  value={formData.role}
                  onChange={handleChange}
                  options={roleOptions.map((role) => ({
                    label: role.label.toUpperCase(),
                    value: role.value,
                  }))}
                  required
                />
              </div>

              <div className="register-submit-row">
                <Button type="submit" variant="primary">
                  {loading ? "Registering..." : "Register User"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
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
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "22px",
  },
  linkReset: {
    textDecoration: "none",
  },
};

export default RegisterPage;