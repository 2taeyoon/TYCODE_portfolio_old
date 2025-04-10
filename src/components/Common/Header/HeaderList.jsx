import React from 'react'
import { Link } from 'react-router-dom'

const HeaderList = ({animateCursor, handleCursorEnter, handleCursorLeave, headerClass, hamBtnHandler}) => {
    return (
            ['ABOUT', 'PROJECT', 'CONTACT', 'BLOG'].map((text, index) => (
                <li key={index}>
                    {index === 3 ? (
                        <a href='https://www.2taeyoon.com/' target='_blank' rel='noopener noreferrer' onClick={hamBtnHandler} className={headerClass} onMouseMove={animateCursor} onMouseEnter={handleCursorEnter} onMouseLeave={handleCursorLeave}>
                            <span className='animate_cursor'>{text}</span>
                        </a>
                    ) : (
                        <Link to={index === 0 ? '/' : (index === 1 ? '/project' : '/contact')} onClick={hamBtnHandler} className={headerClass} onMouseMove={animateCursor} onMouseEnter={handleCursorEnter} onMouseLeave={handleCursorLeave}>
                            <span className='animate_cursor'>{text}</span>
                        </Link>
                    )}
                </li>
            ))
    )
}

export default HeaderList