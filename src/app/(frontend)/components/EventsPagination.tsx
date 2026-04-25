import React from 'react'

const EventsPagination = () => {
    return (
        <div className = "flex justify-between w-[80%] my-4">
            <div className = "flex gap-6 underline">
                <button>Previous</button>
                <button>Next</button>
            </div>
            <div>
                1 of 3
            </div>
        </div>
    )
}

export default EventsPagination