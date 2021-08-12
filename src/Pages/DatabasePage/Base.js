import React, { useEffect, useState } from "react";
import Checkbtn from "../../Components/CheckedBtn/Checked";
import Navbar from "../../Components/Navbar/Navbar";
import SearchIcon from "./search-icon.svg";
import PencilIcon from "./edit-icon.svg";
import TrashIcon from "./trash-icon.svg";
import Modal from "../../Components/Modal/PopModal";
import Api from "../../Services/Api";
import "./style.css";

function Base() {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [clickedQuestion, setClickedQuestion] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [typeModal, setTypeModal] = useState("");
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [selectedMoreThanOne, setSelectedMoreThanOne] = useState(false);
  const [searchedQuestion, setSearchQuestion] = useState("");

  const toggleModal = () => {
    setModalVisible((prev) => !prev);
  };
  const clickEditBtn = (id) => {
    const selectedQuestion = filteredQuestions.filter((item) => item.id === id);
    setClickedQuestion(selectedQuestion[0]);
    setTypeModal("edit");
    toggleModal();
  };
  const clickAddBtn = () => {
    setClickedQuestion("");
    setTypeModal("add");
    toggleModal();
  };
  const clickDeleteBtn = (id) => {
    setTypeModal("delete");
    toggleModal();
    const selectedQuestion = filteredQuestions.filter((item) => item.id === id);
    setClickedQuestion(selectedQuestion[0]);
  };
  const onChangeChecked = (id) => {
    const changedArray = filteredQuestions.map((item, index) => {
      if (item.id === id) {
        item.checked = !item.checked;
      }
      return item;
    });
    setFilteredQuestions(changedArray);
    collectSelectedQuestions(filteredQuestions);
  };
  const collectSelectedQuestions = (arr) => {
    setSelectedQuestions(
      arr.filter((item) => item.checked).map((item) => item.id)
    );
  };
  const deleteSelectedQuestions = () => {
    setTypeModal("delete");
    toggleModal();
  };
  const clickSelectAllBtn = (e) => {
    if (e.target.checked) {
      const newFilter = filteredQuestions.filter(
        (item) => (item.checked = true)
      );
      setFilteredQuestions(newFilter);
      collectSelectedQuestions(newFilter);
    } else {
      const newFilter = filteredQuestions.filter((item) => {
        if (item.checked) {
          item.checked = false;
        }
        return item;
      });
      setFilteredQuestions(newFilter);
      collectSelectedQuestions(newFilter);
    }
  };
  const findSearchedQuestion = () => {
    const newFilter = questions.filter((item) => {
      const title = item.title.toLowerCase();
      if (title.indexOf(searchedQuestion) !== -1) {
        return item;
      } else {
        return "";
      }
    });
    setFilteredQuestions(newFilter);
  };
  const getData = async () => {
    const res = await Api("/questions", "get");
    setQuestions(res.data);
    setFilteredQuestions(res.data);
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

  useEffect(() => {
    findSearchedQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchedQuestion]);

  return (
    <section id="dataBasePage">
      <Modal
        question={clickedQuestion}
        typeModal={typeModal}
        modalVisible={modalVisible}
        toggleModal={toggleModal}
        getData={getData}
        selectedQuestions={selectedQuestions}
        setSelectedQuestions={setSelectedQuestions}
      />
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
              <h1 className={`col-name ${selectedMoreThanOne ? "d-none" : ""}`}>
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
              <h1 className={`col-name ${selectedMoreThanOne ? "d-none" : ""}`}>
                Edit
              </h1>
              <button
                className={`btn all-delete-btn ${
                  selectedMoreThanOne ? "visible-delete-btn" : "hide-delete-btn"
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
          {filteredQuestions
            ? filteredQuestions.map((item, index) => (
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
                        onClick={() => clickEditBtn(item.id)}
                      >
                        <img src={PencilIcon} alt="pencil" />
                      </button>
                      <button
                        className={`btn delete-btn ${
                          selectedMoreThanOne ? "disabled" : ""
                        }`}
                        onClick={() => clickDeleteBtn(item.id)}
                        disabled={selectedMoreThanOne ? true : false}
                      >
                        <img src={TrashIcon} alt="trash" />
                      </button>
                    </div>
                  </div>
                </label>
              ))
            : ""}
        </ul>
      </div>
    </section>
  );
}

export default Base;
