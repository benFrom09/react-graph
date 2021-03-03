import React, { useState} from 'react';
import './App.css';
import Graph from './components/graph/Graph';
import PlottingForm from './components/plotting-form/PlottingForm';

function App() {
  const [func,setFunc] = useState('');

    const handleChange = (e) => {
        const {value } = e.target;
        setFunc(value);
        
    };
  return (
    <div className="App" style={{paddingTop:"60px"}}>
        <PlottingForm plot={func} handleChange={handleChange}  />
        <Graph func={func} width={800} height={800} />
    </div>
  );
}

export default App;
