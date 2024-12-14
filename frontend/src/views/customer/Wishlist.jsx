import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import apiInstance from '../../utils/axios'
import UserData from '../plugin/UserDta'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'


function Wishlist() {

  const [wishlist, setWishlist] = useState([])
  const userData = UserData()

  const fetchWishlist = async () => {
    await apiInstance.get(`customer/wishlist/${userData?.user_id}/`)
      .then((res) => {
        setWishlist(res.data)
        // console.log(res.data)
      })
  }


  useEffect(() => {
    fetchWishlist()
  }, [])



  const addToWishlist = async (productId, userId) => {
    try {
      console.log("add to wishlist")
      const formdata = new FormData()
      formdata.append('product_id', productId)
      formdata.append('user_id', userId)

      const response = await apiInstance.post(`customer/wishlist/${userId}/`, formdata)
      // console.log(response.data)
      fetchWishlist()

      Swal.fire({
        icon: 'success',
        title: response.data.message
      })

    } catch (error) {
      console.log(error)
    }
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
                    <div className="container">
                      <section className="">
                        <div className="row" >
                          <h3 className="mb-3">
                            <i className="fas fa-heart text-danger" /> Wishlist
                          </h3>
                          {wishlist?.map((w, index) => (

                            <div className="col-lg-4 col-md-12 mb-4" key={index}>
                              <div className="card">
                                <div
                                  className="bg-image hover-zoom ripple"
                                  data-mdb-ripple-color="light"
                                >
                                  <img
                                    src={w.product.image}
                                    className="w-100"
                                    style={{ width: "100px", height: "300px", objectFit: "cover" }}
                                  />
                                  <a href="#!">
                                    <div className="mask">
                                      <div className="d-flex justify-content-start align-items-end h-100">
                                        <h5>
                                          <span className="badge badge-primary ms-2">
                                            New
                                          </span>
                                        </h5>
                                      </div>
                                    </div>
                                    <div className="hover-overlay">
                                      <div
                                        className="mask"
                                        style={{
                                          backgroundColor: "rgba(251, 251, 251, 0.15)"
                                        }}
                                      />
                                    </div>
                                  </a>
                                </div>
                                <div className="card-body">
                                  <Link to={`/detail/${w.product.slug}`} className="text-reset">
                                    <h6 className="card-title mb-3 ">{w.product.title}</h6>
                                  </Link>

                                  <h6 className="mb-3">${w.product.price}</h6>

                                  <button
                                    onClick={() => addToWishlist(w.product.id, userData?.user_id)}
                                    type="button" className="btn btn-danger px-3 me-1 mb-1">
                                    <i className="fas fa-heart" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                          {wishlist.length < 1 &&

                            <h6 className='container'>Your wishlist is Empty </h6>
                          }


                        </div>
                      </section>
                    </div>
                  </main>
                </section>
              </div>
            </div>
          </section >
        </div >
      </main >

    </div >
  )
}

export default Wishlist
