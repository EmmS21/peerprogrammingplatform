import React, { createContext, useContext, useState } from 'react'

const initialState = {
    nickname: '',
    selectedRoom: null,
    rooms: [],
    createdRoomTopic: '',
    twilioToken: '',
    device: null,
    roomId: '',
    onlineUsers: [],
    username: '',
    matchedUser: '',
};

const RoomContext = createContext(null);

export const RoomContextProvider = ({ children }) => {
    const[state, setState] = useState(initialState);
    return (
        <RoomContext.Provider value={[state, setState]}>{children}</RoomContext.Provider>
    )
};

export const useGlobalState = () => {
    const value = useContext(RoomContext)
    if(value === undefined) throw new Error('Please add RoomContextProvider');
    return value;
}