import React from 'react'
import CounterUp from './CounterUp'

export default function CounterNumber({ count }) {
    return (
        <>
            <CounterUp count={count} time={1} />
        </>
    )
}
