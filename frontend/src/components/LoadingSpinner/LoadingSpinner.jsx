import React from 'react'

const LoadingSpinner = ({text}) => {
  return (
    <div className="flex flex-col items-center">
      <div style={{animation: "spin 2s linear infinite"}} className="border-[4px] border-solid border-violet-300 border-t-[4px] border-t-primary rounded-full w-[50px] h-[50px]"></div>
      <p className='mt-4'>{text ? text : "Loading..."}</p>
    </div>
  );
}

export default LoadingSpinner