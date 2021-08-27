import React, { useEffect, useState } from "react";
import Checkbtn from "../../Components/CheckedBtn/Checked";
import TextArea from "../../Components/TextArea/TextArea";
import AnswerBar from "../../Components/AnswerBar/AnswerBar";
import Navbar from "../../Components/Navbar/Navbar";
import CloseIcon from "./close-btn.svg";
import SearchIcon from "./search-icon.svg";
import PencilIcon from "./edit-icon.svg";
import TrashIcon from "./trash-icon.svg";
import Api from "../../Services/Api";
import Loader from "../../Components/Loader/Loader";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import "./style.css";
import { Link } from "react-router-dom";

function Base() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [typeModal, setTypeModal] = useState("");
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [selectedMoreThanOne, setSelectedMoreThanOne] = useState(false);
  const [searchedQuestion, setSearchQuestion] = useState("");
  const [field, setField] = useState(null);
  const [isFill, setIsFill] = useState(false);
  const [isSavedField, setIsSavedField] = useState(false);
  const [opacity, setOpacity] = useState(1);

  // Functions depend on Modal
  const toggleModal = () => {
    setModalVisible((prev) => !prev);
  };
  const changeCurrentQuestionTitle = (value) => {
    setCurrentQuestion({
      ...currentQuestion,
      title: value,
    });
  };
  const changeCurrentQuestionChecked = (id) => {
    const prevAnswers = currentQuestion.answers;
    prevAnswers.map((item, index) => {
      if (index === id) {
        item.checked = !item.checked;
      }
      return item;
    });
    setCurrentQuestion({
      ...currentQuestion,
      answers: prevAnswers,
    });
  };
  const changeCurrentQuestionAnswers = (value, id) => {
    const prevAnswers = currentQuestion.answers;
    prevAnswers.map((item, index) => {
      if (index === id) {
        item.title = value;
      }
      return item;
    });
    setCurrentQuestion({
      ...currentQuestion,
      answers: prevAnswers,
    });
  };
  const addNewAnswerBarToCurrentQuestion = () => {
    const prevAnswers = currentQuestion.answers;
    prevAnswers.push({
      title: "",
      checked: false,
    });
    setCurrentQuestion({
      ...currentQuestion,
      answers: prevAnswers,
    });
  };
  const addNewQuestion = () => {
    const answers = currentQuestion.answers.map((item) => ({ ...item }));
    const title = currentQuestion.title;
    const checked = false;
    if (
      answers[answers.length - 1].title.replace(/\s+/g, " ").trim() !== "" &&
      answers.length > 1 &&
      title.replace(/\s+/g, " ").trim() !== "" &&
      answers.some((item) => item.checked)
    ) {
      const data = {
        title,
        answers,
        checked,
      };
      Api("/questions", "post", data)
        .then((res) => {
          if (res.status === 200) {
            setIsSavedField(true);
          }
          getData();
        })
        .catch((error) => console.log(error));
    }
    setTimeout(() => {
      setIsSavedField(false);
    }, 3000);
    setCurrentQuestion(null);
    setSearchQuestion("");
    toggleModal();
  };
  const saveEditedCurrentQuestion = () => {
    const answers = currentQuestion.answers.map((item) => ({ ...item }));
    const title = currentQuestion.title;
    const checked = false;
    if (
      answers[answers.length - 1].title.replace(/\s+/g, " ").trim() !== "" &&
      answers.length >= 1 &&
      title.replace(/\s+/g, " ").trim() !== "" &&
      answers.some((item) => item.checked)
    ) {
      const data = {
        id: currentQuestion.id,
        title,
        answers,
        checked,
      };
      Api(`/questions/${currentQuestion.id}`, "put", data)
        .then((res) => {
          if (res.status === 200) {
            setIsSavedField(true);
          }
          getData();
        })
        .catch((error) => console.log(error));
    }
    setTimeout(() => {
      setIsSavedField(false);
    }, 3000);
    setCurrentQuestion(null);
    setSearchQuestion("");
    toggleModal();
  };
  const deleteAgreeBtn = () => {
    selectedQuestions.map((item) =>
      Api(`/questions/${item}`, "delete")
        .then((res) => {
          if (res.status === 200) {
            setIsSavedField(true);
          }
          getData();
        })
        .catch((error) => console.log(error))
    );
    setTimeout(() => {
      setIsSavedField(false);
    }, 3000);
    setCurrentQuestion(null);
    setSearchQuestion("");
    setSelectedQuestions([]);
    toggleModal();
  };
  const deleteIgnorBtn = () => {
    setCurrentQuestion(null);
    toggleModal();
  };
  const modalCloseBtn = () => {
    setCurrentQuestion(null);
    toggleModal();
  };

  // Functions depend on Base Js
  const clickEditBtn = (item) => {
    const answers = item.answers.map((item) => ({ ...item }));
    setCurrentQuestion((prevState) => ({
      id: item.id,
      title: item.title,
      answers: answers,
      checked: item.checked,
    }));
    setTypeModal("edit");
    toggleModal();
  };
  const clickAddBtn = () => {
    setCurrentQuestion({
      title: "",
      answers: [
        {
          title: "",
          checked: false,
        },
      ],
      checked: false,
    });
    setTypeModal("add");
    toggleModal();
  };
  const onChangeChecked = (id) => {
    const changedArray = questions.map((item, index) => {
      if (item.id === id) {
        item.checked = !item.checked;
      }
      return item;
    });
    setSelectedQuestions(
      changedArray.filter((item) => item.checked).map((item) => item.id)
    );
    setQuestions(changedArray);
  };
  const deleteSelectedQuestions = () => {
    setTypeModal("delete");
    toggleModal();
  };
  const clickSelectAllBtn = (e) => {
    if (e.target.checked) {
      const newFilter = questions.map((item) => {
        item.checked = true;
        return item;
      });
      setQuestions(newFilter);
      setSelectedQuestions(
        newFilter.filter((item) => item.checked).map((item) => item.id)
      );
    } else {
      const newFilter = questions.map((item) => {
        item.checked = false;
        return item;
      });
      setQuestions(newFilter);
      setSelectedQuestions(
        newFilter.filter((item) => item.checked).map((item) => item.id)
      );
    }
  };
  const saveTimerAndAttemtps = () => {
    const id = field.id;
    const durations = field.durations;
    const attempts = field.attempts;
    const data = {
      id,
      durations,
      attempts,
    };
    if (durations >= 5 && attempts >= 1) {
      Api(`/time/${id}`, "put", data).then((res) => {
        if (res.status === 200) {
          setIsSavedField(true);
        }
        getData();
      });
    } else {
      setIsFill((prev) => true);
      setTimeout(() => {
        setIsFill((prev) => false);
      }, 6000);
    }
    setTimeout(() => {
      setIsSavedField(false);
    }, 3000);
  };
  const getData = async () => {
    await Api("/questions", "get").then((res) => {
      const fetchedResult = [];
      for (let key in res.data) {
        fetchedResult.push({
          ...res.data[key],
          id: key,
        });
      }
      setQuestions(fetchedResult);
      setTimeout(() => {
        setOpacity(0);
      }, 100);
    });
    await Api("/time", "get").then((res) => {
      const fetchedResult = [];
      for (let key in res.data) {
        fetchedResult.push({
          ...res.data[key],
          id: key,
        });
      }
      setField(fetchedResult[0]);
    });
  };
  useEffect(() => {
    getData();
  }, []);
  useEffect(() => {
    if (selectedQuestions.length >= 1) {
      setSelectedMoreThanOne((prev) => true);
    } else {
      setSelectedMoreThanOne((prev) => false);
    }
  }, [selectedQuestions]);
  return (
    <>
      <Loader opacity={opacity} />
      {modalVisible ? (
        <Modal isOpen={modalVisible} className={"pop-modal"} centered={true}>
          <Button
            color={`btn modal-close-btn ${
              typeModal === "delete" ? "d-none" : ""
            }`}
            onClick={modalCloseBtn}
          >
            <img src={CloseIcon} alt="icon" />
          </Button>
          <ModalHeader className="modal-header text-center">
            {typeModal === "add"
              ? "Add New Question"
              : typeModal === "edit"
              ? "Edit Question"
              : "Are you sure want to delete?"}
          </ModalHeader>
          <ModalBody className={`${typeModal === "delete" ? "d-none" : ""}`}>
            <TextArea
              value={currentQuestion ? currentQuestion.title : ""}
              typeModal={typeModal}
              onChange={changeCurrentQuestionTitle}
            />
            {currentQuestion
              ? currentQuestion.answers.map((item, index) => (
                  <div className="answer d-flex align-items-center" key={index}>
                    <Checkbtn
                      id={index}
                      checked={item.checked}
                      onChange={changeCurrentQuestionChecked}
                    />
                    <AnswerBar
                      id={index}
                      value={item.title}
                      onChange={changeCurrentQuestionAnswers}
                    />
                  </div>
                ))
              : ""}
            <Button
              className="add-answer-btn"
              onClick={addNewAnswerBarToCurrentQuestion}
            >
              <i className="bi bi-plus-lg"></i>
            </Button>
          </ModalBody>
          <ModalFooter>
            {typeModal === "add" ? (
              <Button className="btn-add" onClick={addNewQuestion}>
                Add
              </Button>
            ) : typeModal === "edit" ? (
              <Button className="btn-save" onClick={saveEditedCurrentQuestion}>
                Save
              </Button>
            ) : (
              <>
                <Button className="btn ignore-btn" onClick={deleteIgnorBtn}>
                  No
                </Button>
                <Button className="btn agree-btn" onClick={deleteAgreeBtn}>
                  Yes
                </Button>
              </>
            )}
          </ModalFooter>
        </Modal>
      ) : (
        ""
      )}
      <section id="dataBasePage">
        <div
          className={`alert alert-primary d-flex align-items-center ${
            isFill ? "show-alert" : ""
          }`}
          role="alert"
        >
          <i className="alert-icon bi bi-info-circle-fill"></i>
          <div>
            Attempts must be greater than 1 , Time must be greater than 5{" "}
          </div>
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
        <Navbar Page="database" />
        <div className="container">
          <div className="row p-0 m-0">
            <div className="col-md-12 p-0 m-0">
              <header className="header">
                <div className="row m-0 p-0 w-100">
                  <div
                    className="col-3 p-0 m-0
                  "
                  >
                    <h1 className="header-title">Questions</h1>
                  </div>
                  <div className="col-6 m-0 p-0">
                    <form className="search-box focused w-100">
                      <label htmlFor="search-bar">
                        <img src={SearchIcon} alt="lupa" />
                      </label>
                      <input
                        type="search"
                        placeholder="type something to search..."
                        id="search-bar"
                        className="search-bar"
                        onChange={(e) => {
                          setSearchQuestion(
                            e.target.value
                              .replace(/\s+/g, " ")
                              .trim()
                              .toLowerCase()
                          );
                        }}
                      />
                    </form>
                  </div>
                  <div className="col-md-3 p-0 d-flex align-items-center justify-content-end">
                    <button className="btn add-btn" onClick={clickAddBtn}>
                      Add<i className="bi bi-plus-lg plus-icon"></i>
                    </button>
                    <Link
                      to="/file"
                      className="btn add-btn ms-2"
                      onClick={clickAddBtn}
                    >
                      Add File<i className="bi bi-plus-lg plus-icon"></i>
                    </Link>
                  </div>
                </div>
              </header>
            </div>
            {field !== null ? (
              <div className="col-12 p-0 mb-4">
                <div className="row p-0 m-0">
                  <div className="col-5 ps-0">
                    <FormGroup>
                      <Label className="field-label" for="attempts">
                        Number Of Attempts
                      </Label>
                      <Input
                        type="number"
                        name="number"
                        id="attempts"
                        placeholder="number"
                        className="field-input"
                        value={field.attempts}
                        onChange={(e) =>
                          setField({ ...field, attempts: e.target.value })
                        }
                      />
                    </FormGroup>
                  </div>
                  <div className="col-5">
                    <FormGroup>
                      <Label for="timer" className="field-label">
                        Duration Of Test (minute)
                      </Label>
                      <Input
                        type="number"
                        name="number"
                        id="timer"
                        placeholder="minute"
                        className="field-input"
                        value={field.durations}
                        onChange={(e) =>
                          setField({ ...field, durations: e.target.value })
                        }
                      />
                    </FormGroup>
                  </div>
                  <div className="col-2 pe-0 d-flex align-items-end justify-content-end">
                    <button
                      className="btn btn-save-field"
                      onClick={saveTimerAndAttemtps}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="col-md-12 columns m-0 p-0">
          <div className="container">
            <div className="row m-0 p-0">
              <div className="col-sm-2 p-0 column-item">
                <h1
                  className={`col-name ${selectedMoreThanOne ? "d-none" : ""}`}
                >
                  Select
                </h1>
                <input
                  type="checkbox"
                  className={`all-select-input ${
                    selectedMoreThanOne ? "d-block" : ""
                  }`}
                  id="selectAll"
                  onChange={clickSelectAllBtn}
                />
              </div>
              <div className="col-sm-2 p-0 column-item">
                <h1 className="col-name">Nth</h1>
              </div>
              <div className="col-sm-6 p-0 column-item">
                <h1 className="col-name d-inline-block">Title</h1>
              </div>
              <div
                className={`col-sm-2 p-0 column-item text-end ${
                  selectedMoreThanOne ? "d-flex justify-content-end" : ""
                }`}
              >
                <h1
                  className={`col-name ${selectedMoreThanOne ? "d-none" : ""}`}
                >
                  Edit
                </h1>
                <button
                  className={`btn all-delete-btn ${
                    selectedMoreThanOne
                      ? "visible-delete-btn"
                      : "hide-delete-btn"
                  }`}
                  onClick={deleteSelectedQuestions}
                >
                  <img src={TrashIcon} alt="delete btn" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="container question-container">
          <ul className="list-group questions-list">
            {questions
              .filter((item) => {
                if (item.title.toLowerCase().indexOf(searchedQuestion) !== -1) {
                  return item;
                } else {
                  return "";
                }
              })
              .map((item, index) => (
                <label
                  className="list-group-item question"
                  htmlFor={item.id}
                  key={index}
                >
                  <div className="row m-0 p-0">
                    <div className="col-sm-2 p-0 column-item">
                      <Checkbtn
                        id={item.id}
                        checked={item.checked}
                        onChange={onChangeChecked}
                      />
                    </div>
                    <div className="col-sm-2 p-0 column-item">
                      <h1 className="question-number">{index + 1}</h1>
                    </div>
                    <div className="col-sm-6 p-0 column-item overflow-hidden">
                      <h1 className="question-title">{item.title}</h1>
                    </div>
                    <div className="col-sm-2 p-0 column-item text-end justify-content-end">
                      <button
                        className={`btn edit-btn ${
                          selectedMoreThanOne ? "disabled" : ""
                        }`}
                        disabled={selectedMoreThanOne ? true : false}
                        onClick={() => clickEditBtn(item)}
                      >
                        <img src={PencilIcon} alt="pencil" />
                      </button>
                    </div>
                  </div>
                </label>
              ))}
          </ul>
        </div>
      </section>
    </>
  );
}

export default Base;
