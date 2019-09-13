import React, { useState } from 'react';
import {
  Button,
  Form,
  Checkbox,
  FormGroup,
  Label,
  Input,
  FormText,
  CustomInput,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from 'reactstrap';

import Autosuggest from 'react-autosuggest';

// Imagine you have a list of languages that you'd like to autosuggest.
const optionalFields = ['version', 'url', 'scheme', 'host', 'method'];

// Teach Autosuggest how to calculate suggestions for any given input value.

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = suggestion => {
  return suggestion;
};

// Use your imagination to render suggestions.
const renderSuggestion = suggestion => <div>{suggestion}</div>;

class AutoSuggestionInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = { suggestions: this.props.optionalValues };
  }

  getSuggestions = value => {
    const { optionalValues } = this.props;
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    if (inputLength === 0) return [];
    return optionalValues.filter(o => o.toLowerCase().includes(value));
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value),
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  renderInputComponent = inputProps => (
    <div>
      <Input {...inputProps} />
    </div>
  );

  render() {
    const { id, inputProps } = this.props;
    const { suggestions } = this.state;

    return (
      <Autosuggest
        id={id}
        suggestions={suggestions}
        renderInputComponent={this.renderInputComponent}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        onSuggestionSelected={(e, { suggestionValue }) =>
          this.props.onSuggestionSelected(suggestionValue)
        }
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
      />
    );
  }
}

export default AutoSuggestionInput;
