import React from 'react'

const Todo = ({todo}) =>
    <span>
        <h4>{todo.owner}</h4>
        <p>{todo.content}</p>
        <p>{todo.valide ? 'Validé' : 'Invalidé'}</p>
        <p className="date">{todo.date_modification}</p>
        <p className="date">{todo.date_creation}</p>
    </span>;

export default Todo