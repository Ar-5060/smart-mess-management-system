import { useEffect, useState } from "react";
import {
  createExpense,
  getExpensesByMess,
  getMonthlyExpenses,
} from "../../api/expenseApi";
import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import InputField from "../../components/common/InputField";
import Button from "../../components/common/Button";
import AlertMessage from "../../components/common/AlertMessage";
import EmptyState from "../../components/common/EmptyState";
import DataTable from "../../components/common/DataTable";
import getErrorMessage from "../../utils/getErrorMessage";

const initialExpenseForm = {
  messId: "",
  title: "",
  category: "BAZAR",
  amount: "",
  expenseDate: "",
  paidByUserId: "",
  notes: "",
};

const initialSummaryForm = {
  messId: "",
  month: "",
  year: "",
};

const expenseCategories = [
  { label: "BAZAR", value: "BAZAR" },
  { label: "ELECTRICITY", value: "ELECTRICITY" },
  { label: "INTERNET", value: "INTERNET" },
  { label: "GAS", value: "GAS" },
  { label: "WATER", value: "WATER" },
  { label: "MAID", value: "MAID" },
  { label: "REPAIR", value: "REPAIR" },
  { label: "OTHER", value: "OTHER" },
];

function ExpensePage() {
  const [expenseForm, setExpenseForm] = useState(initialExpenseForm);
  const [summaryForm, setSummaryForm] = useState(initialSummaryForm);

  const [expenseLoading, setExpenseLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);

  const [expenses, setExpenses] = useState([]);
  const [monthlySummary, setMonthlySummary] = useState(null);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const savedMessId = localStorage.getItem("messId");

    if (savedMessId) {
      setExpenseForm((prev) => ({
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

  const handleExpenseChange = (e) => {
    const { name, value } = e.target;
    setExpenseForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSummaryChange = (e) => {
    const { name, value } = e.target;
    setSummaryForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateExpense = async (e) => {
    e.preventDefault();
    resetMessages();
    setExpenseLoading(true);

    try {
      const payload = {
        messId: Number(expenseForm.messId),
        title: expenseForm.title.trim(),
        category: expenseForm.category,
        amount: Number(expenseForm.amount),
        expenseDate: expenseForm.expenseDate,
        paidByUserId: expenseForm.paidByUserId
          ? Number(expenseForm.paidByUserId)
          : null,
        notes: expenseForm.notes.trim() || null,
      };

      const response = await createExpense(payload);

      setSuccessMessage(
        response?.data?.message || "Expense added successfully."
      );

      localStorage.setItem("messId", String(payload.messId));

      if (payload.messId) {
        await loadExpensesByMess(payload.messId, true);
      }

      setSummaryForm((prev) => ({
        ...prev,
        messId: String(payload.messId),
      }));

      setExpenseForm((prev) => ({
        ...initialExpenseForm,
        messId: prev.messId,
        category: "BAZAR",
      }));
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Failed to add expense."));
    } finally {
      setExpenseLoading(false);
    }
  };

  const loadExpensesByMess = async (messIdOverride, silent = false) => {
    const targetMessId = messIdOverride || expenseForm.messId;

    if (!targetMessId) {
      setErrorMessage("Please enter a Mess ID first.");
      return;
    }

    if (!silent) {
      resetMessages();
    }

    setListLoading(true);

    try {
      const response = await getExpensesByMess(Number(targetMessId));
      setExpenses(response.data || []);
      localStorage.setItem("messId", String(targetMessId));

      if (!silent) {
        setSuccessMessage("Expenses loaded successfully.");
      }
    } catch (error) {
      setExpenses([]);
      setErrorMessage(getErrorMessage(error, "Failed to load expenses."));
    } finally {
      setListLoading(false);
    }
  };

  const loadMonthlySummary = async () => {
    resetMessages();

    if (!summaryForm.messId || !summaryForm.month || !summaryForm.year) {
      setErrorMessage("Please enter Mess ID, month, and year.");
      return;
    }

    setSummaryLoading(true);

    try {
      const response = await getMonthlyExpenses(
        Number(summaryForm.messId),
        Number(summaryForm.month),
        Number(summaryForm.year)
      );

      setMonthlySummary(response.data || null);
      localStorage.setItem("messId", String(summaryForm.messId));
      setSuccessMessage("Monthly expense summary loaded successfully.");
    } catch (error) {
      setMonthlySummary(null);
      setErrorMessage(
        getErrorMessage(error, "Failed to load monthly expense summary.")
      );
    } finally {
      setSummaryLoading(false);
    }
  };

  const expenseColumns = [
    { key: "id", header: "ID" },
    { key: "title", header: "Title" },
    { key: "category", header: "Category" },
    { key: "amount", header: "Amount" },
    { key: "expenseDate", header: "Date" },
    { key: "paidByUserName", header: "Paid By" },
    { key: "messName", header: "Mess" },
    { key: "notes", header: "Notes" },
  ];

  const categoryColumns = [
    { key: "category", header: "Category" },
    { key: "totalAmount", header: "Total Amount" },
  ];

  const monthlyExpenseColumns = [
    { key: "id", header: "ID" },
    { key: "title", header: "Title" },
    { key: "category", header: "Category" },
    { key: "amount", header: "Amount" },
    { key: "expenseDate", header: "Date" },
    { key: "paidByUserName", header: "Paid By" },
    { key: "notes", header: "Notes" },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.wrapper}>
        <PageHeader
          title="Expense Management"
          subtitle="Add shared expenses, load all expenses by mess, and view monthly expense summaries."
        />

        <AlertMessage type="success" message={successMessage} />
        <AlertMessage type="error" message={errorMessage} />

        <div className="section-grid" style={styles.topGrid}>
          <Card title="Add Expense">
            <form onSubmit={handleCreateExpense} style={styles.form}>
              <div className="two-column">
                <InputField
                  label="Mess ID"
                  name="messId"
                  type="number"
                  value={expenseForm.messId}
                  onChange={handleExpenseChange}
                  placeholder="Enter mess ID"
                  min="1"
                  required
                />

                <InputField
                  label="Paid By User ID"
                  name="paidByUserId"
                  type="number"
                  value={expenseForm.paidByUserId}
                  onChange={handleExpenseChange}
                  placeholder="Optional payer user ID"
                  min="1"
                />
              </div>

              <InputField
                label="Title"
                name="title"
                value={expenseForm.title}
                onChange={handleExpenseChange}
                placeholder="e.g. Weekly Bazar"
                required
              />

              <div className="two-column">
                <InputField
                  label="Category"
                  name="category"
                  type="select"
                  value={expenseForm.category}
                  onChange={handleExpenseChange}
                  options={expenseCategories}
                  required
                />

                <InputField
                  label="Amount"
                  name="amount"
                  type="number"
                  value={expenseForm.amount}
                  onChange={handleExpenseChange}
                  placeholder="Enter amount"
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>

              <InputField
                label="Expense Date"
                name="expenseDate"
                type="date"
                value={expenseForm.expenseDate}
                onChange={handleExpenseChange}
                required
              />

              <InputField
                label="Notes"
                name="notes"
                type="textarea"
                value={expenseForm.notes}
                onChange={handleExpenseChange}
                placeholder="Optional notes"
                rows={4}
              />

              <div className="button-row">
                <Button type="submit" variant="primary">
                  {expenseLoading ? "Saving..." : "Add Expense"}
                </Button>

                <Button
                  type="button"
                  onClick={() => loadExpensesByMess()}
                  variant="dark"
                >
                  {listLoading ? "Loading..." : "Load Expenses"}
                </Button>
              </div>
            </form>
          </Card>

          <Card title="Monthly Expense Summary">
            <div style={styles.form}>
              <InputField
                label="Mess ID"
                name="messId"
                type="number"
                value={summaryForm.messId}
                onChange={handleSummaryChange}
                placeholder="Enter mess ID"
                min="1"
              />

              <div className="two-column">
                <InputField
                  label="Month"
                  name="month"
                  type="number"
                  value={summaryForm.month}
                  onChange={handleSummaryChange}
                  placeholder="1 - 12"
                  min="1"
                  max="12"
                />

                <InputField
                  label="Year"
                  name="year"
                  type="number"
                  value={summaryForm.year}
                  onChange={handleSummaryChange}
                  placeholder="e.g. 2026"
                  min="2000"
                />
              </div>

              <Button
                type="button"
                onClick={loadMonthlySummary}
                variant="primary"
              >
                {summaryLoading ? "Loading..." : "Get Monthly Summary"}
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
                  <span className="summary-label">Total Expense</span>
                  <strong>{monthlySummary.totalExpense}</strong>
                </div>

                <div className="summary-item">
                  <span className="summary-label">Expense Count</span>
                  <strong>{monthlySummary.expenses?.length || 0}</strong>
                </div>
              </div>
            )}
          </Card>
        </div>

        <Card title="Expense List">
          {expenses.length === 0 ? (
            <EmptyState message={'No expenses loaded yet. Enter a mess ID and click "Load Expenses".'} />
          ) : (
            <DataTable
              columns={expenseColumns}
              data={expenses}
              renderCell={(key, row) => {
                if (key === "paidByUserName") return row.paidByUserName || "-";
                if (key === "messName") return row.messName || "-";
                if (key === "notes") return row.notes || "-";
                return row[key];
              }}
            />
          )}
        </Card>

        {monthlySummary?.categorySummaries?.length > 0 && (
          <Card title="Category Summary">
            <DataTable
              columns={categoryColumns}
              data={monthlySummary.categorySummaries}
            />
          </Card>
        )}

        {monthlySummary?.expenses?.length > 0 && (
          <Card title="Monthly Expense Details">
            <DataTable
              columns={monthlyExpenseColumns}
              data={monthlySummary.expenses}
              renderCell={(key, row) => {
                if (key === "paidByUserName") return row.paidByUserName || "-";
                if (key === "notes") return row.notes || "-";
                return row[key];
              }}
            />
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
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  topGrid: {
    gridTemplateColumns: "1.15fr 0.85fr",
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

export default ExpensePage;