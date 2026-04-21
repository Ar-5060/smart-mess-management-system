import { useState } from "react";
import {
  createMeal,
  updateMeal,
  getMealsByUserId,
  getMonthlyMealsByMess,
} from "../../api/mealApi";
import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import InputField from "../../components/common/InputField";
import Button from "../../components/common/Button";
import AlertMessage from "../../components/common/AlertMessage";
import EmptyState from "../../components/common/EmptyState";
import DataTable from "../../components/common/DataTable";
import getErrorMessage from "../../utils/getErrorMessage";

const initialMealForm = {
  mealId: "",
  userId: "",
  mealDate: "",
  breakfastCount: 0,
  lunchCount: 0,
  dinnerCount: 0,
};

const initialSummaryForm = {
  messId: "",
  month: "",
  year: "",
};

function MealEntryPage() {
  const [mealForm, setMealForm] = useState(initialMealForm);
  const [summaryForm, setSummaryForm] = useState(initialSummaryForm);

  const [mealLoading, setMealLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [mealHistory, setMealHistory] = useState([]);
  const [monthlySummary, setMonthlySummary] = useState(null);

  const resetMessages = () => {
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleMealFormChange = (e) => {
    const { name, value } = e.target;
    setMealForm((prev) => ({
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

  const buildMealPayload = () => ({
    userId: Number(mealForm.userId),
    mealDate: mealForm.mealDate,
    breakfastCount: Number(mealForm.breakfastCount),
    lunchCount: Number(mealForm.lunchCount),
    dinnerCount: Number(mealForm.dinnerCount),
  });

  const handleCreateMeal = async (e) => {
    e.preventDefault();
    resetMessages();
    setMealLoading(true);

    try {
      const payload = buildMealPayload();
      const response = await createMeal(payload);

      setSuccessMessage(
        response?.data?.message || "Meal entry created successfully."
      );

      if (mealForm.userId) {
        await handleLoadMealHistory(mealForm.userId, true);
      }

      setMealForm((prev) => ({
        ...initialMealForm,
        userId: prev.userId,
      }));
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error, "Failed to create meal entry.")
      );
    } finally {
      setMealLoading(false);
    }
  };

  const handleUpdateMeal = async () => {
    resetMessages();

    if (!mealForm.mealId) {
      setErrorMessage("Please enter a Meal ID before updating.");
      return;
    }

    setMealLoading(true);

    try {
      const payload = buildMealPayload();
      await updateMeal(Number(mealForm.mealId), payload);

      setSuccessMessage("Meal entry updated successfully.");

      if (mealForm.userId) {
        await handleLoadMealHistory(mealForm.userId, true);
      }
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error, "Failed to update meal entry.")
      );
    } finally {
      setMealLoading(false);
    }
  };

  const handleLoadMealHistory = async (userIdOverride, silent = false) => {
    const targetUserId = userIdOverride || mealForm.userId;

    if (!targetUserId) {
      setErrorMessage("Please enter a User ID first.");
      return;
    }

    if (!silent) {
      resetMessages();
    }

    setHistoryLoading(true);

    try {
      const response = await getMealsByUserId(Number(targetUserId));
      setMealHistory(response.data || []);

      if (!silent) {
        setSuccessMessage("Meal history loaded successfully.");
      }
    } catch (error) {
      setMealHistory([]);
      setErrorMessage(
        getErrorMessage(error, "Failed to load meal history.")
      );
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleLoadMonthlySummary = async () => {
    resetMessages();

    if (!summaryForm.messId || !summaryForm.month || !summaryForm.year) {
      setErrorMessage("Please enter Mess ID, month, and year.");
      return;
    }

    setSummaryLoading(true);

    try {
      const response = await getMonthlyMealsByMess(
        Number(summaryForm.messId),
        Number(summaryForm.month),
        Number(summaryForm.year)
      );

      setMonthlySummary(response.data || null);
      setSuccessMessage("Monthly meal summary loaded successfully.");
    } catch (error) {
      setMonthlySummary(null);
      setErrorMessage(
        getErrorMessage(error, "Failed to load monthly meal summary.")
      );
    } finally {
      setSummaryLoading(false);
    }
  };

  const fillFormFromHistory = (meal) => {
    setMealForm({
      mealId: meal.id,
      userId: meal.userId,
      mealDate: meal.mealDate,
      breakfastCount: meal.breakfastCount,
      lunchCount: meal.lunchCount,
      dinnerCount: meal.dinnerCount,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const totalMealUnits =
    Number(mealForm.breakfastCount || 0) +
    Number(mealForm.lunchCount || 0) +
    Number(mealForm.dinnerCount || 0);

  const historyColumns = [
    { key: "id", header: "Meal ID" },
    { key: "userName", header: "User" },
    { key: "messName", header: "Mess" },
    { key: "mealDate", header: "Date" },
    { key: "breakfastCount", header: "Breakfast" },
    { key: "lunchCount", header: "Lunch" },
    { key: "dinnerCount", header: "Dinner" },
    { key: "totalMealUnits", header: "Total" },
    { key: "action", header: "Action" },
  ];

  const monthlyColumns = [
    { key: "userId", header: "User ID" },
    { key: "userName", header: "User Name" },
    { key: "totalMeals", header: "Total Meals" },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.wrapper}>
        <PageHeader
          title="Meal Entry"
          subtitle="Create daily meals, update entries, load user meal history, and view monthly meal summary."
        />

        <AlertMessage type="success" message={successMessage} />
        <AlertMessage type="error" message={errorMessage} />

        <div className="section-grid" style={styles.topGrid}>
          <Card title="Create / Update Meal">
            <form onSubmit={handleCreateMeal} style={styles.form}>
              <div className="two-column">
                <InputField
                  label="Meal ID (for update only)"
                  name="mealId"
                  type="number"
                  value={mealForm.mealId}
                  onChange={handleMealFormChange}
                  placeholder="Enter meal ID for update"
                  min="1"
                />

                <InputField
                  label="User ID"
                  name="userId"
                  type="number"
                  value={mealForm.userId}
                  onChange={handleMealFormChange}
                  placeholder="Enter user ID"
                  min="1"
                  required
                />
              </div>

              <InputField
                label="Meal Date"
                name="mealDate"
                type="date"
                value={mealForm.mealDate}
                onChange={handleMealFormChange}
                required
              />

              <div className="three-column">
                <InputField
                  label="Breakfast Count"
                  name="breakfastCount"
                  type="number"
                  value={mealForm.breakfastCount}
                  onChange={handleMealFormChange}
                  min="0"
                  required
                />

                <InputField
                  label="Lunch Count"
                  name="lunchCount"
                  type="number"
                  value={mealForm.lunchCount}
                  onChange={handleMealFormChange}
                  min="0"
                  required
                />

                <InputField
                  label="Dinner Count"
                  name="dinnerCount"
                  type="number"
                  value={mealForm.dinnerCount}
                  onChange={handleMealFormChange}
                  min="0"
                  required
                />
              </div>

              <div className="summary-item">
                <span className="summary-label">Total Meal Units</span>
                <strong>{totalMealUnits}</strong>
              </div>

              <div className="button-row">
                <Button type="submit" variant="primary">
                  {mealLoading ? "Saving..." : "Create Meal"}
                </Button>

                <Button
                  type="button"
                  onClick={handleUpdateMeal}
                  variant="success"
                >
                  {mealLoading ? "Updating..." : "Update Meal"}
                </Button>

                <Button
                  type="button"
                  onClick={() => handleLoadMealHistory()}
                  variant="dark"
                >
                  {historyLoading ? "Loading..." : "Load User Meals"}
                </Button>
              </div>
            </form>
          </Card>

          <Card title="Monthly Meal Summary">
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
                onClick={handleLoadMonthlySummary}
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
                  <span className="summary-label">Total Meals</span>
                  <strong>{monthlySummary.totalMeals}</strong>
                </div>

                <div className="summary-item">
                  <span className="summary-label">Members Counted</span>
                  <strong>
                    {monthlySummary.memberSummaries?.length || 0}
                  </strong>
                </div>
              </div>
            )}
          </Card>
        </div>

        <Card title="User Meal History">
          {mealHistory.length === 0 ? (
            <EmptyState message='No meal history loaded yet. Enter a user ID and click "Load User Meals".' />
          ) : (
            <DataTable
              columns={historyColumns}
              data={mealHistory}
              renderCell={(key, row) => {
                if (key === "messName") return row.messName || "-";

                if (key === "action") {
                  return (
                    <Button
                      type="button"
                      onClick={() => fillFormFromHistory(row)}
                      variant="primary"
                    >
                      Edit
                    </Button>
                  );
                }

                return row[key];
              }}
            />
          )}
        </Card>

        {monthlySummary?.memberSummaries?.length > 0 && (
          <Card title="Monthly Member Meal Summary">
            <DataTable
              columns={monthlyColumns}
              data={monthlySummary.memberSummaries}
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
    gridTemplateColumns: "1.2fr 0.8fr",
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

export default MealEntryPage;