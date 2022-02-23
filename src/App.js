import { useQuery, gql, useMutation } from '@apollo/client';
import { useState } from 'react';

const GET_TODOS = gql`
  query getTodos {
    todos {
      done
      id
      text
    }
  }
`;

const TOGGLE_TODO = gql`
  mutation toggleTodo($id: uuid!, $done: Boolean!) {
    update_todos(where: { id: { _eq: $id } }, _set: { done: $done }) {
      returning {
        done
        id
        text
      }
    }
  }
`;

const ADD_TODO = gql`
  mutation addTodo($text: String!) {
    insert_todos(objects: { text: $text }) {
      returning {
        done
        id
        text
      }
    }
  }
`;

const DELETE_TODO = gql`
  mutation deleteTodo($id: uuid!) {
    delete_todos(where: { id: { _eq: $id } }) {
      returning {
        done
        id
        text
      }
    }
  }
`;

function App() {
  const [todoText, setTodoText] = useState('');
  const { loading, error, data } = useQuery(GET_TODOS);

  const [toggleTodo] = useMutation(TOGGLE_TODO);
  const [addTodo] = useMutation(ADD_TODO, {
    onCompleted: () => setTodoText(''),
  });
  const [deleteTodo] = useMutation(DELETE_TODO);

  const handleToggleTodo = async ({ id, done }) => {
    const data = await toggleTodo({
      variables: { id, done: !done },
    });
    console.log('toggleData', data);
  };

  const handleDeleteTodo = async ({ id }) => {
    const isConfirmed = window.confirm(
      'Are you sure you want to delete this todo?'
    );
    if (isConfirmed) {
      const data = await deleteTodo({
        variables: { id },
        update: (cache) => {
          const prevData = cache.readQuery({ query: GET_TODOS });
          const newTodos = prevData.todos.filter((todo) => todo.id !== id);
          cache.writeQuery({ query: GET_TODOS, data: { todos: newTodos } });
        },
      });
      console.log('deleteData', data);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!todoText.trim()) return;
    const data = await addTodo({
      variables: { text: todoText },
      refetchQueries: [{ query: GET_TODOS }],
    });
    console.log('Add Data', data);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div className='vh-100 code flex flex-column items-center bg-purple white pa3 fl-1'>
      <h1 className='f2-l'>
        GraphQL Checklist{' '}
        <span role='img' aria-label='Checkmark'>
          ✅
        </span>
      </h1>
      {/* Todo Form */}
      <form onSubmit={handleSubmit} className='mb3'>
        <input
          type='text'
          placeholder='Write your todo'
          className='pa2 f4 b--dashed'
          onChange={(e) => setTodoText(e.target.value)}
          value={todoText}
        />
        <button type='submit' className='pa2 f4 bg-green'>
          Create
        </button>
      </form>
      {/* Todo List */}
      <div className='flex items-center justify-center flex-column'>
        {data.todos.map((todo) => (
          <p onDoubleClick={() => handleToggleTodo(todo)} key={todo.id}>
            <span className={`pointer list pa1 f3 ${todo.done && 'strike'}`}>
              {todo.text}
            </span>
            <button
              onClick={() => handleDeleteTodo(todo)}
              className='bg-transparent bn f4'
            >
              <span className='red'>&times;</span>
            </button>
          </p>
        ))}
      </div>
    </div>
  );
}

export default App;
