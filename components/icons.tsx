import React from 'react';
import {
    FaBars,
    FaTimes,
    FaPhoneAlt,
    FaEnvelope,
    FaMapMarkerAlt,
    FaArrowRight,
    FaCheckCircle,
    FaTools,
    FaShieldAlt,
    FaUsers,
    FaPaperclip,
    FaCommentDots,
    FaWhatsapp,
    FaWpforms,
    FaImages,
    FaPaperPlane,
    FaSyncAlt,
    FaQuestionCircle,
    FaCog,
    FaUserTie,
    FaArrowLeft,
    FaPlay,
    FaUser,
    FaBriefcase,
    FaGraduationCap,
    FaFileUpload,
} from 'react-icons/fa';

export const MenuIcon: React.FC<{ className?: string }> = ({ className }) => <FaBars className={className} />;
export const CloseIcon: React.FC<{ className?: string }> = ({ className }) => <FaTimes className={className} />;
export const PhoneIcon: React.FC<{ className?: string }> = ({ className }) => <FaPhoneAlt className={className} />;
export const MailIcon: React.FC<{ className?: string }> = ({ className }) => <FaEnvelope className={className} />;
export const LocationIcon: React.FC<{ className?: string }> = ({ className }) => <FaMapMarkerAlt className={className} />;
export const ArrowRightIcon: React.FC<{ className?: string }> = ({ className }) => <FaArrowRight className={className} />;
export const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => <FaCheckCircle className={className} />;
export const WrenchScrewdriverIcon: React.FC<{ className?: string }> = ({ className }) => <FaTools className={className} />;
export const ShieldCheckIcon: React.FC<{ className?: string }> = ({ className }) => <FaShieldAlt className={className} />;
export const UserGroupIcon: React.FC<{ className?: string }> = ({ className }) => <FaUsers className={className} />;
export const PaperClipIcon: React.FC<{ className?: string }> = ({ className }) => <FaPaperclip className={className} />;
export const ChatBubbleOvalLeftEllipsisIcon: React.FC<{ className?: string }> = ({ className }) => <FaCommentDots className={className} />;
export const PaperPlaneIcon: React.FC<{ className?: string }> = ({ className }) => <FaPaperPlane className={className} />;
export const RefreshIcon: React.FC<{ className?: string }> = ({ className }) => <FaSyncAlt className={className} />;
export const PlayIcon: React.FC<{ className?: string }> = ({ className }) => <FaPlay className={className} />;
export const ArrowLeftIcon: React.FC<{ className?: string }> = ({ className }) => <FaArrowLeft className={className} />;


// Icons for the new Project Assistant
export const QuoteIcon: React.FC<{ className?: string }> = ({ className }) => <FaWpforms className={className} />;
export const WhatsAppIcon: React.FC<{ className?: string }> = ({ className }) => <FaWhatsapp className={className} />;
export const ServicesIcon: React.FC<{ className?: string }> = ({ className }) => <FaTools className={className} />;
export const PortfolioIcon: React.FC<{ className?: string }> = ({ className }) => <FaImages className={className} />;

// Icons for the data-driven Chatbot
export const QuestionIcon: React.FC<{ className?: string }> = ({ className }) => <FaQuestionCircle className={className} />;
export const CogIcon: React.FC<{ className?: string }> = ({ className }) => <FaCog className={className} />;
export const UserTieIcon: React.FC<{ className?: string }> = ({ className }) => <FaUserTie className={className} />;

// Icons for Application Form
export const UserIcon: React.FC<{ className?: string }> = ({ className }) => <FaUser className={className} />;
export const BriefcaseIcon: React.FC<{ className?: string }> = ({ className }) => <FaBriefcase className={className} />;
export const GraduationCapIcon: React.FC<{ className?: string }> = ({ className }) => <FaGraduationCap className={className} />;
export const FileUploadIcon: React.FC<{ className?: string }> = ({ className }) => <FaFileUpload className={className} />;
