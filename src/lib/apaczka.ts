import axios from 'axios'

// Konfiguracja API Apaczki
const APACZKA_API_URL = process.env.APACZKA_API_URL || 'https://api.apaczka.pl'
const APACZKA_API_KEY = process.env.APACZKA_API_KEY
const APACZKA_USERNAME = process.env.APACZKA_USERNAME
const APACZKA_PASSWORD = process.env.APACZKA_PASSWORD

// Interfejsy dla API Apaczki
export interface ApaczkaShipment {
  id: string
  trackingNumber: string
  status: string
  createdAt: string
  updatedAt: string
}

export interface ApaczkaCreateShipmentRequest {
  sender: {
    name: string
    email: string
    phone: string
    address: string
    city: string
    postalCode: string
    country: string
  }
  recipient: {
    name: string
    email: string
    phone: string
    address: string
    city: string
    postalCode: string
    country: string
  }
  package: {
    weight: number // w kg
    length: number // w cm
    width: number // w cm
    height: number // w cm
    description: string
  }
  service: string // np. 'inpost', 'dpd', 'poczta'
}

export interface ApaczkaCreateShipmentResponse {
  success: boolean
  shipmentId: string
  trackingNumber: string
  labelUrl?: string
  error?: string
}

// Klasa do obsługi API Apaczki
class ApaczkaAPI {
  private apiKey: string
  private username: string
  private password: string
  private baseURL: string

  constructor() {
    this.apiKey = APACZKA_API_KEY || ''
    this.username = APACZKA_USERNAME || ''
    this.password = APACZKA_PASSWORD || ''
    this.baseURL = APACZKA_API_URL

    if (!this.apiKey || !this.username || !this.password) {
      console.warn('Apaczka API credentials not configured')
    }
  }

  // Tworzenie instancji axios z konfiguracją
  private getAxiosInstance() {
    return axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        'X-Username': this.username,
        'X-Password': this.password
      },
      timeout: 30000 // 30 sekund
    })
  }

  // Tworzenie przesyłki
  async createShipment(shipmentData: ApaczkaCreateShipmentRequest): Promise<ApaczkaCreateShipmentResponse> {
    try {
      const response = await this.getAxiosInstance().post('/shipments', shipmentData)
      
      return {
        success: true,
        shipmentId: response.data.shipmentId,
        trackingNumber: response.data.trackingNumber,
        labelUrl: response.data.labelUrl
      }
    } catch (error: any) {
      console.error('Apaczka API error:', error.response?.data || error.message)
      
      return {
        success: false,
        shipmentId: '',
        trackingNumber: '',
        error: error.response?.data?.message || error.message
      }
    }
  }

  // Pobieranie statusu przesyłki
  async getShipmentStatus(trackingNumber: string): Promise<any> {
    try {
      const response = await this.getAxiosInstance().get(`/shipments/${trackingNumber}`)
      return response.data
    } catch (error: any) {
      console.error('Apaczka API error:', error.response?.data || error.message)
      throw error
    }
  }

  // Pobieranie listy dostępnych usług kurierskich
  async getAvailableServices(): Promise<any[]> {
    try {
      const response = await this.getAxiosInstance().get('/services')
      return response.data
    } catch (error: any) {
      console.error('Apaczka API error:', error.response?.data || error.message)
      return []
    }
  }

  // Sprawdzanie ceny przesyłki
  async calculatePrice(shipmentData: ApaczkaCreateShipmentRequest): Promise<any> {
    try {
      const response = await this.getAxiosInstance().post('/calculate-price', shipmentData)
      return response.data
    } catch (error: any) {
      console.error('Apaczka API error:', error.response?.data || error.message)
      throw error
    }
  }
}

// Eksportuj instancję
export const apaczkaAPI = new ApaczkaAPI()
