import { useEffect, useState } from "react";
import {
  createRentPayment,
  getMonthlyRentPayments,
} from "../../api/rentApi";
import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import InputField from "../../components/common/InputField";
import Button from "../../components/common/Button";
import AlertMessage from "../../components/common/AlertMessage";
import EmptyState from "../../components/common/EmptyState";
import StatusBadge from "../../components/common/StatusBadge";
import DataTable from "../../components/common/DataTable";
import getErrorMessage from "../../utils/getErrorMessage";

const initialRentForm = {
  messId: "",
  userId: "",
  month: "",
  year: "",
  amount: "",
  paymentDate: "",
};

const initialSummaryForm = {
  messId: "",
  month: "",
  year: "",
};

function RentPage() {
  const [rentForm, setRentForm] = useState(initialRentForm);
  const [summaryForm, setSummaryForm] = useState(initialSummaryForm);

  const [paymentLoading, setPaymentLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);

  const [monthlySummary, setMonthlySummary] = useState(null);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const savedMessId = localStorage.getItem("messId");

    if (savedMessId) {
      setRentForm((prev) => ({
        ...prev,
        messId: savedMessId,
      }));

      setSummaryForm((prev) => ({
        ...prev,
        messId: savedMessId,
      }));
    }
  }, []);

  const resetMessages = () => {
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleRentFormChange = (e) => {
    const { name, value } = e.target;
    setRentForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSummaryFormChange = (e) => {
    const { name, value } = e.target;
    setSummaryForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const loadMonthlyRentSummary = async (
    messIdOverride,
    monthOverride,
    yearOverride,
    silent = false
  ) => {
    const messId = messIdOverride || summaryForm.messId;
    const month = monthOverride || summaryForm.month;
    const year = yearOverride || summaryForm.year;

    if (!messId || !month || !year) {
      setErrorMessage("Please enter Mess ID, month, and year.");
      return;
    }

    if (!silent) {
      resetMessages();
    }

    setSummaryLoading(true);

    try {
      const response = await getMonthlyRentPayments(
        Number(messId),
        Number(month),
        Number(year)
      );

      setMonthlySummary(response.data || null);
      localStorage.setItem("messId", String(messId));

      if (!silent) {
        setSuccessMessage("Monthly rent summary loaded successfully.");
      }
    } catch (error) {
      setMonthlySummary(null);
      setErrorMessage(
        getErrorMessage(error, "Failed to load monthly rent summary.")
      );
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleCreateRentPayment = async (e) => {
    e.preventDefault();
    resetMessages();
    setPaymentLoading(true);

    try {
      const payload = {
        messId: Number(rentForm.messId),
        userId: Number(rentForm.userId),
        month: Number(rentForm.month),
        year: Number(rentForm.year),
        amount: Number(rentForm.amount),
        paymentDate: rentForm.paymentDate,
      };

      const response = await createRentPayment(payload);

      setSuccessMessage(
        response?.data?.message || "Rent payment recorded successfully."
      );

      localStorage.setItem("messId", String(payload.messId));

      setSummaryForm({
        messId: String(payload.messId),
        month: String(payload.month),
        year: String(payload.year),
      });

      await loadMonthlyRentSummary(
        payload.messId,
        payload.month,
        payload.year,
        true
      );

      setRentForm((prev) => ({
        ...initialRentForm,
        messId: prev.messId,
        month: prev.month,
        year: prev.year,
      }));
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error, "Failed to record rent payment.")
      );
    } finally {
      setPaymentLoading(false);
    }
  };

  const memberColumns = [
    { key: "userId", header: "User ID" },
    { key: "userName", header: "User Name" },
    { key: "amountPaid", header: "Amount Paid" },
    { key: "expectedRentShare", header: "Expected Share" },
    { key: "remainingDue", header: "Remaining Due" },
    { key: "status", header: "Status" },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.wrapper}>
        <PageHeader
          title="Rent Management"
          subtitle="Record rent payments and view monthly rent collection summary for a mess."
        />

        <AlertMessage type="success" message={successMessage} />
        <AlertMessage type="error" message={errorMessage} />

        <div className="section-grid" style={styles.topGrid}>
          <Card title="Record Rent Payment">
            <form onSubmit={handleCreateRentPayment} style={styles.form}>
              <div className="two-column">
                <InputField
                  label="Mess ID"
                  name="messId"
                  type="number"
                  value={rentForm.messId}
                  onChange={handleRentFormChange}
                  placeholder="Enter mess ID"
                  min="1"
                  required
                />

                <InputField
                  label="User ID"
                  name="userId"
                  type="number"
                  value={rentForm.userId}
                  onChange={handleRentFormChange}
                  placeholder="Enter user ID"
                  min="1"
                  required
                />
              </div>

              <div className="three-column">
                <InputField
                  label="Month"
                  name="month"
                  type="number"
                  value={rentForm.month}
                  onChange={handleRentFormChange}
                  placeholder="1 - 12"
                  min="1"
                  max="12"
                  required
                />

                <InputField
                  label="Year"
                  name="year"
                  type="number"
                  value={rentForm.year}
                  onChange={handleRentFormChange}
                  placeholder="e.g. 2026"
                  min="2000"
                  required
                />

                <InputField
                  label="Amount"
                  name="amount"
                  type="number"
                  value={rentForm.amount}
                  onChange={handleRentFormChange}
                  placeholder="Enter paid amount"
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>

              <InputField
                label="Payment Date"
                name="paymentDate"
                type="date"
                value={rentForm.paymentDate}
                onChange={handleRentFormChange}
                required
              />

              <Button type="submit" variant="primary">
                {paymentLoading ? "Saving..." : "Record Rent Payment"}
              </Button>
            </form>
          </Card>

          <Card title="Monthly Rent Summary">
            <div style={styles.form}>
              <InputField
                label="Mess ID"
                name="messId"
                type="number"
                value={summaryForm.messId}
                onChange={handleSummaryFormChange}
                placeholder="Enter mess ID"
                min="1"
              />

              <div className="two-column">
                <InputField
                  label="Month"
                  name="month"
                  type="number"
                  value={summaryForm.month}
                  onChange={handleSummaryFormChange}
                  placeholder="1 - 12"
                  min="1"
                  max="12"
                />

                <InputField
                  label="Year"
                  name="year"
                  type="number"
                  value={summaryForm.year}
                  onChange={handleSummaryFormChange}
                  placeholder="e.g. 2026"
                  min="2000"
                />
              </div>

              <Button
                type="button"
                onClick={() => loadMonthlyRentSummary()}
                variant="dark"
              >
                {summaryLoading ? "Loading..." : "Get Rent Summary"}
              </Button>
            </div>

            {monthlySummary && (
              <div className="summary-grid" style={styles.summaryTop}>
                <div className="summary-item">
                  <span className="summary-label">Mess Name</span>
                  <strong>{monthlySummary.messName}</strong>
                </div>

                <div className="summary-item">
                  <span className="summary-label">Month / Year</span>
                  <strong>
                    {monthlySummary.month} / {monthlySummary.year}
                  </strong>
                </div>

                <div className="summary-item">
                  <span className="summary-label">Monthly Rent</span>
                  <strong>{monthlySummary.monthlyRent}</strong>
                </div>

                <div className="summary-item">
                  <span className="summary-label">Active Members</span>
                  <strong>{monthlySummary.activeMembers}</strong>
                </div>

                <div className="summary-item">
                  <span className="summary-label">Expected Share / Member</span>
                  <strong>{monthlySummary.expectedRentSharePerMember}</strong>
                </div>

                <div className="summary-item">
                  <span className="summary-label">Total Collected</span>
                  <strong>{monthlySummary.totalCollected}</strong>
                </div>

                <div className="summary-item">
                  <span className="summary-label">Total Due</span>
                  <strong>{monthlySummary.totalDue}</strong>
                </div>

                <div className="summary-item">
                  <span className="summary-label">Members Counted</span>
                  <strong>
                    {monthlySummary.memberStatuses?.length || 0}
                  </strong>
                </div>
              </div>
            )}
          </Card>
        </div>

        <Card title="Member Rent Status">
          {!monthlySummary?.memberStatuses?.length ? (
            <EmptyState message='No monthly rent summary loaded yet. Enter mess ID, month, and year, then click "Get Rent Summary".' />
          ) : (
            <DataTable
              columns={memberColumns}
              data={monthlySummary.memberStatuses}
              renderCell={(key, row) => {
                if (key === "status") {
                  return <StatusBadge status={row.status} />;
                }
                return row[key];
              }}
            />
          )}
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
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  topGrid: {
    gridTemplateColumns: "1fr 1fr",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  summaryTop: {
    marginTop: "18px",
  },
};

export default RentPage;