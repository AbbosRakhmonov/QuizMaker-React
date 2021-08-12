import "./style.css";
function TextArea({ value, typeModal, onChange }) {
  return (
    <textarea
      className={`modal-textarea form-control ${
        typeModal === "delete" ? "d-none" : ""
      }`}
      id="exampleFormControlTextarea1"
      placeholder="Question title ..."
      onChange={(e) => onChange(e.target.value)}
      value={value}
    >
      {value}
    </textarea>
  );
}

export default TextArea;
