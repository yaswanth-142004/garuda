import React from 'react'
import ResumeCards from '@/components/ChooseResume/ResumeCards'
import Topbar from '@/components/Topbar'

const ChooseResume = () => {
  return (
    <>
    <Topbar/>
    <div className='bg-black h-screen'>
    <ResumeCards/>
    <ResumeCards/>
    <ResumeCards/>
    </div>
    </>
  )
}

export default ChooseResume
