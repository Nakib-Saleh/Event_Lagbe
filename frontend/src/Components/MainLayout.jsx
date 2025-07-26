import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';
import Footer from './Footer';

const MainLayout = () => {
    return (
        <div className='min-h-screen'>
            <header>
                <NavBar></NavBar>
            </header>
            <main className='max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10'>
                <Outlet></Outlet>
            </main>
            <div className='sticky top-full'>
                <Footer></Footer>
            </div>
        </div>
    );
};

export default MainLayout;