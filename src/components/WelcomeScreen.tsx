
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Brain, Sparkles, Zap, BookOpen } from "lucide-react";

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen = ({ onStart }: WelcomeScreenProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      
      <div className="max-w-5xl w-full relative z-10">
        <div className="text-center mb-16 stagger-in">
          <div className="flex justify-center mb-8">
            <div className="relative floating">
              <div className="glass-card p-6 rounded-full">
                <Brain className="h-20 w-20 text-primary drop-shadow-lg" />
              </div>
              <Sparkles className="h-8 w-8 text-accent absolute -top-2 -right-2 animate-bounce drop-shadow-lg" />
              <div className="absolute inset-0 animate-glow rounded-full" />
            </div>
          </div>
          
          <h1 className="text-7xl font-bold mb-6 tracking-tight leading-tight">
            <span className="block">AI Learning</span>
            <span className="gradient-text block">Platform</span>
          </h1>
          
          <p className="text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed font-light">
            Transform any content into personalized flashcards and quizzes. 
            Learn smarter with AI-powered adaptive learning that evolves with you.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16 stagger-in">
          <Card className="glass-card p-8 hover-lift group cursor-pointer border-0 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4 group-hover:text-primary transition-colors">Upload & Learn</h3>
              <p className="text-muted-foreground leading-relaxed">Upload any text and get instant flashcards and quizzes powered by advanced AI</p>
            </div>
          </Card>
          
          <Card className="glass-card p-8 hover-lift group cursor-pointer border-0 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Zap className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-4 group-hover:text-accent transition-colors">AI-Powered</h3>
              <p className="text-muted-foreground leading-relaxed">Smart questions generated using cutting-edge AI technology that understands context</p>
            </div>
          </Card>
          
          <Card className="glass-card p-8 hover-lift group cursor-pointer border-0 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Brain className="h-8 w-8 text-emerald-500" />
              </div>
              <h3 className="text-xl font-semibold mb-4 group-hover:text-emerald-500 transition-colors">Adaptive Learning</h3>
              <p className="text-muted-foreground leading-relaxed">Personalized experience that adapts to your progress and learning style</p>
            </div>
          </Card>
        </div>

        <div className="text-center animate-scale-in">
          <Button 
            onClick={onStart}
            size="lg"
            className="px-12 py-6 text-xl font-semibold bg-gradient-to-r from-primary to-accent hover-glow shadow-2xl border-0 text-white relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center">
              Get Started
              <Sparkles className="ml-3 h-6 w-6 group-hover:animate-spin transition-transform duration-500" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Button>
          <p className="text-sm text-muted-foreground mt-4 font-light">No signup required • Start learning in seconds</p>
        </div>
      </div>
    </div>
  );
};
