import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import authReducer from "./module/AuthModule";
import memberReducer from "./module/MemberModule";
import spiceReducer from "./module/SpicesModule";
import perfumeReducer from "./module/PerfumeModule";
import shopReducer from "./module/ShopModule";
import chatReducer from "./module/ChatModule";
import historyReducer from "./module/HistoryModule";
import therapyReducer from "./module/TherapyModule";
import bookmarkReducer from "./module/BookmarkModule";
import reviewReducer from "./module/ReviewModule";
import wishlistReducer from "./module/WishlistModule";
import cartReducer from "./module/CartModule";
import subscriptionReducer from "./module/SubscriptionModule";

// 여러 리듀서를 합치는 경우
const rootReducer = combineReducers({
    auth: authReducer,
    members: memberReducer,
    spices: spiceReducer,
    perfumes: perfumeReducer,
    shop: shopReducer,
    chat: chatReducer,
    history: historyReducer,
    therapy: therapyReducer,
    bookmark: bookmarkReducer,
    reviews: reviewReducer,
    wishlist: wishlistReducer,
    cart: cartReducer,
    subscription: subscriptionReducer
});

// 스토어 생성
const store = createStore(
    rootReducer,      // 리듀서를 합친 결과
    applyMiddleware(thunk) // thunk 미들웨어 추가
);

export default store;
