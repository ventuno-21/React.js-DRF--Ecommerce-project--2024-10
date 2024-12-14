import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import apiInstance from '../../utils/axios'
import Swal from 'sweetalert2'
import UserData from '../plugin/UserDta'
import { Form } from 'react-router-dom'


function Settings() {
    const [profile, setProfile] = useState({})

    const fetchProfileData = () => {
        apiInstance.get(`user/profile/${UserData()?.user_id}/`)
            .then((res) => {
                console.log(res.data)
                setProfile(res.data)
            })
    }

    useEffect(() => {
        fetchProfileData()
    }, [])

    const handleInputChange = (event) => {
        setProfile({
            ...profile,
            [event.target.name]: event.target.value
        })
        console.log(profile.full_name)
    }

    const handleImageChange = (event) => {
        setProfile({
            ...profile,
            [event.target.name]: event.target.files[0]
        })
        // console.log(profile.image)
    }
    console.log(profile.image)


    const handleFormSubmit = async (e) => {
        e.preventDefault()
        const formdata = new FormData()

        const res = await apiInstance.get(`user/profile/${UserData()?.user_id}/`)
        if (profile.image && profile.image !== res.data.image) {
            console.log('inside if formdata')
            formdata.append('image', profile.image)
        }
        formdata.append('full_name', profile.full_name)
        formdata.append('phone', profile.phone)
        formdata.append('country', profile.country)
        formdata.append('city', profile.city)
        formdata.append('address', profile.address)
        formdata.append('state', profile.state)

        try {
            await apiInstance.patch(`user/profile/${UserData()?.user_id}/`, formdata,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            )
            // window.location.reload
            Swal.fire({
                icon:'success',
                title:'Profile updated successfully'
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
                            <div className="col-lg-9 mt-1 shadow">
                                <section className="">
                                    <main className="mb-5" style={{}}>
                                        <div className="container px-4">
                                            <section className="">
                                                <h3 className="mb-3">
                                                    {" "}
                                                    <i className="fas fa-gear fa-spin" /> Settings{" "}
                                                </h3>
                                                <form encType="multipart/form-data" onSubmit={handleFormSubmit}>

                                                    <div className="row">
                                                        <div className="col-lg-12">
                                                            <label
                                                                htmlFor="exampleInputEmail1"
                                                                className="form-label"
                                                            >
                                                                Profile image                                                            </label>
                                                            <input
                                                                type="file"
                                                                className="form-control mb-3"
                                                                aria-describedby="emailHelp"
                                                                onChange={handleImageChange}
                                                                name='image'
                                                            />
                                                        </div>
                                                        <div className="col-lg-12">
                                                            <label
                                                                htmlFor="exampleInputEmail1"
                                                                className="form-label"
                                                            >
                                                                Full Name
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                aria-describedby="emailHelp"
                                                                value={profile.full_name}
                                                                onChange={handleInputChange}
                                                                name='full_name'
                                                            />
                                                        </div>
                                                        <div className="col-lg-6 mt-3">
                                                            <label
                                                                htmlFor="exampleInputEmail1"
                                                                className="form-label"
                                                            >
                                                                Email address
                                                            </label>
                                                            <input
                                                                type="email"
                                                                className="form-control"
                                                                aria-describedby="emailHelp"
                                                                value={profile?.user?.email}
                                                                readOnly
                                                            />
                                                        </div>
                                                        <div className="col-lg-6 mt-3">
                                                            <label
                                                                htmlFor="exampleInputEmail1"
                                                                className="form-label"
                                                            >
                                                                Mobile
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                aria-describedby="emailHelp"
                                                                value={profile?.user?.phone}
                                                                onChange={handleInputChange}
                                                                name='phone'
                                                            />
                                                        </div>
                                                    </div>
                                                    <br />
                                                    <div className="row">
                                                        <div className="col-lg-6">
                                                            <label
                                                                htmlFor="exampleInputEmail1"
                                                                className="form-label"
                                                            >
                                                                Address
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                aria-describedby="emailHelp"
                                                                value={profile?.address}
                                                                nChange={handleInputChange}
                                                                name='address'
                                                            />
                                                        </div>
                                                        <div className="col-lg-6 mt-3">
                                                            <label
                                                                htmlFor="exampleInputEmail1"
                                                                className="form-label"
                                                            >
                                                                City
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                aria-describedby="emailHelp"
                                                                value={profile?.city}
                                                                nChange={handleInputChange}
                                                                name='city'

                                                            />
                                                        </div>
                                                        <div className="col-lg-6 mt-3">
                                                            <label
                                                                htmlFor="exampleInputEmail1"
                                                                className="form-label"
                                                            >
                                                                State
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                aria-describedby="emailHelp"
                                                                value={profile?.state}
                                                                nChange={handleInputChange}
                                                                name='state'

                                                            />
                                                        </div>
                                                        <div className="col-lg-6 mt-3">
                                                            <label
                                                                htmlFor="exampleInputEmail1"
                                                                className="form-label"
                                                            >
                                                                Country
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                aria-describedby="emailHelp"
                                                                value={profile?.country}
                                                                nChange={handleInputChange}
                                                                name='country'
                                                            />
                                                        </div>
                                                    </div>
                                                    <button type="submit" className="btn btn-primary mt-5">
                                                        Save Changes
                                                    </button>
                                                </form>
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

export default Settings
