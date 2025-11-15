

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, CheckCircleIcon } from './icons';
import { useScrollReveal, KineticText } from './ui/Animations';

const servicesList = [
    {
        title: 'Esquadrias de Alumínio Premium',
        description: 'Desenvolvemos portas e janelas sob medida que são o coração de projetos arquitetônicos. Utilizando as linhas Gold e Suprema, garantimos não apenas um design impecável, mas também uma performance termoacústica superior, segurança e durabilidade que resistem ao tempo.',
        features: ['Isolamento Acústico e Térmico', 'Segurança Reforçada', 'Design Personalizado', 'Durabilidade e Baixa Manutenção'],
        image: 'https://picsum.photos/seed/servicepage-frames/800/600?format=webp&quality=70',
        imageAlt: 'Janela de alumínio em uma sala de estar moderna'
    },
    {
        title: 'Pele de Vidro e Fachadas Glazing',
        description: 'Transformamos a fachada de edifícios com o sistema de Pele de Vidro (Structural Glazing), criando uma estética limpa, moderna e imponente. Esta solução maximiza a iluminação natural, valoriza o imóvel e reflete o que há de mais avançado na arquitetura contemporânea.',
        features: ['Estética Minimalista e Moderna', 'Otimização da Luz Natural', 'Eficiência Energética', 'Valorização do Imóvel'],
        image: 'https://picsum.photos/seed/servicepage-facade/800/600?format=webp&quality=70',
        imageAlt: 'Fachada de um prédio comercial com pele de vidro'
    },
    {
        title: 'Guarda-corpos de Alumínio e Vidro',
        description: 'Unimos segurança e elegância em nossos guarda-corpos. Ideais para sacadas, escadas, mezaninos e áreas de piscina, eles oferecem proteção sem obstruir a visão, integrando-se perfeitamente ao design do ambiente com um visual leve e sofisticado.',
        features: ['Segurança Conforme Normas ABNT', 'Design Clean e Minimalista', 'Alta Resistência a Intempéries', 'Visão Panorâmica Desobstruída'],
        image: 'https://picsum.photos/seed/servicepage-railing/800/600?format=webp&quality=70',
        imageAlt: 'Guarda-corpo de vidro em uma sacada com vista'
    },
    {
        title: 'Ripados e Brises de Alumínio',
        description: 'Elementos arquitetônicos que proporcionam controle solar, privacidade e um forte apelo estético. Nossos ripados e brises são fabricados com precisão para se adaptarem a fachadas e ambientes internos, adicionando textura e modernidade ao projeto.',
        features: ['Controle de Luminosidade', 'Privacidade e Ventilação', 'Estética Contemporânea', 'Personalização de Cores e Acabamentos'],
        image: 'https://picsum.photos/seed/servicepage-brise/800/600?format=webp&quality=70',
        imageAlt: 'Fachada com brises de alumínio horizontais'
    },
    {
        title: 'Manutenção Predial Especializada',
        description: 'Garantimos a longevidade e o perfeito funcionamento de suas instalações com nosso serviço de manutenção. Realizamos desde a manutenção preventiva, que evita problemas futuros, até a corretiva, para reparos e substituição de componentes.',
        features: ['Aumento da Vida Útil', 'Segurança e Funcionalidade', 'Manutenção Preventiva e Corretiva', 'Equipe Técnica Especializada'],
        image: 'https://picsum.photos/seed/servicepage-maintenance/800/600?format=webp&quality=70',
        imageAlt: 'Técnico realizando manutenção em janela de alumínio'
    }
];

const ServicesPage: React.FC = () => {
    const addToRefs = useScrollReveal();

    return (
        <div className="bg-white pt-28 sm:pt-32 md:pt-40">
            <header className="bg-soft-gray pb-16 md:pb-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
                    <h1 ref={addToRefs} className="font-armstrong text-4xl md:text-5xl uppercase text-heading tracking-wider scroll-reveal">
                        <KineticText text="Engenharia em Alumínio" />
                    </h1>
                    <p ref={addToRefs} className="mt-4 text-lg text-body/80 scroll-reveal" style={{ transitionDelay: '200ms' }}>
                        Cada serviço que oferecemos é executado com precisão milimétrica e um compromisso inabalável com a qualidade, desde a concepção até a instalação final.
                    </p>
                </div>
            </header>

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-24 md:space-y-32">
                {servicesList.map((service, index) => (
                    <section key={index} ref={addToRefs} className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center scroll-reveal">
                        <div className={`relative h-96 lg:h-[500px] ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                            <img 
                                loading="lazy" 
                                decoding="async" 
                                src={service.image} 
                                alt={service.imageAlt} 
                                width="800" height="600" 
                                className="w-full h-full object-cover rounded-4xl shadow-2xl"
                            />
                            <div className={`absolute -bottom-6 w-40 h-40 bg-soft-gray rounded-3xl hidden lg:block ${index % 2 === 1 ? '-left-6' : '-right-6'}`}></div>
                        </div>

                        <div className={`space-y-6 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                            <h2 className="font-armstrong text-3xl md:text-4xl uppercase text-heading tracking-tight">
                                <KineticText text={service.title} />
                            </h2>
                            <p className="text-body/90 text-lg leading-relaxed">{service.description}</p>
                            <ul className="space-y-3 pt-4">
                                {service.features.map((feature, fIndex) => (
                                    <li key={fIndex} className="flex items-center text-body font-medium">
                                        <CheckCircleIcon className="w-6 h-6 mr-3 text-primary/70 flex-shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>
                ))}
            </main>

            <section className="bg-primary text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
                    <h2 ref={addToRefs} className="font-armstrong text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight mb-6 scroll-reveal">
                       <KineticText text="Pronto para Elevar seu Projeto?" />
                    </h2>
                    <p ref={addToRefs} className="text-white/80 text-lg sm:text-xl max-w-3xl mx-auto mb-10 leading-relaxed scroll-reveal" style={{transitionDelay: '200ms'}}>
                        Nossa equipe está pronta para transformar sua visão em realidade com soluções personalizadas e de alta performance.
                    </p>
                    <div ref={addToRefs} className="scroll-reveal" style={{transitionDelay: '400ms'}}>
                        <Link 
                            to="/contato"
                            className="inline-flex items-center justify-center bg-accent text-primary font-bold text-base uppercase px-10 py-5 rounded-full transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl shimmer-effect"
                        >
                           Solicitar Orçamento
                           <ArrowRightIcon className="w-5 h-5 ml-2"/>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ServicesPage;