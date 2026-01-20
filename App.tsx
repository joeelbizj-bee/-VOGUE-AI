
import React, { useState, useRef } from 'react';
import { Header } from './components/Header';
import { Button } from './components/Button';
import { generateFashionPortrait } from './services/geminiService';
import { AppStatus, GenerationResult } from './types';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImage(file);
    }
  };

  const processImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      await generate(base64);
    };
    reader.readAsDataURL(file);
  };

  const generate = async (base64: string) => {
    try {
      setStatus(AppStatus.LOADING);
      setError(null);
      const generatedUrl = await generateFashionPortrait(base64);
      setResult({
        originalUrl: base64,
        generatedUrl,
        timestamp: Date.now()
      });
      setStatus(AppStatus.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during generation.");
      setStatus(AppStatus.ERROR);
    }
  };

  const reset = () => {
    setStatus(AppStatus.IDLE);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-6 py-12 max-w-5xl">
        {status === AppStatus.IDLE && (
          <div className="flex flex-col items-center justify-center text-center space-y-8 animate-fade-in">
            <div className="max-w-2xl space-y-4">
              <h2 className="text-3xl md:text-5xl font-serif text-white leading-tight">
                Transform into a Modern Fashion Icon
              </h2>
              <p className="text-gray-400 text-lg font-light leading-relaxed">
                Upload your portrait to generate an ultra-realistic fashion magazine cover 
                featuring you in a tailored blazer and a classic cowboy hat.
              </p>
            </div>

            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-full max-w-lg aspect-video rounded-2xl border-2 border-dashed border-white/20 hover:border-amber-600/50 transition-colors cursor-pointer flex flex-col items-center justify-center gap-4 bg-white/5 backdrop-blur-sm group"
            >
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-amber-600/20 transition-colors">
                <i className="fa-solid fa-cloud-arrow-up text-2xl text-gray-400 group-hover:text-amber-500"></i>
              </div>
              <div>
                <p className="text-white font-medium">Click to upload your reference photo</p>
                <p className="text-gray-500 text-sm">JPEG, PNG or WEBP (Max 5MB)</p>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                className="hidden" 
                accept="image/*" 
              />
            </div>
          </div>
        )}

        {status === AppStatus.LOADING && (
          <div className="flex flex-col items-center justify-center py-20 space-y-8">
            <div className="relative w-32 h-32">
              <div className="absolute inset-0 border-4 border-amber-600/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <i className="fa-solid fa-scissors text-amber-600 text-2xl animate-pulse"></i>
              </div>
            </div>
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-serif text-white italic">Designing Your Look...</h3>
              <div className="flex flex-col gap-2 max-w-xs mx-auto">
                <p className="text-gray-500 text-sm tracking-widest uppercase animate-pulse">Tailoring Outfit</p>
                <p className="text-gray-500 text-sm tracking-widest uppercase animate-pulse delay-100">Styling Cowboy Kofia</p>
                <p className="text-gray-500 text-sm tracking-widest uppercase animate-pulse delay-200">Applying Cinematic Lighting</p>
              </div>
            </div>
          </div>
        )}

        {status === AppStatus.ERROR && (
          <div className="flex flex-col items-center justify-center text-center py-20 space-y-6">
            <div className="w-20 h-20 rounded-full bg-red-900/20 flex items-center justify-center">
              <i className="fa-solid fa-triangle-exclamation text-3xl text-red-500"></i>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-serif text-white">Something went wrong</h3>
              <p className="text-gray-400 max-w-md">{error}</p>
            </div>
            <Button onClick={reset} variant="outline">Try Again</Button>
          </div>
        )}

        {status === AppStatus.SUCCESS && result && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-fade-in-up">
            <div className="space-y-4">
              <span className="text-xs tracking-widest text-gray-500 uppercase">Reference Image</span>
              <div className="rounded-2xl overflow-hidden border border-white/10 aspect-[3/4] bg-neutral-900 shadow-2xl">
                <img 
                  src={result.originalUrl} 
                  alt="Original" 
                  className="w-full h-full object-cover grayscale opacity-50"
                />
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs tracking-widest text-amber-500 uppercase font-bold">Generated Result</span>
                <span className="text-xs text-gray-500 italic">Vogue AI Masterpiece</span>
              </div>
              <div className="rounded-2xl overflow-hidden border border-amber-600/30 aspect-[3/4] bg-neutral-900 shadow-2xl relative group">
                <img 
                  src={result.generatedUrl} 
                  alt="Fashion Portrait" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                   <p className="text-white text-sm italic font-serif">"The Modern Cowboy"</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  className="flex-1" 
                  variant="primary"
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = result.generatedUrl;
                    link.download = `vogue-ai-${result.timestamp}.png`;
                    link.click();
                  }}
                >
                  <i className="fa-solid fa-download"></i> Download
                </Button>
                <Button 
                  className="flex-1" 
                  variant="outline"
                  onClick={reset}
                >
                  <i className="fa-solid fa-rotate"></i> New Style
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="py-8 px-6 text-center border-t border-white/5">
        <p className="text-gray-600 text-xs tracking-widest uppercase">
          Powered by Gemini 2.5 • Developed for the Fashion Forward
        </p>
      </footer>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
};

export default App;
