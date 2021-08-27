import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Api from "../../Services/Api";
import Loader from "../../Components/Loader/Loader";
import "./style.css";

function File() {
  const [dragEnter, setDragEnter] = useState(false);
  const [dropText, setDropText] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [isSavedField, setIsSavedField] = useState(false);
  const [opacity, setOpacity] = useState(1);
  const val = useRef("");
  const getDrag = (e) => {
    setDragEnter(false);
    if (e.type === "text/plain" && e.length !== 0) {
      const reader = new FileReader();
      reader.readAsText(e);
      reader.addEventListener("load", function (e) {
        const val = e.target.result.trim();
        for (let i = 0; i < val.length; i++) {
          if (val[i] === "#") {
            let question = {
              title: "",
              answers: [],
              checked: false,
            };
            let j = i;
            while (val[j] !== "}") {
              if (val[j] === "{") {
                question.title = val
                  .slice(i + 1, j - 2)
                  .replace(/\s+/g, " ")
                  .trim();
              }
              if (val[j] === "+" || val[j] === "-") {
                const start = j;
                let end = j;
                let answer = "";
                while (val[end] !== "\n") {
                  if (val[end + 1] === "\n") {
                    const title = val
                      .slice(start + 1, end)
                      .replace(/\s+/g, " ")
                      .trim();
                    answer = {
                      title: title,
                      checked: val[start] === "+",
                    };
                    question.answers.push(answer);
                  }
                  end++;
                }
              }
              j++;
            }
            questions.push(question);
            setQuestions([...questions]);
          }
        }
      });
    } else {
      setDropText(true);
      setTimeout(() => {
        setDropText(false);
      }, 4000);
    }
  };
  const clickSave = () => {
    questions.map((item) =>
      Api("/questions", "post", item).catch((error) => console.log(error))
    );
    setQuestions([]);
    setIsSavedField(true);
    val.current.value = "";
    setTimeout(() => {
      setIsSavedField(false);
    }, 2000);
  };
  useEffect(() => {
    setTimeout(() => {
      setOpacity(0);
    }, 200);
  }, []);
  return (
    <section id="UploadFile">
      <Loader opacity={opacity} />
      <div
        className={`alert alert-primary d-flex align-items-center ${
          dropText ? "show-alert" : ""
        }`}
        role="alert"
      >
        <i className="alert-icon bi bi-info-circle-fill"></i>
        <div>You should upload only ".txt" format documents</div>
      </div>
      <div
        className={`alert alert-success d-flex align-items-center ${
          isSavedField ? "show-alert" : ""
        }`}
        role="alert"
      >
        <i className="alert-icon bi bi-check-circle-fill"></i>
        <div>Congratulate Saved</div>
      </div>
      <label
        className={`drop-box ${dragEnter ? "active" : ""} ${
          questions.length > 0 ? "d-none" : ""
        }`}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          getDrag(e.dataTransfer.files[0]);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragEnter(true);
        }}
        onDragLeave={() => setDragEnter(false)}
      >
        <i className="bi bi-file-earmark-plus file-icon" />
        <i className="bi bi-file-arrow-down file-progress-icon"></i>
        <h1 className="upload-title">Upload your txt file</h1>
        <code className="mt-4">
          <h4 className="text-light">Savol Formati</h4>
          #Savol Nomi <br />
          {"{"}
          <br />
          + To`g`ri javob <br />
          - Noto`g`ri javob
          <br />
          {"}"}
        </code>
        <input
          type="file"
          className="d-none"
          accept={".txt"}
          ref={val}
          onChange={(e) => {
            getDrag(e.target.files[0]);
          }}
        />
      </label>
      <Link
        className={`btn btn-danger px-4 mt-4 ${
          questions.length > 0 ? "d-none" : ""
        }`}
        to="/database"
      >
        Exit
      </Link>
      <div
        className={`container ${questions.length > 0 ? "d-block" : "d-none"}`}
      >
        <div className="row">
          <div className="col-md-12">
            <table className="table table-hover table-bordered table-dark table-striped">
              <thead>
                <tr>
                  <th scope="col">No</th>
                  <th scope="col">Title</th>
                  <th scope="col">Answers</th>
                  <th scope="col">Correct Answer</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((item, index) => (
                  <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>{item.title}</td>
                    <td>
                      {item.answers.map((item, index) => (
                        <p key={index}>{item.title}</p>
                      ))}
                    </td>
                    <td>
                      {item.answers
                        .filter((item) => item.checked)
                        .map((item, index) => (
                          <p key={index}>{item.title}</p>
                        ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="col-md-12 text-center">
            <button
              className="btn btn-danger me-3"
              onClick={() => {
                val.current.value = "";
                setQuestions([]);
              }}
            >
              Cancel
            </button>
            <button className="btn btn-primary" onClick={clickSave}>
              Save
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default File;
