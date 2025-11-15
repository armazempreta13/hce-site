import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal, KineticText } from './ui/Animations';
import { ArrowRightIcon, MailIcon } from './icons';
import JobApplicationForm from './JobApplicationForm';

// ==================== CONFIGURAÇÃO DE VAGAS ====================
// Altere para 'false' para ocultar a seção de vagas abertas
const areJobsAvailable: boolean = true; 
// =============================================================

// --- Dados da Equipe (10 membros) ---
const teamMembers = [
  // Liderança
  {
    name: 'Hércules',
    role: 'Sócio-Fundador',
    bio: 'Fundador da HCE, Hércules lidera com a visão técnica e a paixão pela precisão que definem a empresa desde o início.',
    image: 'https://picsum.photos/seed/hercules/400/400?format=webp&quality=70',
    isLeadership: true,
  },
  {
    name: 'Cleide',
    role: 'Sócia-Fundadora & RH',
    bio: 'Responsável pela gestão de pessoas e operações, Cleide é o pilar que garante a força e a coesão da nossa equipe.',
    image: 'https://picsum.photos/seed/cleide/400/400?format=webp&quality=70',
    isLeadership: true,
  },
  // Equipe
  {
    name: 'Funcionário 1',
    role: 'Encarregado de Obras',
    image: 'https://picsum.photos/seed/team1/400/400?format=webp&quality=70',
    isLeadership: false,
  },
  {
    name: 'Funcionário 2',
    role: 'Instalador Líder',
    image: 'https://picsum.photos/seed/team2/400/400?format=webp&quality=70',
    isLeadership: false,
  },
  {
    name: 'Funcionário 3',
    role: 'Serralheiro Especialista',
    image: 'https://picsum.photos/seed/team3/400/400?format=webp&quality=70',
    isLeadership: false,
  },
  {
    name: 'Funcionário 4',
    role: 'Montador de Esquadrias',
    image: 'https://picsum.photos/seed/team4/400/400?format=webp&quality=70',
    isLeadership: false,
  },
  {
    name: 'Funcionário 5',
    role: 'Consultor Técnico',
    image: 'https://picsum.photos/seed/team5/400/400?format=webp&quality=70',
    isLeadership: false,
  },
  {
    name: 'Funcionário 6',
    role: 'Auxiliar de Produção',
    image: 'https://picsum.photos/seed/team6/400/400?format=webp&quality=70',
    isLeadership: false,
  },
  {
    name: 'Funcionário 7',
    role: 'Logística e Estoque',
    image: 'https://picsum.photos/seed/team7/400/400?format=webp&quality=70',
    isLeadership: false,
  },
  {
    name: 'Funcionário 8',
    role: 'Administrativo',
    image: 'https://picsum.photos/seed/team8/400/400?format=webp&quality=70',
    isLeadership: false,
  },
];


// --- Dados das Vagas ---
const jobOpenings = [
    {
        title: 'Ajudante Geral de Instalação',
        description: 'Buscamos um profissional proativo e com vontade de aprender para auxiliar nossa equipe de instaladores em obras de alto padrão. Não exige experiência prévia na área, mas vivência em obras é um diferencial.',
    }
];

const leadership = teamMembers.filter(m => m.isLeadership);
const team = teamMembers.filter(m => !m.isLeadership);

const TeamPage: React.FC = () => {
    const addToRefs = useScrollReveal();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState('');

    const openForm = (jobTitle: string) => {
        setSelectedJob(jobTitle);
        setIsFormOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeForm = () => {
        setIsFormOpen(false);
        document.body.style.overflow = 'auto';
    };


    return (
        <div className="bg-white pt-28 sm:pt-32 md:pt-40">
            {/* Cabeçalho */}
            <header className="bg-soft-gray pb-16 md:pb-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
                    <h1 ref={addToRefs} className="font-armstrong text-4xl md:text-5xl uppercase text-heading tracking-wider scroll-reveal">
                        <KineticText text="Nossa Força, Nossa Gente" />
                    </h1>
                    <p ref={addToRefs} className="mt-4 text-lg text-body/80 scroll-reveal" style={{ transitionDelay: '200ms' }}>
                        Conheça os especialistas que dedicam seu talento e precisão para transformar projetos em realidade.
                    </p>
                </div>
            </header>

            {/* Seção de Liderança */}
            <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                 <div ref={addToRefs} className="text-center max-w-3xl mx-auto mb-16 scroll-reveal">
                    <h2 className="font-armstrong text-3xl md:text-4xl uppercase text-heading tracking-tight">
                        <KineticText text="Liderança" />
                    </h2>
                     <p className="mt-4 text-lg text-body/80">
                        A visão e a experiência que guiam a HCE Esquadrias rumo à excelência.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 max-w-5xl mx-auto">
                    {leadership.map((member, index) => (
                        <div key={member.name} ref={addToRefs} className="text-center scroll-reveal" style={{ transitionDelay: `${index * 150}ms` }}>
                            <div className="relative w-48 h-48 lg:w-56 lg:h-56 mx-auto mb-6">
                                <img src={member.image} alt={member.name} className="w-full h-full object-cover rounded-full shadow-2xl" loading="lazy" />
                                <div className="absolute inset-0 border-4 border-primary/20 rounded-full transform scale-110"></div>
                            </div>
                            <h3 className="font-armstrong text-2xl uppercase text-heading">{member.name}</h3>
                            <p className="font-semibold text-primary/80 mb-3">{member.role}</p>
                            <p className="text-body max-w-xs mx-auto">{member.bio}</p>
                        </div>
                    ))}
                </div>
            </section>
            
            {/* Seção da Equipe */}
            <section className="bg-soft-gray py-16 md:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div ref={addToRefs} className="text-center max-w-3xl mx-auto mb-16 scroll-reveal">
                        <h2 className="font-armstrong text-3xl md:text-4xl uppercase text-heading tracking-tight">
                            <KineticText text="Conheça Nossa Equipe" />
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {team.map((member, index) => (
                            <div key={member.name} ref={addToRefs} className="group text-center bg-white p-6 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 scroll-reveal" style={{ transitionDelay: `${index * 100}ms` }}>
                                <img src={member.image} alt={member.name} className="w-32 h-32 object-cover rounded-full mx-auto mb-4 shadow-md transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                                <h3 className="font-armstrong text-xl uppercase text-heading">{member.name}</h3>
                                <p className="font-semibold text-primary/70 text-sm">{member.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Seção de Recrutamento */}
            <section id="carreiras" className="bg-primary text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
                    <h2 ref={addToRefs} className="font-armstrong text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight mb-6 scroll-reveal">
                       <KineticText text="Faça Parte da Nossa Equipe" />
                    </h2>
                    <p ref={addToRefs} className="text-white/80 text-lg sm:text-xl max-w-3xl mx-auto mb-10 leading-relaxed scroll-reveal" style={{transitionDelay: '200ms'}}>
                        Buscamos talentos apaixonados por precisão e qualidade para crescer conosco e continuar transformando a arquitetura em Brasília.
                    </p>
                    
                    <div ref={addToRefs} className="max-w-3xl mx-auto scroll-reveal" style={{transitionDelay: '400ms'}}>
                        {areJobsAvailable ? (
                            <div className="space-y-6 text-left">
                                <h3 className="font-armstrong text-2xl uppercase text-accent text-center mb-8">Vagas Abertas</h3>
                                {jobOpenings.map((job, index) => (
                                    <div key={index} className="bg-white/10 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
                                        <div>
                                            <h4 className="font-bold text-xl text-white">{job.title}</h4>
                                            <p className="text-white/70 mt-1">{job.description}</p>
                                        </div>
                                        <button onClick={() => openForm(job.title)} className="inline-flex items-center justify-center bg-accent text-primary font-bold text-sm uppercase px-6 py-3 rounded-full transition-all duration-300 ease-in-out hover:scale-105 shimmer-effect flex-shrink-0">
                                           Candidatar-se
                                           <ArrowRightIcon className="w-4 h-4 ml-2"/>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                             <div className="bg-white/10 p-8 rounded-2xl">
                                <h3 className="font-armstrong text-2xl uppercase text-accent mb-4">Banco de Talentos</h3>
                                <p className="text-white/90 mb-6">
                                    No momento não temos vagas abertas, mas estamos sempre em busca de novos talentos. Envie seu currículo para nosso banco de talentos e entraremos em contato para futuras oportunidades.
                                </p>
                                <a href="mailto:hceesquadrias@yahoo.com?subject=Banco de Talentos - HCE" className="inline-flex items-center justify-center bg-accent text-primary font-bold text-base uppercase px-8 py-4 rounded-full transition-all duration-300 ease-in-out hover:scale-105 shimmer-effect">
                                   Enviar Currículo
                                   <MailIcon className="w-5 h-5 ml-2"/>
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {isFormOpen && (
                <JobApplicationForm jobTitle={selectedJob} onClose={closeForm} />
            )}
        </div>
    );
};

export default TeamPage;