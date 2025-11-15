



import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, PlayIcon, CloseIcon } from './icons';
import { useScrollReveal, KineticText } from './ui/Animations';


const useParallax = (speed: number, enabled: boolean) => {
    const ref = useRef<HTMLDivElement>(null);
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
        if (!enabled || !ref.current) {
            return;
        }

        let ticking = false;
        const element = ref.current;
        const parent = element.parentElement;
        
        if (!parent) return;

        const elementTop = parent.offsetTop;
        const elementHeight = parent.offsetHeight;
        const viewportHeight = window.innerHeight;

        const update = () => {
            const scrollY = window.pageYOffset;
            
            if (scrollY + viewportHeight > elementTop && scrollY < elementTop + elementHeight) {
                const relativeScroll = scrollY - elementTop;
                if (element) {
                    element.style.transform = `translate3d(0, ${relativeScroll * speed}px, 0)`;
                }
            }
            ticking = false;
        };

        const onScroll = () => {
            if (!ticking) {
                rafRef.current = window.requestAnimationFrame(update);
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', onScroll, { passive: true });
        rafRef.current = window.requestAnimationFrame(update);

        return () => {
            window.removeEventListener('scroll', onScroll);
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, [speed, enabled]);
    
    return ref;
}

// Components and data moved from AboutPage
const ChevronLeftIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const mediaData = [
    { type: 'video', src: 'https://i.imgur.com/fQW4PeG.mp4', thumbnail: 'https://i.imgur.com/fQW4PeGl.jpg' },
    { type: 'video', src: 'https://i.imgur.com/mfivPrk.mp4', thumbnail: 'https://i.imgur.com/mfivPrkl.jpg' },
    { type: 'image', src: 'https://i.imgur.com/Wb93S7K.jpeg', thumbnail: 'https://i.imgur.com/Wb93S7Kl.jpg' },
    { type: 'video', src: 'https://i.imgur.com/ew22VEF.mp4', thumbnail: 'https://i.imgur.com/ew22VEFl.jpg' },
    { type: 'image', src: 'https://i.imgur.com/nesEH1I.jpeg', thumbnail: 'https://i.imgur.com/nesEH1Il.jpg' },
    { type: 'video', src: 'https://i.imgur.com/nYx4IzO.mp4', thumbnail: 'https://i.imgur.com/nYx4IzOl.jpg' },
    { type: 'video', src: 'https://i.imgur.com/HSc3VmK.mp4', thumbnail: 'https://i.imgur.com/HSc3VmKl.jpg' },
    { type: 'video', src: 'https://i.imgur.com/GtEpOLh.mp4', thumbnail: 'https://i.imgur.com/GtEpOLhl.jpg' },
    { type: 'image', src: 'https://i.imgur.com/LrvXdiN.jpeg', thumbnail: 'https://i.imgur.com/LrvXdiNl.jpg' },
    { type: 'video', src: 'https://i.imgur.com/JUvwwe3.mp4', thumbnail: 'https://i.imgur.com/JUvwwe3l.jpg' },
    { type: 'video', src: 'https://i.imgur.com/0lBXcZd.mp4', thumbnail: 'https://i.imgur.com/0lBXcZdl.jpg' },
    { type: 'video', src: 'https://i.imgur.com/yUHdSA7.mp4', thumbnail: 'https://i.imgur.com/yUHdSA7l.jpg' },
];

const createGroups = (items, size) => {
    const groups = [];
    for (let i = 0; i < items.length; i += size) {
        groups.push(items.slice(i, i + size));
    }
    const lastGroup = groups[groups.length - 1];
    if (lastGroup && lastGroup.length < size) {
        const placeholders = Array(size - lastGroup.length).fill(null);
        groups[groups.length - 1] = [...lastGroup, ...placeholders];
    }
    return groups;
};


const HomePage: React.FC = () => {
    const addToRefs = useScrollReveal();
    
    const [isCtaVisible, setIsCtaVisible] = useState(false);
    const [isCtaImageReady, setIsCtaImageReady] = useState(false);
    const ctaSectionRef = useRef<HTMLElement>(null);
    const parallaxBgRef = useParallax(0.15, isCtaVisible && isCtaImageReady);
    const imagePreloadRef = useRef<HTMLImageElement | null>(null);

    // Logic for Team Carousel, moved from AboutPage
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
    const [currentSlide, setCurrentSlide] = useState(1);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [noTransition, setNoTransition] = useState(false);

    const autoPlayRef = useRef(null);

    const mediaGroups = useMemo(() => createGroups(mediaData, 4), []);
    const slidesWithClones = useMemo(() => {
        if (mediaGroups.length === 0) return [];
        return [mediaGroups[mediaGroups.length - 1], ...mediaGroups, mediaGroups[0]];
    }, [mediaGroups]);

    const stopAutoPlay = useCallback(() => {
        setIsAutoPlaying(false);
        if (autoPlayRef.current) {
            clearInterval(autoPlayRef.current);
            autoPlayRef.current = null;
        }
    }, []);
    
    const startAutoPlay = useCallback(() => {
        setIsAutoPlaying(true);
        if (autoPlayRef.current) clearInterval(autoPlayRef.current);
        autoPlayRef.current = setInterval(() => {
            setCurrentSlide(prev => prev + 1);
        }, 5000);
    }, []);

    useEffect(() => {
        if (isAutoPlaying && !isModalOpen && mediaGroups.length > 1) {
            startAutoPlay();
        } else {
            stopAutoPlay();
        }
        return () => stopAutoPlay();
    }, [isAutoPlaying, isModalOpen, mediaGroups.length, startAutoPlay, stopAutoPlay]);
    
    const handleTransitionEnd = () => {
        if (currentSlide <= 0) {
            setNoTransition(true);
            setCurrentSlide(mediaGroups.length);
        }
        if (currentSlide >= mediaGroups.length + 1) {
            setNoTransition(true);
            setCurrentSlide(1);
        }
    };
    
    useEffect(() => {
        if (noTransition) {
            const timer = setTimeout(() => setNoTransition(false), 50);
            return () => clearTimeout(timer);
        }
    }, [noTransition]);

    const openModal = useCallback((index) => {
        setSelectedMediaIndex(index);
        setIsModalOpen(true);
        stopAutoPlay();
        document.body.style.overflow = 'hidden';
    }, [stopAutoPlay]);

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        startAutoPlay();
        document.body.style.overflow = 'auto';
    }, [startAutoPlay]);

    const nextSlide = useCallback(() => {
        stopAutoPlay();
        setCurrentSlide(prev => prev + 1);
    }, [stopAutoPlay]);

    const prevSlide = useCallback(() => {
        stopAutoPlay();
        setCurrentSlide(prev => prev - 1);
    }, [stopAutoPlay]);

    const goToSlide = useCallback((index) => {
        stopAutoPlay();
        setCurrentSlide(index + 1);
    }, [stopAutoPlay]);

    const showNextMedia = useCallback((e) => {
        if (e) e.stopPropagation();
        setSelectedMediaIndex((prev) => (prev + 1) % mediaData.length);
    }, []);

    const showPrevMedia = useCallback((e) => {
        if (e) e.stopPropagation();
        setSelectedMediaIndex((prev) => (prev - 1 + mediaData.length) % mediaData.length);
    }, []);
    
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (isModalOpen) {
                if (e.key === 'ArrowRight') showNextMedia(e);
                if (e.key === 'ArrowLeft') showPrevMedia(e);
                if (e.key === 'Escape') closeModal();
            }
        };
        
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isModalOpen, showNextMedia, showPrevMedia, closeModal]);

    const currentMedia = mediaData[selectedMediaIndex];
    const activeDotIndex = currentSlide === 0 ? mediaGroups.length - 1 : currentSlide === mediaGroups.length + 1 ? 0 : currentSlide - 1;


    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsCtaVisible(true);
                }
            },
            { rootMargin: '300px', threshold: 0 }
        );

        const currentSection = ctaSectionRef.current;
        if (currentSection) {
            observer.observe(currentSection);
        }

        return () => {
            if (currentSection) {
                observer.unobserve(currentSection);
            }
        };
    }, []);

    useEffect(() => {
        if (isCtaVisible && !imagePreloadRef.current) {
            const img = new Image();
            const imageUrl = `https://picsum.photos/seed/cta-bg/1280/720?format=webp&quality=70`;
            img.src = imageUrl;
            img.onload = () => {
                setIsCtaImageReady(true);
                imagePreloadRef.current = img;
            };
        }
    }, [isCtaVisible]);


    return (
        <div className="bg-soft-gray overflow-x-hidden">
            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeInUp { animation: fadeInUp 0.3s ease-out; }
            `}</style>
            {/* Hero Section - Full Screen com Split Layout */}
            <section className="min-h-screen relative overflow-hidden">
                {/* Background com Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-heading"></div>
                
                {/* Grid Pattern Overlay */}
                <div className="absolute inset-0 opacity-5" style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                    backgroundSize: '50px 50px'
                }}></div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 min-h-screen flex items-center py-24 lg:py-0">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
                        <div className="text-left space-y-8">
                            <div ref={addToRefs} className="scroll-reveal">
                                <span className="text-accent font-bold text-sm uppercase tracking-widest">HCE Esquadrias</span>
                            </div>
                            <h1 ref={addToRefs} className="font-armstrong text-5xl sm:text-6xl md:text-7xl lg:text-8xl uppercase text-white tracking-tighter scroll-reveal" style={{ transitionDelay: '200ms' }}>
                               <KineticText text="Arquitetura em Alumínio" />
                            </h1>
                            <p ref={addToRefs} className="text-lg sm:text-xl max-w-xl text-white/90 leading-relaxed scroll-reveal" style={{ transitionDelay: '400ms' }}>
                                Transformamos metal em arte. Cada projeto é uma assinatura de precisão, tecnologia e design atemporal.
                            </p>
                            <div ref={addToRefs} className="flex flex-col sm:flex-row gap-6 pt-4 scroll-reveal" style={{ transitionDelay: '600ms' }}>
                                <Link to="/contato" className="inline-block bg-accent text-primary font-bold text-base uppercase px-10 py-5 rounded-full transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl shimmer-effect text-center">
                                    Iniciar Projeto
                                </Link>
                                <Link to="/portfolio" className="inline-block bg-white/10 backdrop-blur-sm text-white font-bold text-base uppercase px-10 py-5 rounded-full transition-all duration-300 ease-in-out hover:bg-white/20 border-2 border-white/30 text-center">
                                    Ver Trabalhos
                                </Link>
                            </div>
                        </div>
                        
                        {/* Desktop Image Grid */}
                        <div ref={addToRefs} className="relative h-[600px] scroll-reveal hidden lg:block" style={{ transitionDelay: '300ms' }}>
                            <div className="absolute top-0 right-0 w-[55%] h-[45%] overflow-hidden rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-500">
                                <img loading="eager" src="https://picsum.photos/seed/hero1/500/400?format=webp&quality=70" alt="Projeto 1" className="w-full h-full object-cover"/>
                            </div>
                            <div className="absolute bottom-0 left-0 w-[55%] h-[45%] overflow-hidden rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-500">
                                <img loading="eager" src="https://picsum.photos/seed/hero2/500/400?format=webp&quality=70" alt="Projeto 2" className="w-full h-full object-cover"/>
                            </div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[45%] h-[55%] overflow-hidden rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-500 z-10 ring-8 ring-white/10">
                                <img loading="eager" src="https://picsum.photos/seed/hero3/400/500?format=webp&quality=70" alt="Projeto 3" className="w-full h-full object-cover"/>
                            </div>
                        </div>
                        {/* Mobile Image */}
                        <div ref={addToRefs} className="block lg:hidden scroll-reveal mt-12" style={{ transitionDelay: '300ms' }}>
                            <div className="relative w-full max-w-xs mx-auto h-[450px] sm:h-[500px] rounded-3xl overflow-hidden shadow-2xl ring-8 ring-white/10">
                                <img loading="eager" src="https://picsum.photos/seed/hero-mobile/400/600?format=webp&quality=70" alt="Projeto de esquadrias de alumínio" className="w-full h-full object-cover"/>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60 animate-bounce">
                    <span className="text-xs uppercase tracking-widest">Descer</span>
                    <div className="w-[1px] h-12 bg-white/30"></div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { number: '500+', label: 'Projetos Concluídos' },
                            { number: '15+', label: 'Anos de Experiência' },
                            { number: '98%', label: 'Clientes Satisfeitos' },
                            { number: '50+', label: 'Profissionais' }
                        ].map((stat, index) => (
                            <div key={index} ref={addToRefs} className="text-center scroll-reveal" style={{ transitionDelay: `${index * 100}ms` }}>
                                <div className="font-armstrong text-4xl sm:text-5xl md:text-6xl text-primary mb-2">{stat.number}</div>
                                <div className="text-body text-sm uppercase tracking-wide">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            
            {/* Services Section - Cards com Hover Effect */}
            <section className="py-24 md:py-32 bg-soft-gray">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div ref={addToRefs} className="max-w-3xl mb-16 md:mb-20 scroll-reveal">
                         <span className="text-primary font-bold text-sm uppercase tracking-widest">Nossas Especialidades</span>
                         <h2 className="font-armstrong text-3xl sm:text-4xl md:text-5xl uppercase text-heading tracking-tight mt-4">
                            <KineticText text="Soluções Completas" />
                         </h2>
                         <p className="mt-6 text-lg sm:text-xl text-body">Expertise técnica aliada ao design contemporâneo para elevar seus projetos.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: 'Esquadrias de Alumínio',
                                desc: 'Portas e janelas que unem alta performance termoacústica, segurança e design sofisticado para valorizar seu projeto.',
                                image: 'service-frames'
                            },
                            {
                                title: 'Elementos Arquitetônicos',
                                desc: 'Ripados, brises e guarda-corpos que adicionam estética moderna, privacidade e funcionalidade à sua fachada ou ambiente.',
                                image: 'service-elements'
                            },
                            {
                                title: 'Fachadas & Manutenção',
                                desc: 'Sistemas de pele de vidro (glazing) e serviços especializados de manutenção para garantir a integridade e beleza do seu edifício.',
                                image: 'service-facades'
                            }
                        ].map((service, index) => (
                             <div key={index} ref={addToRefs} className="group scroll-reveal" style={{transitionDelay: `${index * 150}ms`}}>
                                <div className="bg-white rounded-3xl overflow-hidden shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
                                    <div className="relative h-64 overflow-hidden">
                                        <img 
                                            loading="lazy" 
                                            src={`https://picsum.photos/seed/${service.image}/600/400?format=webp&quality=70`} 
                                            alt={service.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    </div>
                                    <div className="p-8">
                                        <h3 className="font-armstrong text-3xl uppercase text-heading mb-4">{service.title}</h3>
                                        <p className="text-body leading-relaxed mb-6">{service.desc}</p>
                                        <Link to="/servicos" className="inline-flex items-center text-primary font-bold group-hover:text-accent transition-colors duration-300">
                                            Saiba mais
                                            <ArrowRightIcon className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-2" />
                                        </Link>
                                    </div>
                                </div>
                             </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Portfolio Full Width */}
            <section className="py-24 md:py-32 bg-heading text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-16 md:mb-20">
                        <div ref={addToRefs} className="scroll-reveal">
                             <span className="text-accent font-bold text-sm uppercase tracking-widest">Portfólio</span>
                             <h2 className="font-armstrong text-3xl sm:text-4xl md:text-5xl uppercase text-white tracking-tight mt-4 mb-6">
                                <KineticText text="Obras que Definem Padrões" />
                             </h2>
                             <p className="text-lg sm:text-xl text-white/80 leading-relaxed max-w-xl">
                                Cada instalação reflete nosso compromisso inabalável com a qualidade. Descubra projetos que transformaram espaços em referências.
                             </p>
                        </div>
                        <div ref={addToRefs} className="scroll-reveal" style={{ transitionDelay: '200ms' }}>
                            <Link to="/portfolio" className="inline-block bg-accent text-primary font-bold text-base uppercase px-10 py-5 rounded-full transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl shimmer-effect">
                                Explorar Todos os Projetos
                            </Link>
                        </div>
                    </div>

                    {/* Portfolio Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((item, index) => (
                            <div 
                                key={item} 
                                ref={addToRefs} 
                                className="relative h-80 rounded-3xl overflow-hidden group cursor-pointer scroll-reveal"
                                style={{transitionDelay: `${index * 100}ms`}}
                            >
                                <img 
                                    loading="lazy" 
                                    src={`https://picsum.photos/seed/portfolio${item}/600/500?format=webp&quality=70`} 
                                    alt={`Projeto ${item}`}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                        <h4 className="font-armstrong text-2xl uppercase text-white mb-2">Projeto Residencial</h4>
                                        <p className="text-white/80 text-sm">Esquadrias Premium</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section (Replaces Testimonials) */}
            <section className="bg-white py-24 md:py-32">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div ref={addToRefs} className="max-w-3xl mx-auto text-center mb-16 md:mb-20 scroll-reveal">
                        <h2 className="font-bold text-3xl md:text-4xl uppercase text-gray-900 tracking-wider">
                            <KineticText text="Nossa Equipe em Ação" />
                        </h2>
                        <p className="mt-6 text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto">
                            Nosso diferencial está na precisão de cada corte e na dedicação de nossa equipe. Veja os bastidores de como transformamos alumínio em obras de arte.
                        </p>
                    </div>

                    <div 
                        ref={addToRefs}
                        className="relative max-w-7xl mx-auto scroll-reveal"
                        style={{transitionDelay: '200ms'}}
                        onMouseEnter={stopAutoPlay}
                        onMouseLeave={startAutoPlay}
                    >
                         <div className="overflow-hidden">
                            <div 
                                className="flex"
                                style={{
                                    transform: `translateX(-${currentSlide * 100}%)`,
                                    transition: noTransition ? 'none' : 'transform 700ms ease-in-out',
                                }}
                                onTransitionEnd={handleTransitionEnd}
                            >
                                {slidesWithClones.map((group, groupIndex) => (
                                    <div 
                                        key={groupIndex}
                                        className="w-full flex-shrink-0 px-2"
                                    >
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {group.map((item, itemIndex) => {
                                                if (!item) {
                                                    return <div key={itemIndex} className="aspect-square bg-slate-100 rounded-2xl" />;
                                                }
                                                const globalIndex = mediaData.indexOf(item);
                                                return (
                                                    <div 
                                                        key={itemIndex}
                                                        className="aspect-square group relative rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                                                        onClick={() => openModal(globalIndex)}
                                                        role="button"
                                                        tabIndex={0}
                                                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openModal(globalIndex); }}
                                                        aria-label={`Ver ${item.type === 'video' ? 'vídeo' : 'imagem'} ${globalIndex + 1}`}
                                                    >
                                                        <img 
                                                            src={item.thumbnail} 
                                                            alt={`Equipe HCE trabalhando ${globalIndex + 1}`}
                                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                                            loading="lazy"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                            {item.type === 'video' && (
                                                                <div className="w-16 h-16 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform duration-300">
                                                                    <PlayIcon className="w-8 h-8 text-white drop-shadow-lg ml-1" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {mediaGroups.length > 1 && (
                            <>
                                <button
                                    onClick={prevSlide}
                                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-all duration-300 z-10 hover:scale-110"
                                    aria-label="Slide anterior"
                                >
                                    <ChevronLeftIcon className="w-8 h-8 text-gray-800" />
                                </button>
                                <button
                                    onClick={nextSlide}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-all duration-300 z-10 hover:scale-110"
                                    aria-label="Próximo slide"
                                >
                                    <ChevronRightIcon className="w-8 h-8 text-gray-800" />
                                </button>
                                <div className="flex justify-center gap-3 mt-10">
                                    {mediaGroups.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => goToSlide(index)}
                                            className={`h-2.5 rounded-full transition-all duration-500 ease-out ${
                                                activeDotIndex === index 
                                                    ? 'w-10 bg-primary' 
                                                    : 'w-3 bg-slate-300 hover:bg-slate-400'
                                            }`}
                                            aria-label={`Ir para slide ${index + 1}`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </section>
            
            {/* Final CTA - Immersive */}
            <section ref={ctaSectionRef} className="relative bg-primary py-24 md:py-40 text-white overflow-hidden">
                <div 
                    ref={parallaxBgRef} 
                    className="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000" 
                    style={{ 
                        backgroundImage: isCtaImageReady ? `url(https://picsum.photos/seed/cta-bg/1280/720?format=webp&quality=70)` : 'none',
                        opacity: isCtaImageReady ? 1 : 0,
                        willChange: isCtaImageReady ? 'transform' : 'auto'
                    }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-heading/90 to-primary/95"></div>
                
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="font-armstrong text-3xl sm:text-4xl md:text-6xl uppercase tracking-tight mb-8">
                            <KineticText text="Pronto para Criar Algo Excepcional?"/>
                        </h2>
                        <p className="text-white/90 text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto mb-12 leading-relaxed">
                            Cada projeto começa com uma conversa. Vamos transformar sua visão em realidade com a precisão que só o alumínio da HCE pode oferecer.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <Link to="/contato" className="inline-block bg-accent text-primary font-bold text-lg uppercase px-14 py-6 rounded-full transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl shimmer-effect">
                                Solicitar Orçamento
                            </Link>
                            <a href="tel:+5561993619554" className="inline-block bg-white/10 backdrop-blur-sm text-white font-bold text-lg uppercase px-14 py-6 rounded-full transition-all duration-300 ease-in-out hover:bg-white/20 border-2 border-white/30">
                                Ligar Agora
                            </a>
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-10 left-10 w-32 h-32 border-2 border-accent/20 rounded-full"></div>
                <div className="absolute bottom-10 right-10 w-40 h-40 border-2 border-accent/20 rounded-full"></div>
            </section>
            
            {/* Modal Lightbox for Team Section */}
            {isModalOpen && (
                <div 
                    className="fixed inset-0 bg-black/95 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fadeInUp" 
                    onClick={closeModal}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Visualizador de mídia"
                    style={{animationDuration: '0.3s'}}
                >
                    <div 
                        className="relative w-full h-full max-w-6xl max-h-[90vh]" 
                        onClick={e => e.stopPropagation()}
                    >
                        <button 
                            onClick={closeModal} 
                            className="absolute -top-2 -right-2 md:top-0 md:-right-12 text-white bg-white/10 hover:bg-white/30 rounded-full p-2 transition-colors z-20" 
                            aria-label="Fechar visualizador"
                        >
                            <CloseIcon className="w-6 h-6" />
                        </button>
                        
                        <div className="w-full h-full flex items-center justify-center">
                            {currentMedia.type === 'image' ? (
                                <img 
                                    src={currentMedia.src} 
                                    alt={`Equipe HCE trabalhando - imagem ${selectedMediaIndex + 1}`}
                                    className="max-w-full max-h-full object-contain rounded-lg" 
                                />
                            ) : (
                                <video 
                                    key={currentMedia.src}
                                    src={currentMedia.src} 
                                    className="max-w-full max-h-full object-contain rounded-lg" 
                                    controls 
                                    autoPlay 
                                    muted 
                                    loop 
                                    playsInline
                                    aria-label={`Vídeo da equipe ${selectedMediaIndex + 1}`}
                                />
                            )}
                        </div>

                        <button 
                            onClick={showPrevMedia} 
                            className="absolute left-0 sm:-left-4 md:-left-16 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 rounded-full p-3 text-white transition-all duration-300 shadow-lg hover:scale-110"
                            aria-label="Mídia anterior"
                        >
                            <ChevronLeftIcon className="w-6 h-6" />
                        </button>
                        <button 
                            onClick={showNextMedia} 
                            className="absolute right-0 sm:-right-4 md:-right-16 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 rounded-full p-3 text-white transition-all duration-300 shadow-lg hover:scale-110"
                            aria-label="Próxima mídia"
                        >
                            <ChevronRightIcon className="w-6 h-6" />
                        </button>

                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 bg-black/50 px-4 py-2 rounded-full text-sm backdrop-blur-sm">
                            {selectedMediaIndex + 1} / {mediaData.length}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomePage;