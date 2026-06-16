# RFQ Form Explorer

یک ابزار طراحی و اکتشاف کامپوننت‌های فرم برای رابط‌های کاربری سرور-درایو بیمه.

**Demo**: [https://mac.sadri@gmail.com/rfq-form-explorer/](https://github.com/mac.sadri/rfq-form-explorer)

---

## ویژگی‌ها

| ماژول | توضیح |
|-------|-------|
| **کاوشگر** | تمام کامپوننت‌ها را با تمام حالت‌ها (hover / focus / error / disabled / readonly) در یک گرید ببین |
| **فرم‌ساز** | فرم چند-استپی را با drag-and-drop بساز و JSON آماده‌ی API را فوری بگیر |
| **پیش‌نمایش** | JSON را paste کن تا ویزارد تعامل‌پذیر با والیدیشن و ناوبری مرحله‌ای ساخته شود |
| **تنظیمات** | رنگ اصلی، انحنا، اندازه دکمه، فونت، حالت روشن/تیره را زنده تنظیم کن |

---

## پشته فنی

- **Vite 6** + **React 19** + **TypeScript 5**
- **Tailwind CSS v4** (CSS-first، بدون `tailwind.config.ts`)
- **Radix UI Dialog** برای مودال‌های ساز (focus trap، ARIA)
- تقویم **جلالی** (پیاده‌سازی pure math، بدون وابستگی)
- **RTL** کامل (`lang="fa" dir="rtl"`)، پشتیبانی از فارسی/عربی

---

## اجرای محلی

```bash
npm install
npm run dev        # http://localhost:5173/rfq-form-explorer/
```

---

## تست

```bash
npm test           # watch mode
npm run test -- --run  # one-shot
```

---

## ساخت و استقرار

```bash
npm run build      # خروجی در dist/
```

برای GitHub Pages:

1. در تنظیمات ریپو → **Pages** → Source: **GitHub Actions** را انتخاب کن.
2. Push به شاخه‌ی `main` به‌طور خودکار build و deploy را اجرا می‌کند.
3. اگر نام ریپو با `rfq-form-explorer` فرق دارد، متغیر `VITE_BASE` را در [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) تغییر بده.

---

## قرارداد JSON

```jsonc
{
  "product_id": "string",
  "steps": [
    {
      "step_id": "string",
      "title": "string",
      "sections": [
        {
          "title": "string | null",  // null = فیلدهای بدون سکشن
          "conditions": { "show_if": "field_id == 'value'" },
          "items": [
            {
              "type": "text | number | money | national_code | phone_number | license_plate | select | chips_select | radio | datepicker | range",
              "id": "unique_string",
              "title": "string",
              "placeholder": "string?",
              "hint": "string?",
              "required": true,
              "items": [{ "value": "v", "label": "l" }],
              "options": { "min": 0, "max": 100, "unit": "ریال" },
              "conditions": {
                "show_if": "field_id == 'value'",
                "disabled_if": "field_id != 'value'",
                "required_if": "field_id == 'value'"
              }
            }
          ]
        }
      ]
    }
  ]
}
```

---

## ساختار پروژه

```
src/
  core/
    types.ts          — TypeScript types (FormSchema, FormItem, …)
    jalali.ts         — تبدیل تاریخ جلالی/میلادی
    conditions.ts     — ارزیابی شرط‌های show_if / disabled_if
    renderer/         — کامپوننت‌های فرم (TextField, SelectField, …)
  wizard/             — مدیریت چند-استپی (Stepper, Wizard, WizardFooter)
  apps/
    explorer/         — کاوشگر کامپوننت‌ها
    builder/          — فرم‌ساز drag-and-drop
    preview/          — پیش‌نمایش JSON → ویزارد
    settings/         — تنظیمات تم
  hooks/
    useTheme.ts       — اعمال design tokens
    usePersist.ts     — useState با localStorage
  i18n/fa.ts          — تبدیل ارقام فارسی
  presets/insurance.ts — ۷ نمونه فرم بیمه
```
