import React, {Component} from 'react'
import axios from 'axios'
import update from 'immutability-helper'

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
        axios.get('http://localhost:4000/v1/to_do.json')
            .then(response => {
                console.log(response);
                // Update the local state with the received data after the GET action
                this.apiJsonArrayHandler(response.data);
            })
            .catch(error => console.log(error))
    };

    // Custom handlers
    apiJsonArrayHandler = (webdata, status = 'index') => {
        switch (status) {
            case 'delete':
                webdata.forEach( web_item_data => {
                    axios.delete(
                        `http://localhost:4000/v1/to_do/${web_item_data.id}`
                    ).then(response => {
                        // informs the apiJso about the DELETE action result from the back-end
                        switch (response.status) {
                            case 204:
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
                                this.setState({todos: updated_todos})
                                break;
                            default:
                                // Something wrong
                                console.log('Cannot delete this for some reason')
                        }
                    }).catch(error =>
                        console.log(error)
                    );
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
    // Post a new item and update the component state
    addToDo = () => {
        axios.post(
            'http://localhost:4000/v1/to_do',
            {
                todo: {
                    owner: this.state.owner
                }
            }
        ).then(response => {
            // Update the local state with the received data after the POST action (and set them for update)
            this.apiJsonArrayHandler([response.data], 'update');
        }).catch(error =>
            console.log(error)
        );
    };

    // Draw
    render() {
        return (
            <div>
                {this.state.todos.map((todo) => {
                    switch (todo.status) {
                        case 'update':
                            return (<TodoForm todo={todo} key={todo.id} apiJsonArrayHandler={this.apiJsonArrayHandler} />);
                        default:
                            return (<TodoItem todo={todo} key={todo.id} apiJsonArrayHandler={this.apiJsonArrayHandler} />);
                    }
                })}
                <button className="new" onClick={this.addToDo}>A new todo</button>
            </div>
        )
    }
}

export default TodoContainer