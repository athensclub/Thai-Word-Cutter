import React from 'react';
import './App.css';
import DemoForm from "./components/DemoForm";
import Output from "./components/Output"
import 'bootstrap/dist/css/bootstrap.min.css';
import LoadingPane from './components/LoadingPane';

interface Props{}

interface States{
  outputText: string,
  loading: boolean
}

class App extends React.Component<Props,States>{

  constructor(props: Props){
    super(props);
    this.state = {
      outputText: "The output will be shown here.",
      loading: false
    };

    this.setOutputText = this.setOutputText.bind(this);
    this.setLoading = this.setLoading.bind(this);
  }

  setOutputText(str: string): void{
    this.setState(state => ({
      outputText: str,
      loading: state.loading
    }));
  }

  setLoading(loading: boolean): void{
    this.setState(state => ({
      outputText: state.outputText,
      loading: loading
    }))
  }

  render(){
    return (
      <div className="App">
        <header className="App-header">

          { !this.state.loading ?
            <DemoForm setResultText={this.setOutputText} setLoading={this.setLoading}></DemoForm> :
            <LoadingPane></LoadingPane>}
          <Output text={this.state.outputText}></Output>
        </header>
      </div>
    );
  }
  
}

export default App;
