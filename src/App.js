import React, {useState} from "react";
import {Switch, Route} from "react-router-dom";
import WelcomePage from "./Pages/WelcomePage/WelcomePage";
import AdminPage from "./Pages/AdminPage/Admin";
import DatabasePage from "./Pages/DatabasePage/Base";
import QuestionsPage from "./Pages/QuestionsPage/QuestionPage";
import File from "./Pages/UploadFilePage/File";
import MyDocument from "./Components/Document/MyDocument";

function App() {
    const [username, setUsername] = useState("");
    const [surname, setSurname] = useState("");
    const [final, setFinal] = useState([]);
    const [trueAnswers, setTrueAnswers] = useState(0);
    const [isPasswordWrong, setIsPasswordWrong] = useState(false);
    const adminLoggedIn = () => {
        localStorage.setItem("admin", true);
    };
    return (<>
            <Switch>
                <Route
                    path="/login"
                    render={(props) => (<AdminPage
                            isPasswordWrong={isPasswordWrong}
                            setIsPasswordWrong={setIsPasswordWrong}
                            setIsAdmin={adminLoggedIn}
                            {...props}
                        />)}
                />
                <Route
                    path="/database"
                    render={(props) => <DatabasePage {...props} />}
                />
                <Route path="/quiz"
                       render={(props) => <QuestionsPage username={username} surname={surname} setFinal={setFinal}
                                                         setTrueAnswers={setTrueAnswers}
                                                         trueAnswers={trueAnswers} {...props}/>}/>
                <Route path="/file" component={File}/>
                <Route path={"/document"}
                       render={(props) => <MyDocument
                           final={final}
                           trueAnswers={trueAnswers}
                           username={username}
                           surname={surname}
                           {...props}/>}/>
                <Route
                    path="/"
                    render={(props) => (<WelcomePage username={username} surname={surname} setSurname={setSurname}
                                                     setUsername={setUsername} {...props} />)}
                />
            </Switch>
        </>);
}

export default App;
