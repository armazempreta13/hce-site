
import React from 'react';
import { Link } from 'react-router-dom';
import { PhoneIcon, MailIcon, LocationIcon } from './icons';

const Footer: React.FC = () => {
    return (
        <footer className="bg-primary text-white font-montserrat">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Column 1: Logo & Description */}
                    <div className="space-y-4">
                        <Link to="/">
                           <img src="https://i.imgur.com/spMimAM.png" alt="HCE Esquadrias Logo" className="h-12 w-auto" />
                        </Link>
                        <p className="text-light-bg/80 text-sm">
                            HCE Esquadrias - Especialistas em Alumínio.
                        </p>
                        <p className="text-light-bg/80 text-sm">
                            Precisão e design que transformam ambientes.
                        </p>
                    </div>

                    {/* Column 2: Quick Navigation */}
                    <div>
                        <h3 className="font-armstrong text-xl uppercase tracking-wider text-accent mb-4">Navegação Rápida</h3>
                        <ul className="space-y-2">
                            <li><Link to="/" className="hover:text-accent transition-colors duration-300">Home</Link></li>
                            <li><Link to="/sobre" className="hover:text-accent transition-colors duration-300">Sobre Nós</Link></li>
                            <li><Link to="/servicos" className="hover:text-accent transition-colors duration-300">Serviços</Link></li>
                            <li><Link to="/portfolio" className="hover:text-accent transition-colors duration-300">Portfólio</Link></li>
                            <li><Link to="/equipe" className="hover:text-accent transition-colors duration-300">Equipe</Link></li>
                            <li><Link to="/contato" className="hover:text-accent transition-colors duration-300">Contato</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Contact */}
                    <div>
                        <h3 className="font-armstrong text-xl uppercase tracking-wider text-accent mb-4">Contato</h3>
                        <ul className="space-y-3 text-light-bg/90">
                            <li className="flex items-start">
                                <LocationIcon className="w-5 h-5 mr-3 mt-1 text-accent flex-shrink-0" />
                                <span>Brasília - DF, Brasil</span>
                            </li>
                            <li className="flex items-center">
                                <PhoneIcon className="w-5 h-5 mr-3 text-accent flex-shrink-0" />
                                <a href="tel:+5561993619554" className="hover:text-accent transition-colors duration-300">(61) 9 9361-9554</a>
                            </li>
                            <li className="flex items-center">
                                <MailIcon className="w-5 h-5 mr-3 text-accent flex-shrink-0" />
                                <a href="mailto:hceesquadrias@yahoo.com" className="hover:text-accent transition-colors duration-300">hceesquadrias@yahoo.com</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 border-t border-light-bg/20 pt-6 text-center text-sm text-light-bg/60">
                    <p>&copy; {new Date().getFullYear()} HCE Esquadrias. Todos os direitos reservados.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;