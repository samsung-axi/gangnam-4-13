import { combineReducers } from "redux";
import userReducer from "./UserModule";

const rootReducer = combineReducers({
    user: userReducer, // user 리듀서를 user 키로 결합   
});

export default rootReducer;