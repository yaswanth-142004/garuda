import React from 'react';
import { Link } from 'react-router-dom';

const ResumeCards = ({ title, description, imageSrc, type }) => {
  return (
    <div className="flex flex-row bg-gray-800 rounded-lg shadow-xl overflow-hidden mb-6 border border-gray-700 hover:border-blue-500 transition-all duration-300 cursor-pointer">
      {/* Left side: Description */}
      <div className="w-2/3 p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
          <p className="text-gray-300 mb-4">{description}</p>
          
          <div className="mt-4">
            <span className="inline-block bg-blue-600 rounded-full px-3 py-1 text-sm font-semibold text-white mr-2">
              {type}
            </span>
          </div>
        </div>
        
        <Link 
          to={`/resume/${type.toLowerCase()}`} 
          className="mt-4 inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors duration-200"
        >
          Use This Template
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </Link>
      </div>
      
      {/* Right side: Image */}
      <div className="w-1/3 bg-gray-700">
        <img 
          src={imageSrc} 
          alt={`${title} Resume Template`} 
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default ResumeCards;
