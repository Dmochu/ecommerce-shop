'use client'

import { useState, useEffect } from 'react'
import { 
  Share2, 
  Users, 
  Gift, 
  Copy, 
  CheckCircle, 
  Mail, 
  MessageCircle,
  Facebook,
  Twitter,
  Instagram,
  Link as LinkIcon,
  Star,
  Trophy,
  Zap
} from 'lucide-react'

interface ReferralProgramProps {
  userId?: string
  referralCode?: string
  referrerReward?: number
  refereeReward?: number
  onShare?: (platform: string, url: string) => void
}

export default function ReferralProgram({ 
  userId, 
  referralCode, 
  referrerReward = 100, 
  refereeReward = 50,
  onShare 
}: ReferralProgramProps) {
  const [copied, setCopied] = useState(false)
  const [referralStats, setReferralStats] = useState({
    totalReferrals: 0,
    completedReferrals: 0,
    totalRewards: 0
  })
  const [emailForm, setEmailForm] = useState({
    emails: '',
    message: ''
  })

  const referralUrl = referralCode 
    ? `${window.location.origin}?ref=${referralCode}`
    : `${window.location.origin}?ref=${userId}`

  const shareText = `Dołącz do sklepu Tulinki i otrzymaj ${refereeReward} punktów bonusowych! Użyj mojego linku: ${referralUrl}`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy link:', error)
    }
  }

  const handleShare = (platform: string) => {
    const encodedText = encodeURIComponent(shareText)
    const encodedUrl = encodeURIComponent(referralUrl)
    
    let shareUrl = ''
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`
        break
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`
        break
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodedText}`
        break
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`
        break
      case 'email':
        shareUrl = `mailto:?subject=Dołącz do Tulinki&body=${encodedText}`
        break
    }

    if (shareUrl) {
      if (onShare) {
        onShare(platform, shareUrl)
      } else {
        window.open(shareUrl, '_blank', 'width=600,height=400')
      }
    }
  }

  const handleEmailReferrals = async () => {
    if (!emailForm.emails.trim()) return

    const emails = emailForm.emails.split(',').map(email => email.trim()).filter(email => email)
    
    try {
      const response = await fetch('/api/referral/send-invites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emails,
          message: emailForm.message,
          referralCode: referralCode || userId
        })
      })

      if (response.ok) {
        setEmailForm({ emails: '', message: '' })
        // Można dodać toast notification
        console.log('Invites sent successfully')
      }
    } catch (error) {
      console.error('Error sending invites:', error)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-full">
          <Share2 className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Poleć znajomym</h3>
          <p className="text-sm text-gray-600">Zbieraj punkty za każdego poleconego znajomego</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{referralStats.totalReferrals}</div>
          <div className="text-sm text-gray-600">Polecenia</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{referralStats.completedReferrals}</div>
          <div className="text-sm text-gray-600">Ukończone</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{referralStats.totalRewards}</div>
          <div className="text-sm text-gray-600">Punkty</div>
        </div>
      </div>

      {/* Rewards Info */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-2 mb-3">
          <Gift className="h-5 w-5 text-blue-600" />
          <h4 className="font-semibold text-gray-900">Twoje nagrody</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <Star className="h-5 w-5 text-yellow-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">Za polecenie</p>
              <p className="text-lg font-bold text-blue-600">{referrerReward} punktów</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Trophy className="h-5 w-5 text-purple-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">Znajomy otrzyma</p>
              <p className="text-lg font-bold text-green-600">{refereeReward} punktów</p>
            </div>
          </div>
        </div>
      </div>

      {/* Referral Link */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Twój link polecenia
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={referralUrl}
            readOnly
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
          />
          <button
            onClick={handleCopyLink}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              copied 
                ? 'bg-green-600 text-white' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {copied ? (
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4" />
                <span>Skopiowano</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Copy className="h-4 w-4" />
                <span>Kopiuj</span>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Social Sharing */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Udostępnij w social media</h4>
        <div className="flex space-x-2">
          <button
            onClick={() => handleShare('facebook')}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Facebook className="h-4 w-4" />
            <span>Facebook</span>
          </button>
          
          <button
            onClick={() => handleShare('twitter')}
            className="flex items-center space-x-2 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
          >
            <Twitter className="h-4 w-4" />
            <span>Twitter</span>
          </button>
          
          <button
            onClick={() => handleShare('whatsapp')}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            <span>WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Email Invites */}
      <div className="border-t pt-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Wyślij zaproszenia email</h4>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Adresy email (oddzielone przecinkami)
            </label>
            <input
              type="text"
              value={emailForm.emails}
              onChange={(e) => setEmailForm({...emailForm, emails: e.target.value})}
              placeholder="znajomy1@email.com, znajomy2@email.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Wiadomość (opcjonalna)
            </label>
            <textarea
              value={emailForm.message}
              onChange={(e) => setEmailForm({...emailForm, message: e.target.value})}
              placeholder="Hej! Sprawdź ten sklep - mają świetne produkty i oferują bonus za rejestrację!"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          
          <button
            onClick={handleEmailReferrals}
            disabled={!emailForm.emails.trim()}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            <Mail className="h-4 w-4" />
            <span>Wyślij zaproszenia</span>
          </button>
        </div>
      </div>

      {/* How it works */}
      <div className="border-t pt-6 mt-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Jak to działa?</h4>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-blue-600">1</span>
            </div>
            <span>Udostępnij swój link polecenia znajomym</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-blue-600">2</span>
            </div>
            <span>Znajomy rejestruje się i składa pierwsze zamówienie</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-blue-600">3</span>
            </div>
            <span>Oboje otrzymujecie punkty bonusowe!</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Komponent do wyświetlania historii referral
export function ReferralHistory({ referrals }: { referrals: any[] }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Historia poleceń</h3>
      
      {referrals.length === 0 ? (
        <div className="text-center py-8">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Brak poleceń</p>
        </div>
      ) : (
        <div className="space-y-3">
          {referrals.map((referral) => (
            <div key={referral.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${
                  referral.status === 'COMPLETED' ? 'bg-green-100' : 'bg-yellow-100'
                }`}>
                  {referral.status === 'COMPLETED' ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <Clock className="h-4 w-4 text-yellow-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {referral.refereeName || referral.refereeEmail}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(referral.createdAt).toLocaleDateString('pl-PL')}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`text-sm font-medium ${
                  referral.status === 'COMPLETED' ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {referral.status === 'COMPLETED' ? 'Ukończone' : 'Oczekuje'}
                </div>
                {referral.rewardGiven && (
                  <div className="text-xs text-gray-500">Nagroda przyznana</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
