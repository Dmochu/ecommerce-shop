'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Eye, Settings, Globe } from 'lucide-react'
import Link from 'next/link'
import VisualEditor from '@/components/admin/VisualEditor'

interface Module {
  id: string
  type: string
  title?: string
  content: any
  order: number
  active: boolean
}

interface Page {
  id: string
  title: string
  slug: string
  description: string | null
  metaTitle: string | null
  metaDescription: string | null
  active: boolean
  modules: Array<{
    id: string
    type: string
    title: string | null
    content: any
    order: number
    active: boolean
  }>
}

interface PageEditorProps {
  page: Page
}

export default function PageEditor({ page }: PageEditorProps) {
  const router = useRouter()
  const [modules, setModules] = useState<Module[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [pageSettings, setPageSettings] = useState({
    title: page.title,
    slug: page.slug,
    description: page.description || '',
    metaTitle: page.metaTitle || '',
    metaDescription: page.metaDescription || '',
    active: page.active
  })

  useEffect(() => {
    // Convert page modules to editor format
    const editorModules = page.modules.map(module => ({
      id: module.id,
      type: module.type,
      title: module.title || '',
      content: module.content,
      order: module.order,
      active: module.active
    }))
    setModules(editorModules)
  }, [page.modules])

  const handleSaveModules = async (updatedModules: Module[]) => {
    setIsSaving(true)
    
    try {
      const response = await fetch(`/api/admin/pages/${page.id}/modules`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ modules: updatedModules })
      })

      if (response.ok) {
        setModules(updatedModules)
        // Show success message
        const notification = document.createElement('div')
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50'
        notification.textContent = 'Moduły zostały zapisane!'
        document.body.appendChild(notification)
        
        setTimeout(() => {
          document.body.removeChild(notification)
        }, 3000)
      } else {
        throw new Error('Failed to save modules')
      }
    } catch (error) {
      console.error('Error saving modules:', error)
      alert('Błąd podczas zapisywania modułów')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveSettings = async () => {
    setIsSaving(true)
    
    try {
      const response = await fetch(`/api/admin/pages/${page.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pageSettings)
      })

      if (response.ok) {
        setShowSettings(false)
        // Show success message
        const notification = document.createElement('div')
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50'
        notification.textContent = 'Ustawienia zostały zapisane!'
        document.body.appendChild(notification)
        
        setTimeout(() => {
          document.body.removeChild(notification)
        }, 3000)
      } else {
        throw new Error('Failed to save settings')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Błąd podczas zapisywania ustawień')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/admin/pages"
              className="inline-flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Powrót
            </Link>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{page.title}</h1>
              <p className="text-sm text-gray-500">/{page.slug}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowSettings(true)}
              className="inline-flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Settings className="h-4 w-4 mr-2" />
              Ustawienia
            </button>
            
            <a
              href={`/${page.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Eye className="h-4 w-4 mr-2" />
              Podgląd
            </a>
            
            <button
              onClick={() => handleSaveModules(modules)}
              disabled={isSaving}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Zapisywanie...' : 'Zapisz'}
            </button>
          </div>
        </div>
      </div>

      {/* Visual Editor */}
      <div className="flex-1">
        <VisualEditor
          pageId={page.id}
          initialModules={modules}
          onSave={handleSaveModules}
        />
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Ustawienia strony</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tytuł strony *
                </label>
                <input
                  type="text"
                  required
                  value={pageSettings.title}
                  onChange={(e) => setPageSettings({...pageSettings, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL (slug) *
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    /
                  </span>
                  <input
                    type="text"
                    required
                    value={pageSettings.slug}
                    onChange={(e) => setPageSettings({...pageSettings, slug: e.target.value})}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Opis strony
                </label>
                <textarea
                  rows={3}
                  value={pageSettings.description}
                  onChange={(e) => setPageSettings({...pageSettings, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta tytuł
                </label>
                <input
                  type="text"
                  value={pageSettings.metaTitle}
                  onChange={(e) => setPageSettings({...pageSettings, metaTitle: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  maxLength={60}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {pageSettings.metaTitle.length}/60 znaków
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta opis
                </label>
                <textarea
                  rows={3}
                  value={pageSettings.metaDescription}
                  onChange={(e) => setPageSettings({...pageSettings, metaDescription: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  maxLength={160}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {pageSettings.metaDescription.length}/160 znaków
                </p>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="active"
                  checked={pageSettings.active}
                  onChange={(e) => setPageSettings({...pageSettings, active: e.target.checked})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="active" className="ml-2 block text-sm text-gray-700">
                  Strona aktywna
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Anuluj
              </button>
              <button
                onClick={handleSaveSettings}
                disabled={isSaving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {isSaving ? 'Zapisywanie...' : 'Zapisz ustawienia'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
