import { useMemo, useState } from "react"

type LoadingDotsProps = {
    size: string
    color: string
    className?: string
}

export const LoadingDots = ({ size, color, className = '' }: LoadingDotsProps) => {

    const classes = `rounded-full animate-bounce` // w-1.5 h-1.5 bg-white/85
    const style = { width: size, height: size, backgroundColor: color }

    return (
        <div className={`flex space-x-1 justify-center items-center ${className}`}>
            {/* <span className='sr-only'>Loading...</span> */}
            <div className={`${classes} [animation-delay:-0.3s]`} style={style}></div>
            <div className={`${classes} [animation-delay:-0.15s]`} style={style}></div>
            <div className={`${classes}`} style={style}></div>
        </div>
    )
}