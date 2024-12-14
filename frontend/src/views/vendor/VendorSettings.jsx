import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import apiInstance from '../../utils/axios'
import UserData from '../plugin/UserDta'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'

function VendorSettings() {
    const [profileData, setProfileData] = useState({
        'full_name': '',
        'phone': '',
        'email': '',
        'about': '',
        'image': ''
    })
    const [vendorData, setVendorData] = useState({})
    const [profileImage, setProfileImage] = useState('')

    const fetchProfileData = async () => {
        await apiInstance.get(`vendor-settings/${UserData()?.user_id}/`)
            .then((res) => {
                setProfileData(res.data)
                setProfileImage(res.data.image)
                console.log(res.data.image)
            })
        console.log(profileImage)
    }

    const fetchVendoreData = () => {
        apiInstance.get(`vendor-shop-settings/${UserData()?.user_id}/`)
            .then((res) => {
                setVendorData(res.data)
                console.log('vendor details ===', res.data)
            })
    }

    useEffect(() => {
        fetchProfileData()
        fetchVendoreData()
    }, [])



    const handleInputChange = (event) => {
        setProfileData({
            ...profileData,
            [event.target.name]: event.target.value
        })
        console.log('profile data after change of inputs===', profileData)

    }

    const handleFileChange = (event) => {
        setProfileData({
            ...profileData,
            [event.target.name]: event.target.files[0]
        })
        console.log('profile data after change of image===', profileData)

    }

    const handleVendorInputChange = (event) => {
        setVendorData({
            ...vendorData,
            [event.target.name]: event.target.value
        })
        console.log('Vedor data after change of inputs===', profileData)

    }
    console.log('Vedor data after change of inputs===', profileData)


    const handleVendorFileChange = (event) => {
        setVendorData({
            ...vendorData,
            [event.target.name]: event.target.files[0]
        })
        console.log('profile data after change of image===', profileData)

    }



    const handleProfileSubmit = async (e) => {
        e.preventDefault()
        const formdata = new FormData()

        const res = await apiInstance.get(`vendor-settings/${UserData()?.user_id}/`)
        console.log('inside handle submit ===', res.data)
        console.log(res.data.image)

        if (profileData.image && profileData.image !== res.data.image) {
            formdata.append('image', profileData.image)
            console.log('inside if formdata')

            console.log('inside formdata imgae ===', res.data.image)
        }
        formdata.append('full_name', profileData.full_name)
        formdata.append('about', profileData.about)
        formdata.append('phone', profileData.phone)

        try {
            await apiInstance.patch(`vendor-settings/${UserData()?.user_id}/`, formdata,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
            fetchProfileData()
            Swal.fire({
                icon: 'success',
                title: 'Profile updated successfully'
            })

        } catch (error) {
            console.log(error)
        }

    }

    const handleVendorSubmit = async (e) => {
        e.preventDefault()
        const formdata = new FormData()

        const res = await apiInstance.get(`vendor-shop-settings/${UserData()?.user_id}/`)
        console.log('inside handle submit ===', res.data)
        console.log(res.data.image)

        if (vendorData.image && vendorData.image !== res.data.image) {
            formdata.append('image', vendorData.image)
            console.log('inside if formdata')

            console.log('inside formdata imgae ===', res.data.image)
        }
        formdata.append('name', vendorData.name)
        formdata.append('description', vendorData.description)
        formdata.append('email', vendorData.email)
        formdata.append('description', vendorData.description)

        try {
            await apiInstance.patch(`vendor-shop-settings/${UserData()?.user_id}/`, formdata,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
            fetchVendoreData()
            Swal.fire({
                icon: 'success',
                title: 'Profile updated successfully'
            })

        } catch (error) {
            console.log(error)
        }

    }





    return (
        <div className="container-fluid" id="main">
            <div className="row row-offcanvas row-offcanvas-left h-100">
                <Sidebar />

                <div className="col-md-9 col-lg-10 main mt-4">
                    <div className="container">
                        <div className="main-body">
                            <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <button className="nav-link active" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true">
                                        Profile
                                    </button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button className="nav-link" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">
                                        Shop
                                    </button>
                                </li>
                            </ul>
                            <div className="tab-content" id="pills-tabContent">
                                <div
                                    className="tab-pane fade show active"
                                    id="pills-home"
                                    role="tabpanel"
                                    aria-labelledby="pills-home-tab"
                                >
                                    <div className="row gutters-sm shadow p-4 rounded">
                                        <div className="col-md-4 mb-3">
                                            <div className="card h-100">
                                                <div className="card-body">
                                                    <div className="d-flex flex-column align-items-center text-center">
                                                        <img
                                                            src={profileData?.image}
                                                            style={{ width: 160, height: 160, objectFit: "cover" }}
                                                            alt="Admin"
                                                            // className="rounded-circle"
                                                            width={150}

                                                        />
                                                        <div className="mt-3">
                                                            <h4 className="text-dark">{profileData?.full_name}</h4>
                                                            <p className="text-secondary mb-1">{profileData?.about}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-8">
                                            <div className="card mb-3">
                                                <div className="card-body">
                                                    <form
                                                        className="form-group"
                                                        method="POST"
                                                        noValidate=""
                                                        encType="multipart/form-data"
                                                        onSubmit={handleProfileSubmit}
                                                    >
                                                        <div className="row text-dark">
                                                            <div className="col-lg-6 mb-2">
                                                                <label htmlFor="" className="mb-2">
                                                                    Profile Image
                                                                </label>
                                                                <input
                                                                    type="file"
                                                                    className="form-control"
                                                                    onChange={handleFileChange}
                                                                    name='image'
                                                                    id=""
                                                                />
                                                            </div>
                                                            <div className="col-lg-6 mb-2 ">
                                                                <label htmlFor="" className="mb-2">
                                                                    Full Name
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    value={profileData?.full_name}
                                                                    id=""
                                                                    onChange={handleInputChange}
                                                                    name="full_name"
                                                                />
                                                            </div>
                                                            <div className="col-lg-6 mb-2">
                                                                <label htmlFor="" className="mb-2">
                                                                    Email
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    value={profileData?.user?.email}
                                                                    id=""
                                                                    readonly
                                                                    onChange={handleInputChange}
                                                                    name="email"
                                                                />
                                                            </div>
                                                            <div className="col-lg-6 mb-2">
                                                                <label htmlFor="" className="mb-2">
                                                                    Phone Number
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    value={profileData?.user?.phone}
                                                                    onChange={handleInputChange}
                                                                    name="phone"
                                                                />
                                                            </div>
                                                            {/* <div className="col-lg-6 mb-2">
                                                                <label htmlFor="" className="mb-2">
                                                                    Gender
                                                                </label>
                                                                <select name="" id="" className="form-control">
                                                                    <option value="">Male</option>
                                                                    <option value="">Female</option>
                                                                </select>
                                                            </div> */}
                                                            <div className="col-lg-12 mb-2">
                                                                <label htmlFor="" className="mb-2">
                                                                    About Me
                                                                </label>
                                                                <textarea
                                                                    type="text"
                                                                    value={profileData?.about}
                                                                    className="form-control"
                                                                    id=""
                                                                    rows='3'
                                                                    cols=''
                                                                    onChange={handleInputChange}
                                                                    name="about"
                                                                ></textarea>
                                                            </div>
                                                            <div className="col-lg-6 mt-4 mb-3">
                                                                <button className="btn btn-success" type="submit">
                                                                    Update Profile <i className="fas fa-check-circle" />{" "}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </form>
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
                                        <div className="col-md-4 mb-3">
                                            <div className="card h-100">
                                                <div className="card-body">
                                                    <div className="d-flex flex-column align-items-center text-center">
                                                        <img
                                                            src={vendorData?.image}
                                                            style={{ width: 160, height: 160, objectFit: "cover" }}
                                                            alt="Admin"
                                                            className="rounded-circle"
                                                            width={150}
                                                        />
                                                        <div className="mt-3">
                                                            <h4 className="text-dark">{vendorData?.name}</h4>
                                                            <p className="text-secondary mb-1">{vendorData?.description}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-8">
                                            <div className="card mb-3">
                                                <div className="card-body">
                                                    <form
                                                        className="form-group"
                                                        method="POST"
                                                        noValidate=""
                                                        onSubmit={handleVendorSubmit}
                                                        encType="multipart/form-data"
                                                    >
                                                        <div className="row text-dark">
                                                            <div className="col-lg-12 mb-2">
                                                                <label htmlFor="" className="mb-2">
                                                                    Shop Image
                                                                </label>
                                                                <input
                                                                    type="file"
                                                                    className="form-control"
                                                                    name="image"
                                                                    onChange={handleVendorFileChange}

                                                                    id=""
                                                                />
                                                            </div>
                                                            <div className="col-lg-12 mb-2 ">
                                                                <label htmlFor="" className="mb-2">
                                                                    Shop name
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    value={vendorData?.name}
                                                                    name='name'
                                                                    onChange={handleVendorInputChange}
                                                                    id=""
                                                                />
                                                            </div>
                                                            <div className="col-lg-6 mb-2">
                                                                <label htmlFor="" className="mb-2">
                                                                    Email
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    value={vendorData?.email}
                                                                    name="email"
                                                                    onChange={handleVendorInputChange}
                                                                    id=""
                                                                />
                                                            </div>
                                                            <div className="col-lg-6 mb-2">
                                                                <label htmlFor="" className="mb-2">
                                                                    Phone Number
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    value={vendorData?.mobile}
                                                                    name="mobile"
                                                                    onChange={handleVendorInputChange}
                                                                    id=""
                                                                />
                                                            </div>
                                                            <div className="col-lg-12 mb-2">
                                                                <label htmlFor="" className="mb-2">
                                                                    About shop
                                                                </label>
                                                                <textarea
                                                                    type="text"
                                                                    value={vendorData?.description}
                                                                    className="form-control"
                                                                    id=""
                                                                    rows='2'
                                                                    name="description"
                                                                    onChange={handleVendorInputChange}
                                                                ></textarea>
                                                            </div>
                                                            <div className="col-lg-12 mt-8 mb-3 d-flex">
                                                                <button className="btn btn-success "
                                                                    type="submit"
                                                                    onChange={handleVendorFileChange}>
                                                                    Update Shop <i className="fas fa-check-circle" />{" "}
                                                                </button>
                                                                <Link className="btn btn-primary  ms-2" to={`/vendor/${vendorData?.slug}/`}>
                                                                    View Shop <i className="fas fa-shop" />{" "}
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VendorSettings
