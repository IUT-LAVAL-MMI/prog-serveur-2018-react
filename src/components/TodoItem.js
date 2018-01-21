import React, { Component } from 'react'

// Components
import Todo from "./Todo";

class TodoItem extends Component {

    // Custom functions
    onClick = () => {
        this.props.apiJsonArrayHandler([this.props.todo], true)
    };

    // Draw
    render () {
        return(
            <span key={this.props.id} onClick={this.onClick}>
                <Todo todo={this.props.todo} />
            </span>
        )
    }
}

export default TodoItem