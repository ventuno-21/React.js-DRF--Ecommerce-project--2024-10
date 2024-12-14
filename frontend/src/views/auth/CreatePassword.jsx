import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import apiInstance from '../../utils/axios'

function CreatePassword() {
    const [password, setPassword] = useState('')
    const [confrimPassword, setConfirmPassword] = useState('')
    const [isLaoding, setIsLoading] = useState(false)
    const [searchParam] = useSearchParams()
    const otp = searchParam.get('otp')
    const uidb64 = searchParam.get('uidb64')
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        setIsLoading(true)
        e.preventDefault()
        if (password !== confrimPassword) {
            alert("password does not match")
            setIsLoading(false)
        } else {
            const formdata = new FormData
            formdata.append('password', password)
            formdata.append('otp', otp)
            formdata.append('uidb64', uidb64)

            try {
                await apiInstance.post(`user/password-change/`, formdata)
                console.log("is changes")
                alert("password change successfully ")
                navigate('/login')
            } catch (error) {
                alert("An error occureed ")
                setIsLoading(false)
            }
        }

    }

    return (
        <>
            <main className="" style={{ marginBottom: 100, marginTop: 50 }}>
                <div className="container">
                    {/* Section: Login form */}
                    <section className="">
                        <div className="row d-flex justify-content-center">
                            <div className="col-xl-5 col-md-8">
                                <div className="card rounded-5">
                                    <div className="card-body p-4">
                                        <h3 className="text-center">Register Account</h3>
                                        <br />

                                        <div className="tab-content">
                                            <div className="tab-pane fade show active" id="pills-login" role="tabpanel" aria-labelledby="tab-login">
                                                <form  onSubmit={handleSubmit} >
                                                       
                                                    <div className="form-outline mb-4">
                                                        <label className="form-label" htmlFor="loginPassword">
                                                            Password
                                                        </label>
                                                        <input
                                                            type="password"
                                                            id="password"
                                                            placeholder="Password"
                                                            className="form-control"
                                                            onChange={(e) => setPassword(e.target.value)}
                                                        />
                                                    </div>
                                                    {/* Password input */}
                                                    <div className="form-outline mb-4">
                                                        <label className="form-label" htmlFor="loginPassword">
                                                            Confirm Password
                                                        </label>
                                                        <input
                                                            type="password"
                                                            id="confirm-password"
                                                            placeholder="Confirm Password"
                                                            required
                                                            className="form-control"
                                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                                        />
                                                    </div>
                                                    {isLaoding === true
                                                        ? <button className='btn btn-primary w-100' type="submit" >
                                                            <span className="mr-2">processing... </span>
                                                            <i className="fas fa-spinner fa-spin" />
                                                        </button>

                                                        : <button className='btn btn-primary w-100' type="submit" >
                                                            <span className="mr-2">Submit </span>
                                                            <i className="fas fa-user-plus" />
                                                        </button>
                                                    }

                                                    <div className="text-center">
                                                        <p className='mt-4'>
                                                            Already have an account? <Link to="/login/">Login</Link>
                                                        </p>
                                                    </div>
                                                </form>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

        </>
    )
}

export default CreatePassword
