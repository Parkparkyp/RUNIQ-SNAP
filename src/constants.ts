/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// 모든 텍스트와 이미지 경로를 여기서 관리합니다.
// 코딩을 몰라도 이 부분의 따옴표 안 내용만 수정하면 사이트에 반영됩니다.

export const SITE_CONFIG = {
  NAME: "RUNIQ",
  VERSION: "2024-2026",
  PROMOTION: "4월 예약 시 필름 서비스 추가 제공",
  CONTACT_KAKAO: "https://open.kakao.com/o/sEXAMPLE", // 실제 오픈채팅 링크로 수정하세요
  INSTAGRAM: "https://instagram.com/runiq_snap",
  ADMIN_PASSWORD: "Runiq94!!",
};

export const INITIAL_CATEGORIES = ["야외스냅", "웨딩야외스냅", "본식스냅", "홈스냅"];

export const GALLERY_DATA = [
  { id: 1, type: "야외스냅", title: "늦은 여름의 빛", src: "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1000" },
  { id: 2, type: "홈스냅", title: "아침의 조각", src: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=1000" },
  { id: 3, type: "웨딩야외스냅", title: "둘만의 숲", src: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000" },
  { id: 4, type: "본식스냅", title: "약속의 시간", src: "https://images.unsplash.com/photo-1544161515-4af6bfe5467e?q=80&w=1000" },
  { id: 5, type: "야외스냅", title: "도시의 벽", src: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=1000" },
  { id: 6, type: "홈스냅", title: "창가에서", src: "https://images.unsplash.com/photo-1536622296737-030639dcc2f9?q=80&w=1000" },
];

export const PRICING_DATA = [
  { period: "평수기 (상시)", price: "250,000₩", detail: "2시간 촬영, 보정본 30장" },
  { period: "6월 얼리버드", price: "200,000₩", detail: "시즌 할인 20% 적용" },
  { period: "7월 썸머이벤트", price: "180,000₩", detail: "최대 할인 적용" },
  { period: "8월 라스트썸머", price: "210,000₩", detail: "휴가 시즌 한정가" },
];
