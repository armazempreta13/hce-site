

import React, { useState, useMemo } from 'react';
import { CloseIcon } from './icons';

type Category = 'Todos' | 'Residencial' | 'Comercial' | 'Industrial';

interface Project {
    id: number;
    title: string;
    category: Category;
    image: string;
    imageWidth: number;
    imageHeight: number;
    description: string;
    details: {
        Local: string;
        Linha: string;
        Acabamento: string;
    };
    gallery: string[];
}

const portfolioData: Project[] = [
    { id: 1, title: 'Residência Lago Sul', category: 'Residencial', image: 'https://picsum.photos/seed/p1/400/560?format=webp&quality=70', imageWidth: 400, imageHeight: 560, description: 'Projeto completo de esquadrias para residência de alto padrão, integrando ambientes internos e externos.', details: { Local: 'Lago Sul, DF', Linha: 'Alumínio Gold', Acabamento: 'Preto Fosco' }, gallery: ['https://picsum.photos/seed/p1-g1/1024/768?format=webp&quality=70', 'https://picsum.photos/seed/p1-g2/1024/768?format=webp&quality=70', 'https://picsum.photos/seed/p1-g3/1024/768?format=webp&quality=70'] },
    { id: 2, title: 'Edifício Corporativo Noroeste', category: 'Comercial', image: 'https://picsum.photos/seed/p2/400/640?format=webp&quality=70', imageWidth: 400, imageHeight: 640, description: 'Fachada em pele de vidro e esquadrias para escritórios, focando em isolamento acústico e eficiência energética.', details: { Local: 'Setor Noroeste, DF', Linha: 'Sistema Atlanta', Acabamento: 'Prata Anodizado' }, gallery: ['https://picsum.photos/seed/p2-g1/1024/768?format=webp&quality=70', 'https://picsum.photos/seed/p2-g2/1024/768?format=webp&quality=70'] },
    { id: 3, title: 'Galpão Industrial SIA', category: 'Industrial', image: 'https://picsum.photos/seed/p3/400/480?format=webp&quality=70', imageWidth: 400, imageHeight: 480, description: 'Janelas e portões de alumínio de alta resistência para complexo industrial.', details: { Local: 'SIA, DF', Linha: 'Suprema', Acabamento: 'Branco Epóxi' }, gallery: ['https://picsum.photos/seed/p3-g1/1024/768?format=webp&quality=70'] },
    { id: 4, title: 'Casa no Jardim Botânico', category: 'Residencial', image: 'https://picsum.photos/seed/p4/400/520?format=webp&quality=70', imageWidth: 400, imageHeight: 520, description: 'Grandes vãos de vidro com portas de correr que conectam a casa à natureza.', details: { Local: 'Jardim Botânico, DF', Linha: 'Alumínio Gold', Acabamento: 'Efeito Madeira' }, gallery: ['https://picsum.photos/seed/p4-g1/1024/768?format=webp&quality=70', 'https://picsum.photos/seed/p4-g2/1024/768?format=webp&quality=70', 'https://picsum.photos/seed/p4-g3/1024/768?format=webp&quality=70'] },
    { id: 5, title: 'Loja Conceito Asa Sul', category: 'Comercial', image: 'https://picsum.photos/seed/p5/400/600?format=webp&quality=70', imageWidth: 400, imageHeight: 600, description: 'Vitrine imponente com porta pivotante de alumínio, refletindo a sofisticação da marca.', details: { Local: 'Asa Sul, DF', Linha: 'Personalizada', Acabamento: 'Dourado Escovado' }, gallery: ['https://picsum.photos/seed/p5-g1/1024/768?format=webp&quality=70', 'https://picsum.photos/seed/p5-g2/1024/768?format=webp&quality=70'] },
    { id: 6, title: 'Cobertura em Águas Claras', category: 'Residencial', image: 'https://picsum.photos/seed/p6/400/680?format=webp&quality=70', imageWidth: 400, imageHeight: 680, description: 'Fechamento de sacada com sistema retrátil e guarda-corpos em alumínio e vidro.', details: { Local: 'Águas Claras, DF', Linha: 'Sistema Stanley', Acabamento: 'Preto Fosco' }, gallery: ['https://picsum.photos/seed/p6-g1/1024/768?format=webp&quality=70', 'https://picsum.photos/seed/p6-g2/1024/768?format=webp&quality=70'] },
];

const PortfolioPage: React.FC = () => {
    const [activeFilter, setActiveFilter] = useState<Category>('Todos');
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const filteredProjects = useMemo(() => {
        if (activeFilter === 'Todos') return portfolioData;
        return portfolioData.filter(p => p.category === activeFilter);
    }, [activeFilter]);
    
    const openModal = (project: Project) => {
        setSelectedProject(project);
        setCurrentImageIndex(0);
        document.body.style.overflow = 'hidden';
    }
    const closeModal = () => {
        setSelectedProject(null);
        document.body.style.overflow = 'auto';
    }

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if(selectedProject) {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % selectedProject.gallery.length);
        }
    }

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if(selectedProject) {
            setCurrentImageIndex((prevIndex) => (prevIndex - 1 + selectedProject.gallery.length) % selectedProject.gallery.length);
        }
    }


    const FilterButton: React.FC<{ category: Category }> = ({ category }) => (
         <button
            onClick={() => setActiveFilter(category)}
            className={`px-6 py-3 rounded-full font-poppins font-semibold text-md transition-all duration-300 ease-in-out transform hover:scale-105 ${activeFilter === category ? 'bg-primary text-white shadow-lg' : 'bg-white text-body hover:bg-slate-200 shadow-sm'}`}
        >
            {category}
        </button>
    );

    return (
        <div className="bg-soft-gray pt-40">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                 <div className="text-center max-w-4xl mx-auto">
                     <h1 className="font-armstrong text-4xl md:text-5xl uppercase text-heading tracking-wider">
                        Projetos que Inspiram
                    </h1>
                     <p className="mt-4 text-lg text-body/80">
                        Navegue por nossa galeria e veja a precisão e o design da HCE em ação. Cada projeto é um testemunho da nossa capacidade de transformar espaços com alumínio de alta performance.
                    </p>
                </div>
                <div className="flex justify-center flex-wrap gap-4 my-16">
                    <FilterButton category="Todos" />
                    <FilterButton category="Residencial" />
                    <FilterButton category="Comercial" />
                    <FilterButton category="Industrial" />
                </div>

                <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-8 space-y-8">
                    {filteredProjects.map(project => (
                        <div key={project.id} className="break-inside-avoid cursor-pointer group" onClick={() => openModal(project)}>
                            <div className="relative overflow-hidden rounded-4xl shadow-lg">
                                <img loading="lazy" decoding="async" src={project.image} alt={project.title} width={project.imageWidth} height={project.imageHeight} className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                                    <h3 className="text-white font-armstrong text-2xl uppercase transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 ease-in-out delay-100">{project.title}</h3>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal Lightbox */}
            {selectedProject && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4" onClick={closeModal}>
                    <div className="relative bg-black rounded-4xl w-full max-w-6xl h-[90vh] shadow-2xl flex flex-col md:flex-row overflow-hidden animate-fadeInUp" onClick={e => e.stopPropagation()}>
                        <button onClick={closeModal} className="absolute top-4 right-4 text-white bg-white/10 hover:bg-white/30 rounded-full p-2 transition-colors z-20" aria-label="Fechar">
                            <CloseIcon className="w-6 h-6" />
                        </button>
                        
                        <div className="w-full md:w-2/3 h-full relative">
                           <img loading="lazy" decoding="async" src={selectedProject.gallery[currentImageIndex]} alt={`${selectedProject.title} - Imagem ${currentImageIndex + 1}`} width="1024" height="768" className="w-full h-full object-contain"/>
                           {selectedProject.gallery.length > 1 && (
                               <>
                                   <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 rounded-full p-3 text-white transition-colors text-2xl leading-none shadow-lg">‹</button>
                                   <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 rounded-full p-3 text-white transition-colors text-2xl leading-none shadow-lg">›</button>
                               </>
                           )}
                       </div>
                       <div className="w-full md:w-1/3 h-full p-8 overflow-y-auto bg-primary/50 backdrop-blur-lg border-l border-white/10">
                           <h2 className="font-armstrong text-2xl uppercase text-white mb-2">{selectedProject.title}</h2>
                           <p className="font-semibold text-white/70 mb-4">{selectedProject.category}</p>
                           <p className="text-white/80 mb-6">{selectedProject.description}</p>
                           <div className="border-t border-white/20 pt-6">
                               <h4 className="font-armstrong text-lg uppercase text-white mb-3">Detalhes Técnicos</h4>
                               <ul className="space-y-2">
                                   {Object.entries(selectedProject.details).map(([key, value]) => (
                                       <li key={key} className="text-sm"><strong className="font-medium text-white/90">{key}:</strong> <span className="text-white/70">{value}</span></li>
                                   ))}
                               </ul>
                           </div>
                       </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PortfolioPage;