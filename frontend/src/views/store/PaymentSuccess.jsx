import { useState, useEffect } from 'react'
import apiInstance from '../../utils/axios'
import { useParams } from 'react-router-dom'

function PaymentSuccess() {
    const [order, setOrder] = useState([])
    const [status, setStatus] = useState('Verifying')

    const param = useParams()

    const urlParam = new URLSearchParams(window.location.search)
    const sessionId = urlParam.get("session_id")

    useEffect(() => {
        apiInstance.get(`checkout/${param.order_oid}/`)
            .then((res) => {
                setOrder(res.data)
                console.log('receive data form checkout: ', res.data)
            })
    }, [])

    useEffect(() => {
        const formdata = new FormData()
        formdata.append("order_oid", param.order_oid)
        formdata.append("session_id", sessionId)
        console.log(param.order_oid)
        setStatus('Verifying')

        apiInstance.post(`payment-success/${order.oid}/`, formdata)
            .then((res) => {
                console.log(res.data)
                if (res.data.message === 'Payment successfull') {
                    setStatus('Payment successfull')
                }
                if (res.data.message === 'Already paid') {
                    setStatus('Already paid')
                }
                if (res.data.message === 'Your invoice is unpaid') {
                    setStatus('Your invoice is unpaid')
                }
                if (res.data.message === 'Your invoice is cancelled') {
                    setStatus('Your invoice is cancelled')
                }
            })
    },[])

    return (
        <div>
            <main className="mb-4 mt-4 h-100">
                <div className="container">
                    {/* Section: Checkout form */}
                    <section className="">
                        <div className="gx-lg-5">
                            <div className="row pb50">
                                <div className="col-lg-12">
                                    <div className="dashboard_title_area">
                                        <h4 className="fw-bold text-center mb-4 mt-4">
                                            Checkout Successfull <i className="fas fa-check-circle" />{" "}
                                        </h4>
                                        {/* <p class="para">Lorem ipsum dolor sit amet, consectetur.</p> */}
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-xl-12">
                                    <div className="application_statics">
                                        <div className="account_user_deails dashboard_page">
                                            <div className="d-flex justify-content-center align-items-center">


                                                {status === 'verifying' &&
                                                    <div className="col-lg-12">
                                                        <div className="border border-3 border-success" />
                                                        <div className="card bg-white shadow p-5">
                                                            <div className="mb-4 text-center">
                                                                <i
                                                                    className="fas fa-check-circle text-success"
                                                                    style={{ fontSize: 100, color: "green" }}
                                                                />
                                                            </div>
                                                            <div className="text-center">
                                                                <h1>Verifiying your payment ! <i className='fas fa-spinner fa-spin'></i></h1>
                                                                <p>
                                                                    <b className='text-success'> Please hold on while verifying your payment </b>
                                                                    <br />
                                                                    <b className='text-danger'> Please do NOT reload or leave the page</b>
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                }

                                                {status === 'Payment successfull' &&
                                                    <div className="col-lg-12">
                                                        <div className="border border-3 border-success" />
                                                        <div className="card bg-white shadow p-5">
                                                            <div className="mb-4 text-center">
                                                                <i
                                                                    className="fas fa-check-circle text-success"
                                                                    style={{ fontSize: 100, color: "green" }}
                                                                />
                                                            </div>
                                                            <div className="text-center">
                                                                <h1>Thank You !</h1>
                                                                <p>
                                                                    Your checkout was successfull, we have sent the detail of
                                                                    order no. <b>{order.oid}</b>  to your email <b>{order.email}</b>
                                                                </p>
                                                                <button
                                                                    className="btn btn-success mt-3"
                                                                    data-bs-toggle="modal"
                                                                    data-bs-target="#exampleModal"
                                                                >
                                                                    View Order <i className="fas fa-eye" />{" "}
                                                                </button>
                                                                <a
                                                                    href="/"
                                                                    className="btn btn-primary mt-3 ms-2"
                                                                >
                                                                    Download Invoice{" "}
                                                                    <i className="fas fa-file-invoice" />{" "}
                                                                </a>
                                                                <a
                                                                    className="btn btn-secondary mt-3 ms-2"
                                                                >
                                                                    Go Home <i className="fas fa-fa-arrow-left" />{" "}
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                }

                                                {status === 'Already paid' &&
                                                    <div className="col-lg-12">
                                                        <div className="border border-3 border-success" />
                                                        <div className="card bg-white shadow p-5">
                                                            <div className="mb-4 text-center">
                                                                <i
                                                                    className="fas fa-check-circle text-success"
                                                                    style={{ fontSize: 100, color: "green" }}
                                                                />
                                                            </div>
                                                            <div className="text-center">
                                                                <h1>Already paid !</h1>
                                                                <p>
                                                                    Your checkout was successfull, we have sent the detail of
                                                                    order no. <b>{order.oid}</b>  to your email <b>{order.email}</b>
                                                                </p>
                                                                <button
                                                                    className="btn btn-success mt-3"
                                                                    data-bs-toggle="modal"
                                                                    data-bs-target="#exampleModal"
                                                                >
                                                                    View Order <i className="fas fa-eye" />{" "}
                                                                </button>
                                                                <a
                                                                    href="/"
                                                                    className="btn btn-primary mt-3 ms-2"
                                                                >
                                                                    Download Invoice{" "}
                                                                    <i className="fas fa-file-invoice" />{" "}
                                                                </a>
                                                                <a
                                                                    className="btn btn-secondary mt-3 ms-2"
                                                                >
                                                                    Go Home <i className="fas fa-fa-arrow-left" />{" "}
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                }

                                                {status === 'Your invoice is unpaid' &&
                                                    <div className="col-lg-12">
                                                        <div className="border border-3 border-success" />
                                                        <div className="card bg-white shadow p-5">
                                                            <div className="mb-4 text-center">
                                                                <i
                                                                    className="fas fa-check-circle text-success"
                                                                    style={{  fontSize: 100, color: "green" }}
                                                                />
                                                            </div>
                                                            <div className="text-center">
                                                                <h1>Unpaid invoice ! <i className='fas fa-ban'></i></h1>
                                                                <p>
                                                                    <b className='text-danger'> Please try to do payment again</b>

                                                                </p>

                                                            </div>
                                                        </div>
                                                    </div>
                                                }

                                                {status === 'Your invoice is cancelled' &&
                                                    <div className="col-lg-12">
                                                        <div className="border border-3 border-success" />
                                                        <div className="card bg-white shadow p-5">
                                                            <div className="mb-4 text-center">
                                                                <i
                                                                    className="fas fa-check-circle text-success"
                                                                    style={{ fontSize: 100, color: "green" }}
                                                                />
                                                            </div>
                                                            <div className="text-center">
                                                                <h1>Thank You !</h1>
                                                                <p>
                                                                    Your checkout was successfull, we have sent the detail of
                                                                    order no. <b>{order.oid}</b>  to your email <b>{order.email}</b>
                                                                </p>
                                                                <button
                                                                    className="btn btn-success mt-3"
                                                                    data-bs-toggle="modal"
                                                                    data-bs-target="#exampleModal"
                                                                >
                                                                    View Order <i className="fas fa-eye" />{" "}
                                                                </button>
                                                                <a
                                                                    href="/"
                                                                    className="btn btn-primary mt-3 ms-2"
                                                                >
                                                                    Download Invoice{" "}
                                                                    <i className="fas fa-file-invoice" />{" "}
                                                                </a>
                                                                <a
                                                                    className="btn btn-secondary mt-3 ms-2"
                                                                >
                                                                    Go Home <i className="fas fa-fa-arrow-left" />{" "}
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                }

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
            {/* modal section */}
            <div
                className="modal fade"
                id="exampleModal"
                tabIndex={-1}
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">
                                Order Summary
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            />
                        </div>
                        <div className="modal-body">
                            <div className="modal-body text-start text-black p-4">
                                <h5
                                    className="modal-title text-uppercase "
                                    id="exampleModalLabel"
                                >
                                    {order.full_name}
                                </h5>
                                <h6>{order.email}</h6>
                                <h6 className="mb-5">{order.address}-{order.state}-{order.city}-{order.country}</h6>
                                <p className="mb-0" style={{ color: "#35558a" }}>
                                    Payment summary
                                </p>
                                <hr
                                    className="mt-2 mb-4"
                                    style={{
                                        height: 0,
                                        backgroundColor: "transparent",
                                        opacity: ".75",
                                        borderTop: "2px dashed #9e9e9e"
                                    }}
                                />
                                {order.order_item?.map((o, index) => (
                                    <div className="d-flex justify-content-between shadow p-1 mb-2" key={index}>
                                        <p className="fw-bold mb-0">{o.product.title}</p>
                                        <p className="text-muted mb-0">${o.price}</p>
                                    </div>
                                ))}
                                <br />
                                <hr
                                    className="mt-2 mb-4"
                                    style={{
                                        height: 0,
                                        backgroundColor: "transparent",
                                        opacity: ".75",
                                        borderTop: "2px dashed #9e9e9e"
                                    }}
                                />
                                <div className="d-flex justify-content-between">
                                    <p className="fw-bold mb-0">Subtotal</p>
                                    <p className="text-muted mb-0">${order.sub_total}</p>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <p className="small mb-0">Shipping Fee</p>
                                    <p className="small mb-0">${order.shipping_amount}</p>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <p className="small mb-0">Service Fee</p>
                                    <p className="small mb-0">${order.service_fee}</p>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <p className="small mb-0">Tax</p>
                                    <p className="small mb-0">${order.tax_fee}</p>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <p className="small mb-0">Discount</p>
                                    <p className="small mb-0">-${order.discount}</p>
                                </div>
                                <div className="d-flex justify-content-between mt-4">
                                    <p className="fw-bold">Total</p>
                                    <p className="fw-bold" style={{ color: "#35558a" }}>
                                        ${order.total}
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default PaymentSuccess
