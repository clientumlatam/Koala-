import React from 'react';
import { 
  X, 
  Award, 
  Gift, 
  Sparkles, 
  CheckCircle2, 
  PlusCircle, 
  Clock, 
  ShoppingBag, 
  Star, 
  Zap, 
  ArrowRight, 
  QrCode, 
  Check, 
  Tag, 
  ShieldCheck,
  UserCheck,
  Percent
} from 'lucide-react';
import { LoyaltyProfile, LoyaltyReward } from '../types';
import { AVAILABLE_LOYALTY_REWARDS } from '../data/loyaltyData';
import { formatCurrency } from '../utils/helpers';

interface LoyaltyProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
  loyaltyProfile: LoyaltyProfile | null;
  onUpdateProfile: (updated: LoyaltyProfile) => void;
  onSelectRewardForCheckout?: (reward: LoyaltyReward) => void;
}

export const LoyaltyProgramModal: React.FC<LoyaltyProgramModalProps> = ({
  isOpen,
  onClose,
  loyaltyProfile,
  onUpdateProfile,
  onSelectRewardForCheckout,
}) => {
  const [activeTab, setActiveTab] = React.useState<'points' | 'punchcard' | 'rewards' | 'history'>('points');
  
  // Registration Form State
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [cuitOrDni, setCuitOrDni] = React.useState('');
  const [feedbackMsg, setFeedbackMsg] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const newProfile: LoyaltyProfile = {
      id: `loyalty-${Date.now()}`,
      name,
      email,
      phone,
      cuitOrDni,
      pointsBalance: 200, // 200 Welcome Bonus points!
      totalSpent: 0,
      tier: 'Bronce',
      punchCardStamps: 1, // 1st stamp bonus
      punchCardsCompleted: 0,
      joinedDate: new Date().toLocaleDateString('es-AR'),
      activeRewards: [],
      pointsHistory: [
        {
          id: `tx-welcome-${Date.now()}`,
          date: new Date().toLocaleDateString('es-AR'),
          description: '🎉 Bono de Bienvenida Club Koala (+200 Puntos)',
          pointsDelta: 200,
          type: 'bonus',
        },
        {
          id: `tx-stamp-${Date.now()}`,
          date: new Date().toLocaleDateString('es-AR'),
          description: '🐨 Primer Sello de Bienvenida en tu Tarjeta Digital',
          pointsDelta: 0,
          type: 'punch_stamp',
        }
      ],
    };

    onUpdateProfile(newProfile);
    setFeedbackMsg('¡Felicitaciones! Te uniste al Club Koala y recibiste 200 Puntos + 1er Sello de regalo.');
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const handleRedeemReward = (reward: LoyaltyReward) => {
    if (!loyaltyProfile) return;
    if (loyaltyProfile.pointsBalance < reward.pointsRequired) {
      setFeedbackMsg(`Necesitás ${reward.pointsRequired} puntos para este canje. Tenés ${loyaltyProfile.pointsBalance} pts.`);
      setTimeout(() => setFeedbackMsg(null), 3500);
      return;
    }

    const updatedProfile: LoyaltyProfile = {
      ...loyaltyProfile,
      pointsBalance: loyaltyProfile.pointsBalance - reward.pointsRequired,
      activeRewards: [...loyaltyProfile.activeRewards, reward],
      pointsHistory: [
        {
          id: `tx-redeem-${Date.now()}`,
          date: new Date().toLocaleDateString('es-AR'),
          description: `Canje de Cupón: ${reward.name} (-${reward.pointsRequired} pts)`,
          pointsDelta: -reward.pointsRequired,
          type: 'redeemed',
        },
        ...loyaltyProfile.pointsHistory,
      ],
    };

    onUpdateProfile(updatedProfile);
    setFeedbackMsg(`¡Cupón "${reward.name}" canjeado con éxito! Código: ${reward.code}`);
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const handleAddDemoStamp = () => {
    if (!loyaltyProfile) return;
    const currentStamps = loyaltyProfile.punchCardStamps + 1;
    let newStamps = currentStamps;
    let completedCards = loyaltyProfile.punchCardsCompleted;
    let bonusMessage = `¡Sello #${currentStamps} registrado!`;
    const newRewards = [...loyaltyProfile.activeRewards];

    if (currentStamps >= 6) {
      newStamps = 0;
      completedCards += 1;
      const perkReward = AVAILABLE_LOYALTY_REWARDS.find(r => r.type === 'punch_card_reward');
      if (perkReward && !newRewards.some(r => r.id === perkReward.id)) {
        newRewards.push(perkReward);
      }
      bonusMessage = '🎉 ¡Completaste tu Tarjeta de 6 Sellos! Desbloqueaste un Cupón del 20% OFF.';
    }

    const updated: LoyaltyProfile = {
      ...loyaltyProfile,
      punchCardStamps: newStamps,
      punchCardsCompleted: completedCards,
      activeRewards: newRewards,
      pointsHistory: [
        {
          id: `tx-stamp-${Date.now()}`,
          date: new Date().toLocaleDateString('es-AR'),
          description: `Sello registrado en Tarjeta Digital (${newStamps}/6 sellos)`,
          pointsDelta: 0,
          type: 'punch_stamp',
        },
        ...loyaltyProfile.pointsHistory,
      ],
    };

    onUpdateProfile(updated);
    setFeedbackMsg(bonusMessage);
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Plata': return 'from-slate-400 to-slate-600 text-white';
      case 'Oro': return 'from-amber-400 to-amber-600 text-slate-950';
      case 'VIP Koala': return 'from-purple-600 to-indigo-600 text-white';
      default: return 'from-orange-500 to-amber-500 text-white';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 my-auto animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-orange-950 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 p-0.5 shadow-lg shadow-orange-500/30 shrink-0 flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-2xl font-black text-amber-400 font-fredoka">
                  🦘
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black font-fredoka text-white">
                    Club Koala Lo Tiene
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-orange-500/30 text-orange-300 border border-orange-400/40 text-[10px] font-black uppercase tracking-wide">
                    Programa de Fidelidad
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Acumulá puntos con cada compra y sellá tu Tarjeta Digital para obtener descuentos.
                </p>
              </div>
            </div>

            {/* Loyalty Status Badge if Logged In */}
            {loyaltyProfile && (
              <div className="bg-slate-900/90 border border-slate-700 p-3 rounded-2xl flex items-center gap-3 self-start sm:self-auto shadow-md">
                <div className="text-right">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Puntos Disponibles</div>
                  <div className="text-2xl font-black text-amber-400 font-fredoka leading-none">
                    {loyaltyProfile.pointsBalance} <span className="text-xs font-bold text-amber-200">pts</span>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-xl text-xs font-black bg-gradient-to-r ${getTierColor(loyaltyProfile.tier)} shadow-sm`}>
                  Nivel {loyaltyProfile.tier}
                </span>
              </div>
            )}
          </div>

          {/* Navigation Tabs */}
          {loyaltyProfile && (
            <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-1 scrollbar-none border-t border-slate-800/80 pt-4">
              <button
                onClick={() => setActiveTab('points')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  activeTab === 'points'
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Star className="w-4 h-4" />
                <span>Puntos y Canjes</span>
              </button>

              <button
                onClick={() => setActiveTab('punchcard')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  activeTab === 'punchcard'
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Award className="w-4 h-4 text-amber-300" />
                <span>Tarjeta Digital (Sellos)</span>
                <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black">
                  {loyaltyProfile.punchCardStamps}/6
                </span>
              </button>

              <button
                onClick={() => setActiveTab('rewards')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  activeTab === 'rewards'
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Gift className="w-4 h-4 text-emerald-300" />
                <span>Mis Cupones ({loyaltyProfile.activeRewards.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('history')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  activeTab === 'history'
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>Historial</span>
              </button>
            </div>
          )}
        </div>

        {/* Feedback Banner */}
        {feedbackMsg && (
          <div className="bg-emerald-500 text-white text-xs font-bold p-3 text-center flex items-center justify-center gap-2 animate-in fade-in">
            <Sparkles className="w-4 h-4" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[65vh] overflow-y-auto">
          {/* Case 1: NOT LOGGED IN / SIGN UP FORM */}
          {!loyaltyProfile ? (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-slate-800 dark:to-slate-800/60 p-5 rounded-2xl border border-orange-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center gap-2 text-orange-800 dark:text-orange-400 font-black text-sm uppercase tracking-wide font-fredoka">
                  <Sparkles className="w-5 h-5 text-orange-500" />
                  <span>¡Unite gratis al Club Koala en 30 segundos!</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Sumá <strong>1 Punto Koala por cada $100</strong> en compras en General Roca y Neuquén. Además, estampá 1 sello en tu <strong>Tarjeta Digital</strong> en cada pedido superior a $5.000 y ganá descuentos directos.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-orange-200 dark:border-slate-700 text-center">
                    <div className="text-2xl mb-1">🎁</div>
                    <div className="font-extrabold text-xs text-slate-900 dark:text-white">Bono de Bienvenida</div>
                    <div className="text-[11px] text-orange-600 font-bold">+200 Puntos Gratis</div>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-orange-200 dark:border-slate-700 text-center">
                    <div className="text-2xl mb-1">🐨</div>
                    <div className="font-extrabold text-xs text-slate-900 dark:text-white">Tarjeta de Sellos</div>
                    <div className="text-[11px] text-emerald-600 font-bold">20% OFF a los 6 sellos</div>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-orange-200 dark:border-slate-700 text-center">
                    <div className="text-2xl mb-1">🏷️</div>
                    <div className="font-extrabold text-xs text-slate-900 dark:text-white">Beneficios Socio</div>
                    <div className="text-[11px] text-amber-600 font-bold">Cupones de hasta $10.000</div>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleRegister} className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-fredoka">
                  Completá tus datos para activar tu cuenta de Fidelidad
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Nombre y Apellido / Razón Social *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ej: Marcos Rodríguez"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="marcos@gmail.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Teléfono / WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="298 4123456"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      DNI o CUIT (Opcional)
                    </label>
                    <input
                      type="text"
                      value={cuitOrDni}
                      onChange={(e) => setCuitOrDni(e.target.value)}
                      placeholder="20-35891234-9"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-extrabold text-sm shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <UserCheck className="w-5 h-5" />
                  <span>Unirme al Club Koala y Reclamar +200 Puntos</span>
                </button>
              </form>
            </div>
          ) : (
            /* Case 2: LOGGED IN MEMBER VIEW */
            <>
              {/* Tab 1: POINTS & REDEMPTION SHOP */}
              {activeTab === 'points' && (
                <div className="space-y-6">
                  {/* Digital Member Card Graphic */}
                  <div className={`p-6 rounded-3xl bg-gradient-to-r ${getTierColor(loyaltyProfile.tier)} shadow-xl relative overflow-hidden text-white`}>
                    <div className="absolute right-4 bottom-4 opacity-15 text-8xl font-fredoka select-none pointer-events-none">
                      🦘
                    </div>
                    
                    <div className="flex justify-between items-start relative z-10">
                      <div>
                        <span className="text-[10px] font-mono tracking-widest uppercase opacity-80 block">Tarjeta Digital de Socio</span>
                        <h3 className="text-xl font-black font-fredoka">{loyaltyProfile.name}</h3>
                        <p className="text-xs opacity-90">{loyaltyProfile.email}</p>
                      </div>

                      <div className="text-right">
                        <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-extrabold inline-block">
                          Nivel {loyaltyProfile.tier}
                        </span>
                        <div className="text-[10px] opacity-80 mt-1">Socio desde {loyaltyProfile.joinedDate}</div>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap justify-between items-end border-t border-white/20 pt-4 relative z-10">
                      <div>
                        <span className="text-xs opacity-80 block">Saldo Actual acumulado:</span>
                        <span className="text-3xl font-black font-fredoka">
                          {loyaltyProfile.pointsBalance} <span className="text-sm font-bold">Puntos</span>
                        </span>
                      </div>

                      <div className="text-right text-xs">
                        <span className="block opacity-90">Equivalente a: <strong>{formatCurrency(loyaltyProfile.pointsBalance * 5)}</strong> en descuentos</span>
                        <span className="text-[11px] opacity-75">Regla: $100 de compra = 1 Punto</span>
                      </div>
                    </div>
                  </div>

                  {/* Rewards Catalog */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider font-fredoka flex items-center gap-2">
                        <Gift className="w-4 h-4 text-orange-500" />
                        <span>Tienda de Canjes e Incentivos</span>
                      </h3>
                      <span className="text-xs text-slate-500">Canjeá tus puntos por cupones de compra</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {AVAILABLE_LOYALTY_REWARDS.filter(r => r.type !== 'punch_card_reward').map((reward) => {
                        const canAfford = loyaltyProfile.pointsBalance >= reward.pointsRequired;

                        return (
                          <div
                            key={reward.id}
                            className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                              canAfford
                                ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm hover:border-orange-400'
                                : 'bg-slate-50 dark:bg-slate-850 opacity-80 border-slate-200 dark:border-slate-800'
                            }`}
                          >
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300">
                                  {reward.pointsRequired} PUNTOS
                                </span>
                                {reward.minOrderAmount && (
                                  <span className="text-[10px] text-slate-500 font-semibold">
                                    Min. compra {formatCurrency(reward.minOrderAmount)}
                                  </span>
                                )}
                              </div>
                              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                                {reward.name}
                              </h4>
                              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                                {reward.description}
                              </p>
                            </div>

                            <button
                              onClick={() => handleRedeemReward(reward)}
                              disabled={!canAfford}
                              className={`w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                                canAfford
                                  ? 'bg-orange-600 hover:bg-orange-500 text-white shadow-sm'
                                  : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                              }`}
                            >
                              <Tag className="w-3.5 h-3.5" />
                              <span>{canAfford ? 'Canjear Cupón' : `Faltan ${reward.pointsRequired - loyaltyProfile.pointsBalance} pts`}</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: DIGITAL PUNCH CARD */}
              {activeTab === 'punchcard' && (
                <div className="space-y-6">
                  <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-black font-fredoka text-amber-400">
                            Tarjeta Digital de Sellos Koala
                          </h3>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                            Activa
                          </span>
                        </div>
                        <p className="text-xs text-slate-300">
                          Obtenés 1 sello por cada pedido superior a $5.000. ¡Al completar los 6 sellos ganás un <strong>20% OFF directo</strong>!
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-slate-400 block">Tarjetas Completadas</span>
                        <span className="text-2xl font-black text-white font-fredoka">
                          {loyaltyProfile.punchCardsCompleted} 🏆
                        </span>
                      </div>
                    </div>

                    {/* Stamp Grid (6 slots) */}
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 py-2">
                      {[1, 2, 3, 4, 5, 6].map((slotNumber) => {
                        const isStamped = slotNumber <= loyaltyProfile.punchCardStamps;
                        const isFinalSlot = slotNumber === 6;

                        return (
                          <div
                            key={slotNumber}
                            className={`aspect-square rounded-2xl flex flex-col items-center justify-center p-2 text-center transition-all border ${
                              isStamped
                                ? 'bg-gradient-to-tr from-amber-500 to-orange-500 border-amber-300 text-slate-950 shadow-md scale-102'
                                : isFinalSlot
                                ? 'bg-slate-800/90 border-amber-400/60 text-amber-300 animate-pulse'
                                : 'bg-slate-800 border-slate-700 text-slate-500'
                            }`}
                          >
                            {isStamped ? (
                              <>
                                <div className="text-2xl">🐨</div>
                                <div className="text-[10px] font-black uppercase mt-1">Sello #{slotNumber}</div>
                              </>
                            ) : isFinalSlot ? (
                              <>
                                <Gift className="w-6 h-6 text-amber-300" />
                                <div className="text-[10px] font-black text-amber-300 uppercase mt-1">20% OFF</div>
                              </>
                            ) : (
                              <>
                                <div className="text-sm font-mono font-bold">#{slotNumber}</div>
                                <div className="text-[9px] text-slate-400 mt-1">Sin Sello</div>
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Action Simulator for user testing */}
                    <div className="bg-slate-850 p-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 border border-slate-750">
                      <div className="text-xs text-slate-300">
                        Progreso actual: <strong className="text-amber-300">{loyaltyProfile.punchCardStamps} de 6 sellos</strong> ({6 - loyaltyProfile.punchCardStamps} sellos para tu recompensa)
                      </div>

                      <button
                        onClick={handleAddDemoStamp}
                        className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Simular estampación de sello por compra"
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>Simular Sello por Compra</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: MY ACTIVE REWARDS */}
              {activeTab === 'rewards' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider font-fredoka flex items-center gap-2">
                    <Gift className="w-4 h-4 text-emerald-500" />
                    <span>Mis Cupones y Recompensas Disponibles ({loyaltyProfile.activeRewards.length})</span>
                  </h3>

                  {loyaltyProfile.activeRewards.length > 0 ? (
                    <div className="space-y-3">
                      {loyaltyProfile.activeRewards.map((reward, idx) => (
                        <div
                          key={`${reward.id}-${idx}`}
                          className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100">
                                {reward.type === 'punch_card_reward' ? 'Recompensa Sellos' : 'Cupón de Descuento'}
                              </span>
                              <span className="font-mono font-bold text-xs text-emerald-800 dark:text-emerald-300">
                                Código: <strong>{reward.code}</strong>
                              </span>
                            </div>
                            <h4 className="font-black text-sm text-slate-900 dark:text-white">
                              {reward.name}
                            </h4>
                            <p className="text-xs text-slate-600 dark:text-slate-300">
                              {reward.description}
                            </p>
                          </div>

                          {onSelectRewardForCheckout && (
                            <button
                              onClick={() => {
                                onSelectRewardForCheckout(reward);
                                onClose();
                              }}
                              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer shrink-0"
                            >
                              <Check className="w-4 h-4" />
                              <span>Usar en mi Carrito</span>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-10 text-center text-slate-500 dark:text-slate-400 space-y-2">
                      <Gift className="w-10 h-10 text-slate-300 mx-auto" />
                      <p className="text-xs font-semibold">Aún no canjeaste cupones.</p>
                      <button
                        onClick={() => setActiveTab('points')}
                        className="text-xs text-orange-600 hover:underline font-bold"
                      >
                        Ir a la Tienda de Puntos para canjear tu primer beneficio
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 4: TRANSACTION HISTORY */}
              {activeTab === 'history' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider font-fredoka flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-500" />
                    <span>Historial de Movimientos de Puntos y Sellos</span>
                  </h3>

                  <div className="space-y-2">
                    {loyaltyProfile.pointsHistory.map((tx) => (
                      <div
                        key={tx.id}
                        className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold ${
                            tx.pointsDelta > 0 
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : tx.pointsDelta < 0
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}>
                            {tx.pointsDelta > 0 ? '+' : tx.pointsDelta < 0 ? '-' : '🐨'}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white">{tx.description}</div>
                            <div className="text-[10px] text-slate-400">{tx.date}</div>
                          </div>
                        </div>

                        {tx.pointsDelta !== 0 && (
                          <div className={`font-black font-fredoka text-sm ${
                            tx.pointsDelta > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                          }`}>
                            {tx.pointsDelta > 0 ? `+${tx.pointsDelta}` : tx.pointsDelta} pts
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
