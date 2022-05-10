//import React, { useEffect } from 'react';
//import NewRoom from './NewRoom';
//import { Link } from 'react-router-dom';
//import { useGlobalState } from '../../context/RoomContextProvider';
//import { useFetchRooms } from '../../hooks/useFetchRooms';
//
//
//const RoomList = () =>  {
//    const [state, setState] = useGlobalState();
//    const fetchRooms = useFetchRooms('/rooms');
//    //we update the application state with the list of rooms we receive
//    console.log('this is working')
//    useEffect(() => {
//        fetchRooms().then(rooms => {
//            setState((state) => {
//                return {...state, rooms};
//            });
//        })
//    }, [fetchRooms, setState]);
//
//    return (
//            <div>
//                <h1>Available rooms</h1>
//
//                { state.rooms.length > 0?
//                    <ul>
//                        {state.rooms.map((selectedRoom, index) => (
//                        <li key={index + 1}>
//                            <Link to={`/rooms/${index + 1}`} onClick={() => {setState({...state, selectedRoom})}}>{selectedRoom.room_name}</Link>
//                        </li>
//                        ))}
//                    </ul>: <div>Create a new room to get started</div>}
//                <NewRoom />
//            </div>
//    );
//};
//
//export default React.memo(RoomList);
