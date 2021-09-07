import React, { useEffect, useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { useTimer } from "reactjs-countdown-hook";
import "./style.css";
import Navbar from "../../Components/Navbar/Navbar";
import Chevron from "./chevron-right.svg";
import Loader from "../../Components/Loader/Loader";
import Api from "../../Services/Api";

function QuestionsPage({ history }) {
  const [prevQuestions, setPrevQuestions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [trueAnswers, setTrueAnswers] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [timer, setTimer] = useState(0);
  const [numberOfAttempts, setNumberOfAttempts] = useState(1);
  const { seconds, minutes, hours, pause, reset } = useTimer(
    timer * 60,
    handleTimerFinish
  );
  function handleTimerFinish() {
    toggleModal();
  }
  const shuffle = (array) => {
    let currentIndex = array.length,
        randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  };
  const toggleModal = () => {
    setModalVisible((prev) => !prev);
  };
  const clickFinishBtn = () => {
    setNumberOfAttempts((prev) => prev - 1);
    pause();
    for (let i = 0; i < prevQuestions.length; i++) {
      for (let j = 0; j < questions.length; j++) {
        if (prevQuestions[i].title === questions[j].title) {
          const prevAnswers = prevQuestions[i].answers.filter(
            (item) => item.checked === true
          );
          const newAnswers = questions[j].answers.filter(
            (item) => item.checked === true
          );
          if (
            newAnswers.length > 0 ||
            newAnswers.length === prevAnswers.length
          ) {
            let counter = 0;
            for (let m = 0; m < newAnswers.length; m++) {
              for (let n = 0; n < prevAnswers.length; n++) {
                if (newAnswers[m].title === prevAnswers[n].title) {
                  counter++;
                }
              }
            }
            if (counter === prevAnswers.length)
              setTrueAnswers((prev) => prev + 1);
          }
        }
      }
    }
    toggleModal();
  };
  const clickNextBtn = () => {
    if (currentQuestionIndex !== questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };
  const clickPrevBtn = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };
  const clickPlayAgainBtn = () => {
    reset();
    setCurrentQuestionIndex(0);
    getData().then(()=> toggleModal())
  };
  const changeAnswerChecked = (index) => {
    const prevAnswers = currentQuestion.answers;
    prevAnswers.map((item, prevIndex) => {
      if (index === prevIndex) {
        item.checked = !item.checked;
      }
      return item;
    });
    setCurrentQuestion({
      ...currentQuestion,
      answers: prevAnswers,
    });
  };
  const getData = async () => {
    await Api("/questions", "get").then((res) => {
      let fetchedResult = [];
      for (let key in res.data) {
        fetchedResult.push({
          ...res.data[key],
        });
      }
      fetchedResult = shuffle(fetchedResult);
      for (let item of fetchedResult) {
        item.answers = shuffle(item.answers);
      }
      const data = fetchedResult.map((item) => ({
        title: item.title,
        answers: item.answers.map((item) => ({
          title: item.title,
          checked: false,
        })),
      }));
      setQuestions(data);
      setPrevQuestions(fetchedResult);
    });
    await Api("/time", "get").then((res) => {
      const fetchedResult = [];
      for (let key in res.data) {
        fetchedResult.push({
          ...res.data[key],
          id: key,
        });
      }
      setTimer(fetchedResult[0].durations);
    });
  };
  useEffect(() => {
    getData();
  }, []);
  useEffect(() => {
    if (questions.length > 0) {
      const prevQuestion = questions.find(
        (item, index) => index === currentQuestionIndex
      );
      setCurrentQuestion(prevQuestion);
    }
  }, [currentQuestionIndex, questions]);
  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer]);

  return (
    <>
      <Loader opacity={questions.length > 0 && timer > 0 ? 0 : 1} />
      <Modal
        isOpen={modalVisible}
        className={"pop-modal question-page-modal"}
        centered={true}
      >
        <ModalHeader className="text-center text-uppercase">
          CONGRATULATION
        </ModalHeader>
        <ModalBody className="text-center">
          <p className="modal-body-text">You Answered</p>
          <h1 className="true-answers-number">
            {trueAnswers} / {questions.length}
          </h1>
          <p className="modal-body-text">questions correct</p>
        </ModalBody>
        <ModalFooter>
          <Button
            className="btn ignore-btn back-btn"
            onClick={() => {
              history.push("/");
            }}
          >
            Back to home
          </Button>
          <Button
            className={`btn agree-btn play-again-btn ${
              numberOfAttempts > 0 ? "d-flex" : "d-none"
            }`}
            onClick={clickPlayAgainBtn}
          >
            Play again
          </Button>
        </ModalFooter>
      </Modal>
      <section
        id="TestsPage"
        className={`${
          questions.length > 0 && timer > 0 ? "d-block" : "d-none"
        }`}
      >
        <div className="container h-100">
          <div className="row p-0 m-0 main-row">
              <Navbar />
            <div className="col-12 p-0 m-0 question-content">
              <div className="row flex-column h-100 flex-nowrap">
                <div className="col-md-12 question-data">
                  <h1 className="page-title text-uppercase">Questions</h1>
                  <p className="question-number">
                    {currentQuestionIndex + 1} / {questions.length}
                  </p>
                  <h3 className="question-title">
                    {currentQuestion ? currentQuestion.title : ""}
                  </h3>
                  <div className="questions-answers-box">
                    {currentQuestion
                      ? currentQuestion.answers.map((item, index) => (
                          <label
                            key={index}
                            htmlFor={index}
                            className={`btn answer-btn d-flex align-items-center ${
                              item.checked ? "active-btn" : ""
                            }`}
                          >
                            <input
                              type="checkbox"
                              className="answer-checked"
                              id={index}
                              checked={item.checked}
                              onChange={() => {
                                changeAnswerChecked(index);
                              }}
                            />
                            <span className="answer-title">{item.title}</span>
                          </label>
                        ))
                      : ""}
                    <div className="slide-buttons">
                      <button
                        className={`btn prev-btn ${
                          currentQuestionIndex > 0
                            ? "show-prev-btn"
                            : "hide-prev-btn"
                        }`}
                        onClick={clickPrevBtn}
                      >
                        <img
                          src={Chevron}
                          className="chevron-left"
                          alt="chevron right"
                        />
                        Prev Question
                      </button>
                      <button
                        className={`btn next-btn ${
                          currentQuestionIndex === questions.length - 1
                            ? "d-none"
                            : ""
                        }`}
                        onClick={clickNextBtn}
                      >
                        Next Question
                        <img
                          src={Chevron}
                          alt="chevron right"
                          className="chevron-right"
                        />
                      </button>
                      <button
                        className={`btn next-btn ${
                          currentQuestionIndex === questions.length - 1
                            ? "d-flex"
                            : "d-none"
                        }`}
                        onClick={clickFinishBtn}
                      >
                        Finish
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-md-12 p-0 m-0 timer-data">
                  <p className="time">
                    {hours} : {minutes} : {seconds}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default QuestionsPage;
