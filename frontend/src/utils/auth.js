import { useAuthStore } from '../store/auth';
import axios from './axios';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2'


const Toast = Swal.mixin({
    toast:true, 
    position:'top',
    showConfirmButton:false,
    timer:3000,
    timerProgressBar: true
})



export const login = async (email, password) => {
    try {
        // Making a POST request to obtain user tokens
        const { data, status } = await axios.post("user/token/", {
            email,
            password
        })
        if (status == 200) {
            //If status_code=200, you receive access & refresh in data from serverside
            setAuthUser(data.access, data.refresh)
            Toast.fire({
                icon:"success",
                title:"You login successfully"
            })
        }
        return { data, error: null };
    } catch (error) {
        const data = null;
        const RegisterError = error.response?.data || 'Something went wrong'
        console.error('Error fetching data:', error);
        return {
            data: data,
            error: RegisterError
        }
    }
}


export const register = async (full_name, email, phone, password, password2) => {

    try {
        const { data } = await axios.post('user/register/', {
            full_name, email, phone, password, password2
        })
        await login(email, password)
        Toast.fire({
            icon:"success",
            title:"You signed up successfully"
        })
        return { data, error: null }
    } catch (error) {
        const data = null;
        const RegisterError = error.response?.data || 'Something went wrong'
        console.error('Error fetching data:', error);
        return {
            data: data,
            error: RegisterError
        }
    }
}


export const logout = () => {
    Cookies.remove("access_token")
    Cookies.remove("refresh_token")
    useAuthStore.getState().setUser(null)

    Toast.fire({
        icon: 'success',
        title: 'You have been logged out.'
    });
}

export const setUser = async () => {
    const accessToken = Cookies.get('access_token')
    const refreshToken = Cookies.get('refresh_token')
    if (!accessToken || !refreshToken) {
        return;
    }
    if (isAccessTokenExpired(accessToken)) {
        const response = await getRefreshToken(refreshToken)
        setAuthUser(response.access, response.refresh)
    } else {
        setAuthUser(accessToken, refreshToken)
    }
}

export const setAuthUser = (access_token, refresh_token) => {
    Cookies.set('access_token', access_token, {
        // expires in 1 day
        expires: 1,
        secure: true
    })
    Cookies.set('refresh_token', refresh_token, {
        // expires in 7 days
        expires: 7,
        secure: true
    })
    const user = jwtDecode(access_token) ?? null
    console.log("user form setAuthUser decoded jwt:", user)


    if (user) {
        console.log("user form setAuthUser:", user)
        useAuthStore.getState().setUser(user)
    }
    useAuthStore.getState().setLoading(false)
}

export const getRefreshToken = async () => {
    const refresh_token = Cookies.get("refresh_token")
    const response = await axios.post('user/token/refresh/', {
        refresh: refresh_token
    })
    return response.data
}

export const isAccessTokenExpired = (accessToken) => {
    try {
        const decodedToken = jwtDecode(accessToken)
        return decodedToken.exp < Date.now() / 1000
    }
    catch (error) {
        return true
    }
}