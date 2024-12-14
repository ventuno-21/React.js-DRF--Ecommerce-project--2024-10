import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import apiInstance from '../../utils/axios'
import UserData from '../plugin/UserDta'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import { preview } from 'vite'

function AddProduct() {

    //     const userData = UserData()

    //     const [product, setProduct] = useState({
    //         title: '',
    //         image: null,
    //         dscription: '',
    //         category: '',
    //         price: '',
    //         old_price: '',
    //         shipping_amount: '',
    //         tax_fee: '',
    //         stock_fee: '',
    //         vendor: userData?.vendor_id,
    //     })
    //     const [specifications, setSpecifications] = useState({
    //         title: '',
    //         content: ''
    //     })
    //     const [colors, setColors] = useState([{
    //         name: '',
    //         color_code: ''
    //     }])
    //     const [sizes, setSizes] = useState([{
    //         name: '',
    //         price: ''
    //     }])
    //     const [gallery, setGalley] = useState([{
    //         image: ''
    //     }])
    //     const [category, setCategory] = useState([])


    //     // const handleAddMore = (setStateFunction) => {
    //     //     setStateFunction((prevState) => [...prevState, {}])
    //     // }

    //     // const handleRemove = (index, setStateFunction) => {
    //     //     setStateFunction((prevState) => {
    //     //         const newState = [...prevState]
    //     //         newState.splice(index, 1)
    //     //         return newState
    //     //     })
    //     // }

    //     // const handleInputChange = (index, field, value, setStateFunction) => {
    //     //     setStateFunction((prevState) => {
    //     //         const newState = [...prevState]
    //     //         newState[index][field] = value
    //     //         return newState
    //     //     })
    //     // }

    //     // const handleImageChnage = (index, event, setStateFunction) => {
    //     //     const file = event.target.files[0]

    //     //     if (file) {
    //     //         const reader = new FileReader()
    //     //         reader.onloadend = () => {
    //     //             setStateFunction((prevState) => {
    //     //                 const newState = [...prevState]
    //     //                 newState[index].image = { file, preview: reader.result }
    //     //                 return newState
    //     //             })
    //     //         }

    //     //         reader.readAsDataURL(file)
    //     //     } else {
    //     //         setStateFunction(() => {
    //     //             const newState = [...prevState]
    //     //             newState[index].image = null
    //     //             newState[index].preview = null
    //     //             return newState
    //     //         })
    //     //     }

    //     // }

    //     // const handleProductInputChange = (event) => {
    //     //     setProduct({
    //     //         ...product,
    //     //         [event.target.name]: event.target.value
    //     //     })
    //     // }

    //     // const handleProductFileChange = (event) => {
    //     //     const file = event.target.files[0]
    //     //     if (file) {
    //     //         const reader = new FileReader()

    //     //         reader.onloadend = () => {
    //     //             setProduct({
    //     //                 ...product,
    //     //                 image: {
    //     //                     file: event.target.files[0],
    //     //                     preview: reader.result
    //     //                 }
    //     //             })
    //     //         }
    //     //         reader.readAsDataURL(file)
    //     //     }
    //     // }



    return (
        <div> Add product</div>
    )
}

export default AddProduct
