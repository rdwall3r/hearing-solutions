# Content: products

One Markdown file per product in `content/products/`. The file name must match `slug`.

```yaml
---
title: "Product name"
slug: product-name              # lowercase-with-dashes, same as the file name
brand: "Brand"
category: otc-hearing-aids      # otc-hearing-aids | assistive-listening | alerting | hearing-protection | accessories
price: 199                      # US dollars, number only
inStock: true
otc: false                      # true → shows the 18+ / mild-to-moderate notice
upgradeEligible: false          # true → shows the "local services" section
images:
  - src: /images/products/product-name.jpg   # put files in public/images/products/
    alt: "What the photo shows"
summary: "One sentence for the product card."
---

Description paragraphs go here, separated by blank lines.
```

The build fails with a clear message if a field is missing or the wrong type.
