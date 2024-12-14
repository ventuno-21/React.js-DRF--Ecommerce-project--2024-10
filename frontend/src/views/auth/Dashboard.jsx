import {useState} from 'react'
import { useAuthStore } from '../../store/auth'
import { Link } from 'react-router-dom'
import { useShallow } from 'zustand/shallow'

function Dashboard() {
    const [isLoggedIn, setIsLoggedIn] = useAuthStore(useShallow((state) => 
        [state.isLoggedIn,state.user]
),)


    return (
        <>
            {isLoggedIn
                ? <div>
                    <h2> Dashboard Component</h2>
                    <Link to={'/logout'}>Logout</Link>
                </div>
                : <div>
                    <div> Home page</div>
                    <div className='d-flex'>
                        <br />
                        <Link className='btn btn-primary' to={'/login'}> Login</Link>
                        <Link className='btn btn-secondary ms-1' to={'/Register'}> Register</Link> 
                    </div>
                </div>
            }

        </>
    )
}

export default Dashboard
