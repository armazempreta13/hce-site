import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { MenuIcon, CloseIcon } from './icons';

const Header: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinkClasses = (isActive: boolean) => {
        const baseClasses = "relative font-medium tracking-wide transition-colors duration-300";
        const colorClasses = "text-primary hover:text-accent-dark";
        // Using accent color for underline for brand consistency
        const afterClasses = `after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-accent after:opacity-70 after:transition-all after:duration-300 hover:after:w-full`;
        // Active link is persistently accent-colored with a full underline
        const activeClasses = isActive ? "text-accent-dark after:w-full" : "";

        return `${baseClasses} ${colorClasses} ${afterClasses} ${activeClasses}`;
    };
    
    const navLinks = (
        <>
            <NavLink to="/" className={({ isActive }) => navLinkClasses(isActive)} onClick={() => setIsOpen(false)}>Home</NavLink>
            <NavLink to="/sobre" className={({ isActive }) => navLinkClasses(isActive)} onClick={() => setIsOpen(false)}>Sobre Nós</NavLink>
            <NavLink to="/servicos" className={({ isActive }) => navLinkClasses(isActive)} onClick={() => setIsOpen(false)}>Serviços</NavLink>
            <NavLink to="/portfolio" className={({ isActive }) => navLinkClasses(isActive)} onClick={() => setIsOpen(false)}>Portfólio</NavLink>
            <NavLink to="/equipe" className={({ isActive }) => navLinkClasses(isActive)} onClick={() => setIsOpen(false)}>Equipe</NavLink>
        </>
    );

    const mobileNavLinkClasses = "relative text-white font-medium tracking-wide transition-colors duration-300 hover:text-white/80 text-2xl after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-white/50 after:transition-all after:duration-300 hover:after:w-full";

    return (
        <header className={`fixed top-0 w-full z-50 transition-all duration-300 ease-in-out ${isScrolled ? 'py-3 bg-white/95 shadow-md border-b border-slate-900/10' : 'py-5 bg-white'}`}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                <Link to="/" className="flex-shrink-0">
                    <img src="https://i.imgur.com/wwhgVHu.png" alt="HCE Esquadrias Logo" className="h-10 md:h-12 w-auto transition-transform duration-300 hover:scale-105" loading="lazy" decoding="async" />
                </Link>

                <nav className="hidden lg:flex items-center space-x-8">
                    {navLinks}
                    <Link to="/contato" className="shimmer-effect bg-primary text-white font-bold text-sm uppercase px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/40">
                        Orçamento
                    </Link>
                </nav>

                <div className="lg:hidden">
                    <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none" aria-label="Toggle menu">
                        {isOpen ? <CloseIcon className="w-8 h-8 text-primary" /> : <MenuIcon className="w-8 h-8 text-primary transition-colors duration-300" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`lg:hidden fixed top-0 left-0 w-full h-full bg-primary/95 z-40 transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                 <div className="flex flex-col items-center justify-center h-full space-y-8">
                    <NavLink to="/" className={({isActive}) => `${mobileNavLinkClasses} ${isActive ? 'after:w-full':''}`} onClick={() => setIsOpen(false)}>Home</NavLink>
                    <NavLink to="/sobre" className={({isActive}) => `${mobileNavLinkClasses} ${isActive ? 'after:w-full':''}`} onClick={() => setIsOpen(false)}>Sobre Nós</NavLink>
                    <NavLink to="/servicos" className={({isActive}) => `${mobileNavLinkClasses} ${isActive ? 'after:w-full':''}`} onClick={() => setIsOpen(false)}>Serviços</NavLink>
                    <NavLink to="/portfolio" className={({isActive}) => `${mobileNavLinkClasses} ${isActive ? 'after:w-full':''}`} onClick={() => setIsOpen(false)}>Portfólio</NavLink>
                    <NavLink to="/equipe" className={({isActive}) => `${mobileNavLinkClasses} ${isActive ? 'after:w-full':''}`} onClick={() => setIsOpen(false)}>Equipe</NavLink>
                    <Link to="/contato" className="shimmer-effect bg-white text-primary font-bold uppercase px-8 py-4 rounded-full transition-transform duration-300 hover:scale-105 mt-8" onClick={() => setIsOpen(false)}>
                        Orçamento
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Header;