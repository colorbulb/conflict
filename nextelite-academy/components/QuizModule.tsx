import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quiz } from '../types';
import { CheckCircle, XCircle, RefreshCw, Trophy } from 'lucide-react';
import { useLanguage } from './LanguageContext';

interface QuizModuleProps {
  quiz: Quiz;
}

const QuizModule: React.FC<QuizModuleProps> = ({ quiz }) => {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);

  // Reset internal state if the quiz prop changes (e.g. language switch or CMS update)
  useEffect(() => {
    resetQuiz();
  }, [quiz]);

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    if (index === quiz.questions[currentIndex].correctIndex) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setShowResult(false);
    setIsAnswered(false);
  };

  if (showResult) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-xl p-8 text-center border-4 border-brand-yellow/30"
      >
        <Trophy className="w-16 h-16 text-brand-yellow mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{t.quiz.title}</h3>
        <p className="text-lg text-gray-600 mb-6">{t.quiz.score} <span className="font-bold text-brand-blue">{score}</span> {t.quiz.outOf} <span className="font-bold">{quiz.questions.length}</span></p>
        <button 
          onClick={resetQuiz}
          className="bg-brand-blue text-white px-6 py-2 rounded-full font-bold hover:bg-blue-600 transition-colors flex items-center justify-center mx-auto"
        >
          <RefreshCw className="w-4 h-4 mr-2" /> {t.quiz.tryAgain}
        </button>
      </motion.div>
    );
  }

  // Guard against empty questions (CMS edge case)
  if (!quiz.questions || quiz.questions.length === 0) {
      return (
          <div className="bg-gray-50 rounded-3xl p-8 text-center border border-gray-100">
              <p className="text-gray-400">Quiz under construction.</p>
          </div>
      )
  }

  const currentQuestion = quiz.questions[currentIndex];

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
      <div className="bg-brand-blue/10 p-4 border-b border-brand-blue/10 flex justify-between items-center">
        <span className="font-bold text-brand-blue font-display">{quiz.title}</span>
        <span className="text-sm text-gray-500">{t.quiz.question} {currentIndex + 1} / {quiz.questions.length}</span>
      </div>
      
      <div className="p-6">
        <h4 className="text-xl font-bold text-gray-800 mb-6">{currentQuestion.question}</h4>
        
        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === currentQuestion.correctIndex;
            let btnClass = "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 font-medium ";
            
            if (isAnswered) {
              if (isCorrect) btnClass += "border-green-500 bg-green-50 text-green-700";
              else if (isSelected) btnClass += "border-red-500 bg-red-50 text-red-700";
              else btnClass += "border-gray-100 text-gray-400";
            } else {
              btnClass += "border-gray-200 hover:border-brand-blue hover:bg-blue-50 text-gray-700";
            }

            return (
              <button 
                key={idx}
                onClick={() => handleOptionClick(idx)}
                disabled={isAnswered}
                className={btnClass}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {isAnswered && isCorrect && <CheckCircle className="w-5 h-5 text-green-500" />}
                  {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-500" />}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-6 h-8 flex justify-end">
           <AnimatePresence>
             {isAnswered && (
               <motion.button
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: 20 }}
                 onClick={nextQuestion}
                 className="bg-brand-blue text-white px-6 py-2 rounded-full font-bold hover:bg-blue-600 transition-colors"
               >
                 {currentIndex === quiz.questions.length - 1 ? t.quiz.finish : t.quiz.next}
               </motion.button>
             )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default QuizModule;
