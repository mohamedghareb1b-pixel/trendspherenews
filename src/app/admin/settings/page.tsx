import { container } from "@/lib/container";
import { SITE_SETTING_KEYS } from "@/application/use-cases/SiteSettingsUseCases";
import { updateSiteSettingsAction } from "../actions";

export default async function SettingsPage() {
  const settings = await container.getSiteSettings.execute();

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Google &amp; Analytics Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Enter your verification codes and tracking IDs here. Changes apply instantly - no
          redeploy needed.
        </p>
      </div>

      <form action={updateSiteSettingsAction} className="space-y-5">
        <div className="rounded-xl border border-gray-100 p-4">
          <h2 className="mb-3 font-medium">Search Engine Indexing</h2>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-sm">Google Search Console Verification Code</label>
              <input
                name="google_site_verification"
                defaultValue={settings[SITE_SETTING_KEYS.GOOGLE_SITE_VERIFICATION]}
                placeholder="the content= value from the meta tag Google gives you"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm"
              />
              <p className="mt-1 text-xs text-gray-400">
                From search.google.com/search-console → Settings → Ownership verification → HTML tag
              </p>
            </div>
            <div>
              <label className="mb-1 block text-sm">Bing Webmaster Verification Code</label>
              <input
                name="bing_site_verification"
                defaultValue={settings[SITE_SETTING_KEYS.BING_SITE_VERIFICATION]}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm"
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 p-4">
          <h2 className="mb-3 font-medium">Analytics</h2>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-sm">Google Analytics 4 Measurement ID</label>
              <input
                name="ga_measurement_id"
                defaultValue={settings[SITE_SETTING_KEYS.GA_MEASUREMENT_ID]}
                placeholder="G-XXXXXXXXXX"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm">Microsoft Clarity Project ID</label>
              <input
                name="clarity_id"
                defaultValue={settings[SITE_SETTING_KEYS.CLARITY_ID]}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm"
              />
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-400">
            These only load after a visitor accepts cookies from the consent banner.
          </p>
        </div>

        <div className="rounded-xl border border-gray-100 p-4">
          <h2 className="mb-3 font-medium">Advertising</h2>
          <div>
            <label className="mb-1 block text-sm">AdSense Publisher ID</label>
            <input
              name="adsense_publisher_id"
              defaultValue={settings[SITE_SETTING_KEYS.ADSENSE_PUBLISHER_ID]}
              placeholder="pub-xxxxxxxxxxxxxxxx"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm"
            />
            <p className="mt-1 text-xs text-gray-400">Used to auto-generate /ads.txt</p>
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 p-4">
          <h2 className="mb-3 font-medium">Header Badge</h2>
          <div>
            <label className="mb-1 block text-sm">Eye-catching text next to the site name</label>
            <input
              name="header_badge_text"
              defaultValue={settings[SITE_SETTING_KEYS.HEADER_BADGE_TEXT]}
              placeholder="e.g. 🔥 Breaking News Daily"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 p-4">
          <h2 className="mb-3 font-medium">Social Follow Links</h2>
          <p className="mb-3 text-xs text-gray-400">
            Shown to readers 1 minute into an article. Leave empty to hide an icon.
          </p>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-sm">Threads URL</label>
              <input
                name="social_threads_url"
                defaultValue={settings[SITE_SETTING_KEYS.SOCIAL_THREADS_URL]}
                placeholder="https://threads.net/@yourpage"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm">Facebook Page URL</label>
              <input
                name="social_facebook_url"
                defaultValue={settings[SITE_SETTING_KEYS.SOCIAL_FACEBOOK_URL]}
                placeholder="https://facebook.com/yourpage"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm">Twitter / X URL</label>
              <input
                name="social_twitter_url"
                defaultValue={settings[SITE_SETTING_KEYS.SOCIAL_TWITTER_URL]}
                placeholder="https://x.com/yourpage"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm">Substack URL</label>
              <input
                name="social_substack_url"
                defaultValue={settings[SITE_SETTING_KEYS.SOCIAL_SUBSTACK_URL]}
                placeholder="https://yourpage.substack.com"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="rounded-lg bg-brand-500 px-5 py-2.5 font-medium text-white hover:bg-brand-700"
        >
          Save Settings
        </button>
      </form>
    </div>
  );
}