import React, {useContext} from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const Header = () => {
let { user,logOutUser } = useContext(AuthContext)
    return (
        <div>

       </div>
    )
}

export default Header

//            { user ? (
//                        <p onClick={logOutUser}>Logout</p>
//            ): (
//                <Link to="/login">Login</Link>
//            )}