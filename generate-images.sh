#!/bin/bash
# Image generation script for Persona Fashion E-Commerce Store
# Generates images sequentially with delays to avoid rate limits

DELAY=5  # seconds between requests

generate() {
  local prompt="$1"
  local output="$2"
  local size="${3:-864x1152}"
  
  if [ -f "$output" ]; then
    echo "⏭️  SKIP (exists): $output"
    return 0
  fi
  
  echo "🎨 Generating: $output"
  if z-ai-generate -p "$prompt" -o "$output" -s "$size" 2>&1; then
    echo "✅ Done: $output"
  else
    echo "❌ Failed: $output - waiting 10s before retry..."
    sleep 10
    if z-ai-generate -p "$prompt" -o "$output" -s "$size" 2>&1; then
      echo "✅ Retry done: $output"
    else
      echo "❌ Retry failed: $output"
    fi
  fi
  
  sleep $DELAY
}

cd /home/z/my-project

# ============================================
# PRODUCT IMAGES - 30 products × 2 images each
# ============================================

# prod_1: Silk Wrap Midi Dress (Women)
generate "Professional fashion product photography of a luxurious silk wrap midi dress in deep burgundy color, flowing fabric with elegant drape, worn on invisible mannequin, cream studio background, soft directional lighting, high-end fashion magazine style, luxury e-commerce product shot" "./public/images/products/silk-wrap-midi-dress-1.jpg"
generate "Close-up detail of a silk wrap midi dress in deep burgundy, showing the luxurious fabric texture and waist tie detail, cream background, professional product photography, fashion e-commerce" "./public/images/products/silk-wrap-midi-dress-2.jpg"

# prod_2: Cashmere Turtleneck Sweater (Women)
generate "Professional fashion product photography of a cream cashmere turtleneck sweater, soft luxurious knit texture, laid flat with elegant folds, minimalist light gray studio background, soft warm lighting, high-end fashion editorial style, luxury e-commerce" "./public/images/products/cashmere-turtleneck-1.jpg"
generate "Close-up detail of cream cashmere turtleneck sweater showing the soft knit texture and ribbed collar, professional fashion product photography, luxury e-commerce" "./public/images/products/cashmere-turtleneck-2.jpg"

# prod_3: Floral Maxi Skirt (Women)
generate "Professional fashion product photography of a floral maxi skirt with delicate pastel flower print on flowing fabric, worn on invisible mannequin, cream studio background, soft natural lighting, high-end fashion style, luxury e-commerce" "./public/images/products/floral-maxi-skirt-1.jpg"
generate "Close-up detail of floral maxi skirt showing the delicate pastel flower print pattern and flowing fabric texture, cream background, professional fashion product photography, luxury e-commerce" "./public/images/products/floral-maxi-skirt-2.jpg"

# prod_4: Tailored Wool Coat (Women)
generate "Professional fashion product photography of a tailored camel wool coat for women, structured silhouette with notch lapels, worn on invisible mannequin, neutral studio background, soft directional lighting, high-end fashion editorial, luxury e-commerce" "./public/images/products/tailored-wool-coat-1.jpg"
generate "Detail shot of tailored camel wool coat showing the fine wool texture, button details and structured lapel, neutral background, professional fashion product photography, luxury e-commerce" "./public/images/products/tailored-wool-coat-2.jpg"

# prod_5: Linen Blend Blouse (Women)
generate "Professional fashion product photography of a white linen blend blouse with relaxed fit, soft natural fabric with subtle texture, worn on invisible mannequin, cream studio background, natural lighting, high-end fashion style, luxury e-commerce" "./public/images/products/linen-blend-blouse-1.jpg"
generate "Detail shot of white linen blend blouse showing the natural fabric texture and button placket detail, cream background, professional fashion product photography, luxury e-commerce" "./public/images/products/linen-blend-blouse-2.jpg"

# prod_6: Tailored Linen Blazer (Men)
generate "Professional fashion product photography of a navy tailored linen blazer for men, structured shoulders, two-button closure, worn on invisible mannequin, light gray studio background, soft lighting, high-end menswear editorial style, luxury e-commerce" "./public/images/products/tailored-linen-blazer-1.jpg"
generate "Detail shot of navy tailored linen blazer showing the linen fabric texture, horn buttons and interior lining, light gray background, professional menswear product photography, luxury e-commerce" "./public/images/products/tailored-linen-blazer-2.jpg"

# prod_7: Cotton Oxford Shirt (Men)
generate "Professional fashion product photography of a classic white cotton Oxford shirt for men, crisp collar, button-down front, worn on invisible mannequin, light studio background, clean soft lighting, high-end menswear style, luxury e-commerce" "./public/images/products/cotton-oxford-shirt-1.jpg"
generate "Detail shot of white cotton Oxford shirt showing the fine Oxford weave texture and button-down collar, light background, professional menswear product photography, luxury e-commerce" "./public/images/products/cotton-oxford-shirt-2.jpg"

# prod_8: Slim Fit Chino Trousers (Men)
generate "Professional fashion product photography of khaki slim fit chino trousers for men, clean tailored silhouette, laid flat with crisp fold, light studio background, soft lighting, high-end menswear style, luxury e-commerce" "./public/images/products/slim-fit-chinos-1.jpg"
generate "Detail shot of khaki slim fit chino trousers showing the cotton twill fabric texture and clean stitching, light background, professional menswear product photography, luxury e-commerce" "./public/images/products/slim-fit-chinos-2.jpg"

# prod_9: Merino Wool Crew Neck (Men)
generate "Professional fashion product photography of a charcoal merino wool crew neck sweater for men, fine knit texture, laid flat elegantly, light gray studio background, warm soft lighting, high-end menswear style, luxury e-commerce" "./public/images/products/merino-crew-neck-1.jpg"
generate "Detail shot of charcoal merino wool crew neck sweater showing the fine merino knit texture and ribbed cuffs, light gray background, professional menswear product photography, luxury e-commerce" "./public/images/products/merino-crew-neck-2.jpg"

# prod_10: Leather Bomber Jacket (Men)
generate "Professional fashion product photography of a black leather bomber jacket for men, premium smooth leather, ribbed cuffs and hem, worn on invisible mannequin, dark moody studio background, dramatic lighting, high-end menswear editorial, luxury e-commerce" "./public/images/products/leather-bomber-jacket-1.jpg"
generate "Detail shot of black leather bomber jacket showing the premium leather grain texture, metal zipper and ribbed collar, dark background, professional menswear product photography, luxury e-commerce" "./public/images/products/leather-bomber-jacket-2.jpg"

# prod_11: Organic Cotton T-Shirt (Kids)
generate "Professional fashion product photography of a pastel blue organic cotton t-shirt for kids, soft natural fabric, simple clean design, laid flat, light cream studio background, soft natural lighting, childrens fashion, e-commerce" "./public/images/products/organic-cotton-tee-1.jpg"
generate "Detail shot of pastel blue organic cotton kids t-shirt showing the soft natural cotton texture, cream background, professional childrens fashion photography, e-commerce" "./public/images/products/organic-cotton-tee-2.jpg"

# prod_12: Denim Overalls (Kids)
generate "Professional fashion product photography of classic blue denim overalls for kids, adjustable straps, brass hardware, worn on small mannequin, light studio background, soft lighting, childrens fashion, e-commerce" "./public/images/products/denim-overalls-1.jpg"
generate "Detail shot of kids blue denim overalls showing the denim texture, brass buckles and pocket detail, light background, professional childrens fashion photography, e-commerce" "./public/images/products/denim-overalls-2.jpg"

# prod_13: Fleece Lined Hoodie (Kids)
generate "Professional fashion product photography of a soft pink fleece lined hoodie for kids, cozy warm fabric, kangaroo pocket, laid flat, cream studio background, warm soft lighting, childrens fashion, e-commerce" "./public/images/products/fleece-hoodie-1.jpg"
generate "Detail shot of pink kids fleece lined hoodie showing the soft fleece interior texture and hood detail, cream background, professional childrens fashion photography, e-commerce" "./public/images/products/fleece-hoodie-2.jpg"

# prod_14: Printed Summer Dress (Kids)
generate "Professional fashion product photography of a cheerful printed summer dress for kids, colorful floral pattern, cotton fabric, A-line silhouette, worn on small mannequin, light studio background, bright natural lighting, childrens fashion, e-commerce" "./public/images/products/summer-dress-kids-1.jpg"
generate "Detail shot of kids printed summer dress showing the colorful floral cotton pattern and hem detail, light background, professional childrens fashion photography, e-commerce" "./public/images/products/summer-dress-kids-2.jpg"

# prod_15: Canvas Sneakers (Kids)
generate "Professional fashion product photography of white canvas sneakers for kids with colorful accent stripes, clean minimalist design, product on white surface, studio lighting, childrens fashion footwear, e-commerce" "./public/images/products/canvas-sneakers-kids-1.jpg"
generate "Side angle view of white canvas kids sneakers showing the rubber sole and colorful stripe detail, white background, professional childrens footwear photography, e-commerce" "./public/images/products/canvas-sneakers-kids-2.jpg"

# prod_16: Leather Ankle Boots (Shoes)
generate "Professional fashion product photography of black leather ankle boots, sleek pointed toe design, block heel, premium leather upper, product on neutral surface, studio lighting, high-end footwear editorial, luxury e-commerce" "./public/images/products/leather-ankle-boots-1.jpg"
generate "Side angle detail of black leather ankle boots showing the premium leather texture, heel detail and side profile, neutral background, professional footwear photography, luxury e-commerce" "./public/images/products/leather-ankle-boots-2.jpg"

# prod_17: Running Performance Sneakers (Shoes)
generate "Professional fashion product photography of modern black and white running sneakers, lightweight mesh upper, cushioned sole, athletic performance footwear, product on light surface, studio lighting, sportswear e-commerce" "./public/images/products/running-sneakers-1.jpg"
generate "Side angle of black and white running sneakers showing the mesh upper detail and cushioned sole technology, light background, professional sportswear photography, e-commerce" "./public/images/products/running-sneakers-2.jpg"

# prod_18: Suede Loafers (Shoes)
generate "Professional fashion product photography of brown suede loafers, classic penny loafer style, premium suede, leather sole, product on neutral surface, studio lighting, high-end mens footwear, luxury e-commerce" "./public/images/products/suede-loafers-1.jpg"
generate "Top-down view of brown suede loafers showing the premium suede texture and penny keeper detail, neutral background, professional footwear photography, luxury e-commerce" "./public/images/products/suede-loafers-2.jpg"

# prod_19: Platform Sandals (Shoes)
generate "Professional fashion product photography of elegant nude platform sandals, strappy design, wooden platform sole, product on neutral surface, studio lighting, high-end womens footwear, luxury e-commerce" "./public/images/products/platform-sandals-1.jpg"
generate "Side angle of nude platform sandals showing the wooden platform sole height and strap detail, neutral background, professional womens footwear photography, luxury e-commerce" "./public/images/products/platform-sandals-2.jpg"

# prod_20: Classic White Sneakers (Shoes)
generate "Professional fashion product photography of classic white leather sneakers, minimal design, clean white sole, premium leather, product on light surface, studio lighting, luxury footwear e-commerce" "./public/images/products/white-sneakers-1.jpg"
generate "Side angle of classic white leather sneakers showing the clean minimal design and premium leather texture, light background, professional footwear photography, luxury e-commerce" "./public/images/products/white-sneakers-2.jpg"

# prod_21: Leather Crossbody Bag (Accessories)
generate "Professional fashion product photography of a tan leather crossbody bag, premium full-grain leather, adjustable strap, brass hardware, product on cream surface, studio lighting, luxury accessories e-commerce" "./public/images/products/crossbody-bag-1.jpg"
generate "Detail of tan leather crossbody bag showing the leather grain texture, brass clasp closure and interior, cream background, professional accessories photography, luxury e-commerce" "./public/images/products/crossbody-bag-2.jpg"

# prod_22: Gold Chain Necklace (Accessories)
generate "Professional fashion product photography of a delicate gold chain necklace, 18k gold plated, minimalist pendant design, laid on dark velvet surface, dramatic lighting, luxury jewelry e-commerce" "./public/images/products/gold-chain-necklace-1.jpg"
generate "Close-up detail of gold chain necklace showing the delicate chain links and clasp, on dark velvet, professional jewelry photography, luxury e-commerce" "./public/images/products/gold-chain-necklace-2.jpg"

# prod_23: Classic Leather Belt (Accessories)
generate "Professional fashion product photography of a black classic leather belt, premium full-grain leather, silver buckle, rolled elegantly, on cream surface, studio lighting, luxury accessories e-commerce" "./public/images/products/leather-belt-1.jpg"
generate "Detail of black leather belt showing the leather grain texture and silver buckle hardware, cream background, professional accessories photography, luxury e-commerce" "./public/images/products/leather-belt-2.jpg"

# prod_24: Silk Scarf (Accessories)
generate "Professional fashion product photography of a luxurious silk scarf with an abstract print in gold, rose and cream tones, draped elegantly, on cream surface, soft lighting, luxury accessories e-commerce" "./public/images/products/silk-scarf-1.jpg"
generate "Detail of silk scarf showing the vibrant abstract print pattern and luxurious silk fabric, cream background, professional accessories photography, luxury e-commerce" "./public/images/products/silk-scarf-2.jpg"

# prod_25: Minimalist Watch (Accessories)
generate "Professional fashion product photography of a minimalist silver watch, clean white dial, thin leather strap, laid on dark surface, dramatic lighting, luxury timepiece e-commerce" "./public/images/products/minimalist-watch-1.jpg"
generate "Close-up detail of minimalist watch showing the clean dial face, thin hands and leather strap texture, dark background, professional watch photography, luxury e-commerce" "./public/images/products/minimalist-watch-2.jpg"

# prod_26: Hydrating Face Serum (Beauty)
generate "Professional beauty product photography of a luxurious hydrating face serum in an elegant frosted glass dropper bottle, golden liquid, on marble surface, soft warm lighting, luxury skincare e-commerce" "./public/images/products/hydrating-serum-1.jpg"
generate "Detail of hydrating face serum bottle showing the frosted glass texture and golden dropper, on marble surface, professional beauty product photography, luxury skincare e-commerce" "./public/images/products/hydrating-serum-2.jpg"

# prod_27: Matte Lipstick Set (Beauty)
generate "Professional beauty product photography of a luxury matte lipstick set, four elegant tubes in nude rose and berry shades, on velvet surface, warm soft lighting, luxury cosmetics e-commerce" "./public/images/products/matte-lipstick-set-1.jpg"
generate "Close-up of matte lipstick set showing swatches of the four shades, rose, berry, nude and mauve, on velvet surface, professional beauty photography, luxury cosmetics e-commerce" "./public/images/products/matte-lipstick-set-2.jpg"

# prod_28: Glow Setting Spray (Beauty)
generate "Professional beauty product photography of a glow setting spray in an elegant glass mist bottle with rose gold cap, on marble surface, soft lighting, luxury cosmetics e-commerce" "./public/images/products/glow-setting-spray-1.jpg"
generate "Detail of glow setting spray bottle showing the glass mist bottle and rose gold cap detail, on marble surface, professional beauty photography, luxury cosmetics e-commerce" "./public/images/products/glow-setting-spray-2.jpg"

# prod_29: Vitamin C Brightening Cream (Beauty)
generate "Professional beauty product photography of a vitamin C brightening cream in a luxurious white and gold jar, on marble surface with citrus accent, warm lighting, luxury skincare e-commerce" "./public/images/products/vitamin-c-cream-1.jpg"
generate "Detail of vitamin C brightening cream jar showing the luxurious white and gold packaging and cream texture, on marble surface, professional beauty photography, luxury skincare e-commerce" "./public/images/products/vitamin-c-cream-2.jpg"

# prod_30: Nourishing Hair Oil (Beauty)
generate "Professional beauty product photography of a nourishing hair oil in an elegant amber glass bottle with gold dropper, on marble surface, warm lighting, luxury haircare e-commerce" "./public/images/products/hair-oil-1.jpg"
generate "Detail of nourishing hair oil bottle showing the amber glass and gold dropper detail, on marble surface, professional beauty photography, luxury haircare e-commerce" "./public/images/products/hair-oil-2.jpg"

echo "============================================"
echo "ALL PRODUCT IMAGES GENERATED!"
echo "============================================"
