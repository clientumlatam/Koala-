import React, { useState } from 'react';
import { 
  Instagram, 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  Grid, 
  Tv, 
  Tag, 
  ExternalLink, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  ShoppingBag, 
  Check, 
  MapPin, 
  Clock, 
  Phone, 
  Building2, 
  Flame, 
  ArrowUpRight,
  Layers,
  X,
  CreditCard,
  Factory,
  PackageCheck,
  Send
} from 'lucide-react';
import { InstagramPost, ProductInventoryRecord, BranchInfo } from '../types';
import { INSTAGRAM_PROFILE_INFO, INITIAL_INSTAGRAM_POSTS } from '../data/instagramData';

interface InstagramFeedViewerProps {
  inventory?: ProductInventoryRecord[];
  currentBranch?: BranchInfo;
  onNavigateToStore?: () => void;
  onTestTrigger?: (keyword: string) => void;
  onAddToCart?: (product: ProductInventoryRecord, quantity: number, isWholesale: boolean) => void;
}

export const InstagramFeedViewer: React.FC<InstagramFeedViewerProps> = ({
  inventory = [],
  currentBranch,
  onNavigateToStore,
  onTestTrigger,
  onAddToCart
}) => {
  const [posts, setPosts] = useState<InstagramPost[]>(INITIAL_INSTAGRAM_POSTS);
  const [selectedPost, setSelectedPost] = useState<InstagramPost | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [savedPosts, setSavedPosts] = useState<Record<string, boolean>>({});
  const [isFollowing, setIsFollowing] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('todos');
  const [viewMode, setViewMode] = useState<'grid' | 'cards' | 'carousel'>('grid');
  const [activeHighlight, setActiveHighlight] = useState<string | null>(null);
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);

  // Featured Carousel State (for the 4-panel top carousel ad)
  const featuredPost = posts.find(p => p.id === 'ig-post-01') || posts[0];
  const [featuredSlide, setFeaturedSlide] = useState(0);

  // Filter posts
  const filteredPosts = posts.filter(post => {
    if (activeCategory === 'todos') return true;
    return post.category === activeCategory;
  });

  const toggleLike = (postId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setLikedPosts(prev => {
      const isLiked = !!prev[postId];
      const nextLiked = !isLiked;
      
      setPosts(currentPosts => 
        currentPosts.map(p => {
          if (p.id === postId) {
            return {
              ...p,
              likes: isLiked ? p.likes - 1 : p.likes + 1
            };
          }
          return p;
        })
      );
      
      return { ...prev, [postId]: nextLiked };
    });
  };

  const toggleSave = (postId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSavedPosts(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleOpenPostModal = (post: InstagramPost) => {
    setSelectedPost(post);
    setActiveSlideIndex(0);
  };

  const handlePrevSlide = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!selectedPost || !selectedPost.carouselSlides) return;
    setActiveSlideIndex(prev => (prev > 0 ? prev - 1 : selectedPost.carouselSlides!.length - 1));
  };

  const handleNextSlide = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!selectedPost || !selectedPost.carouselSlides) return;
    setActiveSlideIndex(prev => (prev < selectedPost.carouselSlides!.length - 1 ? prev + 1 : 0));
  };

  // Find products matching tagged SKUs
  const getTaggedProducts = (skus?: string[]) => {
    if (!skus || !inventory || inventory.length === 0) return [];
    return inventory.filter(item => skus.includes(item.id) || skus.includes(item.sku));
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* 1. INSTAGRAM OFFICIAL PROFILE HEADER (Matching user's authentic screenshot) */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-700/80">
          
          {/* Avatar and Profile Details */}
          <div className="flex items-start sm:items-center gap-4 sm:gap-6">
            {/* Story Gradient Ring around Avatar */}
            <div className="relative group shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-0.5 bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 shadow-md transition-transform transform group-hover:scale-105">
                <div className="w-full h-full rounded-full p-0.5 bg-white dark:bg-slate-800">
                  <img
                    src={INSTAGRAM_PROFILE_INFO.avatarUrl}
                    alt="Koala Lo Tiene"
                    className="w-full h-full object-cover rounded-full"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-orange-500 to-rose-500 text-white p-1 rounded-full shadow-xs">
                <Instagram className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Profile Info */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl sm:text-2xl font-black font-fredoka text-slate-900 dark:text-white flex items-center gap-2">
                  <span>@{INSTAGRAM_PROFILE_INFO.handle}</span>
                  <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold" title="Cuenta Comercial Verificada">
                    ✓
                  </span>
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300 border border-orange-200 dark:border-orange-800">
                  Fábrica & Distribuidora Alto Valle
                </span>
              </div>

              <div className="text-sm font-bold text-slate-700 dark:text-slate-200">
                {INSTAGRAM_PROFILE_INFO.name}
              </div>

              {/* Stats Counters */}
              <div className="flex items-center gap-4 sm:gap-6 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                <div>
                  <strong className="font-extrabold text-slate-900 dark:text-white">{INSTAGRAM_PROFILE_INFO.postsCount}</strong>{' '}
                  <span className="text-slate-500 dark:text-slate-400">publicaciones</span>
                </div>
                <div>
                  <strong className="font-extrabold text-slate-900 dark:text-white">{INSTAGRAM_PROFILE_INFO.followersCount.toLocaleString('es-AR')}</strong>{' '}
                  <span className="text-slate-500 dark:text-slate-400">seguidores</span>
                </div>
                <div>
                  <strong className="font-extrabold text-slate-900 dark:text-white">{INSTAGRAM_PROFILE_INFO.followingCount}</strong>{' '}
                  <span className="text-slate-500 dark:text-slate-400">seguidos</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => setIsFollowing(!isFollowing)}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isFollowing 
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600' 
                  : 'bg-gradient-to-r from-orange-600 to-rose-600 hover:from-orange-500 hover:to-rose-500 text-white shadow-xs'
              }`}
            >
              {isFollowing ? '✓ Siguiendo' : '+ Seguir'}
            </button>

            {onTestTrigger && (
              <button
                onClick={() => onTestTrigger('PRECIO')}
                className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300 border border-orange-200 dark:border-orange-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                title="Probar simulador de mensaje directo"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enviar DM</span>
              </button>
            )}

            <a
              href={INSTAGRAM_PROFILE_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            <a
              href={INSTAGRAM_PROFILE_INFO.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 transition-colors"
              title="Ver en Instagram Oficial"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Bio Text & Highlights Section */}
        <div className="pt-4 space-y-3">
          <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-1">
            {INSTAGRAM_PROFILE_INFO.bio.map((line, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                {line.includes('wa.link') ? (
                  <a
                    href="https://wa.link/ka1dfe"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1"
                  >
                    <span>🔗 {line}</span>
                  </a>
                ) : (
                  <span>{line}</span>
                )}
              </div>
            ))}
          </div>

          {/* Story Highlights Circles */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-700/80">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              Historias Destacadas
            </div>
            <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto pb-2 scrollbar-none">
              {INSTAGRAM_PROFILE_INFO.highlights.map(hl => (
                <button
                  key={hl.id}
                  onClick={() => setActiveHighlight(hl.title)}
                  className="flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-full p-0.5 bg-slate-200 dark:bg-slate-700 group-hover:bg-gradient-to-tr group-hover:from-amber-500 group-hover:to-rose-500 transition-all">
                    <div className="w-full h-full rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200 group-hover:text-orange-600">
                      {hl.icon === 'Clock' && <Clock className="w-5 h-5" />}
                      {hl.icon === 'MessageCircle' && <MessageCircle className="w-5 h-5" />}
                      {hl.icon === 'Factory' && <Factory className="w-5 h-5" />}
                      {hl.icon === 'CreditCard' && <CreditCard className="w-5 h-5" />}
                      {hl.icon === 'MapPin' && <MapPin className="w-5 h-5" />}
                      {hl.icon === 'ShoppingBag' && <ShoppingBag className="w-5 h-5" />}
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 group-hover:text-orange-600">
                    {hl.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. INTERACTIVE FEATURED CAROUSEL (Direct replica of the user's uploaded 4-panel Carousel Ad) */}
      {featuredPost && featuredPost.carouselSlides && (
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 rounded-3xl p-5 sm:p-6 text-white shadow-lg border border-slate-700 relative overflow-hidden">
          {/* Subtle decorative background blur */}
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-orange-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />

          {/* Carousel Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4 relative z-10">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-rose-600 text-white text-[11px] font-black uppercase tracking-wider flex items-center gap-1 shadow-xs">
                <Flame className="w-3.5 h-3.5 fill-white" />
                <span>Campaña Carrusel Destacada</span>
              </span>
              <span className="text-xs font-medium text-slate-300">
                Panel {featuredSlide + 1} de {featuredPost.carouselSlides.length}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setFeaturedSlide(prev => (prev > 0 ? prev - 1 : featuredPost.carouselSlides!.length - 1))}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
                title="Panel Anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setFeaturedSlide(prev => (prev < featuredPost.carouselSlides!.length - 1 ? prev + 1 : 0))}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
                title="Siguiente Panel"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active Carousel Slide Content */}
          {(() => {
            const slide = featuredPost.carouselSlides[featuredSlide];
            return (
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Visual Card / Slide Preview */}
                <div className="lg:col-span-5 relative aspect-square sm:aspect-4/3 lg:aspect-square rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-black p-5 flex flex-col justify-between">
                  <div className={`absolute inset-0 bg-gradient-to-br ${slide.bgColor || 'from-amber-600 to-rose-600'} opacity-30`} />
                  
                  {/* Slide watermark/background image */}
                  {slide.imageUrl && (
                    <img
                      src={slide.imageUrl}
                      alt={slide.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-20"
                      referrerPolicy="no-referrer"
                    />
                  )}

                  <div className="relative z-10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider">
                        {slide.badge || 'PROMO'}
                      </span>
                      <span className="text-[11px] font-bold text-white/80">
                        @koalalotiene
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black font-fredoka leading-tight text-white drop-shadow-sm">
                      {slide.title}
                    </h3>

                    {slide.subtitle && (
                      <p className="text-xs text-slate-200 font-medium leading-relaxed">
                        {slide.subtitle}
                      </p>
                    )}
                  </div>

                  {slide.priceBadge && (
                    <div className="relative z-10 p-3 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 text-center">
                      <span className="text-xs sm:text-sm font-black text-amber-300 font-fredoka">
                        {slide.priceBadge}
                      </span>
                    </div>
                  )}

                  <div className="relative z-10 flex items-center justify-between pt-2 text-[10px] text-white/60 border-t border-white/10">
                    <span>Deslizá para ver más ofertas</span>
                    <span>{featuredSlide + 1} / {featuredPost.carouselSlides.length}</span>
                  </div>
                </div>

                {/* Details & Actions for this Slide */}
                <div className="lg:col-span-7 space-y-4">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-orange-400 mb-1">
                      Detalle de Promoción
                    </div>
                    <h4 className="text-xl font-bold font-fredoka text-white">
                      {slide.title}
                    </h4>
                    {slide.highlightOffer && (
                      <p className="text-sm text-emerald-400 font-semibold mt-1">
                        ✨ {slide.highlightOffer}
                      </p>
                    )}
                  </div>

                  {/* Bullet Points */}
                  {slide.bulletPoints && (
                    <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                      {slide.bulletPoints.map((point, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="w-4 h-4 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                            ✓
                          </span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Quick CTAs */}
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => handleOpenPostModal(featuredPost)}
                      className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Ver Carrusel Completo & Productos</span>
                    </button>

                    {onTestTrigger && (
                      <button
                        onClick={() => onTestTrigger(featuredPost.suggestedKeyword || 'PRECIO')}
                        className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-orange-400" />
                        <span>Simular Bot DM ("{featuredPost.suggestedKeyword}")</span>
                      </button>
                    )}

                    {onNavigateToStore && (
                      <button
                        onClick={onNavigateToStore}
                        className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Ir al Catálogo Web</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Dots Indicator */}
          <div className="flex items-center justify-center gap-2 pt-5 relative z-10">
            {featuredPost.carouselSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setFeaturedSlide(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  featuredSlide === idx ? 'w-8 bg-orange-500' : 'w-2 bg-white/30 hover:bg-white/50'
                }`}
                title={`Panel ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* 3. FEED CONTROLS: CATEGORIES & VIEW SWITCHER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: 'todos', label: 'Todos', icon: Grid },
            { id: 'ofertas', label: 'Mega Ofertas', icon: Flame },
            { id: 'polietileno', label: 'Polietileno & Fábrica', icon: Factory },
            { id: 'cotillon', label: 'Cotillón & Fiestas', icon: Sparkles },
            { id: 'reposteria', label: 'Repostería', icon: ShoppingBag },
            { id: 'descartables', label: 'Descartables & Envases', icon: PackageCheck },
            { id: 'locales', label: 'Sucursales', icon: MapPin },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                activeCategory === cat.id
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              <cat.icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700 p-1 rounded-xl self-end sm:self-auto shrink-0">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-white dark:bg-slate-800 text-orange-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
            }`}
            title="Vista Cuadrícula 3x3"
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('cards')}
            className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'cards'
                ? 'bg-white dark:bg-slate-800 text-orange-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
            }`}
            title="Vista Feed Detallada"
          >
            <Layers className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4. POSTS DISPLAY (Grid 3x3 or Cards List) */}
      {viewMode === 'grid' ? (
        /* GRID 3x3 (Instagram Style) */
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-4">
          {filteredPosts.map(post => {
            const isLiked = !!likedPosts[post.id];
            return (
              <div
                key={post.id}
                onClick={() => handleOpenPostModal(post)}
                className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 group cursor-pointer shadow-2xs hover:shadow-md transition-all"
              >
                {/* Image */}
                <img
                  src={post.mediaUrl}
                  alt={post.title || post.caption}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />

                {/* Badges in top corners */}
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
                  {post.isPinned && (
                    <span className="p-1 rounded-md bg-orange-600 text-white shadow-xs" title="Fijado">
                      📌
                    </span>
                  )}
                  {post.type === 'carousel' && (
                    <span className="p-1 rounded-md bg-black/60 backdrop-blur-sm text-white text-[10px]" title="Carrusel">
                      <Layers className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>

                {/* Category tag on bottom-left */}
                <div className="absolute bottom-2.5 left-2.5 z-10">
                  <span className="px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold">
                    {post.category}
                  </span>
                </div>

                {/* Dark Hover Overlay with Likes and Comments */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white z-20">
                  <div className="flex items-center gap-1.5 font-bold text-sm">
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : 'fill-white text-white'}`} />
                    <span>{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-bold text-sm">
                    <MessageCircle className="w-4 h-4 fill-white text-white" />
                    <span>{post.commentsCount}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* CARDS LIST VIEW */
        <div className="space-y-6 max-w-2xl mx-auto">
          {filteredPosts.map(post => {
            const isLiked = !!likedPosts[post.id];
            const isSaved = !!savedPosts[post.id];
            const tagged = getTaggedProducts(post.taggedProductSkus);

            return (
              <div
                key={post.id}
                className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-xs"
              >
                {/* Post Header */}
                <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-700/80">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full p-0.5 bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600">
                      <img
                        src={INSTAGRAM_PROFILE_INFO.avatarUrl}
                        alt="Koala Lo Tiene"
                        className="w-full h-full object-cover rounded-full"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>@{INSTAGRAM_PROFILE_INFO.handle}</span>
                        <span className="text-blue-500 text-[10px]">✓</span>
                      </div>
                      <div className="text-[11px] text-slate-400">{post.date}</div>
                    </div>
                  </div>

                  <a
                    href={post.permalink || INSTAGRAM_PROFILE_INFO.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    title="Abrir en Instagram"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                {/* Post Media */}
                <div
                  onClick={() => handleOpenPostModal(post)}
                  className="relative aspect-square bg-slate-950 cursor-pointer overflow-hidden group"
                >
                  <img
                    src={post.mediaUrl}
                    alt={post.title || post.caption}
                    className="w-full h-full object-contain group-hover:scale-102 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  {post.type === 'carousel' && (
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5" />
                      <span>Carrusel</span>
                    </div>
                  )}
                </div>

                {/* Action Bar */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={(e) => toggleLike(post.id, e)}
                        className="transition-transform active:scale-125 cursor-pointer"
                      >
                        <Heart className={`w-5 h-5 ${isLiked ? 'fill-rose-500 text-rose-500' : 'text-slate-700 dark:text-slate-300'}`} />
                      </button>
                      <button
                        onClick={() => handleOpenPostModal(post)}
                        className="text-slate-700 dark:text-slate-300 hover:text-orange-600 transition-colors cursor-pointer"
                      >
                        <MessageCircle className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          if (navigator.share) {
                            navigator.share({ title: post.title, text: post.caption, url: window.location.href }).catch(() => {});
                          } else if (navigator.clipboard) {
                            navigator.clipboard.writeText(post.permalink || window.location.href).then(() => {
                              setCopiedPostId(post.id);
                              setTimeout(() => setCopiedPostId(null), 2000);
                            });
                          }
                        }}
                        className="text-slate-700 dark:text-slate-300 hover:text-orange-600 transition-colors cursor-pointer relative"
                        title="Compartir publicación"
                      >
                        {copiedPostId === post.id ? (
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">¡Copiado!</span>
                        ) : (
                          <Share2 className="w-5 h-5" />
                        )}
                      </button>
                    </div>

                    <button
                      onClick={(e) => toggleSave(post.id, e)}
                      className="text-slate-700 dark:text-slate-300 hover:text-orange-600 cursor-pointer"
                    >
                      <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-slate-900 dark:fill-white' : ''}`} />
                    </button>
                  </div>

                  <div className="text-xs font-extrabold text-slate-900 dark:text-white">
                    {post.likes} Me gusta
                  </div>

                  {/* Caption */}
                  <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-3">
                    <strong className="text-slate-900 dark:text-white mr-1.5 font-bold">
                      @{INSTAGRAM_PROFILE_INFO.handle}
                    </strong>
                    {post.caption}
                  </div>

                  {/* Trigger Simulation Button */}
                  {post.suggestedKeyword && onTestTrigger && (
                    <div className="pt-2 flex items-center justify-between bg-orange-50/80 dark:bg-orange-950/40 p-2.5 rounded-xl border border-orange-200/80 dark:border-orange-800">
                      <div className="text-[11px] text-orange-800 dark:text-orange-300 font-semibold">
                        Disparador bot: <strong className="font-mono font-bold">"{post.suggestedKeyword}"</strong>
                      </div>
                      <button
                        onClick={() => onTestTrigger(post.suggestedKeyword!)}
                        className="px-2.5 py-1 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-[11px] font-bold transition-colors cursor-pointer"
                      >
                        Probar Disparador
                      </button>
                    </div>
                  )}

                  {/* Tagged Products in this Post */}
                  {tagged.length > 0 && (
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-700/80">
                      <div className="text-[11px] font-bold text-slate-500 mb-1.5 flex items-center gap-1">
                        <Tag className="w-3 h-3 text-orange-600" />
                        <span>Productos del Post ({tagged.length}):</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {tagged.map(p => (
                          <span
                            key={p.id}
                            className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-[10px] font-bold"
                          >
                            {p.name} • {formatCurrency(p.retailPrice)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. INTERACTIVE POST DETAIL MODAL */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col lg:flex-row relative"
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-3 right-3 z-30 p-2 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white transition-colors cursor-pointer"
              title="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left side: Media / Carousel Viewer */}
            <div className="lg:w-1/2 bg-slate-950 relative flex items-center justify-center min-h-[320px] lg:min-h-[500px] overflow-hidden">
              {selectedPost.type === 'carousel' && selectedPost.carouselSlides && selectedPost.carouselSlides.length > 0 ? (
                /* Carousel Slide Viewer */
                <div className="relative w-full h-full min-h-[380px] lg:min-h-[500px] flex flex-col justify-between overflow-hidden">
                  {(() => {
                    const slide = selectedPost.carouselSlides[activeSlideIndex];
                    return (
                      <>
                        {slide.imageUrl ? (
                          <div className="relative w-full h-full flex items-center justify-center bg-slate-950 p-2">
                            <img
                              src={slide.imageUrl}
                              alt={slide.title}
                              className="w-full h-full max-h-[460px] object-contain rounded-xl"
                              referrerPolicy="no-referrer"
                            />
                            {/* Slide Counter Badge */}
                            <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-xs font-bold shadow-md">
                              {activeSlideIndex + 1} / {selectedPost.carouselSlides.length}
                            </div>
                          </div>
                        ) : (
                          <div className="p-6 relative flex flex-col justify-between h-full">
                            <div className={`absolute inset-0 bg-gradient-to-br ${slide.bgColor || 'from-amber-600 to-rose-600'} opacity-25`} />
                            <div className="relative z-10 space-y-3 pt-6">
                              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-black uppercase tracking-wider">
                                {slide.badge || 'OFERTA'}
                              </span>
                              <h3 className="text-2xl sm:text-3xl font-black font-fredoka text-white leading-tight">
                                {slide.title}
                              </h3>
                              {slide.subtitle && (
                                <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
                                  {slide.subtitle}
                                </p>
                              )}
                            </div>

                            {/* Bullet Points */}
                            {slide.bulletPoints && (
                              <div className="relative z-10 space-y-2 py-4">
                                {slide.bulletPoints.map((b, i) => (
                                  <div key={i} className="flex items-center gap-2 text-xs text-white">
                                    <span className="w-4 h-4 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                                      ✓
                                    </span>
                                    <span>{b}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {slide.priceBadge && (
                              <div className="relative z-10 p-3 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 text-center">
                                <span className="text-sm font-black text-amber-300 font-fredoka">
                                  {slide.priceBadge}
                                </span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Navigation Arrows & Indicators */}
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 flex items-center justify-between z-20">
                          <button
                            onClick={handlePrevSlide}
                            className="p-2.5 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md transition-all cursor-pointer shadow-lg"
                            title="Anterior"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>

                          <div className="flex items-center gap-1.5">
                            {selectedPost.carouselSlides.map((_, idx) => (
                              <button
                                key={idx}
                                onClick={() => setActiveSlideIndex(idx)}
                                className={`h-2 rounded-full transition-all cursor-pointer ${
                                  activeSlideIndex === idx ? 'w-6 bg-orange-400' : 'w-2 bg-white/40 hover:bg-white/70'
                                }`}
                                title={`Slide ${idx + 1}`}
                              />
                            ))}
                          </div>

                          <button
                            onClick={handleNextSlide}
                            className="p-2.5 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md transition-all cursor-pointer shadow-lg"
                            title="Siguiente"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </div>
                      </>
                    );
                  })()}
                </div>
              ) : (
                /* Static Image Viewer */
                <img
                  src={selectedPost.mediaUrl}
                  alt={selectedPost.title || selectedPost.caption}
                  className="w-full h-full object-contain max-h-[500px]"
                  referrerPolicy="no-referrer"
                />
              )}
            </div>

            {/* Right side: Post Info, Caption & Tagged Products */}
            <div className="lg:w-1/2 p-5 sm:p-6 flex flex-col justify-between overflow-y-auto space-y-4">
              {/* Profile Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600">
                    <img
                      src={INSTAGRAM_PROFILE_INFO.avatarUrl}
                      alt="Koala Lo Tiene"
                      className="w-full h-full object-cover rounded-full"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>@{INSTAGRAM_PROFILE_INFO.handle}</span>
                      <span className="text-blue-500 text-[10px]">✓</span>
                    </div>
                    <div className="text-[11px] text-slate-400">{selectedPost.date}</div>
                  </div>
                </div>

                <a
                  href={selectedPost.permalink || INSTAGRAM_PROFILE_INFO.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-orange-600 hover:text-orange-500 flex items-center gap-1"
                >
                  <span>Ver en IG</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Caption Text */}
              <div className="flex-1 overflow-y-auto max-h-56 pr-2 space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                {selectedPost.caption}
              </div>

              {/* Tagged Products in this Post */}
              {(() => {
                const tagged = getTaggedProducts(selectedPost.taggedProductSkus);
                if (tagged.length === 0) return null;
                return (
                  <div className="bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="text-xs font-bold font-fredoka text-slate-900 dark:text-white flex items-center gap-1.5">
                      <ShoppingBag className="w-4 h-4 text-orange-600" />
                      <span>Artículos Disponibles en Tienda ({tagged.length}):</span>
                    </div>
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                      {tagged.map(item => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between gap-2 p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-slate-900 dark:text-white truncate">{item.name}</div>
                            <div className="text-[10px] text-slate-500 flex items-center gap-2">
                              <span>SKU: {item.sku}</span>
                              <span>•</span>
                              <span className="text-emerald-600 font-bold">Roca: {item.stockRoca} u.</span>
                              <span>•</span>
                              <span className="text-blue-600 font-bold">Nqn: {item.stockNeuquen} u.</span>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <div className="font-bold text-orange-600">{formatCurrency(item.retailPrice)}</div>
                            {onAddToCart && (
                              <button
                                onClick={() => onAddToCart(item, 1, false)}
                                className="px-2 py-0.5 rounded-md bg-orange-600 hover:bg-orange-500 text-white text-[10px] font-bold cursor-pointer"
                              >
                                + Agregar
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Bot Trigger Simulation / CTA */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => toggleLike(selectedPost.id, e)}
                      className="flex items-center gap-1.5 font-bold cursor-pointer"
                    >
                      <Heart className={`w-5 h-5 ${likedPosts[selectedPost.id] ? 'fill-rose-500 text-rose-500' : 'text-slate-700 dark:text-slate-300'}`} />
                      <span>{selectedPost.likes}</span>
                    </button>
                    <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
                      <MessageCircle className="w-5 h-5" />
                      <span>{selectedPost.commentsCount} comentarios</span>
                    </div>
                  </div>

                  <span className="text-[11px] text-slate-400">
                    Stock Sincronizado con ERP
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {selectedPost.suggestedKeyword && onTestTrigger && (
                    <button
                      onClick={() => {
                        const kw = selectedPost.suggestedKeyword!;
                        setSelectedPost(null);
                        onTestTrigger(kw);
                      }}
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Simular Disparador "{selectedPost.suggestedKeyword}"</span>
                    </button>
                  )}

                  {onNavigateToStore && (
                    <button
                      onClick={() => {
                        setSelectedPost(null);
                        onNavigateToStore();
                      }}
                      className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Ver Catálogo Completo</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Story Highlight Modal */}
      {activeHighlight && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 space-y-4 border border-slate-200 dark:border-slate-800 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="font-black font-fredoka text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <span>Historia: {activeHighlight}</span>
              </h3>
              <button
                onClick={() => setActiveHighlight(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
              {activeHighlight === 'Horarios' && (
                <div className="space-y-2">
                  <p><strong>Lunes a Viernes:</strong> 08:30 a 12:30 hs y 16:00 a 20:00 hs</p>
                  <p><strong>Sábados:</strong> 09:00 a 13:00 hs</p>
                  <p><strong>Domingos:</strong> Cerrado</p>
                  <p className="text-slate-400 text-[11px]">Válido para Casa Central General Roca y Salón Neuquén Capital.</p>
                </div>
              )}
              {activeHighlight === 'Contacto' && (
                <div className="space-y-2">
                  <p><strong>General Roca:</strong> Av. Roca 1350 • Tel: 298 453-6376</p>
                  <p><strong>Neuquén Capital:</strong> Mitre 678 • Tel: 299 509-3911</p>
                  <p><strong>Email:</strong> lpsrlmilton@lpsrl.com.ar</p>
                </div>
              )}
              {activeHighlight === 'Fábrica' && (
                <div className="space-y-2">
                  <p>Fabricación propia de bolsas camiseta, film stretch virgen de alta adherencia y bobinas tubulares de polietileno con control micrométrico.</p>
                  <p className="text-orange-600 font-bold">Venta mayorista directa por bulto cerrado.</p>
                </div>
              )}
              {activeHighlight === 'Promos BPN' && (
                <div className="space-y-2">
                  <p>Aprovechá <strong>3 y 6 Cuotas Sin Interés</strong> todos los días con Tarjeta Confiable BPN en mostrador y web.</p>
                  <p>Además, 10% de descuento abonando por transferencia bancaria directa.</p>
                </div>
              )}
              {activeHighlight === 'Locales' && (
                <div className="space-y-2">
                  <p>Visitanos en General Roca (Av. Roca 1350) y en Neuquén Centro (Mitre 678). Retiro en depósito en 15 minutos.</p>
                </div>
              )}
              {activeHighlight === 'Catálogo' && (
                <div className="space-y-2">
                  <p>Catálogo online con más de 120 artículos y stock físico en tiempo real sincronizado con nuestro sistema ERP.</p>
                </div>
              )}
            </div>

            <button
              onClick={() => setActiveHighlight(null)}
              className="w-full py-2 rounded-xl bg-orange-600 text-white font-bold text-xs"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
