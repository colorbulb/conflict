import React, { useState, useEffect } from 'react';
import { MenuItem, CustomPage, Course, BlogPost } from '../../types';
import { Plus, Trash2, Save } from 'lucide-react';

interface MenuTabProps {
  enMenuItems: MenuItem[];
  zhMenuItems: MenuItem[];
  customPages: CustomPage[];
  courses: Course[];
  blogPosts: BlogPost[];
  onUpdateMenuItems?: (items: MenuItem[], lang?: 'en' | 'zh') => Promise<void>;
}

const MenuTab: React.FC<MenuTabProps> = ({ 
  enMenuItems, 
  zhMenuItems, 
  customPages,
  courses,
  blogPosts,
  onUpdateMenuItems 
}) => {
  const [menuEditingLang, setMenuEditingLang] = useState<'en' | 'zh'>('en');
  const [localEnMenuItems, setLocalEnMenuItems] = useState<MenuItem[]>(enMenuItems);
  const [localZhMenuItems, setLocalZhMenuItems] = useState<MenuItem[]>(zhMenuItems);
  
  useEffect(() => {
    setLocalEnMenuItems(enMenuItems);
  }, [enMenuItems]);
  
  useEffect(() => {
    setLocalZhMenuItems(zhMenuItems);
  }, [zhMenuItems]);

  const currentMenuItems = menuEditingLang === 'en' ? localEnMenuItems : localZhMenuItems;
  const setCurrentMenuItems = menuEditingLang === 'en' ? setLocalEnMenuItems : setLocalZhMenuItems;

  const handleSaveMenuItems = async () => {
    if (onUpdateMenuItems) {
      try {
        await onUpdateMenuItems(currentMenuItems, menuEditingLang);
        alert(`Menu items saved successfully for ${menuEditingLang === 'en' ? 'English' : '繁體中文'}!`);
      } catch (err) {
        console.error('Error saving menu items:', err);
        alert('Error saving menu items. Please try again.');
      }
    }
  };

  // Generate comprehensive list of all available pages
  const getAllAvailablePages = () => {
    const pages: Array<{ path: string; label: string; category: string }> = [];

    // System/Static Pages
    pages.push(
      { path: '/', label: 'Home Page', category: 'System' },
      { path: '/courses', label: 'Courses Listing', category: 'System' },
      { path: '/instructors', label: 'Instructors Listing', category: 'System' },
      { path: '/blog', label: 'Blog Listing', category: 'System' },
      { path: '/gallery', label: 'Gallery', category: 'System' },
      { path: '/about', label: 'About Us', category: 'System' },
      { path: '/contact', label: 'Contact', category: 'System' }
    );

    // Custom Pages
    customPages.forEach(page => {
      const name = page.translations[menuEditingLang]?.name || page.translations.en?.name || 'Untitled';
      pages.push({
        path: `/${page.slug}`,
        label: `${name} (Custom Page)`,
        category: 'Custom Pages'
      });
    });

    // Course Detail Pages
    courses.forEach(course => {
      pages.push({
        path: `/courses/${course.id}`,
        label: `${course.title} (Course Detail)`,
        category: 'Course Pages'
      });
    });

    // Blog Post Pages
    blogPosts.forEach(post => {
      pages.push({
        path: `/blog/${post.id}`,
        label: `${post.title} (Blog Post)`,
        category: 'Blog Posts'
      });
    });

    return pages;
  };

  const allPages = getAllAvailablePages();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-800">Frontend Navigation Menu</h3>
            <p className="text-sm text-gray-600 mt-1">Manage the main navigation menu. You can create submenus by selecting a parent item.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setMenuEditingLang('en')}
              className={`px-4 py-2 rounded-lg font-bold transition-colors ${menuEditingLang === 'en' ? 'bg-brand-blue text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              English
            </button>
            <button
              onClick={() => setMenuEditingLang('zh')}
              className={`px-4 py-2 rounded-lg font-bold transition-colors ${menuEditingLang === 'zh' ? 'bg-brand-blue text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              繁體中文
            </button>
          </div>
        </div>

        {/* Available Pages Reference */}
        <details className="mb-6 bg-blue-50 rounded-lg p-4">
          <summary className="cursor-pointer font-bold text-brand-blue mb-2">
            📋 Available Pages Reference ({allPages.length} pages)
          </summary>
          <div className="mt-4 space-y-4">
            {['System', 'Custom Pages', 'Course Pages', 'Blog Posts'].map(category => {
              const categoryPages = allPages.filter(p => p.category === category);
              if (categoryPages.length === 0) return null;
              return (
                <div key={category} className="border-l-4 border-brand-blue pl-4">
                  <h4 className="font-bold text-gray-700 mb-2">{category}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {categoryPages.map(page => (
                      <div key={page.path} className="text-xs bg-white rounded px-2 py-1 border border-gray-200">
                        <span className="font-mono text-gray-600">{page.path}</span>
                        <br />
                        <span className="text-gray-500">{page.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </details>

        <div className="space-y-3">
          {currentMenuItems
            .filter(item => !item.parentId)
            .sort((a, b) => a.order - b.order)
            .map(item => {
              const children = currentMenuItems.filter(child => child.parentId === item.id).sort((a, b) => a.order - b.order);
              return (
                <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="flex items-center gap-4 p-4 bg-gray-50">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={item.label}
                          onChange={(e) => {
                            const newItems = currentMenuItems.map(i => 
                              i.id === item.id ? { ...i, label: e.target.value } : i
                            );
                            setCurrentMenuItems(newItems);
                          }}
                          className="font-bold text-gray-800 border rounded px-2 py-1 text-sm"
                          placeholder="Menu Label"
                        />
                        {children.length > 0 && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-bold">
                            {children.length} submenu{children.length !== 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <select
                          value={item.type}
                          onChange={(e) => {
                            const newItems = currentMenuItems.map(i => 
                              i.id === item.id ? { ...i, type: e.target.value as 'page' | 'link' | 'custom' } : i
                            );
                            setCurrentMenuItems(newItems);
                          }}
                          className="border rounded px-2 py-1"
                        >
                          <option value="custom">Internal Route</option>
                          <option value="page">Custom Page Slug</option>
                          <option value="link">External Link</option>
                        </select>
                        {item.type === 'custom' ? (
                          <div className="flex-1 relative">
                            <input
                              type="text"
                              value={item.target}
                              onChange={(e) => {
                                const newItems = currentMenuItems.map(i => 
                                  i.id === item.id ? { ...i, target: e.target.value } : i
                                );
                                setCurrentMenuItems(newItems);
                              }}
                              className="w-full border rounded px-2 py-1 text-xs font-mono"
                              placeholder="/route or /courses/id"
                              list={`all-pages-${item.id}`}
                            />
                            <datalist id={`all-pages-${item.id}`}>
                              {allPages.map(page => (
                                <option key={page.path} value={page.path}>
                                  {page.label}
                                </option>
                              ))}
                            </datalist>
                          </div>
                        ) : item.type === 'page' ? (
                          <div className="flex-1 relative">
                            <input
                              type="text"
                              value={item.target}
                              onChange={(e) => {
                                const newItems = currentMenuItems.map(i => 
                                  i.id === item.id ? { ...i, target: e.target.value } : i
                                );
                                setCurrentMenuItems(newItems);
                              }}
                              className="w-full border rounded px-2 py-1 text-xs font-mono"
                              placeholder="page-slug"
                              list={`custom-pages-${item.id}`}
                            />
                            <datalist id={`custom-pages-${item.id}`}>
                              {customPages.map(page => (
                                <option key={page.id} value={page.slug}>
                                  {page.translations[menuEditingLang]?.name || page.slug}
                                </option>
                              ))}
                            </datalist>
                          </div>
                        ) : (
                          <input
                            type="text"
                            value={item.target}
                            onChange={(e) => {
                              const newItems = currentMenuItems.map(i => 
                                i.id === item.id ? { ...i, target: e.target.value } : i
                              );
                              setCurrentMenuItems(newItems);
                            }}
                            className="flex-1 border rounded px-2 py-1 text-xs font-mono"
                            placeholder="https://..."
                          />
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <input
                        type="number"
                        value={item.order}
                        onChange={(e) => {
                          const newItems = currentMenuItems.map(i => 
                            i.id === item.id ? { ...i, order: parseInt(e.target.value) || 0 } : i
                          );
                          setCurrentMenuItems(newItems);
                        }}
                        className="w-16 border rounded px-2 py-1 text-xs text-center"
                        placeholder="Order"
                      />
                      <button
                        onClick={() => {
                          const newItems = currentMenuItems.map(i => 
                            i.id === item.id ? { ...i, visible: !i.visible } : i
                          );
                          setCurrentMenuItems(newItems);
                        }}
                        className={`text-xs px-3 py-1 rounded-lg font-bold ${item.visible ? 'bg-green-200 text-green-700' : 'bg-gray-200 text-gray-700'} hover:opacity-80`}
                      >
                        {item.visible ? 'Visible' : 'Hidden'}
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Delete this menu item and all its submenus?')) {
                            const newItems = currentMenuItems.filter(i => i.id !== item.id && i.parentId !== item.id);
                            setCurrentMenuItems(newItems);
                          }
                        }}
                        className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Submenu Items */}
                  {children.length > 0 && (
                    <div className="bg-gray-100 border-t border-gray-200 p-3 space-y-2">
                      {children.map(child => (
                        <div key={child.id} className="flex items-center gap-2 p-2 bg-white rounded border border-gray-200">
                          <span className="text-xs text-gray-500">└─</span>
                          <input
                            type="text"
                            value={child.label}
                            onChange={(e) => {
                              const newItems = currentMenuItems.map(i => 
                                i.id === child.id ? { ...i, label: e.target.value } : i
                              );
                              setCurrentMenuItems(newItems);
                            }}
                            className="flex-1 text-sm border rounded px-2 py-1"
                            placeholder="Submenu Label"
                          />
                          <select
                            value={child.type}
                            onChange={(e) => {
                              const newItems = currentMenuItems.map(i => 
                                i.id === child.id ? { ...i, type: e.target.value as 'page' | 'link' | 'custom' } : i
                              );
                              setCurrentMenuItems(newItems);
                            }}
                            className="text-xs border rounded px-2 py-1"
                          >
                            <option value="custom">Route</option>
                            <option value="page">Page</option>
                            <option value="link">Link</option>
                          </select>
                          <input
                            type="text"
                            value={child.target}
                            onChange={(e) => {
                              const newItems = currentMenuItems.map(i => 
                                i.id === child.id ? { ...i, target: e.target.value } : i
                              );
                              setCurrentMenuItems(newItems);
                            }}
                            className="w-32 text-xs border rounded px-2 py-1 font-mono"
                            placeholder="target"
                            list={child.type === 'custom' ? `all-pages-sub-${child.id}` : undefined}
                          />
                          {child.type === 'custom' && (
                            <datalist id={`all-pages-sub-${child.id}`}>
                              {allPages.map(page => (
                                <option key={page.path} value={page.path}>
                                  {page.label}
                                </option>
                              ))}
                            </datalist>
                          )}
                          <input
                            type="number"
                            value={child.order}
                            onChange={(e) => {
                              const newItems = currentMenuItems.map(i => 
                                i.id === child.id ? { ...i, order: parseInt(e.target.value) || 0 } : i
                              );
                              setCurrentMenuItems(newItems);
                            }}
                            className="w-12 text-xs border rounded px-1 py-1 text-center"
                          />
                          <button
                            onClick={() => {
                              const newItems = currentMenuItems.map(i => 
                                i.id === child.id ? { ...i, visible: !i.visible } : i
                              );
                              setCurrentMenuItems(newItems);
                            }}
                            className={`text-xs px-2 py-1 rounded ${child.visible ? 'bg-green-200 text-green-700' : 'bg-gray-200 text-gray-700'}`}
                          >
                            {child.visible ? '✓' : '✗'}
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Delete this submenu item?')) {
                                const newItems = currentMenuItems.filter(i => i.id !== child.id);
                                setCurrentMenuItems(newItems);
                              }
                            }}
                            className="text-red-500 hover:bg-red-50 p-1 rounded"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          const newItem: MenuItem = {
                            id: Math.random().toString(36).substr(2, 9),
                            label: 'New Submenu Item',
                            type: 'custom',
                            target: '',
                            order: children.length,
                            visible: true,
                            parentId: item.id
                          };
                          const newItems = [...currentMenuItems, newItem];
                          setCurrentMenuItems(newItems);
                        }}
                        className="text-xs bg-gray-200 text-gray-700 px-3 py-1 rounded font-bold hover:bg-gray-300 flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Add Submenu
                      </button>
                    </div>
                  )}
                  
                  {/* Add Submenu Button (if no children) */}
                  {children.length === 0 && (
                    <div className="bg-gray-50 border-t border-gray-200 p-2">
                      <button
                        onClick={() => {
                          const newItem: MenuItem = {
                            id: Math.random().toString(36).substr(2, 9),
                            label: 'New Submenu Item',
                            type: 'custom',
                            target: '',
                            order: 0,
                            visible: true,
                            parentId: item.id
                          };
                          const newItems = [...currentMenuItems, newItem];
                          setCurrentMenuItems(newItems);
                        }}
                        className="text-xs bg-gray-200 text-gray-700 px-3 py-1 rounded font-bold hover:bg-gray-300 flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Add Submenu
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
        
        <button
          onClick={() => {
            const newItem: MenuItem = {
              id: Math.random().toString(36).substr(2, 9),
              label: 'New Menu Item',
              type: 'custom',
              target: '',
              order: currentMenuItems.filter(i => !i.parentId).length,
              visible: true
            };
            const newItems = [...currentMenuItems, newItem];
            setCurrentMenuItems(newItems);
          }}
          className="mt-4 bg-brand-blue text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-600"
        >
          <Plus className="w-4 h-4" /> Add Menu Item
        </button>
        
        {/* Save Menu Button */}
        <button
          onClick={handleSaveMenuItems}
          className="mt-4 w-full bg-brand-green text-white py-4 rounded-xl font-bold hover:bg-green-600 flex justify-center items-center gap-2 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1"
        >
          <Save className="w-5 h-5" /> Save Menu Changes
        </button>
      </div>
    </div>
  );
};

export default MenuTab;
