import React from 'react'
import Button from '../ui/Button'
export default function Header({ joinUs, pathname }) {

    const getPageTitle = (pathname) => ({
        // Admin paths
        '/admin': 'Admin Dashboard',
        '/admin/courses': 'Manage Courses',
        '/admin/courses/add': 'New Course',
        '/admin/settings': 'Settings',
        '/admin/profile': 'Profile',
        // User paths
        '/': 'Dashboard',
        '/dashboard/courses': 'Courses',
        '/dashboard/enrollements': 'Your Enrollements',
        '/dashboard/settings': 'Settings',
        '/dashboard/profile': 'Profile'
    }[pathname] || 'Dashboard')
    const title = getPageTitle(pathname)

    return (
        <div className='flex justify-between items-center p-4 bg-white rounded-lg'>
            <h1 className='font-bold uppercase text-2xl'>{title}</h1>
        </div>
    )
}

