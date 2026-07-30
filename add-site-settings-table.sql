-- شغّل السطور دي في Supabase SQL Editor (بتضيف جدول جديد بس، مش بتلمس بياناتك الموجودة)

CREATE TABLE site_settings (
  key VARCHAR(100) PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);
