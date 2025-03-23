// Correct syntax
import { useState, useEffect } from 'react'
import ResumePreview from '../components/ResumeDev/ResumePreview'
import resumeData from '../components/ResumeDev/resumeData.json'
import ChatInterface from '../components/ResumeDev/ChatInterface'
import Topbar from '@/components/Topbar'

function App({ resumeType = 'developer' }) {
  const [currentResumeData, setCurrentResumeData] = useState(resumeData);

  const handleResumeData = (data) => {
    setCurrentResumeData(data);
  };

  // Get the title based on resume type
  const getResumeTitle = () => {
    switch(resumeType) {
      case 'developer':
        return 'Developer Resume Builder';
      case 'researcher':
        return 'Researcher Resume Builder';
      case 'balanced':
        return 'Balanced Resume Builder';
      default:
        return 'Resume Builder';
    }
  };

  return (
    <>
    <Topbar/>
<<<<<<< HEAD
    <div className="flex flex-col bg-gray-950 min-h-screen">
      <div className="px-6 py-4">
        <h1 className="text-2xl font-bold text-white">{getResumeTitle()}</h1>
        <p className="text-gray-400">Tailored for {resumeType} profiles</p>
      </div>
      
      <div className="flex flex-1 gap-6 p-6">
=======
    <div className="flex h-screen bg-black p-6">
      <div className="flex gap-6 w-full h-full">
>>>>>>> upstream/main
        <div className="w-1/3">
          <ChatInterface onResumeData={handleResumeData} resumeType={resumeType} />
        </div>
        <div className="w-2/3">
          <ResumePreview data={currentResumeData} resumeType={resumeType} />
        </div>
      </div>
    </div>
    </>
  )
}

// Add this default export
export default App