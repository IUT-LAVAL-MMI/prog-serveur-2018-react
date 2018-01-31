import React, { Component } from 'react'

class TodoForm extends Component {
    // Reacts
    constructor(props) {
        super(props)
        this.state = {
            owner: this.props.todo.owner,
            content: this.props.todo.content,
            id: this.props.todo.id,
            date_creation: this.props.todo.date_creation,
            date_modification: this.props.todo.date_modification
        }
    }

    // Custom function
    formOnChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
    };
    formOnBlur = () => {
        this.props.updateTodo(this.state)
    };

    // Draw
    render() {
        return (
            <div className="todo">
                <form onBlur={this.formOnBlur} >
                    <h4>{this.state.owner}</h4>
                    <p><input className='input' type="text" name="content" value={this.state.content || ''} placeholder="Your TODO" onChange={this.formOnChange}
                              autoFocus/></p>
                    <p className="date">{this.state.date_modification}</p>
                    <p className="date">{this.state.date_creation}</p>
                </form>
            </div>
        );
    }
}

export default TodoForm