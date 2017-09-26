import React, { Component } from 'react';
import Header from './components/Header';
import Timeline from './components/Timeline';

class App extends Component {

  constructor(props){
    super(props);
    if(props.params !== undefined){
      this.usuario = props.params.match.usuario;
    }
    console.log(`propriedades do App ${props}`);
  }

  componentWillReceiveProps(nextProps ){
    console.log(`componentWillReceiveProps(${nextProps} )`);
    if(nextProps.match.params.usuario !== undefined){
        this.usuario = nextProps.match.params.usuario ;
       
    }
}

  render() {
    return (
    <div id="root">
      <div className="main">
        <Header/>
        <Timeline usuario={this.usuario}/>
      </div>
    </div>
    );
  }
}

export default App;