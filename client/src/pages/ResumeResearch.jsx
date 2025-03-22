// Correct syntax
import { useState, useEffect } from 'react'
import ResumePreview from '../components/ResumeResearch/ResumePreview'
import resumeData from '../components/ResumeResearch/resumeData.json'
import ChatInterface from '../components/ResumeResearch/ChatInterface'
import Topbar from '@/components/Topbar'

function App() {
  const [currentResumeData, setCurrentResumeData] = useState(resumeData);

  const handleResumeData = (data) => {
    setCurrentResumeData(data);
  };

  return (
    <>
    <Topbar/>
    <div className="flex h-screen bg-black p-6">
      <div className="flex gap-6 w-full h-full ">
        <div className="w-1/3">
          <ChatInterface onResumeData={handleResumeData} />
        </div>
        <div className="w-2/3">
          <ResumePreview data={currentResumeData} />
        </div>
      </div>
    </div>
    </>
  )
}

// Add this default export
export default App