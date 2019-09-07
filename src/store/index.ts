import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { createBrowserHistory } from 'history';

import { rootReducer } from './reducers';

import { rootSaga } from '../internal';

export const history = createBrowserHistory();

type Middleware = SagaMiddleware<object>;

const sagaMiddleware: SagaMiddleware<object> = createSagaMiddleware();
const middlewares: Array<Middleware> = [sagaMiddleware];

/* for production */
// const store = createStore(rootReducer, applyMiddleware(...middlewares));

/* for develop */
const store = createStore(
    rootReducer(history),
    composeWithDevTools(applyMiddleware(...middlewares)),
);

sagaMiddleware.run(rootSaga);

export default store;
