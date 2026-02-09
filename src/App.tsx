/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { useEffect, useState, useRef } from 'react';
import { getTodos } from './api/todos';
import { Todo, FilterType, ErrorMessage } from './types/Todo';

export const App: React.FC = () => {
  const field = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<FilterType>('All');
  const [loading, setLoading] = useState(false);
  const [todoTitle, setTodoTitle] = useState('');

  async function loadTodos() {
    setError('');
    setLoading(true);

    try {
      const result = await getTodos();

      setTodos(result);
    } catch {
      setError(ErrorMessage.UnableLoadTodos);
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTodos();
    field.current?.focus();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  function getFilteredTodos() {
    if (filter === 'All') {
      return todos;
    }

    if (filter === 'Active') {
      return todos.filter(todo => !todo.completed);
    }

    if (filter === 'Completed') {
      return todos.filter(todo => todo.completed);
    }

    return todos;
  }

  const filteredTodos = getFilteredTodos();
  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const itemLabel = activeTodosCount === 1 ? 'item' : 'items';

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
            disabled={loading}
          />

          <form>
            <input
              ref={field}
              value={todoTitle}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              disabled={loading}
              onChange={e => setTodoTitle(e.target.value)}
            />
          </form>
        </header>

        {filteredTodos.length > 0 && (
          <section className="todoapp__main" data-cy="TodoList">
            {filteredTodos.map(todo => (
              <div
                key={todo.id}
                data-cy="Todo"
                className={`todo ${todo.completed ? 'completed' : ''}`}
              >
                <label className="todo__status-label">
                  <input
                    data-cy="TodoStatus"
                    type="checkbox"
                    className="todo__status"
                    checked={todo.completed}
                    disabled={loading}
                  />
                </label>

                <span data-cy="TodoTitle" className="todo__title">
                  {todo.title}
                </span>
                <div data-cy="TodoLoader" className="modal overlay"></div>
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                  disabled={loading}
                >
                  ×
                </button>
              </div>
            ))}
          </section>
        )}

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
             {activeTodosCount} {itemLabel} left
             </span>

            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={`filter__link ${filter === 'All' ? 'selected' : ''}`}
                data-cy="FilterLinkAll"
                onClick={() => setFilter('All')}
              >
                All
              </a>

              <a
                href="#/active"
                className={`filter__link ${filter === 'Active' ? 'selected' : ''}`}
                data-cy="FilterLinkActive"
                onClick={() => setFilter('Active')}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={`filter__link ${filter === 'Completed' ? 'selected' : ''}`}
                data-cy="FilterLinkCompleted"
                onClick={() => setFilter('Completed')}
              >
                Completed
              </a>
            </nav>
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={loading}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${
          error ? '' : 'hidden'
        }`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          disabled={loading}
          onClick={() => setError('')}
        />
        {error}
      </div>
    </div>
  );
};
