import React from 'react';

// Mock components
const useScrollReveal = () => {
  const refs = [];
  const addToRefs = (el) => {
    if (el && !refs.includes(el)) {
      refs.push(el);
      el.classList.add('opacity-0', 'translate-y-8');
      setTimeout(() => {
        el.classList.remove('opacity-0', 'translate-y-8');
        el.classList.add('opacity-100', 'translate-y-0');
      }, 100);
    }
  };
  return addToRefs;
};

const KineticText = ({ text }) => <span>{text}</span>;

const AboutPage = () => {
    const addToRefs = useScrollReveal();

    return (
        <div className="bg-gray-50">
            <div className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
                <div 
                    className="absolute inset-0 w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: 'url(https://picsum.photos/seed/about/1280/600?format=webp&quality=70)' }}
                    role="img"
                    aria-label="Imagem de fundo da HCE Esquadrias"
                ></div>
                <div className="absolute inset-0 bg-slate-800 opacity-70"></div>
                <div className="relative z-10 text-white text-center px-4 pt-16">
                     <h1 ref={addToRefs} className="font-bold text-4xl md:text-6xl uppercase tracking-wider scroll-reveal">
                        <KineticText text="A Arte da Precisão" />
                    </h1>
                    <p ref={addToRefs} className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-white/80 scroll-reveal" style={{transitionDelay: '300ms'}}>
                        Desde 2005, unimos engenharia e design para criar esquadrias de alumínio que definem padrões de qualidade e inovação.
                    </p>
                </div>
            </div>

            <div className="bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div ref={addToRefs} className="scroll-reveal">
                            <h2 className="font-bold text-2xl md:text-3xl uppercase text-gray-900 tracking-wider mb-8">
                                <KineticText text="Nossa História" />
                            </h2>
                            <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
                                <p>
                                    Fundada em 2005, a HCE Esquadrias nasceu da paixão pela engenharia de precisão e pelo design arquitetônico. Desde o início, nosso foco foi singular: dominar a arte de trabalhar com o alumínio. Não somos generalistas; somos artesãos técnicos, dedicados a transformar projetos em realidade com a máxima qualidade e durabilidade.
                                </p>
                                <p>
                                    Ao longo de quase duas décadas de atuação focada em Brasília e região, construímos uma reputação de confiança junto a arquitetos, engenheiros e clientes finais que não abrem mão da excelência. Cada projeto é um compromisso com a perfeição, desde a escolha do perfil de alumínio até a instalação final.
                                </p>
                            </div>
                        </div>
                        <div ref={addToRefs} className="relative h-[400px] lg:h-[500px] scroll-reveal" style={{transitionDelay: '200ms'}}>
                            <img 
                                loading="lazy" 
                                decoding="async" 
                                src="https://picsum.photos/seed/factory/600/450?format=webp&quality=70" 
                                alt="Fábrica da HCE Esquadrias com equipamentos modernos" 
                                width="600" 
                                height="450" 
                                className="absolute w-full h-full object-cover rounded-3xl shadow-2xl"
                            />
                            <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-gray-50 rounded-3xl hidden lg:block"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <section className="bg-slate-800 text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
                    <div ref={addToRefs} className="text-center mb-16 md:mb-20 scroll-reveal">
                        <h2 className="font-bold text-3xl md:text-4xl uppercase text-white tracking-wider">
                            <KineticText text="Nossos Pilares" />
                        </h2>
                    </div>
                    <div ref={addToRefs} className="grid grid-cols-1 md:grid-cols-3 gap-12 scroll-reveal" style={{transitionDelay: '200ms'}}>
                        <div className="bg-transparent p-8 rounded-3xl text-center">
                            <h3 className="font-bold text-3xl uppercase text-white tracking-wider mb-4">Missão</h3>
                            <p className="text-slate-300 text-lg">
                                Entregar soluções em esquadrias de alumínio que superem as expectativas em design, performance e durabilidade.
                            </p>
                        </div>
                        <div className="bg-transparent p-8 rounded-3xl text-center border-y md:border-y-0 md:border-x border-slate-700 my-8 md:my-0 py-12 md:py-8">
                            <h3 className="font-bold text-3xl uppercase text-white tracking-wider mb-4">Visão</h3>
                            <p className="text-slate-300 text-lg">
                                Ser a referência em esquadrias de alto padrão, reconhecida pela precisão técnica, inovação e excelência no atendimento.
                            </p>
                        </div>
                        <div className="bg-transparent p-8 rounded-3xl text-center">
                            <h3 className="font-bold text-3xl uppercase text-white tracking-wider mb-4">Valores</h3>
                            <p className="text-slate-300 text-lg">
                               Qualidade, Precisão, Confiança, Inovação e Parceria.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;