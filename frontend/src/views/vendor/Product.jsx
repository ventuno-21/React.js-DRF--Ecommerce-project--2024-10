import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import apiInstance from '../../utils/axios'
import UserData from '../plugin/UserDta'
import { Link, useLocation } from 'react-router-dom'
import { Chart } from 'chart.js/auto'
import Swal from 'sweetalert2'

function Product() {

    const [products, setProducts] = useState([])
    const userData = UserData()
    const Toast = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true
    })


    useEffect(() => {

        apiInstance.get(`vendor/products/${userData?.vendor_id}`)
            .then((res) => {
                console.log(res.data)
                setProducts(res.data)
            })
    }, [])

    const location = useLocation()
    console.log(location.pathname)

    const handleDeleteProduct = async (productPid) => {
        await apiInstance.delete(`vendor-delete-product/${userData?.vendor_id}/${productPid}/`)
        await apiInstance.get(`vendor/products/${userData?.vendor_id}`)
            .then((res) => {
                setProducts(res.data)
            })
        Toast.fire({
            icon: "success",
            title: "Product deleted successfully"
        })

    }


    return (
        <div className="container-fluid" id="main">
            <div className="row row-offcanvas row-offcanvas-left h-100">
                {/* Side Bar Here */}
                <Sidebar />
                <div className="col-md-9 col-lg-10 main mt-4">
                    <div className="row mb-3 container">
                        <h4>
                            <i className="bi bi-grid" /> All Products
                        </h4>
                        <div className="dropdown">
                            <button
                                className="btn btn-secondary dropdown-toggle btn-sm mt-3 mb-4"
                                type="button"
                                id="dropdownMenuButton1"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Filter <i className="fas fa-sliders" />
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                <li>
                                    <a className="dropdown-item" href="#">
                                        Status: Live
                                    </a>
                                </li>
                                <li>
                                    <a className="dropdown-item" href="#">
                                        Status: In-active
                                    </a>
                                </li>
                                <li>
                                    <a className="dropdown-item" href="#">
                                        Status: In-review
                                    </a>
                                </li>
                                <hr />
                                <li>
                                    <a className="dropdown-item" href="#">
                                        Date: Latest
                                    </a>
                                </li>
                                <li>
                                    <a className="dropdown-item" href="#">
                                        Date: Oldest
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <table className="table">
                            <thead className="table-dark">
                                <tr>
                                    <th scope="col">#ID</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Price</th>
                                    <th scope="col">Quantity</th>
                                    <th scope="col">Orders</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products?.map((p, index) => (

                                    <tr>
                                        <th scope="row">
                                            <img src={p.image}
                                                style={{ width: '100px', height: '75px', objectFit: 'cover' }}
                                                className='shadow'
                                            />
                                        </th>
                                        <td>{p.title}</td>
                                        <td>${p.price}</td>
                                        <td>{p.stock_qty}</td>
                                        <td>{p.orders}</td>
                                        <td>{p.status}</td>
                                        <td>
                                            <Link className="btn btn-primary mb-1 me-1">
                                                <i className="fas fa-eye" />
                                            </Link>
                                            <Link to={`/vendor/product/update/${p.pid}/`} className="btn btn-success mb-1  me-1">
                                                <i className="fas fa-edit" />
                                            </Link>
                                            <button onClick={() => handleDeleteProduct(p.pid)} className="btn btn-danger mb-1  me-1">
                                                <i className="fas fa-trash" />
                                            </button>
                                        </td>
                                    </tr>

                                ))}

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Product
