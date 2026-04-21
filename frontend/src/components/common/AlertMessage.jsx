function AlertMessage({ type = "success", message }) {
  if (!message) return null;

  return (
    <div className={`alert alert--${type}`}>
      {message}
    </div>
  );
}

export default AlertMessage;