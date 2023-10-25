import React, { createContext, useContext, useState } from 'react'

const initialState = {
    rooms: [],
    createdRoomTopic: '',
    twilioToken: '',
    device: null,
    roomId: '',
    onlineUsers: [],
    username: '',
    driver: '',
};

const RoomContext = createContext(null);

export const RoomContextProvider = ({ children }) => {
    const[roomState, setRoomState] = useState(initialState);
    return (
        <RoomContext.Provider value={[roomState, setRoomState]}>{children}</RoomContext.Provider>
    )
};

export const useGlobalState = () => {
    const value = useContext(RoomContext)
    if(value === undefined) throw new Error('Please add RoomContextProvider');
    return value;
}