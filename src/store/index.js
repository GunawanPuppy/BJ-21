import { configureStore } from '@reduxjs/toolkit';
import roomReducer from './slice/room'
import loginReducer from './slice/login'
import cardReducer from './slice/card'
import addCardReducer from './slice/addCard'
import roomByIdReducer from './slice/roomById'

const store = configureStore({
    reducer: {
        room: roomReducer,
        login: loginReducer,
        card: cardReducer,
        addards: addCardReducer,
        getRoomById: roomByIdReducer
    }
})

export default store
