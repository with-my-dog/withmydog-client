import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';

import rootReducer from '../reducers';

type Middleware = SagaMiddleware<object>;

const sagaMiddleware: SagaMiddleware<object> = createSagaMiddleware();
const middlewares: Array<Middleware> = [sagaMiddleware];

/* for production */
// const store = createStore(rootReducer, applyMiddleware(...middlewares));

/* for develop */
const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(...middlewares)),
);

export default store;
