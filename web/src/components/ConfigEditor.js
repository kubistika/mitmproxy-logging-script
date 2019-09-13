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

const optionalHttpFields = ['method', 'url', 'host', 'version', 'scheme'];
const optionalHeaders = [
  'Access-Control-Allow-Credentials',
  'Access-Control-Allow-Headers',
  'Access-Control-Allow-Methods',
  'Access-Control-Allow-Origin',
  'Access-Control-Expose-Headers',
  'Access-Control-Max-Age',
  'Accept-Ranges',
  'Age',
  'Allow',
  'Alternate-Protocol',
  'Cache-Control',
  'Client-Date',
  'Client-Peer',
  'Client-Response-Num',
  'Connection',
  'Content-Disposition',
  'Content-Encoding',
  'Content-Language',
  'Content-Length',
  'Content-Location',
  'Content-MD5',
  'Content-Range',
  'Content-Security-Policy, X-Content-Security-Policy, X-WebKit-CSP',
  'Content-Security-Policy-Report-Only',
  'Content-Type',
  'Date',
  'ETag',
  'Expires',
  'HTTP',
  'Keep-Alive',
  'Last-Modified',
  'Link',
  'Location',
  'P3P',
  'Pragma',
  'Proxy-Authenticate',
  'Proxy-Connection',
  'Refresh',
  'Retry-After',
  'Server',
  'Set-Cookie',
  'Status',
  'Strict-Transport-Security',
  'Timing-Allow-Origin',
  'Trailer',
  'Transfer-Encoding',
  'Upgrade',
  'Vary',
  'Via',
  'Warning',
  'WWW-Authenticate',
  'X-Aspnet-Version',
  'X-Content-Type-Options',
  'X-Frame-Options',
  'X-Permitted-Cross-Domain-Policies',
  'X-Pingback',
  'X-Powered-By',
  'X-Robots-Tag',
  'X-UA-Compatible',
  'X-XSS-Protection',
];

class ConfigEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = { suggestions: [], loaded: false };
  }

  async componentDidMount() {
    const { data } = await api.getConfig();

    // Make arrays human readable.
    //data.requestHeaders = data.requestHeaders.join(', ');
    //data.responseHeaders = data.responseHeaders.join(', ');

    // Update state with current configuration.
    this.setState({ ...data, loaded: true });
  }

  async onSubmit() {
    let c = { ...this.state };
    omit(c, 'loaded');

    try {
      await api.saveConfig(c);
      alert('Config saved!');
    } catch {
      alert('Error: server might be down.');
    }
  }

  handleInputChange(event) {
    event.persist();
    let newState = Object.assign({}, this.state);

    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    newState[name] = value;
    this.setState(newState);
  }

  handleFieldChange(event) {
    let newState = Object.assign({}, this.state);

    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    set(newState, name, value);
    this.setState(newState);
  }

  addField(parent, value) {
    const currentFields = get(this.state, parent);
    let fields;
    if (this.isAllFields(currentFields)) fields = [value];
    else {
      fields = [...get(this.state, parent)];
      if (fields.indexOf(value) != -1) return;
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

    if (fields.length === 1 && fields[0] === '*') renderedList = 'All fields!';
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
      <Container>
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
          <Row>
            <Col>
              <FormGroup>
                <h3>Request headers</h3>
                {this.renderFields(
                  'request.headers',
                  'Add HTTP header',
                  optionalHeaders,
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
                {this.renderFields(
                  'response.headers',
                  'Add HTTP header',
                  optionalHeaders,
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
