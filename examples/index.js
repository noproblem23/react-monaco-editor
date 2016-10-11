import React from 'react';
import { render } from 'react-dom';
import MonacoEditor from 'react-monaco-editor';

// Using with webpack
class CodeEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: '// type your code... \n',
    }
  }
  editorDidMount(editor) {
    console.log('editorDidMount', editor, editor.getValue(), editor.getModel());
    this.editor = editor;
  }
  onChange(newValue, e) {
    console.log('onChange', newValue, e);
  }
  changeEditorValue() {
    if (this.editor) {
      this.editor.setValue('// code changed! \n');
    }
  }
  changeBySetState() {
    this.setState({code: '// code changed by setState! \n'});
  }
  render() {
    const code = this.state.code;
    const options = {
      selectOnLineNumbers: true,
      roundedSelection: false,
      readOnly: false,
      theme: 'vs',
      cursorStyle: 'line',
      automaticLayout: false,
    };
    return (
        <div>
          <div>
            <button onClick={::this.changeEditorValue}>Change value</button>
            <button onClick={::this.changeBySetState}>Change by setState</button>
          </div>
          <hr />
          <MonacoEditor
              height="500"
              language="javascript"
              value={code}
              options={options}
              onChange={::this.onChange}
              editorDidMount={::this.editorDidMount}
          />
        </div>
    );
  }
}

// Using with require.config
class AnotherEditor extends React.Component {
  constructor(props) {
    super(props);
    const jsonCode = [
      '{',
      '    "$schema": "http://myserver/foo-schema.json"',
      "}"
    ].join('\n');
    this.state = {
      code: jsonCode,
    }
  }
  editorWillMount(monaco) {
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      schemas: [{
        uri: "http://myserver/foo-schema.json",
        schema: {
          type: "object",
          properties: {
            p1: {
              enum: [ "v1", "v2"]
            },
            p2: {
              $ref: "http://myserver/bar-schema.json"
            }
          }
        }
      },{
        uri: "http://myserver/bar-schema.json",
        schema: {
          type: "object",
          properties: {
            q1: {
              enum: [ "x1", "x2"]
            }
          }
        }
      }]
    });
  }
  render() {
    const code = this.state.code;
    const requireConfig = {
      url: 'https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.1/require.min.js',
      paths: {
        'vs': 'https://as.alipayobjects.com/g/cicada/monaco-editor-mirror/0.6.1/min/vs'
      }
    };
    return (
        <div>
          <MonacoEditor
              width="800"
              height="600"
              language="json"
              defaultValue={code}
              requireConfig={requireConfig}
              editorWillMount={::this.editorWillMount}
          />
        </div>
    );
  }
}

class App extends React.Component {
  render() {
    return (
        <div>
          <h2>Monaco Editor Sample (controlled mode)</h2>
          <CodeEditor />
          <hr />
          <h2>Another editor (uncontrolled mode)</h2>
          <AnotherEditor />
        </div>
    );
  }
}

render(
    <App />,
    document.getElementById('root')
);
