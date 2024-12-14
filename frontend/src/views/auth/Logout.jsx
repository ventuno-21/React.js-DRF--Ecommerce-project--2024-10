import { useEffect } from 'react'
import { logout } from '../../utils/auth'
import { Link } from 'react-router-dom'

const Logout = () => {
    useEffect(() => {
        logout()
    }, [])
    return (
        <>
            <section>
                <main className="" style={{ marginBottom: 100, marginTop: 50 }}>
                    <div className="container">
                        {/* Section: Login form */}
                        <section className="">
                            <div className="row d-flex justify-content-center">
                                <div className="col-xl-5 col-md-8">
                                    <div className="card rounded-5">

                                                    <h3> You logged out successfully</h3>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </main>
            </section>
        </>
    )
}

export default Logout
