import React, { Component } from 'react'
import axios from 'axios'

// Components
import Todo from './Todo'

class TodoContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            todos: []
        }
    }
    componentDidMount() {
        axios.get('http://localhost:4000/v1/to_do.json')
            .then(response => {
                console.log(response);
                this.setState({todos: response.data})
            })
            .catch(error => console.log(error))
    }
    render() {
        return (
            <div>
                {this.state.todos.map((todo) => {
                    return (<Todo todo={todo} key={todo.id} />)
                })}
            </div>
        )
    }
}

export default TodoContainer