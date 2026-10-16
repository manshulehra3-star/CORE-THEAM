import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPowerOff, FaInfoCircle, FaPlay, FaStop, FaServer } from 'react-icons/fa';
import { useCoreTheme } from './CoreThemeContext';

interface ServerProps {
    id: number;
    name: string;
    status: 'running' | 'offline' | 'starting' | 'stopping';
    image?: string;
    memory?: string;
    cpu?: string;
    disk?: string;
    ip?: string;
}

export default ({ server }: { server: ServerProps }) => {
    const { primaryColor } = useCoreTheme();
    const [showDetails, setShowDetails] = useState(false);

    const statusColor = {
        running: 'bg-green-500/20 text-green-400 border-green-500/40',
        offline: 'bg-red-500/20 text-red-400 border-red-500/40',
        starting: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
        stopping: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
    }[server.status];

    const statusDot = {
        running: 'bg-green-500',
        offline: 'bg-red-500',
        starting: 'bg-yellow-500 animate-pulse',
        stopping: 'bg-orange-500 animate-pulse',
    }[server.status];

    const handleRestart = (e: React.MouseEvent) => {
        e.stopPropagation();
        // Wings API call yahan aayega
        fetch(`/api/client/servers/${server.id}/power`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
            },
            body: JSON.stringify({ signal: 'restart' }),
        });
    };

    return (
        <motion.div
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="core-glass relative overflow-hidden rounded-2xl cursor-pointer group"
            onClick={() => (window.location.href = `/server/${server.id}`)}
            style={{ borderTop: `2px solid ${primaryColor}` }}
        >
            {/* Background Image */}
            {server.image && (
                <div
                    className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-300 bg-cover bg-center"
                    style={{ backgroundImage: `url(${server.image})` }}
                />
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

            {/* Content */}
            <div className="relative p-5 z-10">
                {/* Header: Name + Status */}
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                        <FaServer className="text-white/60" size={14} />
                        <h3 className="text-lg font-bold text-white truncate max-w-[140px]">
                            {server.name}
                        </h3>
                    </div>
                    <span className={`px-2 py-1 text-[10px] font-bold rounded-full border ${statusColor} flex items-center gap-1.5`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusDot}`} />
                        {server.status.toUpperCase()}
                    </span>
                </div>

                {/* Details (toggle) */}
                {showDetails && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-1.5 text-xs text-gray-300 mb-4"
                    >
                        <p>💾 RAM: {server.memory || 'N/A'}</p>
                        <p>⚡ CPU: {server.cpu || 'N/A'}</p>
                        <p>💿 Disk: {server.disk || 'N/A'}</p>
                        <p>🌐 IP: {server.ip || 'N/A'}</p>
                    </motion.div>
                )}

                {/* Buttons */}
                <div className="flex gap-2">
                    {/* Restart */}
                    <button
                        onClick={handleRestart}
                        className="flex-1 py-2 rounded-lg text-xs font-semibold text-white transition-all hover:scale-105 active:scale-95"
                        style={{ backgroundColor: `${primaryColor}cc` }}
                    >
                        <FaPowerOff className="inline mr-1.5" size={12} />
                        Restart
                    </button>

                    {/* Details Toggle */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowDetails(!showDetails);
                        }}
                        className="flex-1 py-2 rounded-lg text-xs font-semibold text-white bg-white/10 hover:bg-white/20 transition-all active:scale-95"
                    >
                        <FaInfoCircle className="inline mr-1.5" size={12} />
                        {showDetails ? 'Hide' : 'Details'}
                    </button>
                </div>
            </div>
        </motion.div>
    );
};
