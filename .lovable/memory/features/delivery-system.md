---
name: Delivery System
description: Delivery page with popup banners/promos/coupons + redirect to InstaDelivery (iframe blocked)
type: feature
---
- InstaDelivery blocks iframe (X-Frame-Options: DENY), so page shows popups then redirects
- URL: /delivery → shows banners/promos → opens https://instadelivery.com.br/caseirinhosaconfeitaria in new tab
- Auto-redirect countdown (3s) when no active popups
- delivery_popups table with types: banner, promo, coupon, notice
- Admin at /painel-admin/delivery for CRUD on popups with image upload, colors, coupon codes
- Popup modal detail view on click
