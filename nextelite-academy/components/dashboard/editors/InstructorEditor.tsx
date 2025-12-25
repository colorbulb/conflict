import React, { useState } from 'react';
import { Instructor } from '../../../types';
import { Save, ArrowLeft, Upload } from 'lucide-react';
import { uploadImage } from '../../../firebase/storage';

interface InstructorEditorProps {
  instructor: Instructor;
  onSave: (instructor: Instructor) => void;
  onCancel: () => void;
}


const InstructorEditor: React.FC<InstructorEditorProps> = ({ instructor, onSave, onCancel }) => {
  const [activeLang, setActiveLang] = useState<'en' | 'zh'>('en');
  const safeInstructor: Instructor = {
    ...instructor,
    en: {
      name: instructor.en?.name || '',
      role: instructor.en?.role || '',
      bio: instructor.en?.bio || ''
    },
    zh: {
      name: instructor.zh?.name || '',
      role: instructor.zh?.role || '',
      bio: instructor.zh?.bio || ''
    }
  };
  const [editingInstructor, setEditingInstructor] = useState<Instructor>(safeInstructor);
  const [isUploading, setIsUploading] = useState(false);

  const handleSave = () => {
    onSave(editingInstructor);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button
        onClick={onCancel}
        className="flex items-center text-gray-500 hover:text-gray-800 mb-6 font-bold"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Instructors
      </button>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-2xl font-bold text-gray-800">Edit Instructor</h2>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 rounded-full bg-brand-blue text-white font-bold hover:bg-blue-600 shadow-sm transition-transform hover:scale-105"
          >
            <Save className="w-4 h-4" /> Save Instructor
          </button>
        </div>

        <div className="p-8 space-y-6">
          {/* Language Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              className={`px-4 py-2 rounded-t-lg font-bold ${activeLang === 'en' ? 'bg-brand-blue text-white' : 'bg-white text-brand-blue border'}`}
              onClick={() => setActiveLang('en')}
            >
              English
            </button>
            <button
              className={`px-4 py-2 rounded-t-lg font-bold ${activeLang === 'zh' ? 'bg-brand-blue text-white' : 'bg-white text-brand-blue border'}`}
              onClick={() => setActiveLang('zh')}
            >
              繁體中文
            </button>
          </div>
          <div className="flex gap-6 items-start">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg shrink-0">
              <img src={editingInstructor.imageUrl} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                <input
                  value={editingInstructor[activeLang].name}
                  onChange={(e) =>
                    setEditingInstructor({
                      ...editingInstructor,
                      [activeLang]: {
                        ...editingInstructor[activeLang],
                        name: e.target.value
                      }
                    })
                  }
                  className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Role / Title</label>
                <input
                  value={editingInstructor[activeLang].role}
                  onChange={(e) =>
                    setEditingInstructor({
                      ...editingInstructor,
                      [activeLang]: {
                        ...editingInstructor[activeLang],
                        role: e.target.value
                      }
                    })
                  }
                  className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Profile Image</label>
            <input
              type="text"
              value={editingInstructor.imageUrl}
              onChange={(e) =>
                setEditingInstructor({ ...editingInstructor, imageUrl: e.target.value })
              }
              className="w-full border rounded-xl p-3 text-sm font-mono text-gray-500 mb-2"
              placeholder="Image URL or drag & drop image below"
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
                  const file = files[0];
                  if (file.type.startsWith('image/')) {
                    try {
                      setIsUploading(true);
                      const uploaded = await uploadImage(file, 'instructors');
                      setEditingInstructor({
                        ...editingInstructor,
                        imageUrl: uploaded.url
                      });
                    } catch (error) {
                      console.error('Error uploading instructor image:', error);
                      alert('Error uploading image. Please try again.');
                    } finally {
                      setIsUploading(false);
                    }
                  } else {
                    alert('Please upload an image file (PNG, JPG, GIF, etc.)');
                  }
                }
              }}
              className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
            >
              {isUploading ? (
                <div className="text-gray-500 text-sm">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue mx-auto mb-2"></div>
                  Uploading image...
                </div>
              ) : (
                <div className="text-gray-500 text-sm">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="font-bold">Drag & drop image here</p>
                  <p className="text-xs mt-1">or click to browse</p>
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const files = e.target.files;
                if (files && files.length > 0) {
                  const file = files[0];
                  try {
                    setIsUploading(true);
                    const uploaded = await uploadImage(file, 'instructors');
                    setEditingInstructor({
                      ...editingInstructor,
                      imageUrl: uploaded.url
                    });
                  } catch (error) {
                    console.error('Error uploading instructor image:', error);
                    alert('Error uploading image. Please try again.');
                  } finally {
                    setIsUploading(false);
                  }
                }
              }}
              className="hidden"
              id="instructor-image-upload"
            />
            <label
              htmlFor="instructor-image-upload"
              className="mt-2 block text-center text-xs text-brand-blue hover:text-brand-purple font-bold cursor-pointer"
            >
              Or click to browse files
            </label>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Biography</label>
            <textarea
              value={editingInstructor[activeLang].bio}
              onChange={(e) =>
                setEditingInstructor({
                  ...editingInstructor,
                  [activeLang]: {
                    ...editingInstructor[activeLang],
                    bio: e.target.value
                  }
                })
              }
              className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none h-32"
            />
          </div>

          {/* Social Media Links */}
          <div>
            <h4 className="text-sm font-bold text-gray-700 mb-3">Social Media Links</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">LinkedIn</label>
                <input
                  type="text"
                  value={editingInstructor.socialMedia?.linkedin || ''}
                  onChange={(e) =>
                    setEditingInstructor({
                      ...editingInstructor,
                      socialMedia: {
                        ...(editingInstructor.socialMedia || {}),
                        linkedin: e.target.value
                      }
                    })
                  }
                  className="w-full border rounded-lg p-2 text-sm"
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Twitter</label>
                <input
                  type="text"
                  value={editingInstructor.socialMedia?.twitter || ''}
                  onChange={(e) =>
                    setEditingInstructor({
                      ...editingInstructor,
                      socialMedia: {
                        ...(editingInstructor.socialMedia || {}),
                        twitter: e.target.value
                      }
                    })
                  }
                  className="w-full border rounded-lg p-2 text-sm"
                  placeholder="https://twitter.com/..."
                />
              </div>
            </div>
          </div>

          {/* Certifications */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-bold text-gray-700">Certifications</h4>
              <button
                onClick={() =>
                  setEditingInstructor({
                    ...editingInstructor,
                    certifications: [...(editingInstructor.certifications || []), '']
                  })
                }
                className="text-xs text-brand-blue font-bold hover:bg-blue-50 px-2 py-1 rounded"
              >
                + Add
              </button>
            </div>
            <div className="space-y-2">
              {(editingInstructor.certifications || []).map((cert, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    value={cert}
                    onChange={(e) => {
                      const newCerts = [...(editingInstructor.certifications || [])];
                      newCerts[idx] = e.target.value;
                      setEditingInstructor({
                        ...editingInstructor,
                        certifications: newCerts
                      });
                    }}
                    className="flex-1 border rounded-lg p-2 text-sm"
                    placeholder="Certification name"
                  />
                  <button
                    onClick={() => {
                      const newCerts = (editingInstructor.certifications || []).filter(
                        (_, i) => i !== idx
                      );
                      setEditingInstructor({
                        ...editingInstructor,
                        certifications: newCerts
                      });
                    }}
                    className="text-red-500 hover:text-red-700 px-2"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorEditor;