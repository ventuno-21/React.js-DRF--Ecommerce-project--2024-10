import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import apiInstance from '../../utils/axios'
import UserData from '../plugin/UserDta'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'

function UpdateProduct() {
    const userData = UserData()
    const param = useParams()

    const [product, setProduct] = useState([])
    const [specifications, setSpecifications] = useState([{
        title: '',
        content: ''
    }])
    const [colors, setColors] = useState([{
        name: '',
        color_code: ''
    }])
    const [sizes, setSizes] = useState([{
        name: '',
        price: ''
    }])
    const [gallery, setGallery] = useState([{
        image: ''
    }])
    const [category, setCategory] = useState([])

    const handleAddMore = (setStateFunction) => {
        setStateFunction((prevState) => [...prevState, {}])
    }
    const navigate = useNavigate()


    const handleRemove = (index, setStateFunction) => {
        setStateFunction((prevState) => {
            const newState = [...prevState]
            newState.splice(index, 1)
            return newState
        })
    }

    const handleInputChange = (index, field, value, setStateFunction) => {
        setStateFunction((prevState) => {
            const newState = [...prevState]
            newState[index][field] = value
            return newState
        })
    }

    const handleImageChange = (index, event, setStateFunction) => {
        const file = event.target.files[0]

        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setStateFunction((prevState) => {
                    const newState = [...prevState]
                    newState[index].image = { file, preview: reader.result }
                    return newState
                })
            }

            reader.readAsDataURL(file)
        } else {
            setStateFunction(() => {
                const newState = [...prevState]
                newState[index].image = null
                newState[index].preview = null
                return newState
            })
        }
    }

    const handleProductInputChange = (event) => {
        setProduct({
            ...product,
            [event.target.name]: event.target.value
        })
        console.log(product)
    }

    const handleProductFileChange = (event) => {
        const file = event.target.files[0]
        if (file) {
            const reader = new FileReader()

            reader.onloadend = () => {
                setProduct({
                    ...product,
                    image: {
                        file: event.target.files[0],
                        preview: reader.result
                    }
                })
            }
            reader.readAsDataURL(file)
        }
    }

    useEffect(() => {
        apiInstance.get(`category/`)
            .then((res) => {
                setCategory(res.data)
            })


    }, [])

    useEffect(() => {
        apiInstance.get(`vendor-update-product/${userData?.vendor_id}/${param.pid}/`)
            .then((res) => {
                console.log(res.data)
                setProduct(res.data)
                setSizes(res.data.size)
                setColors(res.data.color)
                setSpecifications(res.data.specification)
                setGallery(res.data.gallery)
            })
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()

        const formdata = new FormData()
        Object.entries(product).forEach(([key, value]) => {
            if (key === 'imgae' && value) {
                formdata.append(key, value.file)
            } else {
                formdata.append(key, value)
            }
        })
        specifications.forEach((specification, index) => {
            Object.entries(specification).forEach(([key, value]) => {
                formdata.append(`specifications[${index}][${key}]`, value)
            })
        })
        colors.forEach((color, index) => {
            Object.entries(color).forEach(([key, value]) => {
                formdata.append(`colors[${index}][${key}]`, value)
            })
        })
        sizes.forEach((size, index) => {
            Object.entries(size).forEach(([key, value]) => {
                formdata.append(`sizes[${index}][${key}]`, value)
            })
        })
        gallery.forEach((item, index) => {
            if (item.image) {
                formdata.append(`gallery[${index}][image]`, item.image.file)

            }
        })

        const response = await apiInstance.patch(`vendor-update-product/${userData?.vendor_id}/${param.pid}/`, formdata, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })

        console.log(response.data)
        Swal.fire({
            icon: 'success',
            title: 'Product updated successfully',
            timer: 1500
        })
        navigate('/vendor/products')
    }





    return (
        <div>

            <div className="container-fluid" id="main">
                <div className="row row-offcanvas row-offcanvas-left h-100">
                    <Sidebar />


                    <div className="col-md-9 col-lg-10 main mt-4">
                        <div className="container">
                            <form
                                onSubmit={handleSubmit}
                                encType='multipart/form-data'
                                className="main-body">
                                <div className="tab-content" id="pills-tabContent">
                                    <div
                                        className="tab-pane fade show active"
                                        id="pills-home"
                                        role="tabpanel"
                                        aria-labelledby="pills-home-tab"
                                    >
                                        <div className="row gutters-sm shadow p-4 rounded">
                                            <h4 className="mb-4">Product Details</h4>
                                            <div className="col-md-12">
                                                <div className="card mb-3">
                                                    <div className="card-body">

                                                        <div className="row text-dark">
                                                            <div className="col-lg-6 mb-2">
                                                                <label htmlFor="" className="mb-2">
                                                                    Product Thumbnail
                                                                </label>
                                                                <input
                                                                    type="file"
                                                                    className="form-control"
                                                                    name="image"
                                                                    onChange={handleProductFileChange}
                                                                    id=""
                                                                    multiple
                                                                />
                                                            </div>
                                                            <div className="col-lg-6 mb-2 ">
                                                                <label htmlFor="" className="mb-2">
                                                                    Title
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    name="title"
                                                                    value={product?.title || ''}
                                                                    onChange={handleProductInputChange}

                                                                />
                                                            </div>
                                                            <div className="col-lg-12 mb-2">
                                                                <label htmlFor="" className="mb-2">
                                                                    Description
                                                                </label>
                                                                <textarea
                                                                    name="description"
                                                                    className="form-control"
                                                                    id=""
                                                                    cols={30}
                                                                    rows={10}
                                                                    value={product?.description || ''}
                                                                    onChange={handleProductInputChange}
                                                                />
                                                            </div>
                                                            <div className="col-lg-6 mb-2">
                                                                <label htmlFor="" className="mb-2">
                                                                    Category
                                                                </label>
                                                                <select
                                                                    name="category"
                                                                    className="select form-control"
                                                                    value={product.category || ''}
                                                                    onChange={handleProductInputChange}
                                                                >
                                                                    {category?.map((c, index) => (
                                                                        <option value={c.id} key={index}>{c.title}</option>
                                                                    ))}

                                                                </select>
                                                            </div>
                                                            {/* <div className="col-lg-6 mb-2 ">
                                                                    <label htmlFor="" className="mb-2">
                                                                        Brand
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        name=""
                                                                        id=""
                                                                    />
                                                                </div> */}
                                                            <div className="col-lg-6 mb-2 ">
                                                                <label htmlFor="" className="mb-2">
                                                                    Price
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    name="price"
                                                                    id=""
                                                                    value={product?.price || ''}
                                                                    onChange={handleProductInputChange}
                                                                />
                                                            </div>
                                                            <div className="col-lg-6 mb-2 ">
                                                                <label htmlFor="" className="mb-2">
                                                                    Old Price
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    name="old_price"
                                                                    id=""
                                                                    value={product?.old_price || ''}
                                                                    onChange={handleProductInputChange}
                                                                />
                                                            </div>
                                                            <div className="col-lg-6 mb-2 ">
                                                                <label htmlFor="" className="mb-2">
                                                                    Shipping Amount
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    name="shipping_amount"
                                                                    id=""
                                                                    value={product?.shipping_amount || ''}
                                                                    onChange={handleProductInputChange}
                                                                />
                                                            </div>
                                                            <div className="col-lg-6 mb-2 ">
                                                                <label htmlFor="" className="mb-2">
                                                                    Stock Qty
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    name="stock_qty"
                                                                    id=""
                                                                    value={product?.stock_qty || ''}
                                                                    onChange={handleProductInputChange}
                                                                />
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="tab-pane fade"
                                        id="pills-profile"
                                        role="tabpanel"
                                        aria-labelledby="pills-profile-tab"
                                    >
                                        <div className="row gutters-sm shadow p-4 rounded">
                                            <h4 className="mb-4">Product Image</h4>


                                            <div className="col-md-12">
                                                <div className="card mb-3">
                                                    <div className="card-body">

                                                        {gallery.map((item, index) => (
                                                            <div className="row text-dark" key={index}>
                                                                <div className="col-lg-3 mb-2">
                                                                    <label htmlFor="" className="mb-2">
                                                                        Product Image
                                                                    </label>
                                                                    {item.image && (item.image.preview
                                                                        ? (
                                                                            <image
                                                                                src={item.image.preview}
                                                                                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                                                                className="form-control"
                                                                                name=""
                                                                                id=""
                                                                            />)
                                                                        :
                                                                        (<image
                                                                            src={item.image}

                                                                            style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                                                            className="form-control"
                                                                            name=""
                                                                            id=""
                                                                        />)

                                                                    )}

                                                                    {!item.image &&
                                                                        (<image
                                                                            src='https://play-lh.googleusercontent.com/iV0NwmTMcoUdL7QkvH706VzvVotRLHULvwBXsWRbLha2hxzbYVy3TrT-3wc-wedWqCoF'

                                                                            style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                                                            className="form-control"
                                                                            name=""
                                                                            id=""
                                                                        />)
                                                                    }
                                                                </div>
                                                                <div className="col-lg-7">
                                                                    <label htmlFor="" className="">
                                                                        Product Image
                                                                    </label>
                                                                    <input
                                                                        type="file"
                                                                        className="form-control"
                                                                        name=""
                                                                        id=""
                                                                        onChange={(e) => handleImageChange(index, e, setGallery)}
                                                                        multiple
                                                                    />
                                                                </div>
                                                                <div className="col-lg-2 mt-4">
                                                                    <button
                                                                        onClick={() => handleRemove(index, setGallery)}
                                                                        className='btn btn-danger'> Remove</button>
                                                                </div>
                                                            </div>

                                                        ))}

                                                        {gallery < 1 &&
                                                            <h4> No image is selected</h4>
                                                        }
                                                        <button
                                                            onClick={() => handleAddMore(setGallery)}
                                                            type='button'
                                                            className="btn btn-primary mt-5">
                                                            <i className="fas fa-plus" /> Add Image
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="tab-pane fade"
                                        id="pills-contact"
                                        role="tabpanel"
                                        aria-labelledby="pills-contact-tab"
                                    >
                                        <div className="row gutters-sm shadow p-4 rounded">
                                            <h4 className="mb-4">Specifications</h4>
                                            <div className="col-md-12">
                                                <div className="card mb-3">
                                                    <div className="card-body">
                                                        {/* {gallery.map((item, index) => ( */}

                                                        {specifications.map((s, index) => (
                                                            <div className="row text-dark" key={index}>
                                                                <div className="col-lg-5 ">
                                                                    <label className="">
                                                                        Title
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        value={s.title || ''}
                                                                        onChange={(e) => handleInputChange(index, 'title', e.target.value, setSpecifications)}
                                                                    />
                                                                </div>
                                                                <div className="col-lg-5 ">
                                                                    <label className="">
                                                                        Content
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        value={s.content || ''}
                                                                        onChange={(e) => handleInputChange(index, 'content', e.target.value, setSpecifications)}
                                                                    />
                                                                </div>
                                                                <div className="col-lg-2">
                                                                    <button
                                                                        onClick={() => handleRemove(index, setSpecifications)}
                                                                        className='btn btn-danger mt-4'>
                                                                        Remove</button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                        {specifications < 1 && (
                                                            <h4>No specification is added</h4>
                                                        )}

                                                        <button
                                                            onClick={() => handleAddMore(setSpecifications)}
                                                            type='button'
                                                            className="btn btn-primary mt-5">
                                                            <i className="fas fa-plus" /> Add Specifications
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="tab-pane fade"
                                        id="pills-contact"
                                        role="tabpanel"
                                        aria-labelledby="pills-contact-tab"
                                    >
                                        <div className="row gutters-sm shadow p-4 rounded">
                                            <h4 className="mb-4">Size</h4>
                                            <div className="col-md-12">
                                                <div className="card mb-3">
                                                    <div className="card-body">
                                                        {sizes.map((s, index) => (
                                                            <div className="row text-dark">
                                                                <div className="col-lg-5 mb-2">
                                                                    <label htmlFor="" className="">
                                                                        Title
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        name=""
                                                                        id=""
                                                                        value={s.name}

                                                                        onChange={(e) => handleInputChange(index, 'name', e.target.value, setSizes)}
                                                                    />
                                                                </div>
                                                                <div className="col-lg-5 mb-2">
                                                                    <label htmlFor="" className="">
                                                                        Content
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        onChange={(e) => handleInputChange(index, 'price', e.target.value, setSizes)}
                                                                        value={s.price}
                                                                        name=""
                                                                        id=""
                                                                    />
                                                                </div>
                                                                <div className="col-lg-2 mb-2">
                                                                    <button className='btn btn-danger'>Remove</button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                        <button
                                                            onClick={() => handleAddMore(setSizes)}
                                                            type='button'
                                                            className="btn btn-primary mt-5">
                                                            <i className="fas fa-plus" /> Add Specifications
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="tab-pane fade"
                                        id="pills-size"
                                        role="tabpanel"
                                        aria-labelledby="pills-size-tab"
                                    >
                                        <div className="row gutters-sm shadow p-4 rounded">
                                            <h4 className="mb-4">Size</h4>
                                            <div className="col-md-12">
                                                <div className="card mb-3">
                                                    <div className="card-body">
                                                        {sizes.map((s, index) => (

                                                            <div className="row text-dark" key={index}>
                                                                <div className="col-lg-5">
                                                                    <label htmlFor="" className="">
                                                                        Size
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        name=""
                                                                        placeholder="XXL"
                                                                        id=""
                                                                        onChange={(e) => handleInputChange(index, 'title', e.target.value, setSizes)}
                                                                        value={s.title}
                                                                    />
                                                                </div>
                                                                <div className="col-lg-5">
                                                                    <label htmlFor="" className="">
                                                                        Price
                                                                    </label>
                                                                    <input
                                                                        type="number"
                                                                        placeholder="$20"
                                                                        className="form-control"
                                                                        name=""
                                                                        id=""
                                                                        onChange={(e) => handleInputChange(index, 'price', e.target.value, setSizes)}
                                                                        value={s.price}
                                                                    />
                                                                </div>

                                                                <div className="col-lg-2 mt-4">
                                                                    <button
                                                                        onClick={() => handleRemove(index, setSizes)}
                                                                        className='btn btn-danger'
                                                                    >Remove</button>
                                                                </div>
                                                            </div>
                                                        ))}

                                                        {sizes.length < 1 && (
                                                            <h4>No size is added</h4>
                                                        )}
                                                        <button
                                                            onClick={() => handleAddMore(setSizes)}
                                                            type='button'
                                                            className="btn btn-primary mt-5">
                                                            <i className="fas fa-plus" /> Add Size
                                                        </button>

                                                    </div>

                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="tab-pane fade"
                                        id="pills-color"
                                        role="tabpanel"
                                        aria-labelledby="pills-color-tab"
                                    >
                                        <div className="row gutters-sm shadow p-4 rounded">
                                            <h4 className="mb-4">Color</h4>
                                            <div className="col-md-12">
                                                <div className="card mb-3">
                                                    <div className="card-body">
                                                        {colors.map((color, index) => (

                                                            <div className="row text-dark" key={index}>
                                                                <div className="col-lg-3">
                                                                    <label htmlFor="" className="">
                                                                        Name
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        name=""
                                                                        placeholder="Green"
                                                                        id=""
                                                                        value={color.name || ''}
                                                                        onChange={(e) => handleInputChange(index, 'name', e.target.value, setColors)}

                                                                    />
                                                                </div>
                                                                <div className="col-lg-3">
                                                                    <label htmlFor="" className="">
                                                                        Code
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        placeholder="#f4f7f6"
                                                                        className="form-control"
                                                                        name=""
                                                                        id=""
                                                                        value={color.color_code || ''}
                                                                        onChange={(e) => handleInputChange(index, 'color_code', e.target.value, setColors)}
                                                                    />
                                                                </div>
                                                                {/* <div className="col-lg-4">
                                                                    <label htmlFor="" className="">
                                                                        Image
                                                                    </label>
                                                                    <input
                                                                        type="file"
                                                                        className="form-control"
                                                                        name=""
                                                                        id=""
                                                                        value={ }
                                                                        onChange={(e) => handleInputChange(index, 'name', e.target.value, setColors)}
                                                                    />
                                                                </div> */}
                                                                <div className="col-lg-2 mt-4">
                                                                    <button
                                                                        onClick={(e) => { handleRemove(index, setColors) }}
                                                                        className='btn btn-danger'>Remove</button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                        {colors.length < 1 && (
                                                            <h4>No color is added</h4>
                                                        )}
                                                        <button
                                                            onClick={() => handleAddMore(setColors)}
                                                            className="btn btn-primary mt-5">
                                                            <i className="fas fa-plus" /> Add Size
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <ul
                                            className="nav nav-pills mb-3 d-flex justify-content-center mt-5"
                                            id="pills-tab"
                                            role="tablist"
                                        >
                                            <li className="nav-item" role="presentation">
                                                <button
                                                    className="nav-link active"
                                                    id="pills-home-tab"
                                                    data-bs-toggle="pill"
                                                    data-bs-target="#pills-home"
                                                    type="button"
                                                    role="tab"
                                                    aria-controls="pills-home"
                                                    aria-selected="true"
                                                >
                                                    Basic Information
                                                </button>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <button
                                                    className="nav-link"
                                                    id="pills-profile-tab"
                                                    data-bs-toggle="pill"
                                                    data-bs-target="#pills-profile"
                                                    type="button"
                                                    role="tab"
                                                    aria-controls="pills-profile"
                                                    aria-selected="false"
                                                >
                                                    Gallery
                                                </button>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <button
                                                    className="nav-link"
                                                    id="pills-contact-tab"
                                                    data-bs-toggle="pill"
                                                    data-bs-target="#pills-contact"
                                                    type="button"
                                                    role="tab"
                                                    aria-controls="pills-contact"
                                                    aria-selected="false"
                                                >
                                                    Specifications
                                                </button>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <button
                                                    className="nav-link"
                                                    id="pills-size-tab"
                                                    data-bs-toggle="pill"
                                                    data-bs-target="#pills-size"
                                                    type="button"
                                                    role="tab"
                                                    aria-controls="pills-size"
                                                    aria-selected="false"
                                                >
                                                    Size
                                                </button>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <button
                                                    className="nav-link"
                                                    id="pills-color-tab"
                                                    data-bs-toggle="pill"
                                                    data-bs-target="#pills-color"
                                                    type="button"
                                                    role="tab"
                                                    aria-controls="pills-color"
                                                    aria-selected="false"
                                                >
                                                    Color
                                                </button>
                                            </li>
                                        </ul>
                                        <div className="d-flex justify-content-center mb-5">
                                            <button type='submit' className="btn btn-success w-50">
                                                Create Product <i className="fa fa-check-circle" />{" "}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default UpdateProduct
