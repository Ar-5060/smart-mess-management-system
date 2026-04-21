import { useEffect, useState } from "react";
import {
  getMonthlySummary,
  getMemberSummary,
} from "../../api/summaryApi";
import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import InputField from "../../components/common/InputField";
import Button from "../../components/common/Button";
import AlertMessage from "../../components/common/AlertMessage";
import EmptyState from "../../components/common/EmptyState";
import StatusBadge from "../../components/common/StatusBadge";
import DataTable from "../../components/common/DataTable";
import getErrorMessage from "../../utils/getErrorMessage";

const initialMonthlyForm = {
  messId: "",
  month: "",
  year: "",
};

const initialMemberForm = {
  userId: "",
  month: "",
  year: "",
};

function MonthlySummaryPage() {
  const [monthlyForm, setMonthlyForm] = useState(initialMonthlyForm);
  const [memberForm, setMemberForm] = useState(initialMemberForm);

  const [monthlyLoading, setMonthlyLoading] = useState(false);
  const [memberLoading, setMemberLoading] = useState(false);

  const [monthlySummary, setMonthlySummary] = useState(null);
  const [memberSummary, setMemberSummary] = useState(null);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const savedMessId = localStorage.getItem("messId");

    if (savedMessId) {
      setMonthlyForm((prev) => ({
        ...prev,
        messId: savedMessId,
      }));
    }
  }, []);

  const resetMessages = () => {
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleMonthlyChange = (e) => {
    const { name, value } = e.target;
    setMonthlyForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMemberChange = (e) => {
    const { name, value } = e.target;
    setMemberForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const loadMonthlySummaryData = async () => {
    resetMessages();

    if (!monthlyForm.messId || !monthlyForm.month || !monthlyForm.year) {
      setErrorMessage("Please enter Mess ID, month, and year.");
      return;
    }

    setMonthlyLoading(true);

    try {
      const response = await getMonthlySummary(
        Number(monthlyForm.messId),
        Number(monthlyForm.month),
        Number(monthlyForm.year)
      );

      setMonthlySummary(response.data || null);
      localStorage.setItem("messId", String(monthlyForm.messId));
      setSuccessMessage("Monthly summary loaded successfully.");
    } catch (error) {
      setMonthlySummary(null);
      setErrorMessage(
        getErrorMessage(error, "Failed to load monthly summary.")
      );
    } finally {
      setMonthlyLoading(false);
    }
  };

  const loadMemberSummaryData = async () => {
    resetMessages();

    if (!memberForm.userId || !memberForm.month || !memberForm.year) {
      setErrorMessage("Please enter User ID, month, and year.");
      return;
    }

    setMemberLoading(true);

    try {
      const response = await getMemberSummary(
        Number(memberForm.userId),
        Number(memberForm.month),
        Number(memberForm.year)
      );

      setMemberSummary(response.data || null);
      setSuccessMessage("Member summary loaded successfully.");
    } catch (error) {
      setMemberSummary(null);
      setErrorMessage(
        getErrorMessage(error, "Failed to load member summary.")
      );
    } finally {
      setMemberLoading(false);
    }
  };

  const memberSettlementColumns = [
    { key: "userId", header: "User ID" },
    { key: "userName", header: "User Name" },
    { key: "totalMeals", header: "Total Meals" },
    { key: "mealCost", header: "Meal Cost" },
    { key: "rentShare", header: "Rent Share" },
    { key: "otherSharedCostShare", header: "Other Shared Cost" },
    { key: "totalPayable", header: "Total Payable" },
    { key: "expensePaid", header: "Expense Paid" },
    { key: "rentPaid", header: "Rent Paid" },
    { key: "totalPaid", header: "Total Paid" },
    { key: "balance", header: "Balance" },
    { key: "dueAmount", header: "Due" },
    { key: "advanceAmount", header: "Advance" },
    { key: "settlementStatus", header: "Status" },
  ];

  const singleMember = memberSummary?.memberSummary;

  return (
    <div style={styles.page}>
      <div style={styles.wrapper}>
        <PageHeader
          title="Monthly Summary"
          subtitle="View full monthly settlement for a mess and individual member-wise monthly settlement."
        />

        <AlertMessage type="success" message={successMessage} />
        <AlertMessage type="error" message={errorMessage} />

        <div className="section-grid" style={styles.topGrid}>
          <Card title="Mess Monthly Summary">
            <div style={styles.form}>
              <InputField
                label="Mess ID"
                name="messId"
                type="number"
                value={monthlyForm.messId}
                onChange={handleMonthlyChange}
                placeholder="Enter mess ID"
                min="1"
              />

              <div className="two-column">
                <InputField
                  label="Month"
                  name="month"
                  type="number"
                  value={monthlyForm.month}
                  onChange={handleMonthlyChange}
                  placeholder="1 - 12"
                  min="1"
                  max="12"
                />

                <InputField
                  label="Year"
                  name="year"
                  type="number"
                  value={monthlyForm.year}
                  onChange={handleMonthlyChange}
                  placeholder="e.g. 2026"
                  min="2000"
                />
              </div>

              <Button
                type="button"
                onClick={loadMonthlySummaryData}
                variant="primary"
              >
                {monthlyLoading ? "Loading..." : "Get Monthly Summary"}
              </Button>
            </div>
          </Card>

          <Card title="Member Monthly Summary">
            <div style={styles.form}>
              <InputField
                label="User ID"
                name="userId"
                type="number"
                value={memberForm.userId}
                onChange={handleMemberChange}
                placeholder="Enter user ID"
                min="1"
              />

              <div className="two-column">
                <InputField
                  label="Month"
                  name="month"
                  type="number"
                  value={memberForm.month}
                  onChange={handleMemberChange}
                  placeholder="1 - 12"
                  min="1"
                  max="12"
                />

                <InputField
                  label="Year"
                  name="year"
                  type="number"
                  value={memberForm.year}
                  onChange={handleMemberChange}
                  placeholder="e.g. 2026"
                  min="2000"
                />
              </div>

              <Button
                type="button"
                onClick={loadMemberSummaryData}
                variant="dark"
              >
                {memberLoading ? "Loading..." : "Get Member Summary"}
              </Button>
            </div>
          </Card>
        </div>

        {monthlySummary && (
          <Card title="Monthly Overview">
            <div className="summary-grid">
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
                <span className="summary-label">Active Members</span>
                <strong>{monthlySummary.activeMembers}</strong>
              </div>

              <div className="summary-item">
                <span className="summary-label">Total Meals</span>
                <strong>{monthlySummary.totalMeals}</strong>
              </div>

              <div className="summary-item">
                <span className="summary-label">Total Meal Expense</span>
                <strong>{monthlySummary.totalMealExpense}</strong>
              </div>

              <div className="summary-item">
                <span className="summary-label">Meal Rate</span>
                <strong>{monthlySummary.mealRate}</strong>
              </div>

              <div className="summary-item">
                <span className="summary-label">Other Shared Expense</span>
                <strong>{monthlySummary.totalOtherSharedExpense}</strong>
              </div>

              <div className="summary-item">
                <span className="summary-label">Total Rent</span>
                <strong>{monthlySummary.totalRent}</strong>
              </div>

              <div className="summary-item">
                <span className="summary-label">Rent Share / Member</span>
                <strong>{monthlySummary.rentSharePerMember}</strong>
              </div>

              <div className="summary-item">
                <span className="summary-label">Other Shared Cost / Member</span>
                <strong>{monthlySummary.otherSharedCostSharePerMember}</strong>
              </div>

              <div className="summary-item">
                <span className="summary-label">Total Payable By All</span>
                <strong>{monthlySummary.totalPayableByAll}</strong>
              </div>

              <div className="summary-item">
                <span className="summary-label">Total Paid By All</span>
                <strong>{monthlySummary.totalPaidByAll}</strong>
              </div>

              <div className="summary-item">
                <span className="summary-label">Total Due</span>
                <strong>{monthlySummary.totalDue}</strong>
              </div>

              <div className="summary-item">
                <span className="summary-label">Total Advance</span>
                <strong>{monthlySummary.totalAdvance}</strong>
              </div>
            </div>
          </Card>
        )}

        <Card title="Member Settlement List">
          {!monthlySummary?.memberSummaries?.length ? (
            <EmptyState message='No monthly settlement loaded yet. Enter mess ID, month, and year, then click "Get Monthly Summary".' />
          ) : (
            <DataTable
              columns={memberSettlementColumns}
              data={monthlySummary.memberSummaries}
              renderCell={(key, row) => {
                if (key === "settlementStatus") {
                  return <StatusBadge status={row.settlementStatus} />;
                }
                return row[key];
              }}
            />
          )}
        </Card>

        <Card title="Single Member Settlement">
          {!singleMember ? (
            <EmptyState message='No member summary loaded yet. Enter user ID, month, and year, then click "Get Member Summary".' />
          ) : (
            <div style={styles.memberBox}>
              <div style={styles.memberHeader}>
                <div>
                  <h3 style={styles.memberName}>{singleMember.userName}</h3>
                  <p style={styles.memberMeta}>
                    Mess: <strong>{memberSummary.messName}</strong> | Month / Year:{" "}
                    <strong>
                      {memberSummary.month} / {memberSummary.year}
                    </strong>
                  </p>
                </div>

                <StatusBadge status={singleMember.settlementStatus} />
              </div>

              <div className="summary-grid">
                <div className="summary-item">
                  <span className="summary-label">User ID</span>
                  <strong>{singleMember.userId}</strong>
                </div>

                <div className="summary-item">
                  <span className="summary-label">Total Meals</span>
                  <strong>{singleMember.totalMeals}</strong>
                </div>

                <div className="summary-item">
                  <span className="summary-label">Meal Cost</span>
                  <strong>{singleMember.mealCost}</strong>
                </div>

                <div className="summary-item">
                  <span className="summary-label">Rent Share</span>
                  <strong>{singleMember.rentShare}</strong>
                </div>

                <div className="summary-item">
                  <span className="summary-label">Other Shared Cost</span>
                  <strong>{singleMember.otherSharedCostShare}</strong>
                </div>

                <div className="summary-item">
                  <span className="summary-label">Total Payable</span>
                  <strong>{singleMember.totalPayable}</strong>
                </div>

                <div className="summary-item">
                  <span className="summary-label">Expense Paid</span>
                  <strong>{singleMember.expensePaid}</strong>
                </div>

                <div className="summary-item">
                  <span className="summary-label">Rent Paid</span>
                  <strong>{singleMember.rentPaid}</strong>
                </div>

                <div className="summary-item">
                  <span className="summary-label">Total Paid</span>
                  <strong>{singleMember.totalPaid}</strong>
                </div>

                <div className="summary-item">
                  <span className="summary-label">Balance</span>
                  <strong>{singleMember.balance}</strong>
                </div>

                <div className="summary-item">
                  <span className="summary-label">Due Amount</span>
                  <strong>{singleMember.dueAmount}</strong>
                </div>

                <div className="summary-item">
                  <span className="summary-label">Advance Amount</span>
                  <strong>{singleMember.advanceAmount}</strong>
                </div>
              </div>
            </div>
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
    maxWidth: "1300px",
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
  memberBox: {
    padding: "18px",
    borderRadius: "12px",
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
  },
  memberHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "12px",
    flexWrap: "wrap",
    marginBottom: "18px",
  },
  memberName: {
    fontSize: "22px",
    color: "#0f172a",
    marginBottom: "6px",
  },
  memberMeta: {
    fontSize: "14px",
    color: "#475569",
    lineHeight: 1.6,
  },
};

export default MonthlySummaryPage;