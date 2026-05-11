/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Instagram, Send, Menu, X, ArrowRight, User, LogOut, Trash2, Plus } from 'lucide-react';
import { SITE_CONFIG, GALLERY_DATA, PRICING_DATA, INITIAL_CATEGORIES } from './constants';

// --- Types ---

interface Reservation {
  id: string;
  name: string;
  contact: string;
  date: string;
  message: string;
  timestamp: string;
}

// --- Components ---

const PromotionBanner = () => (
  <div className="bg-tiffany text-white text-center py-2 px-4 text-[10px] font-medium tracking-[0.3em] uppercase">
    {SITE_CONFIG.PROMOTION}
  </div>
);

const SectionTitle = ({ title, sub }: { title: string; sub?: string }) => (
  <div className="mb-16 border-l-2 border-tiffany pl-6">
    <h2 className="text-3xl font-light tracking-tight">{title}</h2>
    {sub && <p className="text-[10px] text-tiffany mt-2 tracking-[0.2em] uppercase">{sub}</p>}
  </div>
);

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [password, setPassword] = useState('');
  
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [galleryItems, setGalleryItems] = useState(GALLERY_DATA);
  const [pricingItems, setPricingItems] = useState(PRICING_DATA);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  
  const [kakaoLink, setKakaoLink] = useState(SITE_CONFIG.CONTACT_KAKAO);
  const [instagramLink, setInstagramLink] = useState(SITE_CONFIG.INSTAGRAM);

  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [newPhoto, setNewPhoto] = useState({ src: '', title: '', type: INITIAL_CATEGORIES[0] });
  const [newPrice, setNewPrice] = useState({ period: '', price: '', detail: '' });
  const [newCategory, setNewCategory] = useState('');

  // Load all data from localStorage
  useEffect(() => {
    try {
      const savedRes = localStorage.getItem('lunic_reservations');
      if (savedRes) setReservations(JSON.parse(savedRes));

      const savedGallery = localStorage.getItem('runiq_gallery');
      if (savedGallery) setGalleryItems(JSON.parse(savedGallery));

      const savedPricing = localStorage.getItem('runiq_pricing');
      if (savedPricing) setPricingItems(JSON.parse(savedPricing));

      const savedCategories = localStorage.getItem('runiq_categories');
      if (savedCategories) setCategories(JSON.parse(savedCategories));

      const savedKakao = localStorage.getItem('runiq_kakao');
      if (savedKakao) setKakaoLink(savedKakao);

      const savedInsta = localStorage.getItem('runiq_insta');
      if (savedInsta) setInstagramLink(savedInsta);
    } catch (error) {
      console.error("Failed to load data from localStorage:", error);
    }
  }, []);

  // Persistence effects with safety
  useEffect(() => {
    try {
      localStorage.setItem('runiq_gallery', JSON.stringify(galleryItems));
    } catch (e) {
      console.warn("localStorage setItem failed:", e);
    }
  }, [galleryItems]);

  useEffect(() => {
    try {
      localStorage.setItem('runiq_pricing', JSON.stringify(pricingItems));
    } catch (e) {
      console.warn("localStorage setItem failed:", e);
    }
  }, [pricingItems]);

  useEffect(() => {
    try {
      localStorage.setItem('runiq_categories', JSON.stringify(categories));
    } catch (e) {
      console.warn("localStorage setItem failed:", e);
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem('runiq_kakao', kakaoLink);
    } catch (e) {
      console.warn("localStorage setItem failed:", e);
    }
  }, [kakaoLink]);

  useEffect(() => {
    try {
      localStorage.setItem('runiq_insta', instagramLink);
    } catch (e) {
      console.warn("localStorage setItem failed:", e);
    }
  }, [instagramLink]);

  const handleReservationSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newRes: Reservation = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.get('name') as string,
      contact: formData.get('contact') as string,
      date: formData.get('date') as string,
      message: formData.get('message') as string,
      timestamp: new Date().toLocaleString('ko-KR')
    };

    setReservations(prev => {
      const updated = [newRes, ...prev];
      try {
        localStorage.setItem('lunic_reservations', JSON.stringify(updated));
      } catch (e) {
        console.warn("localStorage failed:", e);
      }
      return updated;
    });

    const message = `[RUNIQ 예약 문의]\n이름: ${newRes.name}\n연락처: ${newRes.contact}\n날짜: ${newRes.date}\n메시지: ${newRes.message}`;
    const kakaoUrl = `${kakaoLink}?text=${encodeURIComponent(message)}`;
    
    alert('문의 내용이 저장되었습니다. 카카오톡으로 연결합니다.');
    window.open(kakaoUrl, '_blank');
    e.currentTarget.reset();
  };

  const handleAdminLogin = () => {
    if (password === SITE_CONFIG.ADMIN_PASSWORD) {
      setIsAdmin(true);
      setShowAdminLogin(false);
      setPassword('');
    } else {
      alert('비밀번호가 틀렸습니다.');
    }
  };

  // Management functions
  const addCategory = () => {
    if (!newCategory) return;
    if (categories.includes(newCategory)) return alert('이미 존재하는 카테고리입니다.');
    setCategories([...categories, newCategory]);
    setNewCategory('');
  };

  const deleteCategory = (cat: string) => {
    if (window.confirm(`${cat} 카테고리를 삭제하시겠습니까? 관련 사진의 카테고리 정보는 유지되지만 필터링에서 제외될 수 있습니다.`)) {
      setCategories(categories.filter(c => c !== cat));
    }
  };

  const addGalleryItem = () => {
    if (!newPhoto.src) return alert('사진 주소를 입력해주세요.');
    setGalleryItems([...galleryItems, { ...newPhoto, id: Date.now() }]);
    setNewPhoto({ ...newPhoto, src: '', title: '' });
  };

  const deleteGalleryItem = (id: number) => {
    setGalleryItems(galleryItems.filter(item => item.id !== id));
  };

  const addPricingItem = () => {
    if (!newPrice.period || !newPrice.price) return alert('기간과 금액을 입력해주세요.');
    setPricingItems([...pricingItems, { ...newPrice }]);
    setNewPrice({ period: '', price: '', detail: '' });
  };

  const deletePricingItem = (idx: number) => {
    setPricingItems(pricingItems.filter((_, i) => i !== idx));
  };

  const deleteReservation = (id: string) => {
    const updated = reservations.filter(r => r.id !== id);
    setReservations(updated);
    localStorage.setItem('lunic_reservations', JSON.stringify(updated));
  };

  const filteredGallery = selectedCategory === '전체' 
    ? galleryItems 
    : galleryItems.filter(item => item.type === selectedCategory);

  return (
    <div className="min-h-screen selection:bg-tiffany selection:text-white">
      <PromotionBanner />
      
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-tiffany/20">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <button onClick={() => { setIsAdmin(false); setSelectedCategory('전체'); }} className="text-2xl font-medium tracking-tighter text-tiffany">{SITE_CONFIG.NAME}</button>
          
          <div className="hidden md:flex items-center space-x-12">
            {!isAdmin && [
              { label: '갤러리', id: 'gallery' },
              { label: '가격안내', id: 'price' },
              { label: '예약하기', id: 'reservation' },
              { label: '문의하기', id: 'contact' }
            ].map((item) => (
              <a 
                key={item.id} 
                href={`#${item.id}`} 
                className="text-[11px] font-medium tracking-[0.2em] hover:text-tiffany transition-colors"
              >
                {item.label}
              </a>
            ))}
            <button onClick={() => setShowAdminLogin(true)} className="text-tiffany opacity-50 hover:opacity-100 transition-opacity">
              <User size={16} />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {isAdmin ? (
            /* ADMIN DASHBOARD */
            <motion.div key="admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-24">
              <div className="flex justify-between items-center border-b border-tiffany pb-8">
                <SectionTitle title="관리자 대시보드" sub="SYSTEM CONTROL" />
                <button onClick={() => setIsAdmin(false)} className="flex items-center space-x-2 text-xs border border-tiffany text-tiffany px-6 py-3 hover:bg-tiffany hover:text-white transition-all">
                  <LogOut size={14} />
                  <span>관리 도구 종료</span>
                </button>
              </div>

              {/* Site Settings */}
              <section className="bg-gray-50 p-8 border-t border-tiffany">
                <h3 className="text-lg font-medium mb-8 flex items-center space-x-2">
                  <div className="w-1 h-6 bg-tiffany"></div>
                  <span>사이트 외부 링크 관리</span>
                </h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] tracking-widest text-gray-500 uppercase">인스타그램 URL</label>
                    <input 
                      type="text" 
                      className="w-full p-3 text-sm border-b border-gray-300 bg-transparent outline-none focus:border-tiffany" 
                      value={instagramLink} 
                      onChange={e => setInstagramLink(e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] tracking-widest text-gray-500 uppercase">카카오톡 채널 URL (또는 단축 오픈채팅 링크)</label>
                    <input 
                      type="text" 
                      className="w-full p-3 text-sm border-b border-gray-300 bg-transparent outline-none focus:border-tiffany" 
                      value={kakaoLink} 
                      onChange={e => setKakaoLink(e.target.value)} 
                    />
                    <p className="text-[10px] text-gray-400">예시: http://pf.kakao.com/_xxxx 또는 https://open.kakao.com/o/xxxx</p>
                  </div>
                </div>
              </section>

              {/* Category Management */}
              <section>
                <h3 className="text-lg font-medium mb-8 flex items-center space-x-2">
                  <div className="w-1 h-6 bg-tiffany"></div>
                  <span>카테고리 메뉴 관리</span>
                </h3>
                <div className="flex gap-4 mb-8 bg-gray-50 p-6 border-t border-tiffany">
                  <input 
                    placeholder="새 카테고리 이름" 
                    className="flex-1 p-3 text-sm border-b border-gray-300 bg-transparent outline-none focus:border-tiffany" 
                    value={newCategory} 
                    onChange={e => setNewCategory(e.target.value)} 
                    onKeyDown={e => e.key === 'Enter' && addCategory()}
                  />
                  <button onClick={addCategory} className="bg-tiffany text-white text-xs uppercase tracking-widest px-8">추가</button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {categories.map(cat => (
                    <div key={cat} className="flex items-center space-x-2 bg-white border border-tiffany px-4 py-2 text-sm group">
                      <span>{cat}</span>
                      <button onClick={() => deleteCategory(cat)} className="text-gray-300 hover:text-red-500 transition-colors">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* Gallery Management */}
              <section>
                <h3 className="text-lg font-medium mb-8 flex items-center space-x-2">
                  <div className="w-1 h-6 bg-tiffany"></div>
                  <span>포트폴리오 사진 관리</span>
                </h3>
                <div className="grid md:grid-cols-4 gap-4 mb-8 bg-gray-50 p-6 border-t border-tiffany">
                  <input placeholder="사진 URL (Unsplash 등)" className="p-3 text-sm border-b border-gray-300 bg-transparent outline-none focus:border-tiffany" value={newPhoto.src} onChange={e => setNewPhoto({...newPhoto, src: e.target.value})} />
                  <input placeholder="사진 제목" className="p-3 text-sm border-b border-gray-300 bg-transparent outline-none focus:border-tiffany" value={newPhoto.title} onChange={e => setNewPhoto({...newPhoto, title: e.target.value})} />
                  <select className="p-3 text-sm border-b border-gray-300 bg-transparent outline-none focus:border-tiffany" value={newPhoto.type} onChange={e => setNewPhoto({...newPhoto, type: e.target.value})}>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                  <button onClick={addGalleryItem} className="bg-tiffany text-white text-xs uppercase tracking-widest py-3">사진 등록</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
                  {galleryItems.map(item => (
                    <div key={item.id} className="relative group aspect-square">
                      <img src={item.src} className="w-full h-full object-cover grayscale-[50%]" />
                      <div className="absolute top-2 left-2 bg-black/50 text-[9px] text-white px-2 py-1">{item.type}</div>
                      <button onClick={() => deleteGalleryItem(item.id as number)} className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 size={24} />
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* Price Management */}
              <section>
                <h3 className="text-lg font-medium mb-8 flex items-center space-x-2">
                  <div className="w-1 h-6 bg-tiffany"></div>
                  <span>가격 및 상품 정보 관리</span>
                </h3>
                <div className="grid md:grid-cols-4 gap-4 mb-8 bg-gray-50 p-6 border-t border-tiffany">
                  <input placeholder="상품명 (예: 6월 얼리버드)" className="p-3 text-sm border-b border-gray-300 bg-transparent outline-none focus:border-tiffany" value={newPrice.period} onChange={e => setNewPrice({...newPrice, period: e.target.value})} />
                  <input placeholder="금액 (예: 200,000₩)" className="p-3 text-sm border-b border-gray-300 bg-transparent outline-none focus:border-tiffany" value={newPrice.price} onChange={e => setNewPrice({...newPrice, price: e.target.value})} />
                  <input placeholder="상세 구성 내역" className="p-3 text-sm border-b border-gray-300 bg-transparent outline-none focus:border-tiffany col-span-1" value={newPrice.detail} onChange={e => setNewPrice({...newPrice, detail: e.target.value})} />
                  <button onClick={addPricingItem} className="bg-tiffany text-white text-xs uppercase tracking-widest py-3">정보 추가</button>
                </div>
                <table className="text-sm">
                  <tbody>
                    {pricingItems.map((p, idx) => (
                      <tr key={idx}>
                        <td className="font-medium w-1/4">{p.period}</td>
                        <td className="text-tiffany w-1/4">{p.price}</td>
                        <td className="text-gray-400 text-xs">{p.detail}</td>
                        <td className="text-right">
                          <button onClick={() => deletePricingItem(idx)} className="text-gray-300 hover:text-red-500"><Trash2 size={16} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>

              {/* Reservations */}
              <section>
                <h3 className="text-lg font-medium mb-8 flex items-center space-x-2">
                  <div className="w-1 h-6 bg-tiffany"></div>
                  <span>실시간 예약 문의 로그</span>
                </h3>
                <div className="overflow-x-auto">
                  <table className="text-sm">
                    <thead>
                      <tr>
                        <th>수신일시</th>
                        <th>성함</th>
                        <th>연락처</th>
                        <th>희망날짜</th>
                        <th>문의내용</th>
                        <th>관리</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reservations.length === 0 ? (
                        <tr><td colSpan={6} className="text-center py-12 text-gray-400">접수된 문의가 없습니다.</td></tr>
                      ) : (
                        reservations.map(res => (
                          <tr key={res.id}>
                            <td className="text-[10px] text-gray-400">{res.timestamp}</td>
                            <td className="font-medium">{res.name}</td>
                            <td>{res.contact}</td>
                            <td>{res.date}</td>
                            <td className="max-w-xs truncate">{res.message}</td>
                            <td>
                              <button onClick={() => deleteReservation(res.id)} className="text-gray-300 hover:text-red-500"><Trash2 size={16} /></button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </motion.div>
          ) : (
            /* MAIN PORTFOLIO */
            <div key="portfolio">
              {/* Gallery Section */}
              <section id="gallery" className="mb-40">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
                  <SectionTitle title="포트폴리오" sub="GALLERY EXHIBITION" />
                  
                  {/* Category Filter */}
                  <div className="flex flex-wrap gap-x-8 gap-y-4">
                    {['전체', ...categories].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`text-[11px] tracking-[0.2em] transition-all relative pb-1 ${
                          selectedCategory === cat 
                            ? 'text-tiffany after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-tiffany' 
                            : 'text-gray-400 hover:text-black'
                        }`}
                      >
                        {cat.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <motion.div 
                  layout
                  className="gallery-grid"
                >
                  <AnimatePresence mode="popLayout">
                    {filteredGallery.map((item) => (
                      <motion.div 
                        layout
                        key={item.id} 
                        initial={{ opacity: 0, scale: 0.9 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        exit={{ opacity: 0, scale: 0.9 }} 
                        transition={{ duration: 0.4 }}
                        className="image-container group"
                      >
                        <img src={item.src} alt={item.title} referrerPolicy="no-referrer" />
                        <div className="image-overlay"></div>
                        <div className="absolute inset-0 flex flex-col justify-end p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-white">
                          <span className="text-[10px] tracking-[0.3em] uppercase mb-2 text-white/70">{item.type}</span>
                          <h4 className="text-xl font-light tracking-tight">{item.title}</h4>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
                
                {filteredGallery.length === 0 && (
                  <div className="py-32 text-center text-gray-300 text-sm tracking-widest uppercase">
                    현재 카테고리에 사진이 없습니다.
                  </div>
                )}
              </section>

              {/* Price Section */}
              <section id="price" className="mb-40 py-32 border-y border-tiffany/10">
                <div className="grid md:grid-cols-2 gap-24">
                  <div>
                    <SectionTitle title="이용 안내" sub="PRICING & PACKAGES" />
                    <p className="text-sm text-gray-500 leading-relaxed mb-12">
                      루닉(RUNIQ)은 인위적인 연출보다 그 순간의 무드와 공기를 소중히 여깁니다.<br />
                      계절에 따른 빛의 온도를 체크하여 가장 아름다운 순간을 기록합니다.
                    </p>
                    <div className="p-10 bg-tiffany/5 border-l-4 border-tiffany">
                      <p className="text-[10px] text-tiffany font-medium tracking-widest uppercase mb-4">현재 진행 중인 혜택</p>
                      <p className="text-sm text-gray-700 leading-relaxed italic">
                        "4월 촬영 예약자 분들께는 빈티지한 감성을 더해드릴 <br /> 
                        필름 촬영 서비스를 추가로 제공해 드립니다."
                      </p>
                    </div>
                  </div>
                  <div>
                    <table className="text-sm">
                      <thead>
                        <tr>
                          <th>상품명</th>
                          <th>금액</th>
                          <th>구성 상세</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pricingItems.map((p, idx) => (
                          <tr key={idx}>
                            <td className="font-medium py-7 tracking-wide">{p.period}</td>
                            <td className="text-tiffany font-medium">{p.price}</td>
                            <td className="text-gray-400 text-xs italic">{p.detail}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              {/* Reservation Section */}
              <section id="reservation" className="mb-40">
                <div className="max-w-2xl mx-auto border border-tiffany p-12 md:p-24 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-tiffany/5 -rotate-45 translate-x-16 -translate-y-16"></div>
                  <SectionTitle title="예약 신청" sub="RESERVATION FORM" />
                  <form onSubmit={handleReservationSubmit} className="space-y-12">
                    <div className="border-b border-tiffany/30 focus-within:border-tiffany transition-colors">
                      <label className="text-[9px] tracking-[0.3em] text-tiffany uppercase font-medium">성함</label>
                      <input name="name" required type="text" placeholder="성함을 입력하세요" className="w-full bg-transparent py-4 text-sm outline-none" />
                    </div>
                    <div className="border-b border-tiffany/30 focus-within:border-tiffany transition-colors">
                      <label className="text-[9px] tracking-[0.3em] text-tiffany uppercase font-medium">연락처</label>
                      <input name="contact" required type="tel" placeholder="010-0000-0000" className="w-full bg-transparent py-4 text-sm outline-none" />
                    </div>
                    <div className="border-b border-tiffany/30 focus-within:border-tiffany transition-colors">
                      <label className="text-[9px] tracking-[0.3em] text-tiffany uppercase font-medium">촬영 희망일</label>
                      <input name="date" required type="date" className="w-full bg-transparent py-4 text-sm outline-none" />
                    </div>
                    <div>
                      <label className="text-[9px] tracking-[0.3em] text-tiffany uppercase font-medium mb-4 block">문의 요청사항</label>
                      <textarea name="message" required rows={4} placeholder="촬영 카테고리, 장소, 원하시는 컨셉 등을 자유롭게 남겨주세요" className="w-full border border-tiffany/30 p-6 text-sm outline-none focus:border-tiffany bg-transparent" />
                    </div>
                    <button type="submit" className="btn-minimal w-full flex items-center justify-center space-x-4">
                      <span>예약 신청서 제출 및 카카오톡 연결</span>
                      <ArrowRight size={14} />
                    </button>
                  </form>
                </div>
              </section>

              {/* Contact Section */}
              <section id="contact" className="py-24 text-center">
                <div className="w-1 h-20 bg-tiffany mx-auto mb-12"></div>
                <h3 className="text-4xl font-light mb-12 tracking-tighter">OUR MOMENT.</h3>
                <div className="flex flex-col md:flex-row justify-center items-center gap-12 text-[11px] tracking-[0.4em]">
                  <a href={kakaoLink} target="_blank" className="text-tiffany border-b border-tiffany pb-1 hover:text-black hover:border-black transition-all">KAKAO CHANNELS</a>
                  <a href={instagramLink} target="_blank" className="text-tiffany border-b border-tiffany pb-1 hover:text-black hover:border-black transition-all">INSTAGRAM @RUNIQ_SNAP</a>
                </div>
              </section>
            </div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {showAdminLogin && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-sm flex items-center justify-center p-6">
            <div className="max-w-xs w-full text-center">
              <div className="w-8 h-8 bg-tiffany mx-auto mb-8 rounded-full"></div>
              <h2 className="text-[10px] uppercase tracking-[0.4em] mb-12 text-tiffany font-medium">Administrator Login</h2>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="PASSWORD" 
                className="w-full border-b border-tiffany py-3 text-center outline-none mb-12 text-sm tracking-widest"
                onKeyDown={e => e.key === 'Enter' && handleAdminLogin()}
              />
              <div className="flex flex-col space-y-4">
                <button onClick={handleAdminLogin} className="btn-minimal">접속하기</button>
                <button onClick={() => setShowAdminLogin(false)} className="text-[9px] uppercase tracking-widest text-gray-400">취소</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="py-24 bg-gray-50 border-t border-tiffany/10 text-center">
        <p className="text-[9px] tracking-[0.5em] text-gray-300 font-light">
          © {SITE_CONFIG.VERSION} {SITE_CONFIG.NAME.toUpperCase()} EXPERIENCE.
        </p>
      </footer>
    </div>
  );
}

