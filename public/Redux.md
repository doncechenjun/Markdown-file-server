# Redux

## Three principles

### Single source of truth

**The state of your whole application is stored in an object tree within a single `store`.**

the state from your server can be serialized and hydrated into the client with no extra coding effort.

A single state tree also makes it easier to debug or introspect an application.

```
console.log(store.getState())

/* Prints
{
  visibilityFilter: 'SHOW_ALL',
  todos: [
    {
      text: 'Consider using Redux',
      completed: true,
    },
    {
      text: 'Keep all state in a single tree',
      completed: false
    }
  ]
}
*/
```

### State is Read-Only

**The only way to change the state is to emit an `action`, an object describing what happened.**

As actions are just plain objects, they can be logged, serialized, stored, and later replayed for debugging or testing purposes.

```
store.dispatch({
  type: 'COMPLETE_TODO',
  index: 1
})

store.dispatch({
  type: 'SET_VISIBILITY_FILTER',
  filter: 'SHOW_COMPLETED'
})
```

### Changes are made with pure functions

**To specify how the state tree is transformed by actions, you write pure `reducers.`**

Reducers are just pure functions that take the previous state and an action, 
and return the next state. Remember to return new state objects, instead of 
mutating the previous state. You can start with a single reducer, and as your 
app grows, split it off into smaller reducers that manage specific parts of 
the state tree. Because reducers are just functions, you can control the order 
in which they are called, pass additional data, or even make reusable reducers 
for common tasks such as pagination.

```
function visibilityFilter(state = 'SHOW_ALL', action) {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter
    default:
      return state
  }
}

function todos(state = [], action) {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        {
          text: action.text,
          completed: false
        }
      ]
    case 'COMPLETE_TODO':
      return state.map((todo, index) => {
        if (index === action.index) {
          return Object.assign({}, todo, {
            completed: true
          })
        }
        return todo
      })
    default:
      return state
  }
}

import { combineReducers, createStore } from 'redux'
let reducer = combineReducers({ visibilityFilter, todos })
let store = createStore(reducer)
```

## Action

**Action** are payloads of information that send data from your 
application to your store. They are the only source of information 
for the store. You send them to the store using `store.dispatch()`

Here is an example action which represents adding a new todo item:

```
import {ADD_TODO} from '../aactionTypes'
const ADD_TODO = 'ADD_TODO'
//In larger codebase, declaring a const string Action type will make cleaner code.
{
	type:ADD_TODO,
	text:'Build my first Redux app'
}
```

### Action Creators

A function that return a action. Make them protable and easy to test.

```
function addTodo(text) {
  return {
    type: ADD_TODO,
    text
  }
}
```

In traditional Flux action creator often trigger a dispatch when invoked, like so:

```
function addTodoWithDispatch(text) {
  const action = {
    type: ADD_TODO,
    text
  }
  dispatch(action)
}
```

In Redux, to actually initiate a dispatch, pass the result to the ddispatch() function.

```
dispatch(addTodo(text))
```

Alternatively, create a bound action creator that automatically diapatch:

```
const boundAddTodo=(text)=>dispatch(addTodo(text))
```

## Reducers

**Action**describe the factor that something happened, but not specify how 
the application's atate changes in response. This is the job of a reducer.

### Designing the sttate shape

Try to keep the data separate from th UI state.

```
{
  visibilityFilter: 'SHOW_ALL',
  todos: [
    {
      text: 'Consider using Redux',
      completed: true,
    },
    {
      text: 'Keep all state in a single tree',
      completed: false
    }
  ]
}
```

>We suggest that you keep your state as normalized as possible, 
without any nesting. Keep every entity in an object stored with a
n ID as a key, and use IDs to reference it from other entities, or lists.

### Handling Actions

The reducer is a pure function that take previous state and an actin, 
and returns the next state.

It is called a reducer because it's the type of function you would pass to 
`Array.prototype.reduce(reducer,?initialValue)`. It's vary important that 
the reducer stays pure.
Things never inside a reducer:

1. Mutate its arguments
1. Preform side effect s like API calls and routing transitions
1. Call non-pure functions, e.g. `Date.now()` or `Math.random()`

Redux will call our reducer with an `undefined` state for the first time. 
This is our chance to return the initial state of our app:

```
import { VisibilityFilters } from './actions'

const initialState = {
  visibilityFilter: VisibilityFilters.SHOW_ALL,
  todos: []
}

function todoApp(state, action) {
  if (typeof state === 'undefined') {
    return initialState
  }

  // For now, donât handle any actions
  // and just return the state given to us.
  return state
}
```

For ES6:

```
function todoApp(state = initialState, action) {
  // For now, donât handle any actions
  // and just return the state given to us.
  return state
}
```

Handle `SET_VISIBILITY_FILTER`. Change visibilityFilter on the state:

```
function todoApp(state = initialState, action) {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return Object.assign({}, state, {
        visibilityFilter: action.filter
      })
    default:
      return state
  }
}
```

Note that:

1. As state can NOT be mutate. Create a copy with `object.assign()`.
It will mutate first argument. Must supply a empty object as a first parameter.

1. Return the previous state in the default case ( for any unknown case).

>`Object.assign()` is part of ES6, but is not implemented by most browsers yet.

### Handling more Actions

*never assign to anything inside the `state` unless you clone it first*

Extend the reducer to handle `ADD_Todo`

```
function todoApp(state = initialState, action) {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return Object.assign({}, state, {
        visibilityFilter: action.filter
      })
    case ADD_TODO:
      return Object.assign({}, state, {
        todos: [
          ...state.todos,
          {
            text: action.text,
            completed: false
          }
        ]
      })    
    default:
      return state
  }
}
```

Just like before, we never write directly to state or its fields, 
and instead we return new objects.

case `TOGGLE_TODO`:

```
case TOGGLE_TODO:
  return Object.assign({}, state, {
    todos: state.todos.map((todo, index) => {
      if (index === action.index) {
        return Object.assign({}, todo, {
          completed: !todo.completed
        })
      }
      return todo
    })
  })
```

### Splitting Reducers

Now we can rewrite the main reducer as a function that calls the reducers 
managing parts of the state, and combines them into a single object.

```
function todos(state = [], action) {
  switch (action.type) {
    case ADD_TODO:
      return [
        ...state,
        {
          text: action.text,
          completed: false
        }
      ]
    case TOGGLE_TODO:
      return state.map((todo, index) => {
        if (index === action.index) {
          return Object.assign({}, todo, {
            completed: !todo.completed
          })
        }
        return todo
      })
    default:
      return state
  }
}

function visibilityFilter(state = SHOW_ALL, action) {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return action.filter
    default:
      return state
  }
}

function todoApp(state = {}, action) {
  return {
    visibilityFilter: visibilityFilter(state.visibilityFilter, action),
    todos: todos(state.todos, action)
  }
}
```

## Store

The **Store** is tthe object that brings actions and reducers together.

The store has the following responsibility:

1. Holds application state
1. Allow access to state via `getState()`
1. Allow State to be update via `dispatch(action)`
1. Registers listeners via `subscribe(listener)`
1. Handles unregistering of listener via the function return by `subscribe(listener)`

> Itâs important to note that youâll only have a single store in a Redux application.
>
> When you want to split your data handling logic, youâll use reducer composition instead of many stores.

To create a store with reducers: pass reducers into `createStore()`

```
import { createStore } from 'redux'
import todoApp from './reducers'	
let store = createStore(todoApp)
```

Optionally specify the initial state as the second argument to `createStore()`.

This is useful for hydrating the state of the client to match the state of a Redux application running on the server.

```
let store = createStore(todoApp, window.STATE_FROM_SERVER)
```

### Dispatch actions

```
import { addTodo, toggleTodo, setVisibilityFilter, VisibilityFilters } from './actions'

// Log the initial state
console.log(store.getState())

// Every time the state changes, log it
// Note that subscribe() returns a function for unregistering the listener
let unsubscribe = store.subscribe(() =>
  console.log(store.getState())
)

// Dispatch some actions
store.dispatch(addTodo('Learn about actions'))
store.dispatch(addTodo('Learn about reducers'))
store.dispatch(addTodo('Learn about store'))
store.dispatch(toggleTodo(0))
store.dispatch(toggleTodo(1))
store.dispatch(setVisibilityFilter(VisibilityFilters.SHOW_COMPLETED))

// Stop listening to state updates
unsubscribe()
```

## Data flow

Redux architecture revolves around a strict **unidirectional** data flow.

This means that all data in an application follows the same lifecycle pattern, making the logic of your app 
more predictable and easier to understand. 

Lifecycle in any Redux app follow these 4 steps:

1. Call store.dispatch(action)

	An action is a plain object describing what happened.
2. The Redux store calls the reducer function

	The store will pass two arguments to the reducer: the current state tree and the action.
3. The root reducer may combine the output of multiple reducers into a single state tree.

	```
	function todos(state = [], action) {
		// Somehow calculate it...
		return nextState
	}

	function visibleTodoFilter(state = 'SHOW_ALL', action) {
		// Somehow calculate it...
		return nextState
	}

	let todoApp = combineReducers({
		todos,
		visibleTodoFilter
	})
	```
	While combineReducers() is a handy helper utility, you donât have to use it!
	```
	let nextTodos = todos(state.todos, action)
	let nextVisibleTodoFilter = visibleTodoFilter(state.visibleTodoFilter, action)
	
	//combine into ->
	return {
		todos: nextTodos,
		visibleTodoFilter: nextVisibleTodoFilter
	}
	```
	
4. The Redux store saves the complete state tree returned by the root reducer.

	This new tree is now the next state of your app! Every listener registered 
	with store.subscribe(listener) will now be invoked; listeners may call store.getState() to get the current state.


