'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

export interface VoiceSearchOptions {
  language?: string
  continuous?: boolean
  interimResults?: boolean
  maxAlternatives?: number
}

export interface VoiceSearchResult {
  transcript: string
  confidence: number
  isFinal: boolean
}

export function useVoiceSearch(options: VoiceSearchOptions = {}) {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [confidence, setConfidence] = useState(0)
  const [error, setError] = useState<string | null>(null)
  
  const recognitionRef = useRef<any>(null)
  const onResultRef = useRef<((result: VoiceSearchResult) => void) | null>(null)
  const onErrorRef = useRef<((error: string) => void) | null>(null)

  const {
    language = 'pl-PL',
    continuous = false,
    interimResults = true,
    maxAlternatives = 1
  } = options

  // Sprawdź czy przeglądarka obsługuje rozpoznawanie mowy
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      setIsSupported(!!SpeechRecognition)
      
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = continuous
        recognitionRef.current.interimResults = interimResults
        recognitionRef.current.lang = language
        recognitionRef.current.maxAlternatives = maxAlternatives

        recognitionRef.current.onstart = () => {
          setIsListening(true)
          setError(null)
        }

        recognitionRef.current.onresult = (event: any) => {
          const result = event.results[event.results.length - 1]
          const transcript = result[0].transcript
          const confidence = result[0].confidence || 0
          const isFinal = result.isFinal

          setTranscript(transcript)
          setConfidence(confidence)

          if (onResultRef.current) {
            onResultRef.current({
              transcript,
              confidence,
              isFinal
            })
          }
        }

        recognitionRef.current.onerror = (event: any) => {
          const errorMessage = getErrorMessage(event.error)
          setError(errorMessage)
          setIsListening(false)
          
          if (onErrorRef.current) {
            onErrorRef.current(errorMessage)
          }
        }

        recognitionRef.current.onend = () => {
          setIsListening(false)
        }
      }
    }
  }, [language, continuous, interimResults, maxAlternatives])

  const startListening = useCallback(() => {
    if (!recognitionRef.current || isListening) return

    try {
      setError(null)
      setTranscript('')
      setConfidence(0)
      recognitionRef.current.start()
    } catch (err) {
      setError('Nie można rozpocząć nagrywania')
    }
  }, [isListening])

  const stopListening = useCallback(() => {
    if (!recognitionRef.current || !isListening) return

    try {
      recognitionRef.current.stop()
    } catch (err) {
      setError('Nie można zatrzymać nagrywania')
    }
  }, [isListening])

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }, [isListening, startListening, stopListening])

  const onResult = useCallback((callback: (result: VoiceSearchResult) => void) => {
    onResultRef.current = callback
  }, [])

  const onError = useCallback((callback: (error: string) => void) => {
    onErrorRef.current = callback
  }, [])

  const getErrorMessage = (error: string): string => {
    switch (error) {
      case 'no-speech':
        return 'Nie wykryto mowy. Spróbuj ponownie.'
      case 'audio-capture':
        return 'Błąd dostępu do mikrofonu. Sprawdź uprawnienia.'
      case 'not-allowed':
        return 'Brak uprawnień do mikrofonu. Zezwól na dostęp w ustawieniach przeglądarki.'
      case 'network':
        return 'Błąd sieci. Sprawdź połączenie internetowe.'
      case 'service-not-allowed':
        return 'Usługa rozpoznawania mowy nie jest dostępna.'
      case 'bad-grammar':
        return 'Błąd gramatyki w rozpoznawaniu mowy.'
      default:
        return `Błąd rozpoznawania mowy: ${error}`
    }
  }

  return {
    isListening,
    isSupported,
    transcript,
    confidence,
    error,
    startListening,
    stopListening,
    toggleListening,
    onResult,
    onError
  }
}

// Hook do zarządzania uprawnieniami mikrofonu
export function useMicrophonePermission() {
  const [permission, setPermission] = useState<'granted' | 'denied' | 'prompt' | 'unknown'>('unknown')
  const [isRequesting, setIsRequesting] = useState(false)

  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'permissions' in navigator) {
      navigator.permissions.query({ name: 'microphone' as PermissionName })
        .then(result => {
          setPermission(result.state as any)
        })
        .catch(() => {
          setPermission('unknown')
        })
    }
  }, [])

  const requestPermission = useCallback(async () => {
    if (typeof navigator === 'undefined' || !('mediaDevices' in navigator)) {
      return false
    }

    setIsRequesting(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach(track => track.stop())
      setPermission('granted')
      return true
    } catch (error) {
      setPermission('denied')
      return false
    } finally {
      setIsRequesting(false)
    }
  }, [])

  return {
    permission,
    isRequesting,
    requestPermission
  }
}

// Hook do analizy jakości mowy
export function useSpeechQuality() {
  const [quality, setQuality] = useState<'excellent' | 'good' | 'fair' | 'poor'>('good')
  const [volume, setVolume] = useState(0)

  const analyzeQuality = useCallback((confidence: number, transcript: string) => {
    let qualityScore: 'excellent' | 'good' | 'fair' | 'poor' = 'good'

    if (confidence >= 0.9) {
      qualityScore = 'excellent'
    } else if (confidence >= 0.7) {
      qualityScore = 'good'
    } else if (confidence >= 0.5) {
      qualityScore = 'fair'
    } else {
      qualityScore = 'poor'
    }

    // Analiza długości transkrypcji
    if (transcript.length < 3) {
      qualityScore = 'poor'
    }

    setQuality(qualityScore)
  }, [])

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent':
        return 'text-green-600'
      case 'good':
        return 'text-blue-600'
      case 'fair':
        return 'text-yellow-600'
      case 'poor':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const getQualityLabel = (quality: string) => {
    switch (quality) {
      case 'excellent':
        return 'Doskonała jakość'
      case 'good':
        return 'Dobra jakość'
      case 'fair':
        return 'Średnia jakość'
      case 'poor':
        return 'Słaba jakość'
      default:
        return 'Nieznana jakość'
    }
  }

  return {
    quality,
    volume,
    analyzeQuality,
    getQualityColor,
    getQualityLabel
  }
}
