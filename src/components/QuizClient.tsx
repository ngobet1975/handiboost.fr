"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Trophy, Activity, Info } from 'lucide-react';

type Question = {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
};

const QUIZ_DATA: Question[] = [
  {
    id: 1,
    question: "L'Activité Physique Adaptée (APA) est réservée uniquement aux personnes en situation de handicap.",
    options: [
      "Vrai",
      "Faux"
    ],
    correctAnswer: 1,
    explanation: "Faux ! L'APA s'adresse à toute personne ayant des besoins spécifiques pour sa santé : maladies chroniques (diabète, cancer...), vieillissement, sédentarité, ou situation de handicap."
  },
  {
    id: 2,
    question: "Combien de temps d'activité physique modérée est recommandé par semaine pour un adulte ?",
    options: [
      "30 minutes",
      "150 à 300 minutes",
      "Au moins 10 heures"
    ],
    correctAnswer: 1,
    explanation: "L'OMS recommande 150 à 300 minutes d'activité d'endurance d'intensité modérée par semaine pour un adulte (soit environ 30 minutes par jour, 5 jours par semaine)."
  },
  {
    id: 3,
    question: "Un kinésithérapeute et un enseignant en APA font exactement le même métier.",
    options: [
      "Vrai",
      "Faux"
    ],
    correctAnswer: 1,
    explanation: "Faux ! Le masseur-kinésithérapeute intervient dans le soin et la rééducation. L'enseignant en APA intervient ensuite (ou en parallèle) pour le reconditionnement physique, la prévention santé et le sport-santé."
  },
  {
    id: 4,
    question: "Le 'Sport sur ordonnance' (Prescription médicale) est automatiquement remboursé par la Sécurité Sociale.",
    options: [
      "Vrai",
      "Faux"
    ],
    correctAnswer: 1,
    explanation: "Faux. Actuellement, la Sécurité Sociale ne rembourse pas directement les séances d'APA prescrites. Cependant, de nombreuses mutuelles, assurances ou collectivités locales proposent des aides financières."
  },
  {
    id: 5,
    question: "Pour être en meilleure santé, il faut obligatoiramente faire du sport à haute intensité.",
    options: [
      "Vrai",
      "Faux"
    ],
    correctAnswer: 1,
    explanation: "Faux. Marcher, jardiner, danser ou prendre les escaliers sont des activités physiques très bénéfiques. L'important est de bouger régulièrement et de réduire le temps passé assis."
  }
];

export function QuizClient() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const question = QUIZ_DATA[currentQuestionIndex];
  const isCorrect = selectedAnswer === question.correctAnswer;

  const handleSelectAnswer = (index: number) => {
    if (isAnswered) return;
    setSelectedAnswer(index);
    setIsAnswered(true);
    if (index === question.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < QUIZ_DATA.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setShowResults(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setShowResults(false);
  };

  if (showResults) {
    return (
      <Card className="max-w-3xl mx-auto shadow-2xl border-4 border-slate-100 rounded-[2rem] overflow-hidden bg-white">
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-12 text-center">
          <Trophy className="w-24 h-24 text-yellow-400 mx-auto mb-6" />
          <h2 className="text-4xl font-black text-white mb-4">Quiz terminé !</h2>
          <p className="text-2xl text-blue-100 font-medium">Voici votre résultat</p>
        </div>
        <CardContent className="p-12 text-center">
          <div className="inline-flex items-center justify-center w-40 h-40 rounded-full bg-slate-50 border-8 border-slate-100 mb-8">
            <span className="text-6xl font-black text-slate-800">
              {score}<span className="text-3xl text-slate-400">/{QUIZ_DATA.length}</span>
            </span>
          </div>
          
          {score === QUIZ_DATA.length ? (
            <div className="bg-green-50 text-green-800 p-6 rounded-2xl border-2 border-green-100 mb-8">
              <h3 className="text-2xl font-bold mb-2">Félicitations, un vrai sans faute ! 🌟</h3>
              <p className="text-lg">Vous connaissez parfaitement les principes de l'Activité Physique Adaptée.</p>
            </div>
          ) : score >= QUIZ_DATA.length / 2 ? (
            <div className="bg-blue-50 text-blue-800 p-6 rounded-2xl border-2 border-blue-100 mb-8">
              <h3 className="text-2xl font-bold mb-2">Très bon résultat ! 👍</h3>
              <p className="text-lg">Vous avez de bonnes connaissances sur l'APA. N'hésitez pas à parcourir nos fiches pour approfondir !</p>
            </div>
          ) : (
            <div className="bg-slate-50 text-slate-800 p-6 rounded-2xl border-2 border-slate-100 mb-8">
              <h3 className="text-2xl font-bold mb-2">C'est un bon début ! 🌱</h3>
              <p className="text-lg">Découvrez nos articles et ressources pour en apprendre davantage sur les bienfaits du sport-santé.</p>
            </div>
          )}

          <Button 
            size="lg" 
            onClick={handleRestart}
            className="text-xl font-bold h-16 px-10 rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-xl hover:-translate-y-1 transition-transform"
          >
            <RotateCcw className="mr-3 h-6 w-6" /> Recommencer le quiz
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-3xl mx-auto shadow-2xl border-4 border-slate-100 rounded-[2rem] overflow-hidden bg-white">
      {/* Barre de progression */}
      <div className="w-full bg-slate-100 h-3">
        <div 
          className="bg-blue-600 h-3 transition-all duration-500 ease-out"
          style={{ width: `\${((currentQuestionIndex) / QUIZ_DATA.length) * 100}%` }}
        />
      </div>

      <CardHeader className="bg-slate-50 border-b border-slate-100 p-8 md:p-10">
        <div className="flex items-center justify-between mb-6">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-bold text-sm">
            <Activity className="w-4 h-4" />
            Quiz Sport-Santé
          </div>
          <span className="text-lg font-bold text-slate-500">
            Question {currentQuestionIndex + 1} / {QUIZ_DATA.length}
          </span>
        </div>
        <CardTitle className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
          {question.question}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-8 md:p-10">
        <div className="space-y-4">
          {question.options.map((option, index) => {
            let buttonStateClasses = "bg-white border-slate-200 text-slate-700 hover:border-blue-500 hover:bg-blue-50";
            let Icon = null;

            if (isAnswered) {
              if (index === question.correctAnswer) {
                buttonStateClasses = "bg-green-50 border-green-500 text-green-900 shadow-md ring-2 ring-green-500 ring-offset-2";
                Icon = <CheckCircle2 className="w-6 h-6 text-green-600" />;
              } else if (index === selectedAnswer && index !== question.correctAnswer) {
                buttonStateClasses = "bg-red-50 border-red-300 text-red-900 opacity-70";
                Icon = <XCircle className="w-6 h-6 text-red-500" />;
              } else {
                buttonStateClasses = "bg-slate-50 border-slate-200 text-slate-400 opacity-50";
              }
            } else if (index === selectedAnswer) {
               // Normalement impossible car setSelectedAnswer déclenche setIsAnswered, mais par précaution
               buttonStateClasses = "bg-blue-50 border-blue-500 text-blue-900";
            }

            return (
              <button
                key={index}
                onClick={() => handleSelectAnswer(index)}
                disabled={isAnswered}
                className={`w-full text-left p-6 rounded-2xl border-4 transition-all duration-200 flex items-center justify-between \${buttonStateClasses}`}
              >
                <span className="text-xl md:text-2xl font-bold">{option}</span>
                {Icon}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className={`p-6 rounded-2xl border-2 flex gap-4 items-start \${isCorrect ? 'bg-green-50 border-green-100' : 'bg-orange-50 border-orange-100'}`}>
              <Info className={`w-8 h-8 shrink-0 mt-1 \${isCorrect ? 'text-green-600' : 'text-orange-600'}`} />
              <div>
                <h4 className={`text-xl font-bold mb-2 \${isCorrect ? 'text-green-900' : 'text-orange-900'}`}>
                  {isCorrect ? "Bonne réponse !" : "Pas tout à fait..."}
                </h4>
                <p className={`text-lg leading-relaxed \${isCorrect ? 'text-green-800' : 'text-orange-800'}`}>
                  {question.explanation}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>

      {isAnswered && (
        <CardFooter className="bg-slate-50 border-t border-slate-100 p-8 md:p-10">
          <Button 
            size="lg" 
            onClick={handleNext}
            className="w-full text-xl font-bold h-16 rounded-2xl shadow-xl hover:-translate-y-1 transition-transform bg-blue-700 hover:bg-blue-800 text-white"
          >
            {currentQuestionIndex < QUIZ_DATA.length - 1 ? "Question suivante" : "Voir mes résultats"}
            <ArrowRight className="ml-3 h-6 w-6" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
