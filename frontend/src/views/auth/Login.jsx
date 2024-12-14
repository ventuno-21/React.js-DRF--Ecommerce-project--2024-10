import React, { useState, useEffect } from 'react'
import { login } from '../../utils/auth'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../../store/auth'

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLaoding, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const isLoggedin = useAuthStore((state) => state.isLoggedin)

  console.log(email)

  useEffect(() => {
    if (isLoggedin) {
      navigate('/')
    }
  })

  const resetForm = () => {
    setUsername("")
    setPassword("")
  }

  const handleLogin = (e) => {
    e.preventDefault()
    setIsLoading(true)

    const { error } = login(email, password)
    if (error) {
      alert(error)
    } else {
      navigate("/")
      resetForm()
    }
    setIsLoading(false)
  }

  return (
    <section>
      <main className="" style={{ marginBottom: 100, marginTop: 50 }}>
        <div className="container">
          {/* Section: Login form */}
          <section className="">
            <div className="row d-flex justify-content-center">
              <div className="col-xl-5 col-md-8">
                <div className="card rounded-5">
                  <div className="card-body p-4">
                    <h3 className="text-center">Login</h3>
                    <br />

                    <div className="tab-content">
                      <div
                        className="tab-pane fade show active"
                        id="pills-login"
                        role="tabpanel"
                        aria-labelledby="tab-login"
                      >
                        <form onSubmit={(e)=>handleLogin(e)}>
                          {/* Email input */}
                          <div className="form-outline mb-4">
                            <label className="form-label" htmlFor="Full Name">
                              Email Address
                            </label>
                            <input
                              type="text"
                              id="username"
                              name="username"
                              className="form-control"
                              onChange={(e)=>setEmail(e.target.value)}
                            />
                          </div>

                          <div className="form-outline mb-4">
                            <label className="form-label" htmlFor="loginPassword">
                              Password
                            </label>
                            <input
                              type="password"
                              id="password"
                              name="password"
                              className="form-control"
                              onChange={(e)=>setPassword(e.target.value)}
                            />
                          </div>
                          {isLaoding===true                  
                          ? <button className='btn btn-primary w-100' type="submit" disabled={"isLoading"}>
                            <span className="mr-2">processing</span>
                            <i className="fas fa-spinner fa-spin" />
                          </button>

                          :<button className='btn btn-primary w-100' type="submit" >
                            <span className="mr-2">sign in </span>
                            <i className="fas fa-sign-in-alt" />
                          </button>
                          }

                          <div className="text-center">
                            <p className='mt-4'>
                              Don't have an account? <Link to="/register">Register</Link>
                            </p>
                            <p className='mt-0'>
                              <Link to="/forgot-password/" className='text-danger'>Forgot Password?</Link>
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
    </section>

  )
}

export default Login
