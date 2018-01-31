import React, {Component} from 'react'
import axios from 'axios'
import update from 'immutability-helper'
import Cable from 'actioncable';

// Components
import TodoItem from './TodoItem'
import TodoForm from './TodoForm'

class TodoContainer extends Component {
    // Reacts
    constructor(props) {
        super(props);
        this.state = {
            owner: 'owner', // to be replaced by auth
            todos: []
        }
    };
    componentDidMount() {
        this.createSocket();
    };

    // Custom handlers
    createSocket = () => {
        let cable = Cable.createConsumer('ws://localhost:4000/todo/socket');
        this.to_do_channel = cable.subscriptions.create({
            channel: 'ToDoChannel'
        }, {
            connected: () => {
                // retrieve the index on socket connection
                axios.get('http://localhost:4000/v1/to_do.json')
                    .then(response => {
                        console.log(response);
                        // Update the local state with the received data after the GET action
                        this.apiJsonArrayHandler(response.data);
                    })
                    .catch(error => console.log(error))
            },
            received: (data) => {
                // check the stream concerns my own version
                if (data.version === 'v1') {
                    // pass to the api json handler the received real-time data with the expected action (update, create, delete)
                    this.apiJsonArrayHandler(data.to_do, data.action);
                }
            }
        });
    };
    apiJsonArrayHandler = (webdata, status = 'index') => {
        switch (status) {
            case 'delete':
                webdata.forEach( web_item_data => {
                    // All fine, items is removed from local state
                    const updated_todos = function(local_state, item_data) {
                        const response_index = local_state.findIndex(todo => todo.id === item_data.id);
                        if (response_index === -1) {
                            // Unknown item (add)
                            console.log('Unknown item was removed, nothing changed locally but this is unexpected behaviour!')
                        } else {
                            // Known item (delete)
                            return update(local_state, { $splice: [[response_index, 1]]});
                        }
                    }(this.state.todos, web_item_data);
                    this.setState({todos: updated_todos});
                });
                break;
            default:
                webdata.forEach( web_item_data => {
                    const updated_todos = function(local_state, item_data) {
                        // set the status flag
                        item_data.status = status;
                        // find the element index
                        const response_index = local_state.findIndex(todo => todo.id === item_data.id);
                        if (response_index === -1) {
                            // Unknown item (add)
                            return update(local_state, {$push: [item_data]});
                        } else {
                            // Known item (merge)
                            return update(local_state, {
                                [response_index]: {$merge: item_data}
                            });
                        }
                    }(this.state.todos, web_item_data);
                    this.setState({todos: updated_todos});
                });
        }
    };
    // CRUD methods for an element
    addToDo = () => {
        axios.post(
            'http://localhost:4000/v1/to_do',
            {
                todo: {
                    owner: this.state.owner
                }
            }
        ).catch(error =>
            console.log(error)
        );
    };
    updateTodo = (todo) => {
        axios.put(
            `http://localhost:4000/v1/to_do/${todo.id}`,{
                todo: {
                    owner: this.state.owner,
                    content: todo.content,
                }
            }
        ).catch(error => console.log(error))
    };
    removeToDo = (todo) => {
        axios.delete(`http://localhost:4000/v1/to_do/${todo.id}`).catch(error => console.log(error))
    };
    editToDo = (todo) => {
        // set this element as editable
        this.apiJsonArrayHandler([todo], 'edit')
    };

    // Draw
    render() {
        return (
            <div>
                {this.state.todos.map((todo) => {
                    switch (todo.status) {
                        case 'edit':
                            return (<TodoForm todo={todo} key={todo.id} updateTodo={this.updateTodo} />);
                        default:
                            return (<TodoItem todo={todo} key={todo.id} editToDo={this.editToDo} removeToDo={this.removeToDo} />);
                    }
                })}
                <button className="new" onClick={this.addToDo}>A new todo</button>
            </div>
        )
    }
}

export default TodoContainer