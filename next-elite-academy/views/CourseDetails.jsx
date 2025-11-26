import React, { useState } from 'react';
import { Clock, User, Award, Check, ArrowLeft, Play, FileText, HelpCircle, Download } from 'lucide-react';

export const CourseDetails = ({ course, onNavigate, onEnroll }) => {
  return (
    <div className="w-full bg-slate-50 min-h-screen pb-20">
      {/* Breadcrumb / Back */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-30 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <button 
            onClick={() => onNavigate('courses')}
            className="flex items-center text-slate-500 hover:text-primary transition text-sm font-bold"
          >
            <ArrowLeft size={18} className="mr-2" /> Back to Catalog
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Header Card */}
            <div className="bg-white rounded-2xl shadow-sm p-8 md:p-10 border border-slate-200">
              <span className="inline-block bg-indigo-50 text-primary px-3 py-1 rounded text-xs font-bold uppercase tracking-wider mb-4">
                {course.category}
              </span>
              <h1 className="text-3xl md:text-5xl font-bold mb-6 text-slate-900 leading-tight">{course.title}</h1>
              <p className="text-lg text-slate-600 leading-relaxed">{course.fullDescription}</p>
            </div>

            {/* Interactive Preview Section */}
            {course.preview && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden ring-1 ring-slate-900/5">
                <div className="bg-slate-900 text-white p-6 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/20 rounded-lg">
                        {course.preview.type === 'video' && <Play size={20} className="text-primary" />}
                        {course.preview.type === 'quiz' && <HelpCircle size={20} className="text-primary" />}
                        {course.preview.type === 'document' && <FileText size={20} className="text-primary" />}
                    </div>
                    <div>
                        <h2 className="text-lg font-bold">Course Preview</h2>
                        <p className="text-slate-400 text-xs uppercase tracking-wide">Interactive Content</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{course.preview.title}</h3>
                    <p className="text-slate-600">{course.preview.description}</p>
                  </div>

                  {/* Render based on Type */}
                  <div className="bg-slate-50 rounded-xl p-1 border border-slate-200">
                    
                    {/* VIDEO TYPE */}
                    {course.preview.type === 'video' && (
                      <div className="aspect-video w-full bg-black rounded-lg overflow-hidden relative group cursor-pointer">
                        {/* Fake Video Player Placeholder */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10">
                           <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center group-hover:scale-110 transition duration-300">
                               <Play size={32} className="text-white fill-white ml-1" />
                           </div>
                        </div>
                        <img 
                          src={course.image} 
                          className="w-full h-full object-cover" 
                          alt="Video thumbnail"
                        />
                        <div className="absolute bottom-4 left-4 z-20 text-white font-bold text-xs bg-black/70 px-2 py-1 rounded backdrop-blur-sm">
                          Preview Clip (2:30)
                        </div>
                      </div>
                    )}

                    {/* QUIZ TYPE */}
                    {course.preview.type === 'quiz' && course.preview.quizData && (
                      <QuizPreview questions={course.preview.quizData} />
                    )}

                    {/* DOCUMENT TYPE */}
                    {course.preview.type === 'document' && (
                      <div className="flex flex-col sm:flex-row items-center gap-8 p-8 bg-white rounded-lg">
                        <div className="w-24 h-32 bg-slate-100 border border-slate-300 rounded flex flex-col items-center justify-center shadow-sm relative">
                            <div className="absolute top-0 right-0 w-8 h-8 bg-slate-200" style={{borderBottomLeftRadius: '0.5rem'}}></div>
                            <FileText size={40} className="text-slate-400 mb-2" />
                            <span className="text-[10px] font-bold text-slate-500 uppercase">PDF</span>
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                          <h4 className="font-bold text-slate-900 mb-2 text-lg">Sample Lesson Worksheet</h4>
                          <p className="text-sm text-slate-500 mb-6">PDF Format • 2.4 MB</p>
                          <button className="bg-slate-900 text-white px-6 py-3 rounded-lg text-sm font-bold hover:bg-primary transition flex items-center justify-center gap-2 mx-auto sm:mx-0 shadow-lg">
                            <Download size={18} /> Download Material
                          </button>
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              </div>
            )}

            {/* Syllabus */}
            <div className="bg-white rounded-2xl shadow-sm p-8 md:p-10 border border-slate-200">
              <h2 className="text-2xl font-bold mb-8 text-slate-900">Weekly Syllabus</h2>
              <div className="space-y-6">
                {course.syllabus.map((topic, index) => (
                  <div key={index} className="flex items-start group">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 font-bold mr-6 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition duration-300">
                      {index + 1}
                    </div>
                    <div className="pt-2 pb-6 border-b border-slate-100 flex-1">
                      <p className="text-slate-800 font-semibold text-lg">{topic}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-32 border border-slate-200">
              <div className="relative mb-8 rounded-xl overflow-hidden shadow-md">
                <img 
                    src={course.image} 
                    alt={course.title} 
                    className="w-full h-56 object-cover" 
                />
              </div>
              
              <div className="space-y-5 mb-8">
                <div className="flex items-center text-slate-700">
                  <User size={20} className="mr-3 text-primary" />
                  <div>
                      <p className="text-xs text-slate-400 uppercase font-bold">Instructor</p>
                      <span className="text-sm font-bold">{course.instructor}</span>
                  </div>
                </div>
                <div className="flex items-center text-slate-700">
                  <Clock size={20} className="mr-3 text-primary" />
                  <div>
                      <p className="text-xs text-slate-400 uppercase font-bold">Duration</p>
                      <span className="text-sm font-bold">{course.duration}</span>
                  </div>
                </div>
                <div className="flex items-center text-slate-700">
                  <Award size={20} className="mr-3 text-primary" />
                  <div>
                      <p className="text-xs text-slate-400 uppercase font-bold">Level</p>
                      <span className="text-sm font-bold">{course.level}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={() => onEnroll(course.id)}
                  className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-blue-600 transition shadow-lg shadow-blue-500/20"
                >
                  Enroll Now
                </button>
                <button 
                  onClick={() => onNavigate('contact')}
                  className="w-full bg-white border border-slate-200 text-slate-700 py-4 rounded-xl font-bold hover:bg-slate-50 transition"
                >
                  Request Syllabus
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-4">Included</h4>
                <ul className="space-y-3 text-sm text-slate-700 font-medium">
                  <li className="flex items-center"><Check size={16} className="text-green-500 mr-2" /> Live Zoom Sessions</li>
                  <li className="flex items-center"><Check size={16} className="text-green-500 mr-2" /> 1-on-1 Mentorship</li>
                  <li className="flex items-center"><Check size={16} className="text-green-500 mr-2" /> Digital Certificate</li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// Internal Component for Quiz Logic
const QuizPreview = ({ questions }) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleCheck = () => {
    if (selectedOpt === null) return;
    const correct = selectedOpt === questions[currentQ].correctAnswer;
    setIsCorrect(correct);
    if (correct) setScore(score + 1);
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelectedOpt(null);
      setIsCorrect(null);
    } else {
      setFinished(true);
    }
  };

  if (finished) {
    return (
      <div className="text-center py-12 bg-white rounded-lg">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 mb-6 shadow-sm">
          <Award size={40} />
        </div>
        <h4 className="text-2xl font-bold text-slate-900 mb-2">Quiz Completed!</h4>
        <p className="text-slate-600 mb-8">You scored <span className="font-bold text-primary">{score}</span> out of {questions.length}.</p>
        <button 
          onClick={() => { setFinished(false); setCurrentQ(0); setScore(0); setSelectedOpt(null); setIsCorrect(null); }}
          className="bg-slate-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-slate-800 transition"
        >
          Retake Quiz
        </button>
      </div>
    );
  }

  const question = questions[currentQ];

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg">
      <div className="flex justify-between items-center mb-8">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Question {currentQ + 1} / {questions.length}</span>
        <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">Score: {score}</span>
      </div>
      
      <h4 className="text-xl font-bold text-slate-900 mb-8 leading-snug">{question.question}</h4>
      
      <div className="space-y-4 mb-8">
        {question.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => !isCorrect && isCorrect !== false && setSelectedOpt(idx)}
            disabled={isCorrect !== null}
            className={`w-full text-left p-4 rounded-xl border-2 transition font-medium text-sm md:text-base ${
              selectedOpt === idx 
                ? isCorrect === null 
                  ? 'border-primary bg-indigo-50 text-primary'
                  : isCorrect 
                    ? 'border-green-500 bg-green-50 text-green-800'
                    : 'border-red-500 bg-red-50 text-red-800'
                : 'border-slate-100 hover:border-slate-300 bg-white text-slate-700'
            } ${isCorrect !== null && idx === question.correctAnswer ? '!border-green-500 !bg-green-50 !text-green-800' : ''}`}
          >
            {opt}
          </button>
        ))}
      </div>

      <div className="flex justify-end h-12">
        {isCorrect === null ? (
          <button 
            onClick={handleCheck}
            disabled={selectedOpt === null}
            className={`bg-primary text-white px-8 py-2 rounded-lg font-bold transition shadow-lg shadow-blue-500/30 ${selectedOpt === null ? 'opacity-50 cursor-not-allowed shadow-none' : 'hover:bg-blue-600'}`}
          >
            Check Answer
          </button>
        ) : (
          <button 
            onClick={handleNext}
            className="bg-slate-900 text-white px-8 py-2 rounded-lg font-bold hover:bg-slate-800 transition shadow-lg"
          >
            {currentQ < questions.length - 1 ? 'Next Question' : 'See Results'}
          </button>
        )}
      </div>
      
      {isCorrect === false && (
        <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded text-red-700 text-sm flex items-center justify-center">
            <span>Incorrect. The correct answer is highlighted.</span>
        </div>
      )}
    </div>
  );
};