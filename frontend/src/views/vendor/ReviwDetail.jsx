import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import apiInstance from '../../utils/axios'
import UserData from '../plugin/UserDta'
import { Link, useParams } from 'react-router-dom'

function ReviwDetail() {
    const [review, setReview] = useState({})
    const [updateReview, setUpdateReview] = useState({ reply: '' })
    const param = useParams()

    const handleRepyChange = (event) => {
        setUpdateReview({
            ...updateReview
            , [event.target.name]: event.target.value
        })

        // console.log(updateReview)

    }


    const handleReplySubmit = async (e) => {
        e.preventDefault()
        const formdata = new FormData()
        formdata.append('reply', updateReview?.reply)
        await apiInstance.patch(`vendor-reviews/${UserData()?.vendor_id}/${param?.review_id}/`, formdata)
            .then((res) => {
                console.log(res.data)
            })

        apiInstance.get(`vendor-reviews/${UserData()?.vendor_id}/${param?.review_id}/`)
            .then((res) => {
                console.log(res.data)
                setReview(res.data)
            })
    }

    useEffect(() => {
        apiInstance.get(`vendor-reviews/${UserData()?.vendor_id}/${param?.review_id}/`)
            .then((res) => {
                console.log(res.data)
                setReview(res.data)
            })
    }, [])



    return (
        <div className="container-fluid" id="main">
            <div className="row row-offcanvas row-offcanvas-left h-100">
                <Sidebar />
                {/*/col*/}
                <div className="col-md-9 col-lg-10 main mt-4">
                    <h4>
                        <i className="fas fa-star" /> Review and Rating
                    </h4>

                    <section
                        className="p-4 p-md-5 text-center text-lg-start shadow-1-strong rounded"

                    >
                        <div className="row d-flex justify-content-center align-items-center">
                            <div className="col-md-10">

                                <div className="card mt-3 mb-3 shadow">
                                    <div className="card-body m-3">
                                        <div className="row">
                                            <div className="col-lg-4 d-flex justify-content-center align-items-center mb-4 mb-lg-0">
                                                <img
                                                    src={review?.profile?.image}
                                                    className="rounded-circle img-fluid shadow-1"
                                                    alt="woman avatar"
                                                    width={200}
                                                    height={200}
                                                />
                                            </div>
                                            <div className="col-lg-8">
                                                <p className="text-dark fw-bold mb-4">
                                                    Review:{" "}
                                                    <i>
                                                        {review?.review}
                                                    </i>
                                                </p>
                                                <p className="text-dark fw-bold mb-4">
                                                    Reply:{" "}
                                                    <i>
                                                        {review?.reply === null
                                                            ? <span> No reply until now!</span>
                                                            : <span>{review.reply}</span>
                                                        }
                                                    </i>
                                                </p>
                                                <p className="fw-bold text-dark mb-2">
                                                    <strong>Name: {review?.profile?.full_name}</strong>
                                                </p>
                                                <p className="fw-bold text-muted mb-0">
                                                    Product: {review?.product?.title}
                                                </p>
                                                <p className="fw-bold text-muted mb-0">
                                                    Rating: {review?.rating}
                                                    {review?.rating === 1 &&
                                                        <>
                                                            <i className="fas fa-star" />
                                                        </>
                                                    }
                                                    {review?.rating === 2 &&
                                                        <>
                                                            <i className="fas fa-star" />
                                                            <i className="fas fa-star" />
                                                        </>
                                                    }
                                                    {review?.rating === 3 &&
                                                        <>
                                                            <i className="fas fa-star" />
                                                            <i className="fas fa-star" />
                                                            <i className="fas fa-star" />
                                                        </>
                                                    }
                                                    {review?.rating === 4 &&
                                                        <>
                                                            <i className="fas fa-star" />
                                                            <i className="fas fa-star" />
                                                            <i className="fas fa-star" />
                                                            <i className="fas fa-star" />
                                                        </>
                                                    }
                                                    {review?.rating === 5 &&
                                                        <>
                                                            <i className="fas fa-star" />
                                                            <i className="fas fa-star" />
                                                            <i className="fas fa-star" />
                                                            <i className="fas fa-star" />
                                                            <i className="fas fa-star" />
                                                        </>
                                                    }
                                                </p>
                                                <div className="d-flex mt-3">
                                                    <form onSubmit={handleReplySubmit} className='d-flex fw-bold '>
                                                        <input type='text'
                                                            value={updateReview?.reply}
                                                            name='reply'
                                                            onChange={handleRepyChange}
                                                            placeholder='Write your reply'
                                                            className='form-control shadow' />
                                                        <button type='submit' className='btn btn-primary fw-bold ms-2 me-2'>
                                                            <i className='fas fa-paper-plane'></i>
                                                        </button>

                                                    </form>

                                                    <p className="fw-bold text-muted mb-0 ms-2">
                                                        <a href="#" className="btn btn-danger">
                                                            Delete <i className="fas fa-trash" />
                                                        </a>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>

    )
}

export default ReviwDetail
