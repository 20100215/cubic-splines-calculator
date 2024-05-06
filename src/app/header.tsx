import React from 'react'

function Header() {
  return (
    <nav className="relative flex w-full flex-wrap items-center justify-between bg-slate-950 py-2 shadow-dark-mild lg:py-4">
        <div className="flex w-full flex-wrap items-center px-4">
            <div className="ms-2">
                <span className="text-xl font-medium text-white">Group 1 Gwapo - Cubic Splines</span>
            </div>
            <a href='https://czarivan.notion.site/Cubic-Splines-9f7a5525d527499fa06e20ae0b091afd'
              className='inline-block p-2 bg-yellow-200 rounded-lg ml-7'
              target='_blank'>
              Guide
            </a>
        </div>
    </nav>
  )
}

export default Header
