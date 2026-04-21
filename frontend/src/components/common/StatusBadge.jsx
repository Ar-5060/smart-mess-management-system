function StatusBadge({ status }) {
  const normalizedStatus = String(status || "").toUpperCase();

  const getClassName = () => {
    if (normalizedStatus === "ACTIVE") return "badge badge--success";
    if (normalizedStatus === "INACTIVE") return "badge badge--danger";
    if (normalizedStatus === "PAID") return "badge badge--success";
    if (normalizedStatus === "PARTIAL") return "badge badge--warning";
    if (normalizedStatus === "UNPAID") return "badge badge--danger";
    if (normalizedStatus === "ADVANCE") return "badge badge--success";
    if (normalizedStatus === "DUE") return "badge badge--danger";
    if (normalizedStatus === "SETTLED") return "badge badge--info";
    return "badge badge--default";
  };

  return <span className={getClassName()}>{normalizedStatus || "-"}</span>;
}

export default StatusBadge;