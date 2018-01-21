import React, { Component } from 'react'
import axios from 'axios'

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
        axios.put(
            `http://localhost:4000/v1/to_do/${this.props.todo.id}`,{
                todo: {
                    owner: this.state.owner,
                    content: this.state.content,
                }
            }
        ).then(response => {
            // Update the local state with the received data after the PUT action (and set them as updated)
            this.props.apiJsonArrayHandler([response.data], false);
        }).catch(error => console.log(error))
    };

    // Draw
    render() {
        return (
            <div className="todo">
                <form onBlur={this.formOnBlur} >
                    <h4>{this.state.owner}</h4>
                    <p><input className='input' type="text" name="content" value={this.state.content} placeholder="Your TODO" onChange={this.formOnChange}/></p>
                    <p className="date">{this.state.date_modification}</p>
                    <p className="date">{this.state.date_creation}</p>
                </form>
            </div>
        );
    }
}

export default TodoForm