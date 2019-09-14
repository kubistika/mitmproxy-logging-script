import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Row,
  Container,
  Col,
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
import { get, set, omit, remove } from 'lodash';
import { MdRemoveCircle as MdCancel } from 'react-icons/md';

import * as api from '../api/config';
import AutoSuggestionInput from './AutoSuggest';
import { optionalHttpHeaders, optionalHttpFields } from './HttpConsts';

class ConfigEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
    };
  }

  async componentDidMount() {
    const { data } = await api.getConfig();

    // Update state with current configuration.
    const state = { ...data, loaded: true };
    state.request.includeAllHeaders = this.isAllFields(state.request.headers);
    state.response.includeAllHeaders = this.isAllFields(state.response.headers);
    this.setState(state);
  }

  async onSubmit() {
    let c = { ...this.state };

    // Remove all non-config values from state before sending it to the server
    c = omit(c, [
      'loaded',
      'add_field_to_request.headers',
      'add_field_to_request.fields',
      'add_field_to_response.fields',
      'add_field_to_response.headers',
      'request.includeAllHeaders',
      'response.includeAllHeaders',
    ]);

    if (this.state.request.includeAllHeaders) c.request.headers = ['*'];
    if (this.state.response.includeAllHeaders) c.response.headers = ['*'];

    try {
      await api.saveConfig(c);
      alert('Config saved!');
    } catch {
      alert('Error: server might be down.');
    }
  }

  handleInputChange(event) {
    let newState = Object.assign({}, this.state);

    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    console.log(name);
    switch (name) {
      case 'request.includeAllHeaders':
        console.log('here!');
        newState.request.includeAllHeaders = !newState.request
          .includeAllHeaders;
        break;
      case 'response.includeAllHeaders':
        newState.response.includeAllHeaders = !newState.response
          .includeAllHeaders;
        break;
      default:
        newState[name] = value;
        break;
    }
    this.setState(newState);
  }

  addField(parent, value) {
    let fields;
    const currentFields = get(this.state, parent);

    if (this.isAllFields(currentFields)) fields = [value];
    else {
      fields = [...get(this.state, parent)];
      if (fields.indexOf(value) !== -1) return;
      fields.push(value);
    }

    set(this.state, parent, fields);
    this.setState(this.state);
  }

  isAllFields(fields) {
    return fields.length === 1 && fields[0] === '*';
  }

  removeField(parent, key) {
    let fields = [...get(this.state, parent)];
    fields.splice(key, 1);
    set(this.state, parent, fields);
    this.setState(this.state);
  }

  onSuggestionSelected = (parent, suggestion) => {
    this.addField(parent, suggestion);
    this.setState({ ['add_field_to_' + parent]: '' });
  };

  renderFields(getter, placeholder, optionalValues) {
    let renderedList;
    const fields = get(this.state, getter);

    if (fields.length === 1 && fields[0] === '*') renderedList = '';
    else {
      renderedList = fields.map((key, index) => {
        return (
          <li key={index}>
            <MdCancel
              onClick={() => this.removeField(getter, index)}
              size={30}
              color="red"
              style={{ marginRight: '10px' }}
            />
            <span>{key}</span>
          </li>
        );
      });
    }

    const inputProps = {
      name: 'add_field_to_' + getter,
      placeholder,
      value: this.state['add_field_to_' + getter] || '',
      onChange: e => this.handleInputChange(e),
    };

    return (
      <>
        <ul className="proxy-fields">{renderedList}</ul>
        <AutoSuggestionInput
          id={getter}
          optionalValues={optionalValues}
          onSuggestionSelected={suggestion =>
            this.onSuggestionSelected(getter, suggestion)
          }
          inputProps={inputProps}
        />
      </>
    );
  }

  render() {
    // only render after configuration loaded.
    if (!this.state.loaded) return '';

    return (
      <Container>
        <Form>
          <FormGroup>
            <h3>General settings</h3>
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
          <Row>
            <Col>
              <FormGroup>
                <h3>Request headers</h3>
                <Label style={{ marginLeft: '25px' }}>
                  <Input
                    type="checkbox"
                    checked={this.state.request.includeAllHeaders}
                    name="request.includeAllHeaders"
                    onChange={e => this.handleInputChange(e)}
                  />{' '}
                  Include all
                </Label>
                {!this.state.request.includeAllHeaders &&
                  this.renderFields(
                    'request.headers',
                    'Add HTTP header',
                    optionalHttpHeaders,
                  )}
              </FormGroup>
              <FormGroup>
                <h3>Additional request fields</h3>
                <div>
                  {this.renderFields(
                    'request.fields',
                    'Add HTTP field',
                    optionalHttpFields,
                  )}
                </div>
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <h3>Response headers</h3>
                <Label style={{ marginLeft: '25px' }}>
                  <Input
                    type="checkbox"
                    name="response.includeAllHeaders"
                    checked={this.state.response.includeAllHeaders}
                    onChange={e => this.handleInputChange(e)}
                  />{' '}
                  Include all
                </Label>
                {!this.state.response.includeAllHeaders &&
                  this.renderFields(
                    'response.headers',
                    'Add HTTP header',
                    optionalHttpHeaders,
                  )}
              </FormGroup>
              <FormGroup>
                <h3>Additional response fields</h3>
                <div>
                  {this.renderFields(
                    'response.fields',
                    'Add HTTP field',
                    optionalHttpFields,
                  )}
                </div>
              </FormGroup>
            </Col>
          </Row>
          <Button onClick={() => this.onSubmit()}>Submit</Button>
        </Form>
      </Container>
    );
  }
}

ConfigEditor.defaultProps = {};

ConfigEditor.propTypes = {};

export default ConfigEditor;
