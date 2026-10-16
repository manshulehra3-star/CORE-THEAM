import React, { memo, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEthernet, faHdd, faMemory, faMicrochip, faServer, faPowerOff, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { Server } from '@/api/server/getServer';
import getServerResourceUsage, { ServerPowerState, ServerStats } from '@/api/server/getServerResourceUsage';
import { bytesToString, ip, mbToBytes } from '@/lib/formatters';
import tw from 'twin.macro';
import Spinner from '@/components/elements/Spinner';
import { useCoreTheme } from '@/components/core-theme/CoreThemeContext';
import axios from 'axios';

const isAlarmState = (current: number, limit: number): boolean => limit > 0 && current / (limit * 1024 * 1024) >= 0.9;

type Timer = ReturnType<typeof setInterval>;

export default ({ server, className }: { server: Server; className?: string }) => {
    const interval = useRef<Timer>(null) as React.MutableRefObject<Timer>;
    const [isSuspended, setIsSuspended] = useState(server.status === 'suspended');
    const [stats, setStats] = useState<ServerStats | null>(null);
    const [showDetails, setShowDetails] = useState(false);
    const [restarting, setRestarting] = useState(false);
    const { primaryColor } = useCoreTheme();

    // Per-server image from localStorage
    const serverImage = localStorage.getItem(`core_serverImage_${server.id}`) || '';

    const getStats = () =>
        getServerResourceUsage(server.uuid)
            .then((data) => setStats(data))
            .catch((error) => console.error(error));

    useEffect(() => {
        setIsSuspended(stats?.isSuspended || server.status === 'suspended');
    }, [stats?.isSuspended, server.status]);

    useEffect(() => {
        if (isSuspended || server.isNodeUnderMaintenance) return;
        getStats().then(() => {
            interval.current = setInterval(() => getStats(), 30000);
        });
        return () => {
            interval.current && clearInterval(interval.current);
        };
    }, [isSuspended, server.isNodeUnderMaintenance]);

    const alarms = { cpu: false, memory: false, disk: false };
    if (stats) {
        alarms.cpu = server.limits.cpu === 0 ? false : stats.cpuUsagePercent >= server.limits.cpu * 0.9;
        alarms.memory = isAlarmState(stats.memoryUsageInBytes, server.limits.memory);
        alarms.disk = server.limits.disk === 0 ? false : isAlarmState(stats.diskUsageInBytes, server.limits.disk);
    }

    const diskLimit = server.limits.disk !== 0 ? bytesToString(mbToBytes(server.limits.disk)) : 'Unlimited';
    const memoryLimit = server.limits.memory !== 0 ? bytesToString(mbToBytes(server.limits.memory)) : 'Unlimited';
    const cpuLimit = server.limits.cpu !== 0 ? server.limits.cpu + ' %' : 'Unlimited';

    const status: ServerPowerState | undefined = stats?.status;
    const statusText = isSuspended
        ? 'SUSPENDED'
        : server.isNodeUnderMaintenance
        ? 'MAINTENANCE'
        : server.isTransferring
        ? 'TRANSFERRING'
        : !status
        ? 'LOADING'
        : status.toUpperCase();

    const statusColor =
        statusText === 'RUNNING'
            ? '#10b981'
            : statusText === 'STARTING' || statusText === 'STOPPING'
            ? '#eab308'
            : statusText === 'SUSPENDED' || statusText === 'OFFLINE'
            ? '#ef4444'
            : '#6b7280';

    // Restart handler
    const handleRestart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (restarting) return;
        setRestarting(true);
        try {
            await axios.post(`/api/client/servers/${server.uuid}/power`, { signal: 'restart' });
            setTimeout(() => setRestarting(false), 3000);
        } catch (err) {
            console.error(err);
            setRestarting(false);
        }
    };

    return (
        <Link
            to={`/server/${server.id}`}
            className={className}
            css={tw`block relative overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1`}
            style={{
                background: 'rgba(18, 18, 26, 0.75)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderTop: `2px solid ${primaryColor}`,
                boxShadow: '0 8px 32px rgba(0,0,0,0.37)',
            }}
        >
            {/* Background Image */}
            {serverImage && (
                <div
                    css={tw`absolute inset-0 opacity-20 hover:opacity-30 transition-opacity duration-300`}
                    style={{
                        backgroundImage: `url(${serverImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
            )}
            <div css={tw`absolute inset-0`} style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.3), transparent)' }} />

            {/* Content */}
            <div css={tw`relative p-5 z-10`}>
                {/* Header */}
                <div css={tw`flex justify-between items-start mb-4`}>
                    <div css={tw`flex items-center gap-2 min-w-0`}>
                        <FontAwesomeIcon icon={faServer} css={tw`text-white opacity-60`} />
                        <h3 css={tw`text-lg font-bold text-white truncate`}>{server.name}</h3>
                    </div>
                    <span
                        css={tw`px-2 py-1 text-[10px] font-bold rounded-full flex items-center gap-1.5 flex-shrink-0`}
                        style={{
                            background: `${statusColor}22`,
                            color: statusColor,
                            border: `1px solid ${statusColor}66`,
                        }}
                    >
                        <span css={tw`w-1.5 h-1.5 rounded-full`} style={{ background: statusColor }} />
                        {statusText}
                    </span>
                </div>

                {/* IP */}
                <div css={tw`flex items-center gap-2 mb-3 text-xs text-neutral-400`}>
                    <FontAwesomeIcon icon={faEthernet} />
                    <span>
                        {server.allocations
                            .filter((alloc) => alloc.isDefault)
                            .map((allocation) => `${allocation.alias || ip(allocation.ip)}:${allocation.port}`)
                            .join(', ')}
                    </span>
                </div>

                {/* Details Toggle Content */}
                {showDetails && stats && !isSuspended && !server.isNodeUnderMaintenance && (
                    <div css={tw`grid grid-cols-3 gap-2 my-4 text-xs`}>
                        <div css={tw`text-center p-2 rounded-lg`} style={{ background: 'rgba(255,255,255,0.05)' }}>
                            <FontAwesomeIcon icon={faMicrochip} css={tw`mb-1`} style={{ color: alarms.cpu ? '#ef4444' : '#9ca3af' }} />
                            <p css={tw`text-white font-semibold`}>{stats.cpuUsagePercent.toFixed(1)}%</p>
                            <p css={tw`text-neutral-500 text-[10px]`}>of {cpuLimit}</p>
                        </div>
                        <div css={tw`text-center p-2 rounded-lg`} style={{ background: 'rgba(255,255,255,0.05)' }}>
                            <FontAwesomeIcon icon={faMemory} css={tw`mb-1`} style={{ color: alarms.memory ? '#ef4444' : '#9ca3af' }} />
                            <p css={tw`text-white font-semibold`}>{bytesToString(stats.memoryUsageInBytes)}</p>
                            <p css={tw`text-neutral-500 text-[10px]`}>of {memoryLimit}</p>
                        </div>
                        <div css={tw`text-center p-2 rounded-lg`} style={{ background: 'rgba(255,255,255,0.05)' }}>
                            <FontAwesomeIcon icon={faHdd} css={tw`mb-1`} style={{ color: alarms.disk ? '#ef4444' : '#9ca3af' }} />
                            <p css={tw`text-white font-semibold`}>{bytesToString(stats.diskUsageInBytes)}</p>
                            <p css={tw`text-neutral-500 text-[10px]`}>of {diskLimit}</p>
                        </div>
                    </div>
                )}

                {(!stats || isSuspended || server.isNodeUnderMaintenance) && (
                    <div css={tw`my-3`}>
                        <Spinner size={'small'} />
                    </div>
                )}

                {/* Buttons */}
                <div css={tw`flex gap-2 mt-4`}>
                    <button
                        onClick={handleRestart}
                        disabled={restarting}
                        css={tw`flex-1 py-2 rounded-lg text-xs font-semibold text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-50`}
                        style={{ background: `${primaryColor}cc` }}
                    >
                        <FontAwesomeIcon icon={faPowerOff} css={tw`mr-1.5`} />
                        {restarting ? 'Restarting...' : 'Restart'}
                    </button>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setShowDetails(!showDetails);
                        }}
                        css={tw`flex-1 py-2 rounded-lg text-xs font-semibold text-white transition-all active:scale-95`}
                        style={{ background: 'rgba(255,255,255,0.1)' }}
                    >
                        <FontAwesomeIcon icon={faInfoCircle} css={tw`mr-1.5`} />
                        {showDetails ? 'Hide' : 'Details'}
                    </button>
                </div>
            </div>
        </Link>
    );
};
