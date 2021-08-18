import React from "react";
import { Switch, Route } from "react-router-dom";
import WelcomePage from "./Pages/WelcomePage/WelcomePage";
import AdminPage from "./Pages/AdminPage/Admin";
import DatabasePage from "./Pages/DatabasePage/Base";
import QuestionsPage from "./Pages/QuestionsPage/QuestionPage";
function App() {
  return (
    <>
      <Switch>
        <Route path="/login" component={AdminPage} />
        <Route path="/database" component={DatabasePage} />
        <Route path="/quiz" component={QuestionsPage} />
        <Route path="/" component={WelcomePage} />
      </Switch>
    </>
  );
}

export default App;
