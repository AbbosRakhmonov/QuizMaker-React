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
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import "./style.css";

function Base() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [typeModal, setTypeModal] = useState("");
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [selectedMoreThanOne, setSelectedMoreThanOne] = useState(false);
  const [searchedQuestion, setSearchQuestion] = useState("");

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
      answers.length >= 0 &&
      title.replace(/\s+/g, " ").trim() !== "" &&
      answers.some((item) => item.checked)
    ) {
      const data = {
        title,
        answers,
        checked,
      };
      Api("/questions", "post", data)
        .then(() => getData())
        .catch((error) => console.log(error));
    }
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
        title,
        answers,
        checked,
      };
      Api(`/questions/${currentQuestion.id}`, "put", data)
        .then(() => getData())
        .catch((error) => console.log(error));
    }
    setCurrentQuestion(null);
    setSearchQuestion("");
    toggleModal();
  };
  const deleteAgreeBtn = () => {
    if (selectedMoreThanOne) {
      selectedQuestions.map((item) =>
        Api(`/questions/${item}`, "delete")
          .then(() => getData())
          .catch((error) => console.log(error))
      );
    } else {
      Api(`/questions/${currentQuestion.id}`, "delete")
        .then(() => getData())
        .catch((error) => console.log(error));
    }
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
  const clickDeleteBtn = (item) => {
    setCurrentQuestion({ ...item });
    setTypeModal("delete");
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
  const getData = async () => {
    const res = await Api("/questions", "get");
    setQuestions(res.data);
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
      {modalVisible ? (
        <Modal isOpen={modalVisible} className={"pop-modal"}>
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
        <Navbar Page="database" />
        <div className="container">
          <div className="row p-0 m-0">
            <div className="col-md-12 p-0 m-0">
              <header className="header">
                <h1 className="header-title">Questions</h1>
                <form className="search-box focused">
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
                        e.target.value.replace(/\s+/g, " ").trim().toLowerCase()
                      );
                    }}
                  />
                </form>
                <button className="btn add-btn" onClick={clickAddBtn}>
                  Add<i className="bi bi-plus-lg plus-icon"></i>
                </button>
              </header>
            </div>
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
                      <button
                        className={`btn delete-btn ${
                          selectedMoreThanOne ? "disabled" : ""
                        }`}
                        onClick={() => clickDeleteBtn(item)}
                        disabled={selectedMoreThanOne ? true : false}
                      >
                        <img src={TrashIcon} alt="trash" />
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
