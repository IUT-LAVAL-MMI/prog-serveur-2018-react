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
    apiJsonArrayHandler = (webdata, forUpdate = false) => {
        console.log(webdata);
        webdata.forEach( web_item_data => {
            const updated_todos = function(local_state, item_data) {
                // set the forUpdate flag
                item_data.forUpdate = forUpdate;
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
    // Post a new item and update the component state
    addToDo = () => {
        axios.post(
            'http://localhost:4000/v1/to_do',
            {
                todo:
                    {
                        id: '',
                        owner: this.state.owner,
                        content: ''
                    }
            }
        ).then(response => {
            // Update the local state with the received data after the POST action (and set them for update)
            this.apiJsonArrayHandler([response.data], true);
        }).catch(error =>
            console.log(error)
        );
    };

    // Draw
    render() {
        return (
            <div>
                {this.state.todos.map((todo) => {
                    if (todo.forUpdate) {
                        return (<TodoForm todo={todo} key={todo.id} apiJsonArrayHandler={this.apiJsonArrayHandler} />)
                    } else {
                        return (<TodoItem todo={todo} key={todo.id} apiJsonArrayHandler={this.apiJsonArrayHandler} />)
                    }
                })}
                <button className="new" onClick={this.addToDo}>A new todo</button>
            </div>
        )
    }
}

export default TodoContainer