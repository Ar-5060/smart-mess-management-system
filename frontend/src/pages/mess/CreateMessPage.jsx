import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createMess } from "../../api/messApi";
import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import InputField from "../../components/common/InputField";
import Button from "../../components/common/Button";
import AlertMessage from "../../components/common/AlertMessage";
import getErrorMessage from "../../utils/getErrorMessage";

const initialForm = {
  messName: "",
  address: "",
  totalMembers: "",
  monthlyRent: "",
  rentDueDate: "",
  createdBy: "",
};

function CreateMessPage() {
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [createdMess, setCreatedMess] = useState(null);

  useEffect(() => {
    const savedUserId = localStorage.getItem("userId");

    if (savedUserId) {
      setFormData((prev) => ({
        ...prev,
        createdBy: savedUserId,
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetMessages = () => {
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetMessages();
    setCreatedMess(null);
    setLoading(true);

    try {
      const payload = {
        messName: formData.messName.trim(),
        address: formData.address.trim(),
        totalMembers: Number(formData.totalMembers),
        monthlyRent: formData.monthlyRent ? Number(formData.monthlyRent) : null,
        rentDueDate: formData.rentDueDate || null,
        createdBy: Number(formData.createdBy),
      };

      const response = await createMess(payload);
      const data = response.data;

      setSuccessMessage(data?.message || "Mess created successfully.");
      setCreatedMess(data);

      if (data?.id) {
        localStorage.setItem("messId", String(data.id));
      }

      setFormData((prev) => ({
        ...initialForm,
        createdBy: prev.createdBy,
      }));
    } catch (error) {
      setErrorMessage(
        getErrorMessage(
          error,
          "Failed to create mess. Please check manager user ID and try again."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const savedUserId = localStorage.getItem("userId");
  const savedMessId = localStorage.getItem("messId");

  return (
    <div style={styles.page}>
      <div style={styles.wrapper}>
        <PageHeader
          title="Create Mess"
          subtitle="Set up your mess workspace, connect the manager account, and prepare the system for members, meals, and expenses."
        />

        <AlertMessage type="success" message={successMessage} />
        <AlertMessage type="error" message={errorMessage} />

        <div className="register-layout">
          <Card className="register-hero-card">
            <div className="register-hero">
              <div className="dashboard-eyebrow">Mess Setup</div>

              <h2 className="register-hero__title">
                Create and connect your mess in one clean step
              </h2>

              <p className="register-hero__text">
                After a manager is registered, create the mess using that saved
                user ID. This links the manager account to the mess and lets you
                continue with member management and monthly operations.
              </p>

              <div className="register-side-info">
                <div className="register-side-info__item">
                  <span className="register-side-info__label">Saved User ID</span>
                  <strong className="register-side-info__value">
                    {savedUserId || "Not saved yet"}
                  </strong>
                </div>

                <div className="register-side-info__item">
                  <span className="register-side-info__label">Saved Mess ID</span>
                  <strong className="register-side-info__value">
                    {savedMessId || "Not saved yet"}
                  </strong>
                </div>
              </div>

              <div className="register-side-actions">
                <Link to="/members" style={styles.linkReset}>
                  <Button variant="primary">Go to Members</Button>
                </Link>

                <Link to="/" style={styles.linkReset}>
                  <Button variant="dark">Back to Dashboard</Button>
                </Link>
              </div>
            </div>
          </Card>

          <Card title="Mess Information" className="register-form-card">
            <form onSubmit={handleSubmit} style={styles.form}>
              <div className="register-form-section">
                <div className="register-form-section__header">
                  <h3 className="register-form-section__title">
                    Basic Information
                  </h3>
                  <p className="register-form-section__text">
                    Enter the mess name, address, and the expected number of
                    members.
                  </p>
                </div>

                <InputField
                  label="Mess Name"
                  name="messName"
                  value={formData.messName}
                  onChange={handleChange}
                  placeholder="Enter mess name"
                  required
                />

                <InputField
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter mess address"
                  required
                />

                <InputField
                  label="Total Members"
                  name="totalMembers"
                  type="number"
                  value={formData.totalMembers}
                  onChange={handleChange}
                  placeholder="e.g. 6"
                  min="1"
                  required
                />
              </div>

              <div className="register-form-section">
                <div className="register-form-section__header">
                  <h3 className="register-form-section__title">
                    Rent and Manager Setup
                  </h3>
                  <p className="register-form-section__text">
                    Add rent details and connect the registered manager using
                    the saved user ID.
                  </p>
                </div>

                <div className="two-column">
                  <InputField
                    label="Monthly Rent"
                    name="monthlyRent"
                    type="number"
                    value={formData.monthlyRent}
                    onChange={handleChange}
                    placeholder="e.g. 18000"
                    min="0"
                    step="0.01"
                  />

                  <InputField
                    label="Rent Due Date"
                    name="rentDueDate"
                    type="date"
                    value={formData.rentDueDate}
                    onChange={handleChange}
                  />
                </div>

                <InputField
                  label="Manager User ID"
                  name="createdBy"
                  type="number"
                  value={formData.createdBy}
                  onChange={handleChange}
                  placeholder="Enter manager user ID"
                  min="1"
                  required
                />

                <div className="mess-helper-box">
                  Registering a manager does not assign a mess immediately. The
                  manager gets linked only after this page submits the mess
                  creation request using that manager&apos;s user ID as{" "}
                  <strong>createdBy</strong>.
                </div>
              </div>

              <div className="register-submit-row">
                <Button type="submit" variant="primary">
                  {loading ? "Creating..." : "Create Mess"}
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {createdMess && (
          <Card title="Created Mess" className="register-form-card">
            <div className="summary-grid">
              <div className="summary-item">
                <span className="summary-label">Mess ID</span>
                <strong>{createdMess.id}</strong>
              </div>

              <div className="summary-item">
                <span className="summary-label">Mess Name</span>
                <strong>{createdMess.messName}</strong>
              </div>

              <div className="summary-item">
                <span className="summary-label">Address</span>
                <strong>{createdMess.address}</strong>
              </div>
            </div>

            <div className="register-side-actions" style={{ marginTop: "18px" }}>
              <Link to="/members" style={styles.linkReset}>
                <Button variant="primary">Add Members</Button>
              </Link>

              <Link to="/expenses" style={styles.linkReset}>
                <Button variant="dark">Open Expenses</Button>
              </Link>
            </div>
          </Card>
        )}
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

export default CreateMessPage;