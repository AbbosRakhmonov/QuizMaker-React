import "./style.css";
function Checked({ id, checked, onChange }) {
  return (
    <input
      className="check-btn"
      type="checkbox"
      id={id}
      checked={checked}
      onChange={() => {
        onChange(id);
      }}
    />
  );
}

export default Checked;
