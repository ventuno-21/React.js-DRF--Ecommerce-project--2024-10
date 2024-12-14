import { useState, useEffect, useContext } from 'react'
import apiInstance from '../../utils/axios'
import { Link } from 'react-router-dom'
import GetCurrentAddress from '../plugin/UserCountry'
import UserData from '../plugin/UserDta'
import CartID from '../plugin/CartID'
import Swal from 'sweetalert2'
import { CartContext } from '../plugin/Context'



export const Toast = Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true
})

function Products() {
    const [products, setProducts] = useState([])
    const [category, setCategory] = useState([])
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [colorValue, setColorValue] = useState('No color')
    const [selectedColors, setSelectedColors] = useState({})
    const [sizeValue, setSizeValue] = useState('No size')
    const [selectedSizes, setSelectedSizes] = useState({})
    const [qtyValue, setQtyValue] = useState(1)
    const currentAddress = GetCurrentAddress()
    const userData = UserData()
    const cart_id = CartID()
    const [cartCount, setCartCount] = useContext(CartContext)


    const handleColorButtonOnClick = (event, product_id, colorName) => {
        setColorValue(colorName)
        setSelectedProduct(product_id)

        setSelectedColors((prevSelectedColors) => (
            { ...prevSelectedColors, [product_id]: colorName }
        ))
    }

    const handleSizeButtonOnClick = (event, product_id, sizeName) => {
        setSizeValue(sizeName)
        setSelectedProduct(product_id)

        setSelectedSizes((prevSelectedSizes) => (
            { ...prevSelectedSizes, [product_id]: sizeName }
        ))
    }

    const handleQtyChange = (event, product_id) => {
        setQtyValue(event.target.value)
        setSelectedProduct(product_id)
    }

    const handleAddToCart = async (product_id, price, shipping_amount) => {
        try {
            const formdata = new FormData()
            formdata.append("product_id", product_id)
            formdata.append("user_id", userData?.user_id)
            formdata.append("price", price)
            formdata.append("shipping_amount", shipping_amount)
            formdata.append("country", currentAddress.country)
            formdata.append("color", colorValue)
            formdata.append("size", sizeValue)
            formdata.append("qty", qtyValue)
            formdata.append("cart_id", cart_id)

            const response = await apiInstance.post(`cart-view/`, formdata)



            Toast.fire({
                icon: "success",
                title: response.data.message
            })

            const url = userData?.user_id ? `cart-list/${cart_id}/${userData?.user_id}/` : `cart-list/${cart_id}/`
            apiInstance.get(url)
                .then((res) => {
                    // console.log('app.jsx, cart details = ', res.data)
                    setCartCount(res.data.length)

                })



        } catch (error) {
            console.log(error)
        }
    }

    // console.log(selectedColors)
    // console.log(selectedSizes)



    useEffect(() => {
        apiInstance.get(`products/`)
            .then((res) => {
                // console.log(res.data)
                setProducts(res.data)
            })
    }, [])

    useEffect(() => {
        apiInstance.get(`category/`)
            .then((res) => {
                // console.log(res.data)
                setCategory(res.data)
            })
    }, [])

    const addToWishlist = async (productId, userId) => {
        try {
            console.log("add to wishlist")
            const formdata = new FormData()
            formdata.append('product_id', productId)
            formdata.append('user_id', userId)

            const response = await apiInstance.post(`customer/wishlist/${userId}/`, formdata)
            console.log(response.data)
            Swal.fire({
                icon:'success',
                title:response.data.message
            })

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <main className="mt-5">
                <div className="container">
                    <section className="text-center">
                        <div className="row">
                            {products?.map((p, index) => (
                                <div className="col-lg-4 col-md-12 mb-4" key={index}>
                                    <div className="card shadow">
                                        <div
                                            className="bg-image hover-zoom ripple"
                                            data-mdb-ripple-color="light"
                                        >
                                            <Link to={`/detail/${p.slug}`}>
                                                <img
                                                    src={p.image} style={{ width: '100%', height: '250px', objectFit: 'cover' }} />
                                            </Link>
                                        </div>
                                        <div className="card-body">
                                            <Link to={`/detail/${p.slug}`} className="text-reset">
                                                <h5 className="card-title mb-3">{p.title}</h5>
                                            </Link>
                                            <a href="" className="text-reset">
                                                <p>{p.category?.title}</p>
                                            </a>
                                            <div className='d-flex justify-content-center'>
                                                <h6 className="mb-3">${p.price}</h6>
                                                <h6 className="mb-3 text-muted ms-2"> <strike>${p.old_price}</strike></h6>
                                            </div>
                                            <div className="btn-group">
                                                <button
                                                    className="btn btn-primary dropdown-toggle"
                                                    type="button"
                                                    id="dropdownMenuClickable"
                                                    data-bs-toggle="dropdown"
                                                    data-bs-auto-close="false"
                                                    aria-expanded="false"
                                                >
                                                    Variation
                                                </button>
                                                <ul
                                                    className="dropdown-menu"
                                                    aria-labelledby="dropdownMenuClickable"
                                                >

                                                    <div className="d-flex flex-column">
                                                        <li className="p-1">
                                                            <b>Quantity</b>:
                                                        </li>
                                                        <div className="p-1 mt-0 pt-0 d-flex flex-wrap">
                                                            <li>
                                                                <input type='number' className='form-control'
                                                                    onChange={(e) => handleQtyChange(e, p.id)}
                                                                />

                                                            </li>

                                                        </div>
                                                    </div>
                                                    {p.size?.length > 0 &&
                                                        <div className="d-flex flex-column">
                                                            <li className="p-1">
                                                                <b>Size</b>: {selectedSizes[p.id] || 'Select a size'}
                                                            </li>
                                                            <div className="p-1 mt-0 pt-0 d-flex flex-wrap">
                                                                {p.size?.map((s, index) => (
                                                                    <li key={index}>
                                                                        <button onClick={(e) => handleSizeButtonOnClick(e, p.id, s.name)}
                                                                            className="btn btn-secondary btn-sm me-2 mb-1">
                                                                            {s.name}
                                                                        </button>
                                                                    </li>
                                                                ))}
                                                            </div>
                                                        </div>}
                                                    {p.color?.length > 0 &&
                                                        <div className="d-flex flex-column mt-3">
                                                            <li className="p-1">
                                                                <b>Color</b>: {selectedColors[p.id] || "Select a color"}
                                                            </li>
                                                            <div className="p-1 mt-0 pt-0 d-flex flex-wrap">
                                                                {p.color.map((c, index) => (
                                                                    <li key={index}>
                                                                        <button onClick={(e) => handleColorButtonOnClick(e, p.id, c.name)}
                                                                            className="btn btn-sm me-2 mb-1 p-3 shadow"
                                                                            style={{ backgroundColor: `${c.color_code}` }}
                                                                        />
                                                                    </li>))}
                                                            </div>
                                                        </div>}
                                                    <div className="d-flex mt-3 p-1">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleAddToCart(p.id, p.price, p.shipping_amount)}
                                                            className="btn btn-primary me-1 mb-1"
                                                        >
                                                            <i className="fas fa-shopping-cart" />
                                                        </button>
                                                        <button
                                                            onClick={addToWishlist}
                                                            type="button"
                                                            className="btn btn-danger px-3 me-1 mb-1 ms-2"
                                                        >
                                                            <i className="fas fa-heart" />
                                                        </button>
                                                    </div>
                                                </ul>
                                                <button
                                                    onClick={() => addToWishlist(p.id, userData?.user_id)}
                                                    type="button"
                                                    className="btn btn-danger px-3 me-1 ms-2"
                                                >
                                                    <i className="fas fa-heart" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                    {/* category section */}

                    <div className='row'>
                        {category?.map((c, index) => (
                            <div className="col-lg-2" key={index}>
                                <img src={c.image} style={{ width: "100px", height: "100px", objectFit: "cover" }} className='shadow' alt="" />
                                <br />
                                <br />
                                <h6>{c.title}</h6>
                            </div>
                        ))}
                    </div>
                </div>



            </main>



        </>
    )
}

export default Products
