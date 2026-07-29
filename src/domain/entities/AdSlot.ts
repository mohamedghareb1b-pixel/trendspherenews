export class AdSlot {
  constructor(
    public readonly id: string,
    public key: string,
    public name: string,
    public code: string | null,
    public enabled: boolean,
    public updatedAt: Date = new Date()
  ) {}

  isRenderable(): boolean {
    return this.enabled && !!this.code?.trim();
  }
}

/** أماكن الإعلانات الافتراضية المقترحة من الـ PRD - تُنشأ تلقائيًا لو مش موجودة */
export const DEFAULT_AD_SLOTS: { key: string; name: string }[] = [
  { key: "homepage_hero", name: "Homepage - Top" },
  { key: "homepage_feed", name: "Homepage - Inside Feed" },
  { key: "article_top", name: "Article - Top" },
  { key: "article_middle", name: "Article - Middle" },
  { key: "article_bottom", name: "Article - Bottom" },
  { key: "sidebar", name: "Sidebar" },
  { key: "footer", name: "Footer" },
];
