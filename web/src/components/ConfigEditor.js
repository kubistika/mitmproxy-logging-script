import React, { useState } from 'react';
import PropTypes from 'prop-types';
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

import * as api from '../api/config';

class ConfigEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = { loaded: false };
  }

  async componentDidMount() {
    const { data } = await api.getConfig();

    // Make arrays human readable.
    data.requestHeaders = data.requestHeaders.join(', ');
    data.responseHeaders = data.responseHeaders.join(', ');

    // Update state with current configuration.
    this.setState({ ...data, loaded: true });
  }

  async onSubmit() {
    let c = { ...this.state };
    c.requestHeaders = c.requestHeaders.split(', ');
    c.responseHeaders = c.responseHeaders.split(', ');

    try {
      api.saveConfig(c);
      alert('config saved!');
    } catch {
      alert('error');
    }
  }

  handleInputChange(event) {
    let newState = Object.assign({}, this.state);

    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    newState[name] = value;
    this.setState(newState);
  }

  handleFieldChange(event, isRequest) {
    let newState = Object.assign({}, this.state);

    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    console.log(isRequest);
    if (isRequest) {
      newState.requestInfo[name] = value;
    } else {
      newState.responseInfo[name] = value;
    }
    this.setState(newState);
  }

  renderFields(isRequest) {
    const fields = isRequest ? this.state.requestInfo : this.state.responseInfo;

    return Object.keys(fields).map((key, index) => {
      return (
        <CustomInput
          key={`${isRequest}_${key}`}
          id={`${isRequest}_${key}`}
          type="checkbox"
          label={key}
          name={key}
          checked={fields[key]}
          onChange={e => this.handleFieldChange(e, isRequest)}
        />
      );
    });
  }

  renderHeadersInput(isRequest) {
    const key = isRequest
      ? 'includeAllRequestHeaders'
      : 'includeAllResponseHeaders';
    const values = isRequest
      ? this.state.requestHeaders
      : this.state.responseHeaders;
    const help = isRequest
      ? ' Include all request headers'
      : ' Include all response headers';

    return (
      <InputGroup>
        <InputGroupAddon addonType="prepend">
          <InputGroupText>
            <Input
              addon
              type="checkbox"
              checked={this.state[key]}
              name={key}
              onChange={e => this.handleInputChange(e)}
              aria-label="Comma seperated headers"
            />
            <span style={{ marginLeft: '8px' }}>{help}</span>
          </InputGroupText>
        </InputGroupAddon>
        <Input
          value={values}
          name={isRequest ? 'requestHeaders' : 'responseHeaders'}
          onChange={e => this.handleInputChange(e)}
          placeholder="Comma separated headers"
          disabled={this.state[key]}
        />
      </InputGroup>
    );
  }

  render() {
    // only render after configuration loaded.
    if (!this.state.loaded) return '';

    return (
      <div>
        <Form>
          <FormGroup>
            <Label for="logPath">Log path</Label>
            <Input
              type="text"
              name="logPath"
              id="logPath"
              placeholder="Log path"
              value={this.state.logPath}
              onChange={e => this.handleInputChange(e)}
            />
          </FormGroup>
          <FormGroup>{this.renderHeadersInput(true)}</FormGroup>
          <FormGroup>
            <Label>Additional request fields</Label>
            <div>{this.renderFields(true)}</div>
          </FormGroup>
          <FormGroup>{this.renderHeadersInput(false)}</FormGroup>
          <FormGroup>
            <Label>Additional response fields</Label>
            <div>{this.renderFields(false)}</div>
          </FormGroup>
          <Button onClick={() => this.onSubmit()}>Submit</Button>
        </Form>
      </div>
    );
  }
}

ConfigEditor.defaultProps = {};

ConfigEditor.propTypes = {};

export default ConfigEditor;
