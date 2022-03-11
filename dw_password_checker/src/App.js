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

  const barColor = () => {
    if (score < 2) return "danger";
    else if (score < 3) return "warning";
    else if (score <= 4) return "success";
  };

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
          <Progress color={barColor()} value={score} max={4} />
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
