import React, { useState } from 'react';
import { Course, Page } from '../types';
import { Clock, User, Award, Check, ArrowLeft, Play, FileText, HelpCircle, Download } from 'lucide-react';

interface CourseDetailsProps {
  course: Course;
  onNavigate: (page: Page) => void;
  onEnroll: (courseId: string) => void;
}

export const CourseDetails: React.FC<CourseDetailsProps> = ({ course, onNavigate, onEnroll }) => {
  return (
    <div className="w-full bg-slate-50 min-h-screen pb-20">
      {/* Breadcrumb / Back */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-4">
          <button 
            onClick={() => onNavigate('courses')}
            className="flex items-center text-slate-500 hover:text-primary transition text-sm font-medium"
          >
            <ArrowLeft size={16} className="mr-1" /> Back to Courses
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header Card */}
            <div className="bg-white rounded-2xl shadow-sm p-8 border border-slate-100">
              <span className="bg-indigo-100 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                {course.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold mt-4 mb-4 text-slate-900">{course.title}</h1>
              <p className="text-lg text-slate-600 leading-relaxed">{course.fullDescription}</p>
            </div>

            {/* Interactive Preview Section */}
            {course.preview && (
              <div className="bg-white rounded-2xl shadow-sm border border-indigo-100 overflow-hidden">
                <div className="bg-indigo-900 text-white p-6">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    {course.preview.type === 'video' && <Play size={24} className="text-accent" />}
                    {course.preview.type === 'quiz' && <HelpCircle size={24} className="text-accent" />}
                    {course.preview.type === 'document' && <FileText size={24} className="text-accent" />}
                    Interactive Course Preview
                  </h2>
                  <p className="text-indigo-200 text-sm mt-1">Get a sneak peek into what you'll learn.</p>
                </div>
                
                <div className="p-8">
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{course.preview.title}</h3>
                    <p className="text-slate-600">{course.preview.description}</p>
                  </div>

                  {/* Render based on Type */}
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    
                    {/* VIDEO TYPE */}
                    {course.preview.type === 'video' && (
                      <div className="aspect-video w-full bg-black rounded-lg overflow-hidden relative group cursor-pointer">
                        {/* Fake Video Player Placeholder since we don't have real valid embed URLs always */}
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                           <Play size={64} className="text-white opacity-80 group-hover:scale-110 transition duration-300" />
                        </div>
                        <img 
                          src={course.image} 
                          className="w-full h-full object-cover opacity-50 group-hover:opacity-40 transition" 
                          alt="Video thumbnail"
                        />
                        <div className="absolute bottom-4 left-4 text-white font-bold text-sm bg-black/50 px-2 py-1 rounded">
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
                      <div className="flex flex-col sm:flex-row items-center gap-6 p-4">
                        <div className="w-20 h-24 bg-red-100 text-red-500 rounded flex items-center justify-center shadow-sm border border-red-200">
                          <FileText size={40} />
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                          <h4 className="font-bold text-slate-900 mb-1">Sample Lesson Worksheet</h4>
                          <p className="text-sm text-slate-500 mb-4">PDF Format • 2.4 MB</p>
                          <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 transition flex items-center justify-center gap-2 mx-auto sm:mx-0">
                            <Download size={16} /> Download Sample
                          </button>
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              </div>
            )}

            {/* Syllabus */}
            <div className="bg-white rounded-2xl shadow-sm p-8 border border-slate-100">
              <h2 className="text-2xl font-bold mb-6 text-slate-900">Course Syllabus</h2>
              <div className="space-y-4">
                {course.syllabus.map((topic, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-primary font-bold mr-4">
                      {index + 1}
                    </div>
                    <div className="pt-1">
                      <p className="text-slate-700 font-medium">{topic}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24 border border-slate-100">
              <img 
                src={course.image} 
                alt={course.title} 
                className="w-full h-48 object-cover rounded-xl mb-6" 
              />
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center text-slate-700">
                  <User size={20} className="mr-3 text-slate-400" />
                  <span className="text-sm font-medium">Instructor: {course.instructor}</span>
                </div>
                <div className="flex items-center text-slate-700">
                  <Clock size={20} className="mr-3 text-slate-400" />
                  <span className="text-sm font-medium">Duration: {course.duration}</span>
                </div>
                <div className="flex items-center text-slate-700">
                  <Award size={20} className="mr-3 text-slate-400" />
                  <span className="text-sm font-medium">Level: {course.level}</span>
                </div>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={() => onEnroll(course.id)}
                  className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
                >
                  Enroll in this Course
                </button>
                <button 
                  onClick={() => onNavigate('contact')}
                  className="w-full bg-white border border-slate-200 text-slate-700 py-3 rounded-lg font-medium hover:bg-slate-50 transition"
                >
                  Ask a Question
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100">
                <h4 className="font-bold text-sm mb-3">Course Features</h4>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center"><Check size={14} className="text-green-500 mr-2" /> Small class sizes</li>
                  <li className="flex items-center"><Check size={14} className="text-green-500 mr-2" /> Personal feedback</li>
                  <li className="flex items-center"><Check size={14} className="text-green-500 mr-2" /> Certificate of completion</li>
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
import { QuizQuestion } from '../types';

const QuizPreview: React.FC<{ questions: QuizQuestion[] }> = ({ questions }) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
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
      <div className="text-center py-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-primary mb-4">
          <Award size={32} />
        </div>
        <h4 className="text-xl font-bold text-slate-900 mb-2">Quiz Completed!</h4>
        <p className="text-slate-600 mb-4">You scored {score} out of {questions.length}.</p>
        <button 
          onClick={() => { setFinished(false); setCurrentQ(0); setScore(0); setSelectedOpt(null); setIsCorrect(null); }}
          className="text-primary font-bold hover:underline"
        >
          Try Again
        </button>
      </div>
    );
  }

  const question = questions[currentQ];

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
        <span>Question {currentQ + 1} of {questions.length}</span>
        <span>Score: {score}</span>
      </div>
      
      <h4 className="text-lg font-bold text-slate-800 mb-6">{question.question}</h4>
      
      <div className="space-y-3 mb-6">
        {question.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => !isCorrect && isCorrect !== false && setSelectedOpt(idx)}
            disabled={isCorrect !== null}
            className={`w-full text-left p-3 rounded-lg border-2 transition font-medium ${
              selectedOpt === idx 
                ? isCorrect === null 
                  ? 'border-primary bg-indigo-50 text-primary'
                  : isCorrect 
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-red-500 bg-red-50 text-red-700'
                : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
            } ${isCorrect !== null && idx === question.correctAnswer ? '!border-green-500 !bg-green-50 !text-green-700' : ''}`}
          >
            {opt}
          </button>
        ))}
      </div>

      <div className="flex justify-end h-10">
        {isCorrect === null ? (
          <button 
            onClick={handleCheck}
            disabled={selectedOpt === null}
            className={`bg-primary text-white px-6 py-2 rounded-lg font-bold transition ${selectedOpt === null ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'}`}
          >
            Check Answer
          </button>
        ) : (
          <button 
            onClick={handleNext}
            className="bg-slate-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-slate-800 transition"
          >
            {currentQ < questions.length - 1 ? 'Next Question' : 'See Results'}
          </button>
        )}
      </div>
      
      {isCorrect === false && (
        <p className="text-red-600 font-medium mt-2 text-center text-sm">Incorrect. The correct answer is highlighted.</p>
      )}
    </div>
  );
};