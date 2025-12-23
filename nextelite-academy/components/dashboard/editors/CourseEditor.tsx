import React, { useState, useRef } from 'react';
import { Course, Attachment } from '../../../types';
import { Save, ArrowLeft, Upload, Plus, Trash2, X, FileText, Eye } from 'lucide-react';
import { uploadImage, uploadPDF } from '../../../firebase/storage';
import RichTextEditor from '../../RichTextEditor';

interface CourseEditorProps {
  course: Course;
  lookupLists: { ageGroups: string[]; courseCategories: string[]; blogCategories: string[] };
  onSave: (course: Course) => void;
  onCancel: () => void;
}

const CourseEditor: React.FC<CourseEditorProps> = ({ course, lookupLists, onSave, onCancel }) => {
  const [editingCourse, setEditingCourse] = useState<Course>(course);
  const [isUploading, setIsUploading] = useState(false);
  const [viewingPdf, setViewingPdf] = useState<{ url: string; title: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    onSave(editingCourse);
  };

  const addOutlineItem = () => {
    setEditingCourse({
      ...editingCourse,
      outline: [...editingCourse.outline, '']
    });
  };

  const updateCourseOutline = (idx: number, value: string) => {
    const newOutline = [...editingCourse.outline];
    newOutline[idx] = value;
    setEditingCourse({ ...editingCourse, outline: newOutline });
  };

  const removeOutlineItem = (idx: number) => {
    setEditingCourse({
      ...editingCourse,
      outline: editingCourse.outline.filter((_, i) => i !== idx)
    });
  };

  const addQuizQuestion = () => {
    setEditingCourse({
      ...editingCourse,
      quiz: {
        ...editingCourse.quiz,
        questions: [
          ...editingCourse.quiz.questions,
          { question: '', options: ['', '', '', ''], correctAnswer: 0 }
        ]
      }
    });
  };

  const updateQuizQuestion = (idx: number, field: string, value: any) => {
    const newQuestions = [...editingCourse.quiz.questions];
    newQuestions[idx] = { ...newQuestions[idx], [field]: value };
    setEditingCourse({
      ...editingCourse,
      quiz: { ...editingCourse.quiz, questions: newQuestions }
    });
  };

  const updateQuizOption = (qIdx: number, optIdx: number, value: string) => {
    const newQuestions = [...editingCourse.quiz.questions];
    newQuestions[qIdx].options[optIdx] = value;
    setEditingCourse({
      ...editingCourse,
      quiz: { ...editingCourse.quiz, questions: newQuestions }
    });
  };

  const removeQuizQuestion = (idx: number) => {
    setEditingCourse({
      ...editingCourse,
      quiz: {
        ...editingCourse.quiz,
        questions: editingCourse.quiz.questions.filter((_, i) => i !== idx)
      }
    });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <button
        onClick={onCancel}
        className="flex items-center text-gray-500 hover:text-gray-800 mb-6 font-bold"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Courses
      </button>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div
          className={`p-8 border-b border-gray-100 flex justify-between items-center ${editingCourse.color} text-white`}
        >
          <h2 className="text-2xl font-bold font-display">Edit Course</h2>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 rounded-full bg-brand-blue text-white font-bold hover:bg-blue-600 shadow-sm transition-transform hover:scale-105"
          >
            <Save className="w-4 h-4" /> Save Course
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Course Title</label>
              <input
                value={editingCourse.title}
                onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white transition-colors"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Age Groups (Select Multiple)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-48 overflow-y-auto border rounded-xl p-4 bg-gray-50">
                {lookupLists.ageGroups.map((age) => (
                  <label
                    key={age}
                    className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded-lg transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={
                        Array.isArray(editingCourse.ageGroup)
                          ? editingCourse.ageGroup.includes(age)
                          : false
                      }
                      onChange={(e) => {
                        const currentAgeGroups = Array.isArray(editingCourse.ageGroup)
                          ? editingCourse.ageGroup
                          : [];
                        if (e.target.checked) {
                          setEditingCourse({
                            ...editingCourse,
                            ageGroup: [...currentAgeGroups, age]
                          });
                        } else {
                          setEditingCourse({
                            ...editingCourse,
                            ageGroup: currentAgeGroups.filter((ag) => ag !== age)
                          });
                        }
                      }}
                      className="w-4 h-4 text-brand-blue rounded focus:ring-brand-blue"
                    />
                    <span className="text-sm text-gray-700">{age}</span>
                  </label>
                ))}
              </div>
              {Array.isArray(editingCourse.ageGroup) && editingCourse.ageGroup.length === 0 && (
                <p className="text-xs text-red-500 mt-1">Please select at least one age group</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
              <select
                value={editingCourse.category || ''}
                onChange={(e) => setEditingCourse({ ...editingCourse, category: e.target.value })}
                className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white transition-colors"
              >
                <option value="">Select Category</option>
                {lookupLists.courseCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Short Description
              </label>
              <textarea
                value={editingCourse.description}
                onChange={(e) =>
                  setEditingCourse({ ...editingCourse, description: e.target.value })
                }
                className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white transition-colors"
                rows={2}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Full Description
              </label>
              <RichTextEditor
                initialValue={editingCourse.fullDescription || ''}
                onChange={(html) => setEditingCourse({ ...editingCourse, fullDescription: html })}
                placeholder="Enter detailed course description..."
              />
            </div>
          </div>

          {/* Header Background Image */}
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Course Detail Header Background
            </label>
            {editingCourse.headerBackgroundImage && (
              <div className="mb-3 rounded-lg overflow-hidden border border-gray-200 h-32 bg-gray-100">
                <img
                  src={editingCourse.headerBackgroundImage}
                  alt="Header Background"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <input
              type="text"
              value={editingCourse.headerBackgroundImage || ''}
              onChange={(e) =>
                setEditingCourse({
                  ...editingCourse,
                  headerBackgroundImage: e.target.value
                })
              }
              className="w-full border rounded-lg p-2 text-xs mb-2"
              placeholder="https://example.com/header-bg.jpg"
            />
            <div
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDragEnter={(e) => {
                e.preventDefault();
                e.stopPropagation();
                e.currentTarget.classList.add('border-brand-blue', 'bg-blue-50');
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.stopPropagation();
                e.currentTarget.classList.remove('border-brand-blue', 'bg-blue-50');
              }}
              onDrop={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                e.currentTarget.classList.remove('border-brand-blue', 'bg-blue-50');
                const files = e.dataTransfer.files;
                if (files && files.length > 0) {
                  try {
                    setIsUploading(true);
                    const uploaded = await uploadImage(files[0], 'course-headers');
                    setEditingCourse({
                      ...editingCourse,
                      headerBackgroundImage: uploaded.url
                    });
                    alert("Header uploaded! Don't forget to save the course.");
                  } catch (error) {
                    console.error('Error uploading header:', error);
                    alert('Error uploading. Please try again.');
                  } finally {
                    setIsUploading(false);
                  }
                }
              }}
              className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center bg-white hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <Upload className="w-6 h-6 mx-auto mb-1 text-gray-400" />
              <p className="text-xs text-gray-500">Drag & drop image here</p>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const files = e.target.files;
                if (files && files.length > 0) {
                  try {
                    setIsUploading(true);
                    const uploaded = await uploadImage(files[0], 'course-headers');
                    setEditingCourse({
                      ...editingCourse,
                      headerBackgroundImage: uploaded.url
                    });
                    alert("Header uploaded! Don't forget to save the course.");
                  } catch (error) {
                    console.error('Error uploading header:', error);
                    alert('Error uploading. Please try again.');
                  } finally {
                    setIsUploading(false);
                  }
                }
              }}
              className="hidden"
              id="course-header-bg-upload"
            />
            <label
              htmlFor="course-header-bg-upload"
              className="mt-1 block text-center text-xs text-brand-blue hover:text-brand-purple font-bold cursor-pointer mb-3"
            >
              Or click to browse files
            </label>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Background Opacity (0.0 - 1.0)
              </label>
              <input
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={
                  editingCourse.headerBackgroundOpacity !== undefined
                    ? editingCourse.headerBackgroundOpacity
                    : 0.2
                }
                onChange={(e) =>
                  setEditingCourse({
                    ...editingCourse,
                    headerBackgroundOpacity: parseFloat(e.target.value) || 0.2
                  })
                }
                className="w-full border rounded-lg p-2 text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">Default: 0.2 (20% opacity)</p>
            </div>
          </div>

          {/* Styling */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-2xl">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Color Theme</label>
              <select
                value={editingCourse.color}
                onChange={(e) => setEditingCourse({ ...editingCourse, color: e.target.value })}
                className="w-full border rounded-xl p-3 bg-white"
              >
                <option value="bg-brand-blue">Blue</option>
                <option value="bg-brand-orange">Orange</option>
                <option value="bg-brand-green">Green</option>
                <option value="bg-brand-purple">Purple</option>
                <option value="bg-brand-yellow">Yellow</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Icon</label>
              <select
                value={typeof editingCourse.icon === 'string' ? editingCourse.icon : 'coding'}
                onChange={(e) => setEditingCourse({ ...editingCourse, icon: e.target.value })}
                className="w-full border rounded-xl p-3 bg-white"
              >
                <option value="debate">Debate (Book)</option>
                <option value="logic">Logic (Brain)</option>
                <option value="coding">Coding (CPU)</option>
                <option value="graduation">Graduation Cap</option>
                <option value="code">Code</option>
                <option value="users">Users</option>
                <option value="target">Target</option>
                <option value="lightbulb">Lightbulb</option>
                <option value="calculator">Calculator</option>
                <option value="globe">Globe</option>
                <option value="music">Music</option>
                <option value="paintbrush">Paintbrush</option>
                <option value="gamepad">Gamepad</option>
                <option value="flask">Flask</option>
                <option value="bookmarked">Bookmarked</option>
                <option value="languages">Languages</option>
                <option value="sparkles">Sparkles</option>
                <option value="rocket">Rocket</option>
                <option value="award">Award</option>
                <option value="trending">Trending Up</option>
              </select>
            </div>
          </div>

          {/* Outline */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-bold text-gray-700">Course Outline</label>
              <button
                onClick={addOutlineItem}
                className="text-xs text-brand-blue font-bold flex items-center hover:bg-blue-50 px-2 py-1 rounded"
              >
                <Plus className="w-3 h-3 mr-1" /> Add Module
              </button>
            </div>
            <div className="space-y-2">
              {editingCourse.outline.map((item, idx) => (
                <div key={idx} className="flex gap-2">
                  <div className="bg-gray-100 flex items-center justify-center w-8 rounded text-gray-500 text-xs font-bold">
                    {idx + 1}
                  </div>
                  <input
                    value={item}
                    onChange={(e) => updateCourseOutline(idx, e.target.value)}
                    className="flex-1 border rounded-lg p-2 text-sm"
                  />
                  <button
                    onClick={() => removeOutlineItem(idx)}
                    className="text-red-400 hover:text-red-600 p-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Attachments (PDF) */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-bold text-gray-700">Attachments (PDF)</label>
            </div>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDragEnter={(e) => {
                e.preventDefault();
                e.stopPropagation();
                e.currentTarget.classList.add('border-brand-blue', 'bg-blue-50');
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.stopPropagation();
                e.currentTarget.classList.remove('border-brand-blue', 'bg-blue-50');
              }}
              onDrop={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                e.currentTarget.classList.remove('border-brand-blue', 'bg-blue-50');
                const files = Array.from(e.dataTransfer.files).filter(
                  (f: File) => f.type === 'application/pdf'
                );
                if (files.length > 0) {
                  try {
                    setIsUploading(true);
                    const uploadPromises = files.map((file) => uploadPDF(file, 'attachments'));
                    const results = await Promise.all(uploadPromises);
                    setEditingCourse({
                      ...editingCourse,
                      attachments: [...editingCourse.attachments, ...results]
                    });
                    alert("PDF(s) uploaded! Don't forget to save the course.");
                  } catch (error) {
                    console.error('Error uploading PDF:', error);
                    alert('Error uploading PDF. Please try again.');
                  } finally {
                    setIsUploading(false);
                  }
                }
              }}
              className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
            >
              <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600 mb-1">Drag & drop PDF files here</p>
              <p className="text-xs text-gray-500">or click to select files</p>
              <input
                type="file"
                accept=".pdf"
                multiple
                className="hidden"
                ref={fileInputRef}
                onChange={async (e) => {
                  const files = e.target.files;
                  if (files && files.length > 0) {
                    try {
                      setIsUploading(true);
                      const uploadPromises = Array.from(files).map((file) =>
                        uploadPDF(file, 'attachments')
                      );
                      const results = await Promise.all(uploadPromises);
                      setEditingCourse({
                        ...editingCourse,
                        attachments: [...editingCourse.attachments, ...results]
                      });
                      alert("PDF(s) uploaded! Don't forget to save the course.");
                    } catch (error) {
                      console.error('Error uploading PDF:', error);
                      alert('Error uploading PDF. Please try again.');
                    } finally {
                      setIsUploading(false);
                    }
                  }
                }}
              />
            </div>
            {editingCourse.attachments.length > 0 && (
              <div className="mt-4 space-y-2">
                {editingCourse.attachments.map((att, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-red-500" />
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{att.name}</p>
                        <p className="text-xs text-gray-500">{att.size}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setViewingPdf({ url: att.url, title: att.name })}
                        className="text-brand-blue hover:text-brand-purple text-sm font-bold flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" /> View
                      </button>
                      <a
                        href={att.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-gray-700 text-sm"
                      >
                        <FileText className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => {
                          if (confirm('Delete this attachment?')) {
                            setEditingCourse({
                              ...editingCourse,
                              attachments: editingCourse.attachments.filter((_, i) => i !== idx)
                            });
                          }
                        }}
                        className="text-red-400 hover:text-red-600 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quiz Builder */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">Quiz Questions</h3>
              <button
                onClick={addQuizQuestion}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-purple text-white font-bold hover:bg-purple-600 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Question
              </button>
            </div>
            <div className="space-y-6">
              {editingCourse.quiz.questions.map((q, qIdx) => (
                <div key={qIdx} className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-bold text-gray-700">Question {qIdx + 1}</h4>
                    <button
                      onClick={() => removeQuizQuestion(qIdx)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">
                        Question Text
                      </label>
                      <input
                        value={q.question}
                        onChange={(e) => updateQuizQuestion(qIdx, 'question', e.target.value)}
                        className="w-full border rounded-lg p-3 text-sm"
                        placeholder="Enter your question..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Answer Options
                      </label>
                      <div className="space-y-2">
                        {q.options.map((opt, optIdx) => (
                          <div key={optIdx} className="flex items-center gap-2">
                            <input
                              type="radio"
                              checked={q.correctAnswer === optIdx}
                              onChange={() => updateQuizQuestion(qIdx, 'correctAnswer', optIdx)}
                              className="w-4 h-4"
                            />
                            <input
                              value={opt}
                              onChange={(e) => updateQuizOption(qIdx, optIdx, e.target.value)}
                              className="flex-1 border rounded-lg p-2 text-sm"
                              placeholder={`Option ${optIdx + 1}`}
                            />
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Select the radio button for the correct answer
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Price and Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Price (₩)</label>
              <input
                type="number"
                value={editingCourse.price || 0}
                onChange={(e) =>
                  setEditingCourse({ ...editingCourse, price: parseInt(e.target.value) || 0 })
                }
                className="w-full border rounded-xl p-3"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Duration</label>
              <input
                value={editingCourse.duration || ''}
                onChange={(e) => setEditingCourse({ ...editingCourse, duration: e.target.value })}
                className="w-full border rounded-xl p-3"
                placeholder="e.g., 8 weeks"
              />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Course Image URL</label>
            <input
              value={editingCourse.imageUrl || ''}
              onChange={(e) => setEditingCourse({ ...editingCourse, imageUrl: e.target.value })}
              className="w-full border rounded-xl p-3"
              placeholder="https://example.com/course-image.jpg"
            />
          </div>
        </div>
      </div>

      {/* PDF Viewer Modal */}
      {viewingPdf && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setViewingPdf(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-4xl w-full h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-bold text-lg">{viewingPdf.title}</h3>
              <button
                onClick={() => setViewingPdf(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <iframe src={viewingPdf.url} className="flex-1 w-full" />
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseEditor;