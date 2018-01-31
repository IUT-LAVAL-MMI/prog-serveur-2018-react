import React, { Component } from 'react'
import FontAwesome from 'react-fontawesome'

// Components
import Todo from "./Todo";

class TodoItem extends Component {

    // Custom functions
    onClick = () => {
        // Update the local props with the element data after the click action (and set them as data is for update in the container)
        this.props.editToDo(this.props.todo)
    };
    onDelete = () => {
        // Update the local props with the element data after the click action (and set them as data is for update in the container)
        this.props.removeToDo(this.props.todo)
    };

    // Draw
    render () {
        return(
            <span className="todo" key={this.props.id}>
                <FontAwesome name='deleteIcon' className='fa-trash-o' onClick={this.onDelete}/>
                <div onClick={this.onClick}>
                    <Todo todo={this.props.todo} />
                </div>
            </span>
        )
    }
}

export default TodoItem