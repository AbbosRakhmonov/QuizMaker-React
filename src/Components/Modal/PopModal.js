import { useState, useEffect } from "react";
import TextArea from "../TextArea/TextArea";
import AnswerBar from "../AnswerBar/AnswerBar";
import CloseIcon from "./close-btn.svg";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import Api from "../../Services/Api";
import Checked from "../CheckedBtn/Checked";
import "./style.css";

function PopModal({
  question,
  typeModal,
  modalVisible,
  toggleModal,
  getData,
  selectedQuestions,
  setSelectedQuestions,
}) {
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [answers, setAnswers] = useState([]);

  const onChangeAnswers = (value, i) => {
    const newAnswers = answers.map((item, index) => {
      if (index === i) {
        item.title = value;
      }
      return item;
    });
    setAnswers(newAnswers);
  };
  const onChangeTitle = (value) => {
    setTitle((prev) => value);
  };
  const addNewAnswer = () => {
    answers.push({
      title: "",
      checked: false,
    });
    setAnswers([...answers]);
  };
  const clickAddBtn = () => {
    if (
      answers[answers.length - 1].title.replace(/\s+/g, " ").trim() !== "" &&
      answers.length >= 0
    ) {
      const data = {
        title: title.replace(/\s+/g, " ").trim(),
        answers: answers.map((item) => {
          if (item.title) {
            item.title = item.title.replace(/\s+/g, " ").trim();
          }
          return item;
        }),
        checked: false,
      };
      Api("/questions", "post", data).then(() => getData());
      setTitle("");
      setAnswers([
        {
          title: "",
          checked: false,
        },
      ]);
    }
    toggleModal();
  };
  const clickSaveBtn = () => {
    if (answers[answers.length - 1].title.trim() === "") {
      answers.splice(answers.length - 1, 1);
      setAnswers([...answers]);
    }
    const data = {
      id: id,
      title: title.replace(/\s+/g, " ").trim(),
      answers: answers.map((item) => {
        if (item.title) {
          item.title = item.title.replace(/\s+/g, " ").trim();
        }
        return item;
      }),
      checked: false,
    };
    Api(`/questions/${id}`, "put", data).then(() => getData());
    toggleModal();
  };
  const clickAgreeBtn = () => {
    if (selectedQuestions.length > 0) {
      selectedQuestions.map((item) =>
        Api(`/questions/${item}`, "delete").then(() => getData())
      );
      setSelectedQuestions([]);
    } else {
      Api(`/questions/${id}`, "delete").then(() => getData());
    }
    toggleModal();
  };
  const onChangeChecked = (id) => {
    const changedArray = answers.map((item, index) => {
      if (index === id) {
        item.checked = !item.checked;
      }
      return item;
    });
    setAnswers(changedArray);
  };

  useEffect(() => {
    setTitle((prev) => question.title);
    setAnswers((prev) => question.answers);
    setId((prev) => question.id);
  }, [question]);

  return (
    <Modal isOpen={modalVisible} className={"pop-modal"}>
      <Button
        color={`btn modal-close-btn ${typeModal === "delete" ? "d-none" : ""}`}
        onClick={toggleModal}
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
          value={title}
          typeModal={typeModal}
          onChange={onChangeTitle}
        />
        {answers
          ? answers.map((item, index) => (
              <div className="answer d-flex align-items-center" key={index}>
                <Checked
                  id={index}
                  checked={item.checked}
                  onChange={onChangeChecked}
                />
                <AnswerBar
                  index={index}
                  value={item.title}
                  onChange={onChangeAnswers}
                />
              </div>
            ))
          : setAnswers([
              {
                title: "",
                checked: false,
              },
            ])}
        <Button className="add-answer-btn" onClick={addNewAnswer}>
          <i className="bi bi-plus-lg"></i>
        </Button>
      </ModalBody>
      <ModalFooter>
        {typeModal === "add" ? (
          <Button className="btn-add" onClick={clickAddBtn}>
            Add
          </Button>
        ) : typeModal === "edit" ? (
          <Button className="btn-save" onClick={clickSaveBtn}>
            Save
          </Button>
        ) : (
          <>
            <Button className="btn ignore-btn" onClick={toggleModal}>
              No
            </Button>
            <Button className="btn agree-btn" onClick={clickAgreeBtn}>
              Yes
            </Button>
          </>
        )}
      </ModalFooter>
    </Modal>
  );
}

export default PopModal;
