function InputField({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
  required = false,
  min,
  max,
  step,
  rows,
  options = [],
}) {
  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}

      {type === "textarea" ? (
        <textarea
          className="form-input form-textarea"
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          rows={rows || 4}
        />
      ) : type === "select" ? (
        <select
          className="form-input"
          name={name}
          value={value}
          onChange={onChange}
          required={required}
        >
          {options.map((option) => {
            const optionValue =
              typeof option === "object" ? option.value : option;
            const optionLabel =
              typeof option === "object" ? option.label : option;

            return (
              <option key={optionValue} value={optionValue}>
                {optionLabel}
              </option>
            );
          })}
        </select>
      ) : (
        <input
          className="form-input"
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          min={min}
          max={max}
          step={step}
        />
      )}
    </div>
  );
}

export default InputField;