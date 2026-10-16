import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaBullhorn, FaSave, FaCheck, FaInfoCircle, FaExclamationTriangle,
    FaCheckCircle, FaFire, FaEye
} from 'react-icons/fa';
import { getAnnouncement, AnnouncementData, AnnouncementType } from './AnnouncementBanner';
import { useCoreTheme } from './CoreThemeContext';

const TYPES: { key: AnnouncementType; icon: React.ReactNode; color: string; label: string }[] = [
    { key: 'info', icon: <FaInfoCircle />, color: '#06b6d4', label: 'Info' },
    { key: 'warning', icon: <FaExclamationTriangle />, color: '#f59e0b', label: 'Warning' },
    { key: 'success', icon: <FaCheckCircle />, color: '#10b981', label: 'Success' },
    { key: 'urgent', icon: <FaFire />, color: '#ef4444', label: 'Urgent' },
];

export default () => {
    const { primaryColor } = useCoreTheme();
    const [data, setData] = useState<AnnouncementData>(getAnnouncement);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        setData(getAnnouncement());
    }, []);

    const save = () => {
        localStorage.setItem('core_announcement', JSON.stringify(data));
        window.dispatchEvent(new Event('core-announcement-update'));
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="core-glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <motion.div
                        whileHover={{ rotate: [0, -15, 15, 0] }}
                        transition={{ duration: 0.6 }}
                        className="p-3 rounded-xl"
                        style={{ background: `${primaryColor}22`, color: primaryColor }}
                    >
                        <FaBullhorn size={20} />
                    </motion.div>
                    <div>
                        <h2 className="text-lg font-bold text-white">Announcement</h2>
                        <p className="text-xs text-gray-400">Panel ke top pe dikhega</p>
                    </div>
                </div>

                {/* Enable toggle */}
                <button
                    onClick={() => setData({ ...data, enabled: !data.enabled })}
                    className={`relative w-14 h-7 rounded-full transition-all`}
                    style={{ background: data.enabled ? primaryColor : '#374151' }}
                >
                    <motion.div
                        layout
                        className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-lg"
                        style={{ left: data.enabled ? '32px' : '4px' }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                </button>
            </div>

            <AnimatePresence>
                {data.enabled && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden space-y-4"
                    >
                        {/* Type picker */}
                        <div>
                            <label className="text-xs text-gray-400 uppercase mb-2 block font-bold">
                                Type
                            </label>
                            <div className="grid grid-cols-4 gap-2">
                                {TYPES.map((t) => (
                                    <motion.button
                                        key={t.key}
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setData({ ...data, type: t.key })}
                                        className={`p-3 rounded-xl flex flex-col items-center gap-1.5 transition ${
                                            data.type === t.key ? 'ring-2' : 'bg-white/5 hover:bg-white/10'
                                        }`}
                                        style={{
                                            background:
                                                data.type === t.key ? `${t.color}22` : undefined,
                                            color: data.type === t.key ? t.color : '#9ca3af',
                                            // @ts-ignore
                                            '--tw-ring-color': t.color,
                                        }}
                                    >
                                        {t.icon}
                                        <span className="text-[10px] font-bold">{t.label}</span>
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Title */}
                        <div>
                            <label className="text-xs text-gray-400 uppercase mb-1 block font-bold">
                                Title
                            </label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) => setData({ ...data, title: e.target.value })}
                                placeholder="🎉 Server Sale 50% OFF!"
                                className="w-full p-3 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-white/30 text-sm text-white"
                            />
                        </div>

                        {/* Message */}
                        <div>
                            <label className="text-xs text-gray-400 uppercase mb-1 block font-bold">
                                Message
                            </label>
                            <textarea
                                value={data.message}
                                onChange={(e) => setData({ ...data, message: e.target.value })}
                                placeholder="Use code CORE50 to get 50% off on all plans!"
                                rows={3}
                                className="w-full p-3 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-white/30 text-sm text-white resize-none"
                            />
                        </div>

                        {/* Dismissible */}
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={data.dismissible}
                                onChange={(e) => setData({ ...data, dismissible: e.target.checked })}
                                style={{ accentColor: primaryColor }}
                            />
                            <span className="text-sm text-gray-300">Allow users to dismiss</span>
                        </label>

                        {/* Live preview */}
                        <div>
                            <p className="text-xs text-gray-400 uppercase mb-2 font-bold flex items-center gap-2">
                                <FaEye /> Live Preview
                            </p>
                            <div
                                className="p-3 rounded-xl text-sm"
                                style={{
                                    background: TYPES.find((t) => t.key === data.type)?.color + '15',
                                    border: `1px solid ${TYPES.find((t) => t.key === data.type)?.color}55`,
                                }}
                            >
                                <p className="font-bold text-white text-xs mb-1">{data.title || 'Title...'}</p>
                                <p className="text-gray-300 text-xs">{data.message || 'Message...'}</p>
                            </div>
                        </div>

                        {/* Save */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={save}
                            className="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition"
                            style={{ background: saved ? '#10b981' : primaryColor }}
                        >
                            {saved ? <><FaCheck /> Saved!</> : <><FaSave /> Save Announcement</>}
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
