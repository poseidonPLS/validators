import React, { useState } from 'react';
import axios from 'axios';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => setInput(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setData(null);
    setError(null);

    try {
      const response = await axios.get(`https://rpc-pulsechain.g4mm4.io/beacon-api/eth/v1/beacon/states/head/validators/${input}`);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Pause for 2 seconds
      setData(response.data.data);
    } catch (err) {
      setError('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>PulseChain Validator Status</h1>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Enter Validator Index or Pubkey" 
          value={input} 
          onChange={handleInputChange} 
        />
        <button type="submit">Submit</button>
      </form>

      <CSSTransition
        in={loading}
        timeout={300}
        classNames="fade"
        unmountOnExit
      >
        <p className="loading-text">Fetching info from PulseChain via Gamma's RPC...</p>
      </CSSTransition>

      {error && <p className="error-text">{error}</p>}

      <TransitionGroup>
        {data && (
          <CSSTransition
            key={data.index}
            timeout={500}
            classNames="fade"
          >
            <div className="validator-info">
              <h2>Validator Info</h2>
              <p>Index: {data.index}</p>
              <p>Balance: {data.balance}</p>
              <p>Status: {data.status}</p>
              <p>Slashed: {data.validator.slashed.toString()}</p>
              <p>Activation Epoch: {data.validator.activation_epoch}</p>
              <p>Exit Epoch: {data.validator.exit_epoch === '18446744073709551615' ? 'false' : data.validator.exit_epoch}</p>
            </div>
          </CSSTransition>
        )}
      </TransitionGroup>

      <p className="disclaimer">Disclaimer: Information may not be accurate.</p>
      <footer>
        Site made by <a href="https://poseidonpls.vercel.app/" target="_blank" rel="noopener noreferrer">Poseidon</a>.
      </footer>
    </div>
  );
}

export default App;
