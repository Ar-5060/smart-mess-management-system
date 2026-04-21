import { useEffect, useMemo, useState } from "react";
import {
  createMember,
  getMembersByMessId,
  activateMember,
  deactivateMember,
} from "../../api/memberApi";
import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import InputField from "../../components/common/InputField";
import Button from "../../components/common/Button";
import AlertMessage from "../../components/common/AlertMessage";
import EmptyState from "../../components/common/EmptyState";
import StatusBadge from "../../components/common/StatusBadge";
import DataTable from "../../components/common/DataTable";
import StatCard from "../../components/common/StatCard";
import getErrorMessage from "../../utils/getErrorMessage";

const initialForm = {
  name: "",
  email: "",
  password: "",
  phone: "",
  messId: "",
};

function MemberManagementPage() {
  const [formData, setFormData] = useState(initialForm);
  const [searchMessId, setSearchMessId] = useState("");
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const savedMessId = localStorage.getItem("messId");

    if (savedMessId) {
      setFormData((prev) => ({
        ...prev,
        messId: savedMessId,
      }));
      setSearchMessId(savedMessId);
    }
  }, []);

  const activeCount = useMemo(
    () => members.filter((member) => member.status === "ACTIVE").length,
    [members]
  );

  const inactiveCount = useMemo(
    () => members.filter((member) => member.status === "INACTIVE").length,
    [members]
  );

  const resetMessages = () => {
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchMembers = async (messIdValue, silent = false) => {
    if (!messIdValue) {
      setErrorMessage("Please enter a mess ID first.");
      return;
    }

    if (!silent) {
      resetMessages();
    }

    setListLoading(true);

    try {
      const response = await getMembersByMessId(Number(messIdValue));
      setMembers(response.data || []);
      localStorage.setItem("messId", String(messIdValue));

      if (!silent) {
        setSuccessMessage("Members loaded successfully.");
      }
    } catch (error) {
      setMembers([]);
      setErrorMessage(getErrorMessage(error, "Failed to load members."));
    } finally {
      setListLoading(false);
    }
  };

  const handleCreateMember = async (e) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: formData.phone.trim(),
        messId: Number(formData.messId),
      };

      const response = await createMember(payload);

      setSuccessMessage(
        response?.data?.message || "Member added successfully."
      );

      localStorage.setItem("messId", String(payload.messId));
      setSearchMessId(String(payload.messId));

      setFormData((prev) => ({
        ...initialForm,
        messId: prev.messId,
      }));

      await fetchMembers(payload.messId, true);
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Failed to add member."));
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (member) => {
    resetMessages();
    setActionLoadingId(member.id);

    try {
      if (member.status === "ACTIVE") {
        await deactivateMember(member.id);
        setSuccessMessage(`Member "${member.name}" deactivated successfully.`);
      } else {
        await activateMember(member.id);
        setSuccessMessage(`Member "${member.name}" activated successfully.`);
      }

      if (searchMessId) {
        await fetchMembers(searchMessId, true);
      }
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error, "Failed to update member status.")
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  const columns = [
    { key: "id", header: "ID" },
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    { key: "phone", header: "Phone" },
    { key: "role", header: "Role" },
    { key: "status", header: "Status" },
    { key: "joinDate", header: "Join Date" },
    { key: "messName", header: "Mess" },
    { key: "action", header: "Action" },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.wrapper}>
        <PageHeader
          title="Member Management"
          subtitle="Add members to a mess, load members by mess ID, and activate or deactivate them."
        />

        <AlertMessage type="success" message={successMessage} />
        <AlertMessage type="error" message={errorMessage} />

        <div className="section-grid" style={styles.topGrid}>
          <Card title="Add Member">
            <form onSubmit={handleCreateMember} style={styles.form}>
              <InputField
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                placeholder="Enter member name"
                required
              />

              <InputField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleFormChange}
                placeholder="Enter member email"
                required
              />

              <div className="two-column">
                <InputField
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleFormChange}
                  placeholder="Enter password"
                  required
                />

                <InputField
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  placeholder="Enter phone"
                />
              </div>

              <InputField
                label="Mess ID"
                name="messId"
                type="number"
                value={formData.messId}
                onChange={handleFormChange}
                placeholder="Enter mess ID"
                min="1"
                required
              />

              <Button type="submit" variant="primary">
                {loading ? "Adding..." : "Add Member"}
              </Button>
            </form>
          </Card>

          <Card title="Load Members">
            <div style={styles.form}>
              <InputField
                label="Mess ID"
                name="searchMessId"
                type="number"
                value={searchMessId}
                onChange={(e) => setSearchMessId(e.target.value)}
                placeholder="Enter mess ID to view members"
                min="1"
              />

              <Button
                type="button"
                onClick={() => fetchMembers(searchMessId)}
                variant="dark"
                fullWidth
              >
                {listLoading ? "Loading..." : "Get Members"}
              </Button>
            </div>

            <div className="section-grid" style={styles.statsGrid}>
              <StatCard label="Total" value={members.length} />
              <StatCard label="Active" value={activeCount} />
              <StatCard label="Inactive" value={inactiveCount} />
            </div>
          </Card>
        </div>

        <Card title="Member List">
          {members.length === 0 ? (
            <EmptyState message='No members loaded yet. Enter a mess ID and click "Get Members".' />
          ) : (
            <DataTable
              columns={columns}
              data={members}
              renderCell={(key, row) => {
                if (key === "phone") return row.phone || "-";
                if (key === "role") return row.role || "-";
                if (key === "joinDate") return row.joinDate || "-";
                if (key === "messName") return row.messName || "-";
                if (key === "status") {
                  return <StatusBadge status={row.status} />;
                }
                if (key === "action") {
                  const isLoading = actionLoadingId === row.id;
                  const isActive = row.status === "ACTIVE";

                  return (
                    <Button
                      type="button"
                      onClick={() => handleToggleStatus(row)}
                      variant={isActive ? "danger" : "success"}
                    >
                      {isLoading
                        ? "Updating..."
                        : isActive
                        ? "Deactivate"
                        : "Activate"}
                    </Button>
                  );
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
    gridTemplateColumns: "1.1fr 0.9fr",
  },
  statsGrid: {
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    marginTop: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
};

export default MemberManagementPage;