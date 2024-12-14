import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import apiInstance from '../../utils/axios'
import UserData from '../plugin/UserDta'
import Swal from 'sweetalert2'
// import Moment from 'react-moment'


function Notification() {
    const [notif, setNotif] = useState([])
    const user_data = UserData()

    const fetchNotif = () => {
        apiInstance.get(`customer/notification/${user_data?.user_id}`)
            .then((res) => {
                console.log(res.data)
                setNotif(res.data)
            })
    }


    useEffect(() => {
        fetchNotif()
    }, [])


    const markNotifAsSeen = async (notifId) => {
        await apiInstance.get(`customer/notification/${user_data?.user_id}/${notifId}/`)
            .then((res) => {
                console.log(res.data)
            })
        fetchNotif()
    }


    return (
        <div>
            <main className="mt-5">
                <div className="container">
                    <section className="">
                        <div className="row">
                            <Sidebar />
                            <div className="col-lg-9 mt-1">
                                <section className="">
                                    <main className="mb-5" style={{}}>
                                        <div className="container px-4">
                                            <section className="">
                                                <h3 className="mb-3">
                                                    <i className="fas fa-bell" /> Notifications{" "}
                                                </h3>
                                                <div className="list-group shadow">

                                                    {notif?.map((n, index) => (
                                                        <a
                                                            key={index}
                                                            href="#"
                                                            className="list-group-item list-group-item-action "
                                                            aria-current="true"
                                                        >
                                                            <div className="d-flex w-100 justify-content-between">
                                                                <h5 className="mb-1">Order confirmed</h5>
                                                                <small>{n.date}</small>
                                                            </div>
                                                            <p className="mb-1">
                                                                Your order has been confirmed.
                                                            </p>
                                                            <button
                                                                onClick={() => markNotifAsSeen(n.id)}
                                                                className='btn btn-success mt-3'>
                                                                <i className='fas fa-eye'></i>
                                                            </button>
                                                        </a>
                                                    ))}
                                                    {notif.length < 1 &&
                                                        <h5 className='mt-5 mb-5 p-3'> You have no unseen notifications.</h5>
                                                    }
                                                </div>
                                            </section>
                                        </div>
                                    </main>
                                </section>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

        </div>
    )
}

export default Notification
