import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { Provider, Editor, Preview } from '@matthamlin/react-preview-editor'
import { transform } from '@babel/standalone'
import buildspaceLogo from '../assets/buildspace-logo.png';

function transformCode(code) {
  return transform(code, { presets: [['stage-0', { decoratorsLegacy: true }], 'react'] }).code
}

const Home = () => {
  const [userInput, setUserInput] = useState('');
  const [apiOutput, setApiOutput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const callGenerateEndpoint = async () => {
    setIsGenerating(true);

    console.log("Calling OpenAI...")
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userInput }),
    });

    const data = await response.json();
    const { output } = data;
    console.log("OpenAI replied...", output.text)

    setApiOutput(`${output.text}`);
    setIsGenerating(false);
  }

  const onUserChangedText = (event) => {
    console.log(event.target.value);
    setUserInput(event.target.value);
  };
  return (
    <div className="root">
      <Head>
        <title>GPT-3 React Code Generator</title>
      </Head>
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>React Code Generator</h1>
          </div>
          <div className="header-subtitle">
            <h2>powered by GPT-3</h2>
          </div>
        </div>
      </div>
      <div className="prompt-container">
        <p style={{ color: "#FFF" }}>Create a React app that contains: </p>
        <textarea
          placeholder="start typing here"
          className="prompt-box"
          value={userInput}
          onChange={onUserChangedText}
        />
        <div className="prompt-buttons">
          <a
            className={isGenerating ? 'generate-button loading' : 'generate-button'}
            onClick={callGenerateEndpoint}
          >
            <div className="generate">
              {isGenerating ? <span class="loader"></span> : <p>Generate</p>}
            </div>
          </a>
        </div>
        {apiOutput && (
          <div className="output">
            <div className="output-header-container">
              <div className="output-header">
                <h3>Output</h3>
              </div>
            </div>
            <div className="output-content" style={{ backgroundColor: "#BADA55", padding: "10px" }}>
              <code>{apiOutput}</code>
            </div>
            <div style={{ margin: "10em 0" }}>
              <Provider
                code={`
                function App() {
                  // Copy your generated app logic here
                  return <h1>Copy the app code here, and be careful to copy only the correct part as the preview may break.</h1>
                };
                render(<App />);`}
                transformCode={transformCode}
              >
                <Preview style={{ backgroundColor: "#BADA88" }} />
                <Editor style={{ border: "solid 4px black", padding: "10px" }} />
              </Provider>
            </div>
          </div>
        )}
      </div>
      <div className="badge-container grow">
        <a
          href="https://buildspace.so/builds/ai-writer"
          target="_blank"
          rel="noreferrer"
        >
          <div className="badge">
            <Image src={buildspaceLogo} alt="buildspace logo" />
            <p>build with buildspace</p>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Home;
