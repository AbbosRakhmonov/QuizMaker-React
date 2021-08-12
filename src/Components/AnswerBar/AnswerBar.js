import { useRef, useEffect } from "react";
import autosize from "autosize";
import "./style.css";

function AnswerBar({ index, value, onChange }) {
  const text = useRef();
  useEffect(() => {
    autosize(text.current);
  }, [text]);
  return (
    <label htmlFor={index} className="answer-label d-block w-100">
      <textarea
        className="form-control answer-box"
        onChange={(e) => onChange(e.target.value, index)}
        placeholder={`Answer-${index + 1}`}
        value={value}
        ref={text}
      ></textarea>
    </label>
  );
}

export default AnswerBar;
