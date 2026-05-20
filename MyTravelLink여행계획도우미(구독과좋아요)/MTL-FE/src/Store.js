import rootReducer from './modules';
import { composeWithDevTools } from '@redux-devtools/extension';
import { persistReducer } from "redux-persist";
import storage from 'redux-persist/lib/storage';
import { createStore, applyMiddleware } from 'redux';
import {thunk} from 'redux-thunk';
import {createLogger} from 'redux-logger';

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['user'],
    debug: false
};

const persistedReducer = persistReducer(persistConfig, rootReducer);


// logger 미들웨어 설정 커스터마이즈
const customLogger = createLogger({
    predicate: (getState, action) => action.type !== 'persist/PERSIST' && action.type !== 'persist/REHYDRATE'  // persist/PERSIST 액션 로깅 무시
});

const store = createStore(
    persistedReducer,
    composeWithDevTools(applyMiddleware(thunk, customLogger))
);

export default store;
