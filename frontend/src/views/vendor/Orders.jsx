import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import apiInstance from '../../utils/axios'
import UserData from '../plugin/UserDta'
import { Link, useLocation } from 'react-router-dom'
import { Chart } from 'chart.js/auto'

function VendorOrders() {

    const [orders, setOrders] = useState([])

    useEffect(() => {
        apiInstance.get(`vendor/orders/${UserData()?.vendor_id}`)
            .then((res) => {
                setOrders(res.data)
                console.log(res.data)
            })
    }, [])

    const handleFilterOrders = async (filter) =>{
        console.log(filter);
        const response = await apiInstance.get(`vendor/orders/filter/${UserData()?.vendor_id}?filter=${filter}`)
        setOrders(response.data)
        
    }

    return (
        <div className="container-fluid" id="main">
            <div className="row row-offcanvas row-offcanvas-left h-100">
                {/* Sidebar Here */}
                <Sidebar />
                <div className="col-md-9 col-lg-10 main mt-4 ">
                    <h4>
                        <i className="bi bi-cart-check-fill"> All Orders </i>
                    </h4>
                    <div className="dropdown">
                        <button
                            className="btn btn-secondary dropdown-toggle btn-sm mt-3 mb-4"
                            type="button"
                            id="dropdownMenuButton1"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            Filter <i className="fas fa-sliders"></i>
                        </button>

                        <ul
                            className="dropdown-menu"
                            aria-labelledby="dropdownMenuButton1"
                        >
                            <li>
                                <a className="dropdown-item" onClick={()=>handleFilterOrders('paid')}>
                                    Payment Status: Paid
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" onClick={()=>handleFilterOrders('pending')}>
                                    Payment Status: Pending
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" onClick={()=>handleFilterOrders('processing')}>
                                    Date: Processing
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" onClick={()=>handleFilterOrders('cancelled')}>
                                    Payment Status: Cancelled
                                </a>
                            </li>
                            <hr />
                            <li>
                                <a className="dropdown-item" onClick={()=>handleFilterOrders('latest')}>
                                    Date: Latest
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" onClick={()=>handleFilterOrders('oldest')}>
                                    Date: Oldest
                                </a>
                            </li>
                            <hr />
                            <li>
                                <a className="dropdown-item" onClick={()=>handleFilterOrders('Pending')}>
                                    Order Status: Pending
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" onClick={()=>handleFilterOrders('fulfilled')}>
                                    Order Status: Fulfilled 
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" onClick={()=>handleFilterOrders('cancelled')}>
                                    Order Status: Cancelled
                                </a>
                            </li>
                        </ul>
                    </div>

                    <table className="table">
                        <thead className="table-dark">
                            <tr>
                                <th scope="col">#Order ID</th>
                                <th scope="col">Total</th>
                                <th scope="col">Payment Status</th>
                                <th scope="col">Delivery Status</th>
                                <th scope="col">Date</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders?.map((o, index) => (

                                <tr keys={index}>
                                    <th scope="row">#{o.oid}</th>
                                    <td>${o.total}</td>
                                    <td>{o.payment_status}</td>
                                    <td>{o.order_status}</td>
                                    <td>{o.date}</td>
                                    <td>
                                        <Link to={`/vendor/orders/${o.oid}`} className="btn btn-primary mb-1">
                                            <i className="fas fa-eye"></i>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>

        </div>

    )
}

export default VendorOrders
