// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import furnitureReducer from '../features/furniture/furnitureSlice';
import recommendedReducer from "../features/furniture/recommendedSlice";
import interiorReducer from '../features/furniture/interiorSlice';
import searchReducer from '../features/search/searchSlice';
import aiReducer from '../features/ai/aiSlice';
import selectionReducer from '../features/furniture/selectionSlice';
import authReducer from "../features/auth/authSlice";
import cachedSearchReducer from "../features/search/cachedSearchSlice";

export const store = configureStore({
    reducer: {
        furniture: furnitureReducer,
        recommended: recommendedReducer,
        interior: interiorReducer,
        search: searchReducer,
        ai: aiReducer,
        selection: selectionReducer,
        auth: authReducer,
        cachedSearch: cachedSearchReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});
