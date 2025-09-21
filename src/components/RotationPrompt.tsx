import React from 'react';

const AnimatedPhoneIcon = () => (
    <div className="relative w-16 h-28 mb-6">
        <div className="absolute inset-0 border-4 border-slate-500 rounded-2xl animate-rotate-prompt"></div>
        <style>{`
            @keyframes rotate-prompt {
                0% { transform: rotate(0deg); }
                30% { transform: rotate(0deg); }
                50% { transform: rotate(90deg); }
                80% { transform: rotate(90deg); }
                100% { transform: rotate(0deg); }
            }
            .animate-rotate-prompt {
                animation: rotate-prompt 3s ease-in-out infinite;
            }
        `}</style>
    </div>
);

const RotationPrompt: React.FC = () => {
    return (
        <>
            <div id="rotation-prompt" className="fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-sm flex-col items-center justify-center text-center p-4">
                <AnimatedPhoneIcon />
                <h2 className="text-2xl font-bold text-slate-100 mb-2">Please Rotate Your Device</h2>
                <p className="text-slate-400 max-w-xs">For the best experience, this application is designed for landscape mode on mobile devices.</p>
            </div>
            <style>{`
                #rotation-prompt {
                    display: none; /* Hidden by default */
                }
                
                /* Media query for mobile devices in portrait mode */
                @media screen and (max-width: 767px) and (orientation: portrait) {
                    #rotation-prompt {
                        display: flex; /* Show the prompt */
                    }
                }
            `}</style>
        </>
    );
};

export default RotationPrompt;