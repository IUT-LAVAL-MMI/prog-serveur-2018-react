import React, { Component } from 'react'
import './App.css'
import TodoContainer from './components/TodoContainer'

class App extends Component {
    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <h1>LPDIWA Todo Board</h1>
                </div>
                <TodoContainer />
            </div>
        );
    }
}

export default App