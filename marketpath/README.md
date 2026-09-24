# marketpath — Django app

Drop this `marketpath/` folder into your project root (next to your
other apps), then wire it up:

## 1. settings.py

```python
INSTALLED_APPS = [
    ...
    "marketpath",
]
```

Make sure your project has a `STATICFILES_DIRS` / `STATIC_URL` set up
as usual (this app just uses `{% static %}`, nothing custom).

## 2. project urls.py

```python
from django.urls import path, include

urlpatterns = [
    ...
    path("", include("marketpath.urls")),   # serves at /
    # or: path("marketpath/", include("marketpath.urls")),
]
```

## 3. Migrate

```bash
python manage.py makemigrations marketpath
python manage.py migrate
```

This creates the `Enquiry` table that stores contact-form submissions
(visible in Django admin once you register a superuser).

## 4. Run it

```bash
python manage.py runserver
```

Visit `/` (or wherever you mounted it) to see the page.

## What's dynamic vs. static

- **Enquiry form** (`forms.py`, `models.py`) is fully wired: it
  validates server-side, saves to the database, and shows a success
  message via Django's `messages` framework. Check it in
  `/admin/marketpath/enquiry/`.
- **Courses and reviews** currently live as plain Python lists in
  `views.py` (`COURSES`, `REVIEWS`) so you can edit copy without
  touching templates. Move them to models later if you want to edit
  them from the admin instead of a deploy.
- **Excel tool previews** (option chain, FII/DII data, stock scanner,
  end-of-day) are still sample numbers rendered client-side in
  `static/marketpath/js/main.js` (`SHEETS`). They're cosmetic mockups,
  not real data — wire them to your actual sheets/API when ready.

## Before going live

- Replace the phone number and email in `templates/marketpath/index.html`
  (`#contact` section).
- Replace the three sample reviews in `views.py` with real customer
  quotes.
- Add whatever risk-disclosure / registration text your regulator
  requires to the footer.
- Consider adding `django-recaptcha` or similar to the enquiry form
  if it gets spammed.
