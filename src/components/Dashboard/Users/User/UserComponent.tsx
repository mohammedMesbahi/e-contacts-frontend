import React, {useState} from 'react';
import User from "../../../../Models/User";
import './UserComponent.css'

type props = {
    user: User
}
const UserComponent: React.FC<props> = ({user}) => {

    return (
        <div className='userContainer'>
            <div>
                <h3
                >
                    {user.login}
                </h3>
            </div>
            <button>
                {user.verified ? 'Verified' : 'Not Verified'}
            </button>
        </div>
    );
};

export default UserComponent;