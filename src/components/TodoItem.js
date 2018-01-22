import React, { Component } from 'react'
import FontAwesome from 'react-fontawesome'

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
            <span className="todo" key={this.props.id}>
                <FontAwesome name='deleteIcon' className='fa-trash-o' />
                <div onClick={this.onClick}>
                    <Todo todo={this.props.todo} />
                </div>
            </span>
        )
    }
}

export default TodoItem