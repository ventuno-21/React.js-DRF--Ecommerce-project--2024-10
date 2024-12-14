import { useState, useEffect } from 'react'
import apiInstance from '../../utils/axios'
import UserData from '../plugin/UserDta'
import { Link } from 'react-router-dom'

function Sidebar() {
    const [profile, setProfile] = useState({})
    const user_data = UserData()

    useEffect(() => {
        apiInstance.get(`user/profile/${user_data?.user_id}`)
            .then((res) => {
                setProfile(res.data)
            })
    }, [])



    return (
        <div className="col-lg-3">
            <div className="d-flex justify-content-center align-items-center flex-column mb-4 shadow rounded-3">
                <img
                    src={profile.image}
                    style={{ width: 120, height: 128, objectFit: 'cover' }}
                    alt=""
                />
                <div className="text-center">
                    <h3 className="mb-0">{profile.full_name}</h3>
                    <p className="mt-0">
                        <a href="">Edit Account</a>
                    </p>
                </div>
            </div>
            <ol className="list-group">
                <li className="list-group-item d-flex justify-content-between align-items-start">
                    <div className="ms-2 me-auto">
                        <Link to={'/customer/account/'} className="fw-bold text-dark">Account</Link>
                    </div>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-start">
                    <div className="ms-2 me-auto">
                        <Link to={'/customer/orders/'} className="fw-bold text-dark">Orders</Link>
                    </div>
                    <span className="badge bg-primary rounded-pill">14</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-start">
                    <div className="ms-2 me-auto">
                        <Link to={'/customer/wishlist/'} className="fw-bold text-dark">Wishlist</Link>
                    </div>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-start">
                    <div className="ms-2 me-auto">
                        <Link to={'/customer/notifications/'} className="fw-bold text-dark">Notification</Link>
                    </div>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-start">
                    <div className="ms-2 me-auto">
                        <Link to={'/customer/settings/'} className="fw-bold text-dark">Settings</Link>
                    </div>
                </li>

            </ol>
        </div>
    )
}

export default Sidebar
