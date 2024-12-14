import { useState, useEffect } from "react";


import React from 'react'

function GetCurrentAddress() {
    const [add, setAdd] = useState('')

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(pos => {
            const  latitude = pos.coords.latitude
            const longitude = pos.coords.longitude
            console.log('latitude:', latitude)
            const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            console.log(url)
            fetch(url)
                .then(res => res.json())
                .then(data => setAdd(data.address))
        })
        }, [])

        return add
}

export default GetCurrentAddress
