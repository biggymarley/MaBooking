import React, { useState } from 'react'

type LoadingType = boolean;

export default function useLoading() {
    const [loading, setLoading] = useState<LoadingType>(false)


    return { loading, setLoading }
}