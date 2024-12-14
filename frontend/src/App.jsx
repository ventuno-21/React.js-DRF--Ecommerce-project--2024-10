import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './views/auth/Login'
import Logout from './views/auth/Logout'
import Register from './views/auth/Register'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
// import Dashboard from './views/auth/Dashboard'
import ForgotPassword from './views/auth/ForgotPassword'
import CreatePassword from './views/auth/CreatePassword'
import StoreFooter from './views/base/StoreFooter'
import StoreHeader from './views/base/StoreHeader'
import MainWrapper from './layout/MainWrapper'
import Products from './views/store/Products'
import ProductDetail from './views/store/ProductDetail'
import Cart from './views/store/Cart'
import Checkout from './views/store/Checkout'
import PaymentSuccess from './views/store/PaymentSuccess'
import Search from './views/store/Search'
import { CartContext } from './views/plugin/Context'
import CartID from './views/plugin/CartID'
import UserData from './views/plugin/UserDta'
import apiInstance from './utils/axios'
import Account from './views/customer/Account'
import Orders from './views/customer/orders'
import Allorders from './views/customer/AllOrders'
import OrderDetail from './views/customer/OrderDetail'
import Wishlist from './views/customer/Wishlist'
import Notification from './views/customer/Notification'
import Settings from './views/customer/Settings'
import Invoice from './views/customer/Invoice'
import Dashboard from './views/vendor/Dashboard'
import Product from './views/vendor/Product'
import VendorOrders from './views/vendor/Orders'
import VendorOrderDetail from './views/vendor/OrderDetails'
import Earning from './views/vendor/Earning'
import Reviews from './views/vendor/Reviews'
import ReviwDetail from './views/vendor/ReviwDetail'
// import Coupon from './views/vendor/Coupon'
import CouponMain from './views/vendor/Coupon'
import EditCoupon from './views/vendor/EditCoupon'
import VendorNotification from './views/vendor/Notification'
import VendorSettings from './views/vendor/VendorSettings'
import Shop from './views/vendor/Shop'
import AddProduct2 from './views/vendor/AddProduct2'
import UpdateProduct from './views/vendor/UpdateProduct'


function App() {
  const [count, setCount] = useState(0)
  const [cartCount, setCartCount] = useState()
  const cart_id = CartID()
  const userData = UserData()

  useEffect(() => {

    const url = userData?.user_id ? `cart-list/${cart_id}/${userData?.user_id}/` : `cart-list/${cart_id}/`
    apiInstance.get(url)
      .then((res) => {
        // console.log('app.jsx, cart details = ', res.data)
        setCartCount(res.data.length)
      })

  }, [cartCount])

  return (
    <>
      <CartContext.Provider value={[cartCount, setCartCount]}>

        <BrowserRouter>
          <StoreHeader />
          {/* <MainWrapper> */}
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/logout' element={<Logout />} />
            <Route path='/register' element={<Register />} />
            {/* <Route path='/dashboard' element={<Dashboard />} /> */}
            <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route path='/create-new-password' element={<CreatePassword />} />

            {/* Store components */}
            <Route path='/' element={<Products />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/checkout/:order_oid/' element={<Checkout />} />
            <Route path='/payment-success/:order_oid/' element={<PaymentSuccess />} />
            <Route path='/detail/:slug' element={<ProductDetail />} />
            <Route path='/search/' element={<Search />} />

            {/* Customer components */}
            <Route path='/customer/orders/' element={<Allorders />} />
            <Route path='/customer/orders/:order_oid/' element={<OrderDetail />} />
            <Route path='/customer/account/' element={<Account />} />
            <Route path='/customer/wishlist/' element={<Wishlist />} />
            <Route path='/customer/notifications/' element={<Notification />} />
            <Route path='/customer/settings/' element={<Settings />} />
            <Route path='/customer/invoice/:order_oid/' element={<Invoice />} />

            {/* Vendor components */}
            <Route path='/vendor/dashboard/' element={<Dashboard />} />
            <Route path='/vendor/products/' element={<Product />} />
            <Route path='/vendor/orders/' element={<VendorOrders />} />
            <Route path='/vendor/orders/:order_oid/' element={<VendorOrderDetail />} />
            <Route path='/vendor/earning/' element={<Earning />} />
            <Route path='/vendor/reviews/' element={<Reviews />} />
            <Route path='/vendor/reviews/:review_id' element={<ReviwDetail />} />
            <Route path='/vendor/coupon/' element={<CouponMain />} />
            <Route path='/vendor/coupon/:coupon_id' element={<EditCoupon />} />
            <Route path='/vendor/notifications/' element={<VendorNotification />} />
            <Route path='/vendor/settings/' element={<VendorSettings />} />
            <Route path='/vendor/:slug/' element={<Shop />} />
            <Route path='/vendor/add-product/' element={<AddProduct2 />} />
            <Route path='/vendor/product/update/:pid/' element={<UpdateProduct />} />



          </Routes>
          <StoreFooter />
          {/* </MainWrapper> */}
        </BrowserRouter>
      </CartContext.Provider>
    </>
  )
}

export default App
