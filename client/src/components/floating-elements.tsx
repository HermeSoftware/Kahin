export function FloatingElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-20 left-10 w-3 h-3 bg-primary rounded-full opacity-50 floating-animation pulse-glow" />
      <div 
        className="absolute top-40 right-20 w-2 h-2 bg-secondary rounded-full opacity-35 floating-animation" 
        style={{ animationDelay: '1s' }}
      />
      <div 
        className="absolute top-60 left-1/4 w-2 h-2 bg-accent rounded-full opacity-45 floating-animation" 
        style={{ animationDelay: '2s' }}
      />
      <div 
        className="absolute bottom-40 right-10 w-3 h-3 bg-primary rounded-full opacity-25 floating-animation pulse-glow" 
        style={{ animationDelay: '3s' }}
      />
      <div 
        className="absolute top-32 right-1/4 w-2 h-2 bg-primary rounded-full opacity-40 floating-animation" 
        style={{ animationDelay: '4s' }}
      />
      <div 
        className="absolute bottom-32 left-20 w-2 h-2 bg-secondary rounded-full opacity-35 floating-animation" 
        style={{ animationDelay: '5s' }}
      />
      <div 
        className="absolute top-1/2 left-1/2 w-1 h-1 bg-accent rounded-full opacity-60 floating-animation" 
        style={{ animationDelay: '2.5s' }}
      />
      <div 
        className="absolute top-80 left-16 w-1 h-1 bg-secondary rounded-full opacity-30 floating-animation" 
        style={{ animationDelay: '1.5s' }}
      />
    </div>
  );
}
