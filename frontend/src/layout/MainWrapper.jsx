import { useEffect, useState } from "react";
import { setUser } from '../utils/auth'

import React from 'react'

const MainWrapper = (childern) => {
    const [loading, setLoading] = useState(true)
    useEffect(async () => {
        const handler = async () => {
            setLoading(true)
            await setUser()
            setLoading(false)
        }
        handler()
    }, [])


    return (
        <>
            {loading ? null : childern}
        </>
    )
}

export default MainWrapper