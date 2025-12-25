'use client'

import { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Move, 
  Save,
  Undo,
  Redo,
  Layout,
  Image,
  Type,
  Star,
  ShoppingCart,
  Users,
  Mail,
  Phone,
  MapPin,
  Globe,
  Settings
} from 'lucide-react'

interface Module {
  id: string
  type: string
  title?: string
  content: any
  order: number
  active: boolean
}

interface VisualEditorProps {
  pageId: string
  initialModules?: Module[]
  onSave?: (modules: Module[]) => void
}

const MODULE_TYPES = [
  {
    type: 'hero',
    name: 'Hero Section',
    icon: Layout,
    description: 'Główna sekcja z obrazem i tekstem',
    color: 'bg-blue-500'
  },
  {
    type: 'features',
    name: 'Funkcje',
    icon: Star,
    description: 'Sekcja z funkcjami/usługami',
    color: 'bg-green-500'
  },
  {
    type: 'testimonials',
    name: 'Opinie',
    icon: Users,
    description: 'Sekcja z opiniami klientów',
    color: 'bg-purple-500'
  },
  {
    type: 'products',
    name: 'Produkty',
    icon: ShoppingCart,
    description: 'Sekcja z produktami',
    color: 'bg-orange-500'
  },
  {
    type: 'gallery',
    name: 'Galeria',
    icon: Image,
    description: 'Galeria zdjęć',
    color: 'bg-pink-500'
  },
  {
    type: 'text',
    name: 'Tekst',
    icon: Type,
    description: 'Sekcja z tekstem',
    color: 'bg-gray-500'
  },
  {
    type: 'contact',
    name: 'Kontakt',
    icon: Mail,
    description: 'Informacje kontaktowe',
    color: 'bg-indigo-500'
  }
]

export default function VisualEditor({ pageId, initialModules = [], onSave }: VisualEditorProps) {
  const [modules, setModules] = useState<Module[]>(initialModules)
  const [selectedModule, setSelectedModule] = useState<string | null>(null)
  const [showModulePicker, setShowModulePicker] = useState(false)
  const [history, setHistory] = useState<Module[][]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  useEffect(() => {
    setModules(initialModules)
  }, [initialModules])

  const addToHistory = (newModules: Module[]) => {
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push([...newModules])
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  const addModule = (type: string) => {
    const newModule: Module = {
      id: `module-${Date.now()}`,
      type,
      title: `Nowy ${MODULE_TYPES.find(m => m.type === type)?.name}`,
      content: getDefaultContent(type),
      order: modules.length,
      active: true
    }
    
    const newModules = [...modules, newModule]
    setModules(newModules)
    addToHistory(newModules)
    setShowModulePicker(false)
  }

  const getDefaultContent = (type: string) => {
    switch (type) {
      case 'hero':
        return {
          title: 'Witamy w naszym sklepie',
          subtitle: 'Odkryj najlepsze produkty',
          image: '',
          buttonText: 'Zobacz produkty',
          buttonLink: '/products'
        }
      case 'features':
        return {
          title: 'Nasze zalety',
          features: [
            { title: 'Szybka dostawa', description: 'Dostawa w 24h', icon: 'truck' },
            { title: 'Wysoka jakość', description: 'Tylko najlepsze produkty', icon: 'star' },
            { title: 'Obsługa 24/7', description: 'Jesteśmy zawsze dostępni', icon: 'phone' }
          ]
        }
      case 'testimonials':
        return {
          title: 'Opinie naszych klientów',
          testimonials: [
            { name: 'Anna Kowalska', text: 'Świetny sklep!', rating: 5 },
            { name: 'Jan Nowak', text: 'Polecam!', rating: 5 }
          ]
        }
      case 'products':
        return {
          title: 'Nasze produkty',
          categoryId: '',
          limit: 8,
          showFilters: true
        }
      case 'gallery':
        return {
          title: 'Galeria',
          images: []
        }
      case 'text':
        return {
          title: 'O nas',
          content: 'Tutaj możesz napisać o swojej firmie...'
        }
      case 'contact':
        return {
          title: 'Kontakt',
          email: 'kontakt@sklep.pl',
          phone: '+48 123 456 789',
          address: 'ul. Przykładowa 1, 00-000 Warszawa'
        }
      default:
        return {}
    }
  }

  const updateModule = (id: string, updates: Partial<Module>) => {
    const newModules = modules.map(module => 
      module.id === id ? { ...module, ...updates } : module
    )
    setModules(newModules)
    addToHistory(newModules)
  }

  const deleteModule = (id: string) => {
    const newModules = modules.filter(module => module.id !== id)
    setModules(newModules)
    addToHistory(newModules)
    if (selectedModule === id) {
      setSelectedModule(null)
    }
  }

  const toggleModuleActive = (id: string) => {
    updateModule(id, { active: !modules.find(m => m.id === id)?.active })
  }

  const onDragEnd = (result: any) => {
    if (!result.destination) return

    const newModules = Array.from(modules)
    const [reorderedItem] = newModules.splice(result.source.index, 1)
    newModules.splice(result.destination.index, 0, reorderedItem)

    // Update order
    const updatedModules = newModules.map((module, index) => ({
      ...module,
      order: index
    }))

    setModules(updatedModules)
    addToHistory(updatedModules)
  }

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setModules(history[historyIndex - 1])
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setModules(history[historyIndex + 1])
    }
  }

  const saveModules = () => {
    if (onSave) {
      onSave(modules)
    }
  }

  const renderModulePreview = (module: Module) => {
    const moduleType = MODULE_TYPES.find(m => m.type === module.type)
    const Icon = moduleType?.icon || Layout

    return (
      <div className={`p-4 border-2 border-dashed rounded-lg ${
        module.active ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
      }`}>
        <div className="flex items-center space-x-3 mb-2">
          <div className={`p-2 rounded-lg ${moduleType?.color} text-white`}>
            <Icon className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-gray-900">{module.title}</h4>
            <p className="text-sm text-gray-500">{moduleType?.description}</p>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => toggleModuleActive(module.id)}
              className={`p-1 rounded ${
                module.active ? 'text-green-600' : 'text-gray-400'
              }`}
            >
              {module.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setSelectedModule(module.id)}
              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => deleteModule(module.id)}
              className="p-1 text-red-600 hover:bg-red-50 rounded"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {/* Module Content Preview */}
        <div className="text-sm text-gray-600">
          {module.type === 'hero' && (
            <div className="bg-gray-100 p-3 rounded">
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-2/3"></div>
            </div>
          )}
          {module.type === 'features' && (
            <div className="flex space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex-1 bg-gray-100 p-2 rounded">
                  <div className="h-3 bg-gray-300 rounded mb-1"></div>
                  <div className="h-2 bg-gray-300 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          )}
          {module.type === 'text' && (
            <div className="bg-gray-100 p-3 rounded">
              <div className="h-3 bg-gray-300 rounded mb-1"></div>
              <div className="h-3 bg-gray-300 rounded w-4/5"></div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Edytor wizualny</h2>
          <p className="text-sm text-gray-500">Przeciągnij moduły, aby zmienić kolejność</p>
        </div>

        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex space-x-2">
            <button
              onClick={undo}
              disabled={historyIndex <= 0}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50"
            >
              <Undo className="h-4 w-4" />
            </button>
            <button
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50"
            >
              <Redo className="h-4 w-4" />
            </button>
            <button
              onClick={saveModules}
              className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <Save className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Add Module Button */}
        <div className="p-4">
          <button
            onClick={() => setShowModulePicker(true)}
            className="w-full flex items-center justify-center space-x-2 p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <Plus className="h-5 w-5 text-gray-400" />
            <span className="text-gray-600">Dodaj moduł</span>
          </button>
        </div>

        {/* Modules List */}
        <div className="flex-1 overflow-y-auto p-4">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="modules">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                  {modules.map((module, index) => (
                    <Draggable key={module.id} draggableId={module.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`${snapshot.isDragging ? 'opacity-50' : ''}`}
                        >
                          <div
                            {...provided.dragHandleProps}
                            className="flex items-center space-x-2 mb-2"
                          >
                            <Move className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-500">Przeciągnij</span>
                          </div>
                          {renderModulePreview(module)}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Preview Header */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Podgląd strony</h3>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded">
                <Globe className="h-4 w-4" />
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded">
                <Settings className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-y-auto bg-gray-100 p-8">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm min-h-[600px]">
            {modules.filter(m => m.active).length === 0 ? (
              <div className="flex items-center justify-center h-96 text-gray-500">
                <div className="text-center">
                  <Layout className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg">Brak modułów</p>
                  <p className="text-sm">Dodaj pierwszy moduł, aby rozpocząć</p>
                </div>
              </div>
            ) : (
              <div className="space-y-8 p-8">
                {modules
                  .filter(m => m.active)
                  .sort((a, b) => a.order - b.order)
                  .map((module) => (
                    <div key={module.id} className="border border-gray-200 rounded-lg p-6">
                      <h4 className="text-lg font-semibold mb-4">{module.title}</h4>
                      <div className="text-sm text-gray-600">
                        Moduł: {MODULE_TYPES.find(m => m.type === module.type)?.name}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Module Picker Modal */}
      {showModulePicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Wybierz typ modułu</h3>
            <div className="grid grid-cols-2 gap-4">
              {MODULE_TYPES.map((moduleType) => {
                const Icon = moduleType.icon
                return (
                  <button
                    key={moduleType.type}
                    onClick={() => addModule(moduleType.type)}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`p-2 rounded-lg ${moduleType.color} text-white`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{moduleType.name}</h4>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">{moduleType.description}</p>
                  </button>
                )
              })}
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowModulePicker(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Anuluj
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
