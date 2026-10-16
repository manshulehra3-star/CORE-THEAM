import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { HexColorPicker } from 'react-colorful';
import { useCoreTheme } from './CoreThemeContext';
import { FaCog, FaTimes, FaSnowflake, FaImage, FaPalette } from 'react-icons/fa';

export default () => {
    const [isOpen, setIsOpen] = useState(false);
    const { 
        panelName, setPanelName, 
        primaryColor, setPrimaryColor, 
        setBgImage, snowEffect, setSnowEffect 
    } = useCoreTheme();

    const { getRootProps: getBgProps, getInputProps: getBgInput } = useDropzone({
        accept: {'image/*': []},
        onDrop: (files) => {
            const reader = new FileReader();
            reader.onload = () => setBgImage(reader.result);
            reader.readAsDataURL(files[0]);
        }
    });

    return (
        <>
            <button onClick={() => setIsOpen(true)} className="fixed bottom-6 right-6 p-4 rounded-full shadow-lg text-white z-50 transition-transform hover:scale-110" style={{ backgroundColor: primaryColor }}>
                <FaCog size={24} />
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="core-glass w-full max-w-md p-6 relative animate-fade-up my-8">
                        <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                            <FaTimes size={20} />
                        </button>
                        <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-2"><FaPalette /> Core Theme Editor</h3>

                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="text-sm text-gray-400 mb-1 block">Panel Name</label>
                                <input type="text" value={panelName} onChange={(e) => setPanelName(e.target.value)} className="w-full p-2 rounded-lg bg-black/40 border border-white/10 text-white outline-none" />
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="text-sm text-gray-400 mb-2 block">Primary Color</label>
                            <HexColorPicker color={primaryColor} onChange={setPrimaryColor} className="w-full" />
                        </div>

                        <div {...getBgProps()} className="border-2 border-dashed border-gray-600 p-4 rounded-xl text-center cursor-pointer hover:border-core-primary transition mb-6">
                            <input {...getBgInput()} />
                            <p className="text-xs text-gray-400 flex items-center justify-center gap-2"><FaImage /> Drop Background Image</p>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-300 flex items-center gap-2"><FaSnowflake /> Snow Effect</span>
                            <button onClick={() => setSnowEffect(!snowEffect)} className={`w-12 h-6 rounded-full transition ${snowEffect ? 'bg-core-primary' : 'bg-gray-600'}`}>
                                <div className={`w-4 h-4 bg-white rounded-full transition transform ${snowEffect ? 'translate-x-7' : 'translate-x-1'}`} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
