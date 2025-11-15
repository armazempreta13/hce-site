import React, { useState, useEffect } from 'react';
import { PhoneIcon, MailIcon, LocationIcon, PaperClipIcon, ArrowRightIcon } from './icons';

// Initial state for the form
const initialFormData = {
    name: '',
    email: '',
    whatsapp: '',
    projectType: '',
    service: '',
    message: '',
};

// Simple email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// WhatsApp validation regex (handles formats like (XX) XXXXX-XXXX)
const whatsappRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;


const ProgressBar: React.FC<{ currentStep: number; totalSteps: number }> = ({ currentStep, totalSteps }) => {
    return (
        <div className="w-full bg-slate-200 rounded-full h-2.5 mb-12">
            <div
                className="bg-primary h-2.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
        </div>
    );
};


const ContactPage: React.FC = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState<Partial<typeof initialFormData>>({});
    const [fileName, setFileName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Persist form data in localStorage
    useEffect(() => {
        try {
            const savedData = localStorage.getItem('contactFormData');
            if (savedData) {
                setFormData(JSON.parse(savedData));
            }
        } catch (e) {
            console.error("Failed to parse contact form data from localStorage", e)
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('contactFormData', JSON.stringify(formData));
    }, [formData]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        let formattedValue = value;
        if (name === 'whatsapp') {
            // Auto-format WhatsApp number
            formattedValue = value
                .replace(/\D/g, '')
                .replace(/^(\d{2})(\d)/g, '($1) $2')
                .replace(/(\d{4,5})(\d{4})/, '$1-$2')
                .slice(0, 15);
        }

        setFormData(prevState => ({ ...prevState, [name]: formattedValue }));
        
        // Clear error when user starts typing
        if (errors[name as keyof typeof errors]) {
            setErrors(prevErrors => {
                const newErrors = { ...prevErrors };
                delete newErrors[name as keyof typeof errors];
                return newErrors;
            });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFileName(e.target.files[0].name);
        } else {
            setFileName('');
        }
    };

    const validateStep = (): boolean => {
        const newErrors: Partial<typeof initialFormData> = {};
        if (step === 1) {
            if (!formData.name.trim()) newErrors.name = 'O nome é obrigatório.';
            if (!formData.email.trim()) {
                newErrors.email = 'O e-mail é obrigatório.';
            } else if (!emailRegex.test(formData.email)) {
                newErrors.email = 'Formato de e-mail inválido.';
            }
            if (!formData.whatsapp.trim()) {
                newErrors.whatsapp = 'O WhatsApp é obrigatório.';
            } else if (!whatsappRegex.test(formData.whatsapp)) {
                 newErrors.whatsapp = 'Use o formato (XX) XXXXX-XXXX.';
            }
        } else if (step === 2) {
            if (!formData.projectType) newErrors.projectType = 'Selecione o tipo de projeto.';
            if (!formData.service) newErrors.service = 'Selecione um serviço.';
            if (!formData.message.trim() || formData.message.length < 10) {
                newErrors.message = 'Descreva sua necessidade (mín. 10 caracteres).';
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateAllSteps = (): boolean => {
        const newErrors: Partial<typeof initialFormData> = {};
        
        // Step 1 validation
        if (!formData.name.trim()) newErrors.name = 'O nome é obrigatório.';
        if (!formData.email.trim()) {
            newErrors.email = 'O e-mail é obrigatório.';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Formato de e-mail inválido.';
        }
        if (!formData.whatsapp.trim()) {
            newErrors.whatsapp = 'O WhatsApp é obrigatório.';
        } else if (!whatsappRegex.test(formData.whatsapp)) {
             newErrors.whatsapp = 'Use o formato (XX) XXXXX-XXXX.';
        }

        // Step 2 validation
        if (!formData.projectType) newErrors.projectType = 'Selecione o tipo de projeto.';
        if (!formData.service) newErrors.service = 'Selecione um serviço.';
        if (!formData.message.trim() || formData.message.length < 10) {
            newErrors.message = 'Descreva sua necessidade (mín. 10 caracteres).';
        }
        
        setErrors(newErrors);

        const step1Fields: (keyof typeof initialFormData)[] = ['name', 'email', 'whatsapp'];
        
        const errorKeys = Object.keys(newErrors) as (keyof typeof initialFormData)[];
        
        // If validation fails, go back to the first step with an error
        if (errorKeys.some(key => step1Fields.includes(key))) {
            setStep(1);
            return false;
        }
        if (errorKeys.length > 0) { // Any other errors must be on step 2
            setStep(2);
            return false;
        }

        return true;
    }


    const nextStep = () => {
        if (validateStep()) {
            setStep(prev => prev < 3 ? prev + 1 : prev);
        }
    }
    const prevStep = () => setStep(prev => prev > 1 ? prev - 1 : prev);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateAllSteps()) {
            setIsSubmitting(true);

            const messageParts = [
                "Olá HCE Esquadrias!",
                "Gostaria de solicitar um orçamento. Seguem os detalhes:",
                "",
                "*INFORMAÇÕES DE CONTATO*",
                `- Nome: ${formData.name}`,
                `- E-mail: ${formData.email}`,
                `- WhatsApp: ${formData.whatsapp}`,
                "",
                "*DETALHES DO PROJETO*",
                `- Tipo de Projeto: ${formData.projectType}`,
                `- Serviço de Interesse: ${formData.service}`,
                `- Mensagem:\n${formData.message}`,
            ];

            if (fileName) {
                messageParts.push(`\n*Arquivo Anexado:* ${fileName} (Enviarei a seguir)`);
            }
            
            messageParts.push("\nAguardo o retorno. Obrigado!");
            
            const fullMessage = messageParts.join('\n');
            const phoneNumber = '5561993619554';
            const encodedMessage = encodeURIComponent(fullMessage);
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

            // Short delay for UX before redirecting
            setTimeout(() => {
                localStorage.removeItem('contactFormData');
                window.location.href = whatsappUrl;
            }, 1000);
        }
    };
    
    const getFormElementClasses = (fieldName: keyof typeof formData) => {
        const baseClasses = "minimal-input w-full px-0 py-2 bg-transparent border-0 border-b-2 focus:ring-0 transition-colors text-lg text-primary placeholder-transparent";
        return `${baseClasses} ${errors[fieldName] ? 'border-red-500 focus:border-red-600' : 'border-slate-300 focus:border-primary'}`;
    }

    return (
        <div className="bg-soft-gray pt-40 pb-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12 max-w-4xl mx-auto">
                     <h1 className="font-armstrong text-4xl md:text-5xl uppercase text-heading tracking-wider">
                        Solicite um Orçamento
                    </h1>
                    <p className="mt-4 text-lg text-body/70">Siga os 3 passos para nos enviar os detalhes do seu projeto. Nossa equipe técnica retornará o mais breve possível.</p>
                </div>

                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
                    {/* Form Column */}
                    <div className="lg:col-span-2 bg-white p-8 sm:p-12 rounded-4xl shadow-lg">
                       <ProgressBar currentStep={step} totalSteps={3} />
                        <form onSubmit={handleSubmit} noValidate>
                            {step === 1 && (
                                <div className="space-y-10 animate-fade-in-up">
                                    <h2 className="font-armstrong text-2xl uppercase text-heading">Passo 1: Suas Informações de Contato</h2>
                                    <div className="input-group">
                                        <input type="text" name="name" id="name" required className={getFormElementClasses('name')} value={formData.name} onChange={handleChange} placeholder="Seu Nome" />
                                        <label htmlFor="name" className="animated-label">Seu Nome</label>
                                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="input-group">
                                            <input type="email" name="email" id="email" required className={getFormElementClasses('email')} value={formData.email} onChange={handleChange} placeholder="Seu E-mail" />
                                            <label htmlFor="email" className="animated-label">Seu E-mail</label>
                                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                        </div>
                                        <div className="input-group">
                                            <input type="tel" name="whatsapp" id="whatsapp" required className={getFormElementClasses('whatsapp')} placeholder="(XX) XXXXX-XXXX" value={formData.whatsapp} onChange={handleChange} maxLength={15} />
                                            <label htmlFor="whatsapp" className="animated-label">Seu WhatsApp</label>
                                            {errors.whatsapp && <p className="text-red-500 text-sm mt-1">{errors.whatsapp}</p>}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-10 animate-fade-in-up">
                                    <h2 className="font-armstrong text-2xl uppercase text-heading">Passo 2: Detalhes do Projeto</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="input-group select-wrapper">
                                            <select name="projectType" id="projectType" required className={getFormElementClasses('projectType')} value={formData.projectType} onChange={handleChange}>
                                                <option value="" disabled></option>
                                                <option value="Construção">Construção</option>
                                                <option value="Reforma">Reforma</option>
                                                <option value="Comercial">Comercial</option>
                                            </select>
                                            <label htmlFor="projectType" className="animated-label">Tipo de Projeto</label>
                                            {errors.projectType && <p className="text-red-500 text-sm mt-1">{errors.projectType}</p>}
                                        </div>
                                        <div className="input-group select-wrapper">
                                            <select name="service" id="service" required className={getFormElementClasses('service')} value={formData.service} onChange={handleChange}>
                                                <option value="" disabled></option>
                                                <option value="Esquadrias (Janelas/Portas)">Esquadrias (Janelas/Portas)</option>
                                                <option value="Ripados e Brises">Ripados e Brises</option>
                                                <option value="Guarda-corpo">Guarda-corpo</option>
                                                <option value="Pele de Vidro">Pele de Vidro</option>
                                                <option value="Manutencao Predial">Manutenção Predial</option>
                                            </select>
                                            <label htmlFor="service" className="animated-label">Serviço de Interesse</label>
                                            {errors.service && <p className="text-red-500 text-sm mt-1">{errors.service}</p>}
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <textarea name="message" id="message" rows={4} required className={getFormElementClasses('message')} placeholder="Descreva sua necessidade..." value={formData.message} onChange={handleChange}></textarea>
                                        <label htmlFor="message" className="animated-label">Sua Mensagem</label>
                                        {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-10 animate-fade-in-up">
                                    <h2 className="font-armstrong text-2xl uppercase text-heading">Passo 3: Anexos e Finalização</h2>
                                    <p className="text-body/80">Se tiver uma planta, projeto ou foto, você pode anexar aqui (opcional). Isso nos ajuda a criar um orçamento mais preciso.</p>
                                    <div>
                                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-lg font-medium text-primary/80 hover:text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary flex items-center justify-center border-2 border-dashed border-slate-300 p-6 transition-colors hover:border-primary/50">
                                            <PaperClipIcon className="w-6 h-6 mr-3" />
                                            <span className="text-lg truncate max-w-full">{fileName || 'Anexar Planta ou Foto'}</span>
                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                                        </label>
                                    </div>
                                </div>
                            )}

                            <div className="mt-12 flex justify-between items-center">
                                <button type="button" onClick={prevStep} className={`font-bold text-body/80 transition-all duration-300 ${step === 1 ? 'opacity-0 pointer-events-none' : 'opacity-100 hover:text-primary'}`}>
                                    Voltar
                                </button>
                                {step < 3 ? (
                                    <button type="button" onClick={nextStep} className="inline-flex items-center bg-primary text-white font-bold font-poppins text-lg uppercase px-10 py-4 rounded-full transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg shimmer-effect">
                                        Avançar <ArrowRightIcon className="w-5 h-5 ml-2"/>
                                    </button>
                                ) : (
                                    <button type="submit" disabled={isSubmitting} className="inline-flex items-center justify-center bg-primary text-white font-bold font-poppins text-lg uppercase px-10 py-4 rounded-full transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg shimmer-effect disabled:opacity-70 disabled:cursor-not-allowed min-w-[240px]">
                                        {isSubmitting ? (
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        ) : 'Enviar Solicitação'}
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Info Column */}
                    <div className="lg:col-span-1 space-y-8 mt-10 lg:mt-0">
                         <div className="bg-primary text-white p-8 rounded-3xl">
                             <h3 className="font-armstrong text-2xl uppercase text-white mb-4">Escolha de Arquitetos e Construtoras</h3>
                             <p className="text-slate-300">Nossa precisão e compromisso com a qualidade nos tornam o parceiro ideal para projetos que exigem o máximo de performance e estética.</p>
                         </div>
                        <div className="p-8">
                             <h3 className="font-armstrong text-2xl uppercase text-heading mb-6">Contato Direto</h3>
                            <ul className="space-y-6 text-body text-lg">
                                <li className="flex items-start">
                                    <LocationIcon className="w-6 h-6 mr-4 mt-1 text-primary flex-shrink-0" />
                                    <span>Brasília - DF, Brasil</span>
                                </li>
                                <li className="flex items-center">
                                    <PhoneIcon className="w-6 h-6 mr-4 text-primary flex-shrink-0" />
                                    <a href="tel:+5561993619554" className="hover:text-primary transition-colors duration-300">(61) 9 9361-9554</a>
                                </li>
                                <li className="flex items-center">
                                    <MailIcon className="w-6 h-6 mr-4 text-primary flex-shrink-0" />
                                    <a href="mailto:hceesquadrias@yahoo.com" className="hover:text-primary transition-colors duration-300">hceesquadrias@yahoo.com</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;