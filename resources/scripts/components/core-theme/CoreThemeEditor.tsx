import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { HexColorPicker } from 'react-colorful';
import { motion, AnimatePresence } from 'framer-motion';
import { useCoreTheme } from './CoreThemeContext';
import AnnouncementEditor from './AnnouncementEditor';
import SidebarCustomizer from './SidebarCustomizer';
import {
    FaCog, FaTimes, FaSnowflake, FaImage, FaPalette,
    FaBullhorn, FaBars, FaCheck
} from 'react-icons/fa';

type Tab = 'colors' | 'announcement' | 'sidebar';

const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'colors', label: 'Colors', icon: <FaPalette /> },
    { key: 'announcement', label: 'Announce', icon: <FaBullhorn /> },
    { key: 'sidebar', label: 'Sidebar', icon: <FaBars /> },
];

export default () => {
    const [isOpen, setIsOpen] = useState(false);
    const [tab, setTab] = useState<Tab>('colors');
    const [saved, setSaved] = useState(false);

    const {
        panelName, setPanelName,
        primaryColor, setPrimaryColor,
        setBgImage, snowEffect, setSnowEffect,
    } = useCoreTheme();

    const { getRootProps: getBgProps, getInputProps: getBgInput } = useDropzone({
        accept: { 'image/*': [] },
        onDrop: (files) => {
            const reader = new FileReader();
            reader.onload = () => setBgImage(reader.result);
            reader.readAsDataURL(files[0]);
        },
    });

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 1500);
    };

    return (
        <>
            {/* Floating Gear */}
            <motion.button
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 p-4 rounded-full shadow-2xl text-white z-50 flex items-center justify-center"
                style={{
                    background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)`,
                    boxShadow: `0 0 30px ${primaryColor}88`,
                }}
            >
                <FaCog size={24} />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto"
                        onClick={() => setIsOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 40, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, y: 40, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            onClick={(e) => e.stopPropagation()}
                            className="core-glass w-full max-w-2xl relative my-8 overflow-hidden"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-5 border-b border-white/10">
                                <div className="flex items-center gap-3">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                                        className="p-2 rounded-xl"
                                        style={{ background: `${primaryColor}22`, color: primaryColor }}
                                    >
                                        <FaCog size={18} />
                                    </motion.div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">Core Theme Editor</h3>
                                        <p className="text-xs text-gray-400">Customize your panel</p>
                                    </div>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.15, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 rounded-lg hover:bg-white/10 transition text-gray-400 hover:text-white"
                                >
                                    <FaTimes size={18} />
                                </motion.button>
                            </div>

                            {/* Tabs */}
                            <div className="flex gap-1 p-2 border-b border-white/10 bg-black/20">
                                {TABS.map((t) => (
                                    <motion.button
                                        key={t.key}
                                        whileHover={{ y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setTab(t.key)}
                                        className="flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition relative overflow-hidden"
                                        style={{
                                            color: tab === t.key ? '#fff' : '#9ca3af',
                                            background:
                                                tab === t.key ? `${primaryColor}33` : 'transparent',
                                        }}
                                    >
                                        {tab === t.key && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute inset-0 rounded-xl"
                                                style={{
                                                    background: `${primaryColor}22`,
                                                    border: `1px solid ${primaryColor}55`,
                                                }}
                                                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                            />
                                        )}
                                        <span className="relative z-10 flex items-center gap-2">
                                            {t.icon} {t.label}
                                        </span>
                                    </motion.button>
                                ))}
                            </div>

                            {/* Content */}
                            <div className="p-5 max-h-[70vh] overflow-y-auto">
                                <AnimatePresence mode="wait">
                                    {tab === 'colors' && (
                                        <motion.div
                                            key="colors"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            className="space-y-5"
                                        >
                                            {/* Panel Name */}
                                            <div>
                                                <label className="text-xs text-gray-400 uppercase mb-1 block font-bold">
                                                    Panel Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={panelName}
                                                    onChange={(e) => setPanelName(e.target.value)}
                                                    className="w-full p-3 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-white/30 text-white text-sm"
                                                />
                                            </div>

                                            {/* Color Picker */}
                                            <div>
                                                <label className="text-xs text-gray-400 uppercase mb-2 block font-bold">
                                                    Primary Color
                                                </label>
                                                <HexColorPicker
                                                    color={primaryColor}
                                                    onChange={setPrimaryColor}
                                                    className="w-full"
                                                />
                                            </div>

                                            {/* Background Drop */}
                                            <div>
                                                <label className="text-xs text-gray-400 uppercase mb-2 block font-bold">
                                                    Background Image
                                                </label>
                                                <div
                                                    {...getBgProps()}
                                                    className="border-2 border-dashed border-white/20 p-6 rounded-xl text-center cursor-pointer hover:border-white/40 transition group"
                                                >
                                                    <input {...getBgInput()} />
                                                    <motion.div
                                                        whileHover={{ scale: 1.1 }}
                                                        className="inline-flex items-center gap-2 text-xs text-gray-400 group-hover:text-white"
                                                    >
                                                        <FaImage /> Drop image or click to select
                                                    </motion.div>
                                                </div>
                                            </div>

                                            {/* Snow Toggle */}
                                            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                                                <span className="text-sm text-gray-300 flex items-center gap-3">
                                                    <FaSnowflake
                                                        className={snowEffect ? 'animate-spin' : ''}
                                                        style={{ color: snowEffect ? primaryColor : '#6b7280' }}
                                                    />
                                                    Snow Effect
                                                </span>
                                                <button
                                                    onClick={() => setSnowEffect(!snowEffect)}
                                                    className="relative w-12 h-6 rounded-full transition-all"
                                                    style={{
                                                        background: snowEffect ? primaryColor : '#374151',
                                                    }}
                                                >
                                                    <motion.div
                                                        layout
                                                        className="absolute top-1 w-4 h-4 bg-white rounded-full"
                                                        style={{ left: snowEffect ? '28px' : '4px' }}
                                                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                                    />
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}

                                    {tab === 'announcement' && (
                                        <motion.div
                                            key="announcement"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                        >
                                            <AnnouncementEditor />
                                        </motion.div>
                                    )}

                                    {tab === 'sidebar' && (
                                        <motion.div
                                            key="sidebar"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                        >
                                            <SidebarCustomizer />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Footer Save */}
                            <div className="p-4 border-t border-white/10 bg-black/20 flex gap-2">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleSave}
                                    className="flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-white transition"
                                    style={{
                                        background: saved
                                            ? '#10b981'
                                            : `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)`,
                                    }}
                                >
                                    {saved ? <><FaCheck /> Saved!</> : 'Save Settings'}
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
