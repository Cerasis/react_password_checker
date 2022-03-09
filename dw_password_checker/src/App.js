import "./App.css";
import { useState, useEffect } from "react";
import useDebounce from "./Debouncer";
import { Form, FormGroup, Input, Label, Progress } from "reactstrap";
import axios from "axios";

function App() {
  const [searchString, setSearchString] = useState("");
  const deboucedSearchString = useDebounce(searchString, 200);

  const onChange = (e) => setSearchString(e.target.value);

  const [checkResponse, setCheckResponse] = useState({
    score: undefined,
    guessTimeString: undefined,
    warning: undefined,
    suggestions: undefined,
  });

  const { score, guessTimeString, warning, suggestions } = checkResponse;

  useEffect(() => {
    if (!deboucedSearchString || /^\s*$/.test(deboucedSearchString)) {
      setCheckResponse({
        score: undefined,
        guessTimeString: undefined,
        warning: undefined,
        suggestions: undefined,
      });
      return;
    }
    axios
      .post(
        "https://o9etf82346.execute-api.us-east-1.amazonaws.com/staging/password/strength",
        { password: encodeURIComponent(deboucedSearchString) }
      )
      .then((response) => setCheckResponse(response.data));
  }, [deboucedSearchString]);

  const barColor = (value) => {
    if (value < 2) return "danger";
    else if (value < 3) return "warning";
    else if (value <= 4) return "success";
  };

  function progressBar() {
    return (
      <Progress multi>
        {score >= 0 && <Progress bar color={barColor(score)} value="20" />}
        {score >= 1 && <Progress bar color={barColor(score)} value="20" />}
        {score >= 2 && <Progress bar color={barColor(score)} value="20" />}
        {score >= 3 && <Progress bar color={barColor(score)} value="20" />}
        {score >= 4 && <Progress bar color={barColor(score)} value="20" />}
      </Progress>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>
          <b>Is your password strong enough?</b>
        </p>
        <Form className="App-form">
          <FormGroup>
            <Label for="examplePassword">Password</Label>
            <Input
              id="examplePassword"
              name="password"
              type="password"
              onChange={onChange}
            />
          </FormGroup>
          {progressBar()}
        </Form>
        {(guessTimeString || warning) && (
          <h5>
            It will take {guessTimeString} to guess your password. {warning}
          </h5>
        )}
        {suggestions && (
          <h5>
            <b>{suggestions.map((suggestion) => suggestion + " ")}</b>
          </h5>
        )}
      </header>
    </div>
  );
}

export default App;
