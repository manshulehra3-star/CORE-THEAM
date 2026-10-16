import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaBars, FaServer, FaTerminal, FaFolder, FaDatabase, FaClock,
    FaNetworkWired, FaCog, FaUsers, FaKey, FaPalette, FaSave,
    FaUndo, FaChevronDown, FaChevronUp, FaCheck, FaTimes, FaFire
} from 'react-icons/fa';
import { useCoreTheme } from './CoreThemeContext';

export interface SidebarItem {
    key: string;
    label: string;
    icon: string;
    color: string;
}

const AVAILABLE_ICONS = {
    server: <FaServer />,
    console: <FaTerminal />,
    files: <FaFolder />,
    database: <FaDatabase />,
    schedule: <FaClock />,
    network: <FaNetworkWired />,
    settings: <FaCog />,
    users: <FaUsers />,
    key: <FaKey />,
    palette: <FaPalette />,
    fire: <FaFire />,
    bars: <FaBars />,
};

const DEFAULT_ITEMS: SidebarItem[] = [
    { key: 'console', label: 'Console', icon: 'console', color: '#10b981' },
    { key: 'files', label: 'File Manager', icon: 'files', color: '#6366f1' },
    { key: 'databases', label: 'Databases', icon: 'database', color: '#f59e0b' },
    { key: 'schedules', label: 'Schedules', icon: 'schedule', color: '#8b5cf6' },
    { key: 'users', label: 'Users', icon: 'users', color: '#ec4899' },
    { key: 'network', label: 'Network', icon: 'network', color: '#06b6d4' },
    { key: 'startup', label: 'Startup', icon: 'fire', color: '#ef4444' },
    { key: 'settings', label: 'Settings', icon: 'settings', color: '#6b7280' },
];

export const getSidebarItem = (key: string): SidebarItem | undefined => {
    const saved = localStorage.getItem('core_sidebarItems');
    const items: SidebarItem[] = saved ? JSON.parse(saved) : DEFAULT_ITEMS;
    return items.find((i) => i.key === key);
};

export const getSidebarIcon = (iconName: string): React.ReactNode => {
    return AVAILABLE_ICONS[iconName as keyof typeof AVAILABLE_ICONS] || <FaServer />;
};

export default () => {
    const { primaryColor } = useCoreTheme();
    const [items, setItems] = useState<SidebarItem[]>(() => {
        const saved = localStorage.getItem('core_sidebarItems');
        return saved ? JSON.parse(saved) : DEFAULT_ITEMS;
    });
    const [expandedItem, setExpandedItem] = useState<string | null>(null);
    const [saved, setSaved] = useState(false);

    const saveAll = () => {
        localStorage.setItem('core_sidebarItems', JSON.stringify(items));
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const resetAll = () => {
        if (confirm('Reset sidebar to default?')) {
            setItems(DEFAULT_ITEMS);
            localStorage.removeItem('core_sidebarItems');
        }
    };

    const updateItem = (key: string, updates: Partial<SidebarItem>) => {
        setItems(items.map((i) => (i.key === key ? { ...i, ...updates } : i)));
    };

    return (
        <div className="core-glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        className="p-3 rounded-xl"
                        style={{ background: `${primaryColor}22`, color: primaryColor }}
                    >
                        <FaPalette size={20} />
                    </motion.div>
                    <div>
                        <h2 className="text-lg font-bold text-white">Sidebar Customizer</h2>
                        <p className="text-xs text-gray-400">Icons aur colors change karo</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={resetAll}
                        className="px-3 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 transition flex items-center gap-2"
                    >
                        <FaUndo /> Reset
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={saveAll}
                        className="px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition"
                        style={{ background: saved ? '#10b981' : primaryColor }}
                    >
                        {saved ? <><FaCheck /> Saved!</> : <><FaSave /> Save All</>}
                    </motion.button>
                </div>
            </div>

            <div className="space-y-2">
                {items.map((item, idx) => (
                    <motion.div
                        key={item.key}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="rounded-xl overflow-hidden border border-white/5 bg-white/[0.02]"
                    >
                        <button
                            onClick={() => setExpandedItem(expandedItem === item.key ? null : item.key)}
                            className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition"
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className="p-2 rounded-lg"
                                    style={{ background: `${item.color}22`, color: item.color }}
                                >
                                    {getSidebarIcon(item.icon)}
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-semibold text-white">{item.label}</p>
                                    <p className="text-[10px] text-gray-500 font-mono">{item.key}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span
                                    className="w-4 h-4 rounded-full border border-white/20"
                                    style={{ background: item.color }}
                                />
                                {expandedItem === item.key ? <FaChevronUp /> : <FaChevronDown />}
                            </div>
                        </button>

                        <AnimatePresence>
                            {expandedItem === item.key && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="p-3 pt-0 space-y-3">
                                        {/* Icon picker */}
                                        <div>
                                            <label className="text-[10px] text-gray-400 uppercase mb-1 block">
                                                Icon
                                            </label>
                                            <div className="flex gap-1.5 flex-wrap">
                                                {Object.keys(AVAILABLE_ICONS).map((iconKey) => (
                                                    <motion.button
                                                        key={iconKey}
                                                        whileHover={{ scale: 1.15 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => updateItem(item.key, { icon: iconKey })}
                                                        className={`p-2 rounded-lg text-xs transition ${
                                                            item.icon === iconKey
                                                                ? 'ring-2 ring-white/40'
                                                                : 'bg-white/5 hover:bg-white/10'
                                                        }`}
                                                        style={{
                                                            background:
                                                                item.icon === iconKey
                                                                    ? `${item.color}33`
                                                                    : undefined,
                                                            color:
                                                                item.icon === iconKey ? item.color : '#9ca3af',
                                                        }}
                                                    >
                                                        {AVAILABLE_ICONS[iconKey as keyof typeof AVAILABLE_ICONS]}
                                                    </motion.button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Color picker */}
                                        <div>
                                            <label className="text-[10px] text-gray-400 uppercase mb-1 block">
                                                Color
                                            </label>
                                            <div className="flex gap-2 items-center">
                                                <input
                                                    type="color"
                                                    value={item.color}
                                                    onChange={(e) =>
                                                        updateItem(item.key, { color: e.target.value })
                                                    }
                                                    className="w-10 h-9 rounded-lg cursor-pointer bg-transparent"
                                                />
                                                <input
                                                    type="text"
                                                    value={item.color}
                                                    onChange={(e) =>
                                                        updateItem(item.key, { color: e.target.value })
                                                    }
                                                    className="flex-1 p-2 rounded-lg bg-black/40 border border-white/10 text-xs font-mono outline-none"
                                                />
                                            </div>
                                        </div>

                                        {/* Label rename */}
                                        <div>
                                            <label className="text-[10px] text-gray-400 uppercase mb-1 block">
                                                Label
                                            </label>
                                            <input
                                                type="text"
                                                value={item.label}
                                                onChange={(e) =>
                                                    updateItem(item.key, { label: e.target.value })
                                                }
                                                className="w-full p-2 rounded-lg bg-black/40 border border-white/10 text-sm outline-none"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>

            {/* Live Preview */}
            <div className="mt-6 p-4 rounded-xl bg-black/30 border border-white/5">
                <p className="text-xs text-gray-400 mb-3 uppercase font-bold">👁️ Live Preview</p>
                <div className="flex flex-wrap gap-2">
                    {items.map((item) => (
                        <motion.div
                            key={item.key}
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/5"
                        >
                            <span style={{ color: item.color }}>{getSidebarIcon(item.icon)}</span>
                            <span className="text-xs text-white">{item.label}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};
