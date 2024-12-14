import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import apiInstance from '../../utils/axios'
import UserData from '../plugin/UserDta'
import { Line, Bar } from 'react-chartjs-2'
import { Chart } from 'chart.js/auto'

function Earning() {
    const [earningStats, setEarningStats] = useState({})
    const [earningStatsTracker, setEarningStatsTracker] = useState()
    const [earningChart, setEarningChart] = useState([])

    useEffect(() => {
        apiInstance.get(`vendor-earning/${UserData()?.vendor_id}`)
            .then((res) => {
                console.log(res.data[0])
                setEarningStats(res.data[0])

            })
        apiInstance.get(`vendor-monthly-earning/${UserData()?.vendor_id}`)
            .then((res) => {
                console.log(res.data)
                setEarningStatsTracker(res.data)
                setEarningChart(res.data)

            })
    }, [])

    const earning_months = earningChart?.map(item => item.month)
    const earning_sales_count = earningChart?.map(item => item.total_earning)

    const revenue_data = {
        labels: earning_months,
        datasets: [
            {
                label: 'Total sales revenue',
                data: earning_sales_count,
                fill: true,
                backgroundColor: 'green',
                borderColor: 'green'
            }
        ]
    }



    return (
        <div className="container-fluid" id="main">
            <div className="row row-offcanvas row-offcanvas-left h-100">
                <Sidebar />
                <div className="col-md-9 col-lg-10 main mt-4">
                    <div className="row mb-3">
                        <div className="col-xl-6 col-lg-6 mb-2">
                            <div className="card card-inverse card-success">
                                <div className="card-block bg-success p-3">
                                    <div className="rotate">
                                        <i className="bi bi-currency-dollar fa-5x" />
                                    </div>
                                    <h6 className="text-uppercase">Total Sales</h6>
                                    <h1 className="display-1">${earningStats?.total_revenue}</h1>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-6 col-lg-6 mb-2">
                            <div className="card card-inverse card-danger">
                                <div className="card-block bg-danger p-3">
                                    <div className="rotate">
                                        <i className="bi bi-currency-dollar fa-5x" />
                                    </div>
                                    <h6 className="text-uppercase">Monthly Earning</h6>
                                    <h1 className="display-1">${earningStats.monthly_revenue}</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div className="row  container">
                        <div className="col-lg-12">
                            <h4 className="mt-3 mb-4">Revenue Tracker</h4>
                            <table className="table">
                                <thead className="table-dark">
                                    <tr>
                                        <th scope="col">Month</th>
                                        <th scope="col">Orders</th>
                                        <th scope="col">Revenue</th>
                                        <th scope="col">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {earningStatsTracker?.map((e, index) => (
                                        <tr key={index}>
                                            {e.month === 1 && <th scope="row">January</th>}
                                            {e.month === 2 && <th scope="row">February</th>}
                                            {e.month === 3 && <th scope="row">March</th>}
                                            {e.month === 4 && <th scope="row">April</th>}
                                            {e.month === 5 && <th scope="row">May</th>}
                                            {e.month === 6 && <th scope="row">June</th>}
                                            {e.month === 7 && <th scope="row">July</th>}
                                            {e.month === 8 && <th scope="row">August</th>}
                                            {e.month === 9 && <th scope="row">September</th>}
                                            {e.month === 10 && <th scope="row">October</th>}
                                            {e.month === 11 && <th scope="row">November</th>}
                                            {e.month === 12 && <th scope="row">December</th>}

                                            <td>{e.sales_count}</td>
                                            <td>${e.total_earning}</td>
                                            <td>
                                                <a href="" className="btn btn-primary mb-1">
                                                    <i className="fas fa-eye" />
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="container">
                            <div className="row ">
                                <div className="col">
                                    <h4 className="mt-4">Revenue Analytics</h4>
                                    <Bar data={revenue_data} style={{height:300}} />
                                </div>
                            </div>
                            <div className="row my-2">
                                <div className="col-md-12 py-1">
                                    <div className="card">
                                        <div className="card-body">
                                            <canvas id="line-chart" />
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

export default Earning
