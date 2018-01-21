import React, { Component } from 'react'
import axios from 'axios'

class TodoContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            todos: []
        }
    }
    componentDidMount() {
        axios.get('http://localhost:4000/v1/to_do.json')
            .then(response => {
                console.log(response)
                this.setState({todos: response.data})
            })
            .catch(error => console.log(error))
    }
    render() {
        return (
            <div>
                {this.state.todos.map((todos) => {
                    return(
                        <div className="tile" key={todos.id} >
                            <h4>{todos.owner}</h4>
                            <p>{todos.content}</p>
                        </div>
                    )
                })}
            </div>
        )
    }
}

export default TodoContainer