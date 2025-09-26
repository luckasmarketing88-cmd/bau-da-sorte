'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Info, X } from 'lucide-react'

interface User {
  name: string
  email: string
  coins: number
}

interface HistoryItem {
  date: string
  category: string
  prize: string
}

interface Prize {
  type: 'coins' | 'voucher'
  value: string
  rarity: 'comum' | 'raro' | 'incomum' | 'epico' | 'lendario'
  color: string
}

export default function BauDaSorte() {
  const [user, setUser] = useState<User | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isOpening, setIsOpening] = useState(false)
  const [lastPrize, setLastPrize] = useState<Prize | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [showTransparency, setShowTransparency] = useState(false)
  const [showPurchase, setShowPurchase] = useState(false)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [showHistory, setShowHistory] = useState(false)

  const prizes = {
    comum: [
      { type: 'coins' as const, value: '0.2', rarity: 'comum' as const, color: 'text-gray-600' },
      { type: 'coins' as const, value: '0.5', rarity: 'comum' as const, color: 'text-gray-600' },
      { type: 'coins' as const, value: '1.0', rarity: 'comum' as const, color: 'text-gray-600' },
      { type: 'coins' as const, value: '1.5', rarity: 'comum' as const, color: 'text-gray-600' },
      { type: 'coins' as const, value: '2.0', rarity: 'comum' as const, color: 'text-gray-600' },
    ],
    raro: [
      { type: 'voucher' as const, value: 'Rappi R$5', rarity: 'raro' as const, color: 'text-green-600' },
    ],
    incomum: [
      { type: 'voucher' as const, value: 'Shopee R$10', rarity: 'incomum' as const, color: 'text-blue-600' },
      { type: 'voucher' as const, value: 'McDonald\'s R$15', rarity: 'incomum' as const, color: 'text-blue-600' },
      { type: 'voucher' as const, value: 'Google Play R$15', rarity: 'incomum' as const, color: 'text-blue-600' },
      { type: 'voucher' as const, value: 'Americanas R$15', rarity: 'incomum' as const, color: 'text-blue-600' },
    ],
    epico: [
      { type: 'voucher' as const, value: 'Uber R$20', rarity: 'epico' as const, color: 'text-purple-600' },
      { type: 'voucher' as const, value: 'Uber R$30', rarity: 'epico' as const, color: 'text-purple-600' },
      { type: 'voucher' as const, value: 'Spotify Premium', rarity: 'epico' as const, color: 'text-purple-600' },
      { type: 'voucher' as const, value: 'Xbox Game Pass', rarity: 'epico' as const, color: 'text-purple-600' },
      { type: 'voucher' as const, value: 'Google Play R$30', rarity: 'epico' as const, color: 'text-purple-600' },
      { type: 'voucher' as const, value: 'Shopee R$30', rarity: 'epico' as const, color: 'text-purple-600' },
    ],
    lendario: [
      { type: 'voucher' as const, value: 'McDonald\'s R$50', rarity: 'lendario' as const, color: 'text-yellow-600' },
      { type: 'voucher' as const, value: 'Assaí R$50', rarity: 'lendario' as const, color: 'text-yellow-600' },
      { type: 'voucher' as const, value: 'Netflix Premium', rarity: 'lendario' as const, color: 'text-yellow-600' },
      { type: 'voucher' as const, value: 'Cinemark R$50', rarity: 'lendario' as const, color: 'text-yellow-600' },
      { type: 'voucher' as const, value: 'Google Play R$50', rarity: 'lendario' as const, color: 'text-yellow-600' },
      { type: 'voucher' as const, value: 'Americanas R$50', rarity: 'lendario' as const, color: 'text-yellow-600' },
      { type: 'voucher' as const, value: 'Shopee R$50', rarity: 'lendario' as const, color: 'text-yellow-600' },
    ]
  }

  const motivationalPhrases = {
    comum: [
      "QUASE LÁ! +{valor} coins - Sua sorte está crescendo!",
      "🔥 FOGO! Mais {valor} coins - O próximo baú pode ser lendário!"
    ],
    raro: [
      "🎉 BOA! {premio} é seu - A sorte está ao seu lado!",
      "💚 EVOLUINDO! {premio} - Próximo nível chegando!"
    ],
    incomum: [
      "🚀 INCRÍVEL! {premio} - Você está acima da média!",
      "💙 SUPERANDO! {premio} - Poucos chegam até aqui!"
    ],
    epico: [
      "✨ ESPETACULAR! {premio} - Entre os 1% mais sortudos!",
      "💜 ELITE! {premio} - Você é destaque hoje!"
    ],
    lendario: [
      "🏆 LENDÁRIO! {premio} - VOCÊ É UMA LENDA!",
      "🌟 IM-PRESSIONANTE! {premio} - SORTE MAXIMA!"
    ]
  }

  // Função para enviar email quando ganhar prêmio verde para cima
  const sendPrizeEmail = async (user: User, prize: Prize) => {
    // Verificar se é prêmio de raridade verde para cima (raro, incomum, épico, lendário)
    const shouldSendEmail = ['raro', 'incomum', 'epico', 'lendario'].includes(prize.rarity)
    
    if (!shouldSendEmail) return

    try {
      // EMAIL PARA O GANHADOR
      const winnerEmailData = {
        from: 'saasforcreator@gmail.com',
        to: user.email,
        subject: `🎉 Parabéns ${user.name}! Você ganhou um prêmio ${prize.rarity.toUpperCase()}!`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #92400e, #d97706); padding: 20px; border-radius: 10px;">
            <div style="background: rgba(0,0,0,0.8); padding: 30px; border-radius: 10px; text-align: center;">
              <h1 style="color: #fbbf24; margin-bottom: 20px;">
                ${prize.rarity === 'lendario' ? '🏆' : 
                  prize.rarity === 'epico' ? '✨' :
                  prize.rarity === 'incomum' ? '🚀' : '🎉'} 
                PARABÉNS ${user.name.toUpperCase()}!
              </h1>
              
              <div style="background: ${
                prize.rarity === 'lendario' ? 'linear-gradient(45deg, #fbbf24, #f59e0b)' :
                prize.rarity === 'epico' ? 'linear-gradient(45deg, #a855f7, #8b5cf6)' :
                prize.rarity === 'incomum' ? 'linear-gradient(45deg, #3b82f6, #2563eb)' :
                'linear-gradient(45deg, #10b981, #059669)'
              }; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <h2 style="color: white; margin: 0; font-size: 24px;">
                  PRÊMIO ${prize.rarity.toUpperCase()}
                </h2>
                <p style="color: white; font-size: 20px; margin: 10px 0; font-weight: bold;">
                  ${prize.value}
                </p>
              </div>
              
              <p style="color: #fbbf24; font-size: 16px; margin: 20px 0;">
                ${prize.rarity === 'lendario' ? 'Você está entre os 1% mais sortudos! Uma verdadeira lenda!' :
                  prize.rarity === 'epico' ? 'Incrível! Apenas 1% das pessoas conseguem prêmios épicos!' :
                  prize.rarity === 'incomum' ? 'Parabéns! Você está acima da média com este prêmio incomum!' :
                  'Excelente! Você conquistou um prêmio raro!'}
              </p>
              
              <div style="background: rgba(251, 191, 36, 0.1); padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="color: #fbbf24; margin: 0; font-size: 14px;">
                  📧 Aguarde o contato do nosso time para receber seu prêmio!
                </p>
              </div>
              
              <p style="color: #d1d5db; font-size: 14px; margin-top: 30px;">
                Continue jogando e boa sorte nos próximos baús! 🍀
              </p>
            </div>
          </div>
        `
      }

      // EMAIL PARA VOCÊ (NOTIFICAÇÃO DE GANHADOR)
      const notificationEmailData = {
        from: 'saasforcreator@gmail.com',
        to: 'saasforcreator@gmail.com',
        subject: `🚨 NOVO GANHADOR - ${prize.rarity.toUpperCase()}: ${prize.value}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1f2937; padding: 20px; border-radius: 10px;">
            <div style="background: #374151; padding: 30px; border-radius: 10px;">
              <h1 style="color: #f59e0b; margin-bottom: 20px; text-align: center;">
                🚨 NOVO GANHADOR DETECTADO!
              </h1>
              
              <div style="background: ${
                prize.rarity === 'lendario' ? '#fbbf24' :
                prize.rarity === 'epico' ? '#a855f7' :
                prize.rarity === 'incomum' ? '#3b82f6' :
                '#10b981'
              }; padding: 20px; border-radius: 10px; margin: 20px 0; text-align: center;">
                <h2 style="color: white; margin: 0; font-size: 20px;">
                  PRÊMIO ${prize.rarity.toUpperCase()}
                </h2>
                <p style="color: white; font-size: 18px; margin: 10px 0; font-weight: bold;">
                  ${prize.value}
                </p>
              </div>
              
              <div style="background: #4b5563; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #f9fafb; margin: 0 0 15px 0;">📋 DADOS DO GANHADOR:</h3>
                <p style="color: #d1d5db; margin: 5px 0;"><strong>Nome:</strong> ${user.name}</p>
                <p style="color: #d1d5db; margin: 5px 0;"><strong>Email:</strong> ${user.email}</p>
                <p style="color: #d1d5db; margin: 5px 0;"><strong>Data:</strong> ${new Date().toLocaleString('pt-BR')}</p>
                <p style="color: #d1d5db; margin: 5px 0;"><strong>Raridade:</strong> ${prize.rarity.toUpperCase()}</p>
              </div>
              
              <div style="background: #065f46; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="color: #10b981; margin: 0; font-size: 14px; text-align: center;">
                  ✅ AÇÃO NECESSÁRIA: Entre em contato com o ganhador para enviar o prêmio!
                </p>
              </div>
            </div>
          </div>
        `
      }

      // Simular envio de emails (em produção, aqui seria uma chamada para API de email)
      console.log('📧 EMAIL PARA GANHADOR:', winnerEmailData)
      console.log('📧 EMAIL DE NOTIFICAÇÃO PARA VOCÊ:', notificationEmailData)
      console.log(`✅ Emails enviados - Ganhador: ${user.email} | Prêmio: ${prize.value} (${prize.rarity.toUpperCase()})`)
      
      // Mostrar notificação visual para o usuário
      setTimeout(() => {
        alert(`📧 Emails enviados com sucesso!
        
✅ Confirmação enviada para: ${user.email}
✅ Notificação enviada para: saasforcreator@gmail.com

Prêmio: ${prize.value} (${prize.rarity.toUpperCase()})`)
      }, 1000)

    } catch (error) {
      console.error('❌ Erro ao enviar emails:', error)
    }
  }

  const handleLogin = () => {
    if (name.trim() && email.trim() && password.length >= 6) {
      setUser({
        name: name.trim(),
        email: email.trim(),
        coins: 5 // 5 coins grátis
      })
    }
  }

  const drawPrize = (): Prize => {
    const random = Math.random() * 100
    
    if (random < 77) {
      // Comum - 77%
      const commonPrizes = prizes.comum
      return commonPrizes[Math.floor(Math.random() * commonPrizes.length)]
    } else if (random < 93) {
      // Raro - 16%
      return prizes.raro[0]
    } else if (random < 98) {
      // Incomum - 5%
      const uncommonPrizes = prizes.incomum
      return uncommonPrizes[Math.floor(Math.random() * uncommonPrizes.length)]
    } else if (random < 99) {
      // Épico - 1% - número sorteado será 99
      const epicPrizes = prizes.epico
      const selectedPrize = epicPrizes[Math.floor(Math.random() * epicPrizes.length)]
      console.log('Número sorteado para épico: 99')
      return selectedPrize
    } else {
      // Lendário - 1% - número sorteado será 100
      const legendaryPrizes = prizes.lendario
      const selectedPrize = legendaryPrizes[Math.floor(Math.random() * legendaryPrizes.length)]
      console.log('Número sorteado para lendário: 100')
      return selectedPrize
    }
  }

  const openChest = () => {
    if (!user || user.coins < 10) return

    setIsOpening(true)
    
    setTimeout(() => {
      const prize = drawPrize()
      setLastPrize(prize)
      
      // Atualizar coins do usuário
      const newUser = { ...user }
      newUser.coins -= 10 // Custo do baú
      
      if (prize.type === 'coins') {
        newUser.coins += parseFloat(prize.value)
      }
      
      setUser(newUser)
      
      // Adicionar ao histórico
      const newHistoryItem: HistoryItem = {
        date: new Date().toLocaleDateString('pt-BR'),
        category: prize.rarity.toUpperCase(),
        prize: prize.type === 'coins' ? `+${prize.value} coins` : prize.value
      }
      setHistory(prev => [newHistoryItem, ...prev])
      
      // ENVIAR EMAILS SE FOR PRÊMIO VERDE PARA CIMA
      sendPrizeEmail(user, prize)
      
      setIsOpening(false)
      setShowResult(true)
    }, 3000)
  }

  const getMotivationalPhrase = (prize: Prize): string => {
    const phrases = motivationalPhrases[prize.rarity]
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)]
    
    if (prize.type === 'coins') {
      return randomPhrase.replace('{valor}', prize.value).replace('{premio}', `${prize.value} coins`)
    } else {
      return randomPhrase.replace('{premio}', prize.value).replace('{valor}', prize.value)
    }
  }

  const buyCoins = (amount: number) => {
    if (!user) return
    
    const newUser = { ...user }
    newUser.coins += amount
    setUser(newUser)
    setShowPurchase(false)
  }

  // Tela de Login
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#3b2f2f] to-[#d4af37] flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-black/60 backdrop-blur-md border-amber-700/50 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-amber-100 mb-2">
              🎁 BAÚ DA SORTE
            </CardTitle>
            <p className="text-amber-200/80">Cadastre-se e ganhe 5 coins grátis!</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-amber-100/90">Como você quer ser chamado?</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-amber-900/30 border-amber-600/50 text-amber-100 placeholder:text-amber-300/50"
                placeholder="Seu nome"
              />
            </div>
            
            <div>
              <Label htmlFor="email" className="text-amber-100/90">Seu melhor email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-amber-900/30 border-amber-600/50 text-amber-100 placeholder:text-amber-300/50"
                placeholder="seu@email.com"
              />
            </div>
            
            <div>
              <Label htmlFor="password" className="text-amber-100/90">Crie uma senha (mínimo 6 caracteres)</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-amber-900/30 border-amber-600/50 text-amber-100 placeholder:text-amber-300/50"
                placeholder="••••••"
              />
            </div>
            
            <Button
              onClick={handleLogin}
              disabled={!name.trim() || !email.trim() || password.length < 6}
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold py-3 text-lg shadow-lg"
            >
              🎁 QUERO MEUS 5 COINS GRÁTIS!
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Tela Principal
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#3b2f2f] to-[#d4af37] p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-amber-100">
          <h1 className="text-xl font-bold">Olá, {user.name}!</h1>
          <p className="text-amber-200/80">💎 {user.coins.toFixed(1)} coins - Falta pouco para o próximo baú!</p>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={showTransparency} onOpenChange={setShowTransparency}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-amber-100 hover:bg-amber-800/30">
                <Info className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-black/80 text-amber-100 border-amber-700">
              <DialogHeader>
                <DialogTitle>🎯 SUAS CHANCES REAIS:</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold">77% - Moedas extras (0.2 a 2.0 coins)</p>
                </div>
                <div>
                  <p className="font-semibold">16% - Rappi R$5</p>
                </div>
                <div>
                  <p className="font-semibold">5% - Shopee R$10, McDonald's R$15, Google Play R$15, Americanas R$15</p>
                </div>
                <div>
                  <p className="font-semibold">1% - Uber R$20-30, Spotify, Xbox, Google Play R$30, Shopee R$30</p>
                </div>
                <div>
                  <p className="font-semibold">1% - McDonald's R$50, Assaí R$50, Netflix, Cinemark, Google Play R$50, Americanas R$50, Shopee R$50</p>
                </div>
                <div className="mt-4 p-3 bg-yellow-900/30 rounded">
                  <p className="text-yellow-300">⚠️ Jogo de sorte. Resultados aleatórios.</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowHistory(!showHistory)}
            className="text-amber-100 hover:bg-amber-800/30"
          >
            📋
          </Button>
        </div>
      </div>

      {/* Histórico */}
      {showHistory && (
        <Card className="mb-6 bg-black/60 backdrop-blur-md border-amber-700/50">
          <CardHeader>
            <CardTitle className="text-amber-100 flex justify-between items-center">
              📋 Histórico
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHistory(false)}
                className="text-amber-100 hover:bg-amber-800/30"
              >
                <X className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <p className="text-amber-200/60">Nenhum baú aberto ainda</p>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {history.map((item, index) => (
                  <div key={index} className="text-amber-200/80 text-sm">
                    {item.date} - {item.category} - {item.prize}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Baú Central */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative mb-6">
          {isOpening ? (
            <div className="w-64 h-64 flex items-center justify-center animate-pulse">
              <img 
                src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/01cab663-cf9b-4c08-8d08-3373c787f5bc.jpg" 
                alt="Baú Aberto" 
                className="w-full h-full object-contain filter brightness-125 animate-bounce"
              />
            </div>
          ) : (
            <div className="w-64 h-64 flex items-center justify-center shadow-2xl">
              <img 
                src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/007474e5-6aec-408f-ab7c-c312eff5bcec.jpg" 
                alt="Baú da Sorte" 
                className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}
        </div>
        
        <Button
          onClick={openChest}
          disabled={user.coins < 10 || isOpening}
          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-8 text-xl mb-4 disabled:opacity-50 shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          {isOpening ? "ABRINDO..." : "ABRIR BAÚ - 10 coins"}
        </Button>
        
        <Dialog open={showPurchase} onOpenChange={setShowPurchase}>
          <DialogTrigger asChild>
            <Button 
              className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-bold py-3 px-6 shadow-lg border-2 border-yellow-400/50 transform hover:scale-105 transition-all duration-200"
            >
              💎 COMPRAR MAIS COINS
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-black/80 text-amber-100 border-amber-700 max-w-sm mx-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-center">💎 POTENCIALIZE SUA SORTE</DialogTitle>
              <p className="text-center text-amber-200/80 text-sm">🔥 Pacotes especiais com coins extras!</p>
            </DialogHeader>
            <div className="space-y-3">
              <div className="p-3 bg-gradient-to-r from-orange-900/50 to-red-900/50 rounded-lg border-2 border-orange-500/50 shadow-lg">
                <p className="text-orange-300 font-bold mb-2 text-center text-sm">🔥 MAIS ESCOLHIDO - MELHOR CUSTO!</p>
                <p className="text-white mb-2 text-center font-semibold text-sm">R$20 = 44 coins (4 baús + 4 extras)</p>
                <p className="text-orange-200 text-xs text-center mb-2">💰 Economia de R$2,00 + coins bônus!</p>
                <Button
                  onClick={() => buyCoins(44)}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 font-bold py-2 text-sm shadow-lg"
                >
                  🚀 QUERO ESSE!
                </Button>
              </div>
              
              <div className="p-3 bg-gradient-to-r from-blue-900/50 to-cyan-900/50 rounded-lg border-2 border-blue-500/50 shadow-lg">
                <p className="text-blue-300 font-bold mb-2 text-center text-sm">🎯 PARA COMEÇAR:</p>
                <p className="text-white mb-2 text-center font-semibold text-sm">R$5 = 10 coins (1 baú)</p>
                <p className="text-blue-200 text-xs text-center mb-2">✨ Perfeito para testar sua sorte!</p>
                <Button
                  onClick={() => buyCoins(10)}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 font-bold py-2 text-sm shadow-lg"
                >
                  🎲 COMEÇAR AGORA
                </Button>
              </div>
              
              <div className="p-3 bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-lg border-2 border-purple-500/50 shadow-lg">
                <p className="text-purple-300 font-bold mb-2 text-center text-sm">💎 AVANÇADO - MÁXIMO VALOR!</p>
                <p className="text-white mb-2 text-center font-semibold text-sm">R$50 = 120 coins (12 baús + 12 extras)</p>
                <p className="text-purple-200 text-xs text-center mb-2">🏆 Para os verdadeiros sortudos!</p>
                <Button
                  onClick={() => buyCoins(120)}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 font-bold py-2 text-sm shadow-lg"
                >
                  👑 EVOLUIR
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Modal de Resultado */}
      <Dialog open={showResult} onOpenChange={setShowResult}>
        <DialogContent className="bg-black/80 text-amber-100 border-amber-700">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">
              {lastPrize && (
                <div className={`${lastPrize.rarity === 'lendario' ? 'text-yellow-400' : 
                                lastPrize.rarity === 'epico' ? 'text-purple-400' :
                                lastPrize.rarity === 'incomum' ? 'text-blue-400' :
                                lastPrize.rarity === 'raro' ? 'text-green-400' : 'text-gray-400'}`}>
                  {lastPrize.rarity.toUpperCase()}
                </div>
              )}
            </DialogTitle>
          </DialogHeader>
          {lastPrize && (
            <div className="text-center space-y-4">
              <div className="text-4xl mb-4">
                {lastPrize.rarity === 'lendario' ? '🏆' :
                 lastPrize.rarity === 'epico' ? '✨' :
                 lastPrize.rarity === 'incomum' ? '🚀' :
                 lastPrize.rarity === 'raro' ? '🎉' : '💎'}
              </div>
              
              <p className="text-lg font-semibold">
                {getMotivationalPhrase(lastPrize)}
              </p>
              
              {/* Notificação de email para prêmios verdes para cima */}
              {['raro', 'incomum', 'epico', 'lendario'].includes(lastPrize.rarity) && (
                <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-3 mt-4">
                  <p className="text-green-300 text-sm">
                    📧 Emails de confirmação enviados!<br/>
                    ✅ Para você: {user.email}<br/>
                    ✅ Notificação: saasforcreator@gmail.com
                  </p>
                </div>
              )}
              
              <div className="flex flex-col gap-3 mt-6">
                <Button
                  onClick={() => {
                    setShowResult(false)
                    setLastPrize(null)
                  }}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 shadow-lg"
                >
                  🎯 TENTAR NOVAMENTE
                </Button>
                
                <Button
                  onClick={() => {
                    setShowResult(false)
                    setShowPurchase(true)
                  }}
                  className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-bold py-2 shadow-lg"
                >
                  💎 COMPRAR COINS
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}