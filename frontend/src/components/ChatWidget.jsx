import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles, RefreshCw } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// KNOWLEDGE BASE — All chatbot intelligence lives here. Add more intents below.
// ─────────────────────────────────────────────────────────────────────────────
const KNOWLEDGE_BASE = [
  {
    id: 'greeting',
    patterns: ['hi', 'hello', 'hey', 'namaste', 'good morning', 'good evening', 'good afternoon', 'howdy', 'sup'],
    response: `👋 **Namaste!** I'm **EcoBot**, your smart waste management assistant for Jamshedpur's EcoSync platform.\n\nHere's what I can help you with:\n\n• 🗑️ **Waste Classification** — plastic, organic, e-waste, hazardous\n• 📸 **How to Report** waste piles in your area\n• 📅 **Schedule Pickups** from your home\n• ♻️ **Recycling Info** & composting tips\n• 🏙️ **Jamshedpur Local** — JNAC/JUSCO zones, drop-off centers\n• 🌟 **EcoPoints** — earn rewards for eco actions\n\nWhat would you like to know? Type your question!`
  },
  {
    id: 'thanks',
    patterns: ['thanks', 'thank you', 'thankyou', 'thx', 'ty', 'great', 'awesome', 'perfect', 'ok thanks', 'got it'],
    response: `You're welcome! 🌿 Every small action helps keep Jamshedpur clean. If you have any more questions, I'm here 24/7!\n\n💚 *Together we build a greener Steel City.*`
  },
  {
    id: 'bye',
    patterns: ['bye', 'goodbye', 'see you', 'cya', 'later', 'take care', 'exit', 'quit'],
    response: `Goodbye! 👋 Remember — a cleaner city starts with each one of us. See you on EcoSync! 🌱`
  },
  // ── PLASTIC ────────────────────────────────────────────────────────────────
  {
    id: 'plastic',
    patterns: ['plastic', 'plastic bottle', 'polythene', 'polybag', 'plastic bag', 'carry bag', 'pet bottle', 'packaging', 'wrapper', 'sachet'],
    response: `📦 **Plastic Waste Classification**\n\nPlastics fall under **Dry/Recyclable Waste**:\n\n✅ **Accepted for Recycling:**\n• PET bottles (water, soda, juice)\n• HDPE containers (shampoo, detergent)\n• Hard plastic containers (rinsed and dry)\n• Plastic buckets, trays, crates\n\n❌ **NOT Recyclable (Landfill):**\n• Laminated chip packets & pouches\n• Styrofoam cups/trays\n• Soiled plastic bags\n• Multi-layer packaging\n\n⚠️ **Important:** Single-use plastic is **banned in Mango area**. Avoid plastic bags — use cloth bags instead!\n\n📍 Drop clean recyclable plastic at **JNAC Recycling Points** in Bistupur, Sakchi & Telco.`
  },
  // ── ORGANIC / WET WASTE ────────────────────────────────────────────────────
  {
    id: 'organic',
    patterns: ['food', 'food waste', 'vegetable', 'fruit', 'kitchen', 'wet waste', 'organic', 'banana', 'peel', 'leftover', 'compost', 'composting', 'rotten', 'tea leaves', 'egg shell'],
    response: `🍎 **Organic / Wet Waste**\n\nWet waste = anything that was once alive and decomposes naturally.\n\n✅ **Examples:**\n• Fruit & vegetable peels\n• Cooked food leftovers\n• Tea/coffee grounds & filters\n• Eggshells, nutshells\n• Flowers & leaves\n• Soiled paper napkins\n\n♻️ **Best Practices:**\n• Use a **green bin** for wet waste — keep it separate from dry waste\n• You can compost at home using a simple clay pot or bucket\n• Fill your compost bin: brown material (dry leaves) + green material (food scraps) in 2:1 ratio\n• Ready compost in 45-60 days — great for your terrace garden!\n\n📅 Schedule a **composting bag pickup** via the "Schedule Pickup" page. JUSCO collects organic waste on alternate days in most Jamshedpur zones.`
  },
  // ── E-WASTE ────────────────────────────────────────────────────────────────
  {
    id: 'ewaste',
    patterns: ['e-waste', 'ewaste', 'electronics', 'electronic', 'battery', 'batteries', 'mobile', 'phone', 'charger', 'laptop', 'computer', 'tv', 'television', 'refrigerator', 'washing machine', 'ac', 'air conditioner', 'light bulb', 'cfl', 'led', 'tubelight'],
    response: `🔋 **E-Waste (Electronic Waste)**\n\nE-waste is **hazardous** — it contains lead, mercury, cadmium and other toxic metals. **Never** throw it in regular bins!\n\n📍 **JNAC E-Waste Drop-Off Centers in Jamshedpur:**\n• Bistupur Market Area (near Municipal Office)\n• Sakchi Bus Stand vicinity\n• Adityapur Industrial Zone collection point\n\n📅 **Special E-Waste Collection Drives** are organized quarterly — watch for Admin Announcements on this dashboard!\n\n✅ **Accepted Items:**\n• Mobile phones, tablets, laptops\n• Chargers, cables, earphones\n• Batteries (AA, AAA, Li-ion)\n• CFL/LED bulbs, tube lights\n• Small appliances: mixers, irons\n• Large appliances: AC, TV, fridge (schedule separate pickup)\n\n⚠️ **Tip:** Remove personal data from devices before dropping off.`
  },
  // ── HAZARDOUS ─────────────────────────────────────────────────────────────
  {
    id: 'hazardous',
    patterns: ['hazardous', 'dangerous', 'chemical', 'poison', 'toxic', 'paint', 'oil', 'medicine', 'medicines', 'drug', 'syringe', 'needle', 'pesticide', 'insecticide', 'bleach', 'acid'],
    response: `⚠️ **Hazardous Waste**\n\nHazardous waste is **extremely dangerous** to humans and the environment. Handle with care!\n\n🚫 **Never:**\n• Pour chemicals down the drain\n• Mix hazardous waste with regular trash\n• Burn pesticide containers\n\n✅ **Safe Disposal Options:**\n• **Medicines:** Return unused medicines to pharmacies or JNAC pharmacy take-back drives\n• **Paint/Chemicals:** Seal tightly, label clearly, and call JNAC hazardous waste helpline\n• **Needles/Sharps:** Use a puncture-proof container (like an old plastic bottle), seal it, and hand it to healthcare waste collectors\n• **Pesticide Containers:** Rinse three times, then puncture to prevent reuse — hand to JUSCO\n\n📞 **JNAC Helpline:** Contact support via the EcoSync Contact page for hazardous waste special pickup scheduling.`
  },
  // ── DRY / RECYCLABLE ──────────────────────────────────────────────────────
  {
    id: 'dry_waste',
    patterns: ['dry waste', 'paper', 'cardboard', 'newspaper', 'glass', 'metal', 'tin', 'can', 'aluminium', 'steel container', 'recyclable', 'recycle', 'recycling'],
    response: `📰 **Dry / Recyclable Waste**\n\nDry waste = materials that can be recycled or reused. Use a **blue bin**.\n\n✅ **Recyclable Items:**\n\n**Paper & Cardboard:**\n• Newspapers, magazines, books\n• Cardboard boxes (flatten them!)\n• Envelopes, paper bags\n\n**Glass:**\n• Bottles & jars (rinsed)\n• Glass containers\n\n**Metal:**\n• Tin/aluminium cans (rinsed)\n• Steel utensils, scrap metal\n• Bottle caps & lids\n\n**Plastic** (see Plastic section)\n\n💡 **Pro Tip:** Clean and dry items before recycling — food residue contaminates entire batches!\n\n📍 Jamshedpur has **Dry Waste Collection Centers (DWCCs)** in Bistupur, Jugsalai, Mango & Adityapur.`
  },
  // ── BIOMEDICAL ────────────────────────────────────────────────────────────
  {
    id: 'biomedical',
    patterns: ['biomedical', 'hospital waste', 'medical waste', 'clinic waste', 'blood', 'bandage', 'cotton'],
    response: `🏥 **Biomedical / Medical Waste**\n\nMedical waste from clinics, hospitals, and home healthcare must be handled separately.\n\n✅ **Guidance:**\n• Hospitals must have a registered **Common Biomedical Waste Treatment Facility (CBWTF)** tie-up\n• Home-generated bandages (non-infectious) go in regular dry waste\n• Sharps (needles): use a puncture-proof container, then contact JNAC for collection\n\n📞 For medical facilities, contact **JNAC Environment Cell** through the EcoSync Contact page.`
  },
  // ── REPORTING ─────────────────────────────────────────────────────────────
  {
    id: 'report_waste',
    patterns: ['report', 'how to report', 'report waste', 'complain', 'complaint', 'waste pile', 'garbage', 'dump', 'dumping', 'illegal dump', 'debris', 'construction waste', 'report garbage', 'report problem'],
    response: `📸 **How to Report Waste on EcoSync**\n\nSpotting a waste pile? Here's how to report it in under 2 minutes:\n\n**Step 1:** Login to your EcoSync account\n**Step 2:** Click **"Report Waste"** button on your Dashboard\n**Step 3:** Fill in:\n  • Type of waste (Plastic, Organic, Bulk, Hazardous)\n  • Location (type your area: Sakchi, Mango, Bistupur, etc.)\n  • Description of the problem\n  • Optional: Upload a photo for faster resolution\n**Step 4:** Submit! 🎉\n\n✅ **What happens next:**\n• Your report gets a unique tracking ID\n• A JNAC/JUSCO driver is assigned\n• You'll see status updates: Pending → Assigned → Cleaned → Verified\n• Earn **EcoPoints** for each verified report!\n\n💡 **Tip:** Adding a photo increases resolution speed by 60%.`
  },
  // ── PICKUP SCHEDULING ─────────────────────────────────────────────────────
  {
    id: 'schedule_pickup',
    patterns: ['pickup', 'schedule pickup', 'schedule', 'collection', 'home collection', 'collect', 'when pickup', 'pickup time', 'book pickup', 'request pickup'],
    response: `📅 **Schedule a Waste Pickup**\n\nNeed a home/office pickup? EcoSync makes it easy!\n\n**How to Schedule:**\n1. Go to **Dashboard → "Schedule Pickup"**\n2. Choose your preferred **date & time slot**\n3. Select waste type:\n   • 🟢 Organic/Wet waste\n   • 🔵 Dry/Recyclable waste  \n   • ⚫ Bulk/Furniture\n   • 🔴 Hazardous (special request)\n4. Enter your **full address** in Jamshedpur\n5. Add any special notes\n6. Submit!\n\n🚛 **JUSCO Pickup Schedule (General):**\n• Wet waste: Daily (morning 6AM–9AM in most zones)\n• Dry waste: Alternate days\n• Bulk items: By appointment (2–3 business days)\n\n📍 **Zones covered:** Bistupur, Sakchi, Mango, Jugsalai, Telco, Adityapur, Boram, Kadma, Sonari\n\n⚠️ Keep your waste bag at the designated spot by 6AM on collection day!`
  },
  // ── ECOPOINTS ─────────────────────────────────────────────────────────────
  {
    id: 'ecopoints',
    patterns: ['ecopoints', 'eco points', 'points', 'reward', 'rewards', 'earn points', 'how to earn', 'badge', 'achievement', 'leaderboard'],
    response: `🌟 **EcoPoints — Earn While You Help!**\n\nEcoPoints is EcoSync's reward system for civic eco-contributions.\n\n**How to Earn:**\n| Action | Points |  \n|--------|--------|  \n| Submit a waste report | +10 pts |  \n| Report verified & cleaned | +25 pts |  \n| Schedule a pickup | +5 pts |  \n| Refer a friend to EcoSync | +20 pts |  \n| Community cleanup participation | +50 pts |  \n\n**Benefits of EcoPoints:**\n• 🏅 Unlock profile badges (Eco Starter → Eco Hero → Green Guardian)\n• 📊 Appear on the City Leaderboard\n• 🎁 Redeem for local partner discounts (coming soon)\n\n💡 **Tip:** Verified reports (with before/after photos) earn the most points!`
  },
  // ── ZONES / LOCATIONS ─────────────────────────────────────────────────────
  {
    id: 'zones',
    patterns: ['zone', 'area', 'bistupur', 'sakchi', 'mango', 'jugsalai', 'telco', 'adityapur', 'boram', 'kadma', 'sonari', 'jamshedpur area', 'which area', 'my location', 'sector'],
    response: `🏙️ **Jamshedpur Municipal Zones on EcoSync**\n\nEcoSync covers all major zones managed by **JNAC** (Jamshedpur Notified Area Committee) and **JUSCO** (Jamshedpur Utilities & Services Company):\n\n| Zone | Dry Waste Day | Notes |\n|------|--------------|-------|\n| Bistupur | Mon, Thu | Recycling center nearby |\n| Sakchi | Tue, Fri | JNAC main office zone |\n| Mango | Mon, Wed | Plastic-free zone |\n| Jugsalai | Tue, Sat | Near Subarnarekha |\n| Telco | Wed, Sat | Industrial adjacent |\n| Kadma | Mon, Fri | |\n| Sonari | Tue, Thu | |\n| Adityapur | Mon, Thu | Industrial zone |\n\n📞 **JUSCO Helpline:** Contact via EcoSync's Contact page for zone-specific queries.`
  },
  // ── JNAC / JUSCO ──────────────────────────────────────────────────────────
  {
    id: 'jnac_jusco',
    patterns: ['jnac', 'jusco', 'municipal', 'corporation', 'authority', 'government', 'council', 'civic body'],
    response: `🏛️ **JNAC & JUSCO — Who Does What?**\n\n**JNAC (Jamshedpur Notified Area Committee):**\n• Overall civic governance of Jamshedpur\n• Handles planning, sanitation policy, public health\n• Manages solid waste management initiatives\n• Issues permits for bulk waste disposal\n\n**JUSCO (Jamshedpur Utilities & Services Company):**\n• Tata group's utility arm (subsidiary of Tata Steel)\n• Operates daily garbage collection across all zones\n• Water supply, sewerage, street lighting\n• Runs the actual fleet of waste collection trucks\n\n🤝 EcoSync bridges **citizens ↔ JNAC ↔ JUSCO** for faster resolution of waste complaints and scheduled pickups.\n\n📞 For direct contact: Use the **Contact** page on EcoSync.`
  },
  // ── COMPOSTING ────────────────────────────────────────────────────────────
  {
    id: 'composting',
    patterns: ['compost', 'composting', 'home compost', 'vermicompost', 'terrace garden', 'kitchen garden', 'fertilizer', 'manure'],
    response: `🌱 **Home Composting Guide for Jamshedpur**\n\nTurn your kitchen waste into gold — literally!\n\n**Simple Clay Pot Method:**\n1. Get a clay pot or old bucket with drainage holes\n2. Layer: dry leaves → kitchen scraps → more dry leaves\n3. Add a handful of soil after each layer\n4. Keep moist but not wet\n5. Turn every 3 days with a stick\n6. Ready in **45–60 days!** 🌿\n\n**Vermicomposting (Earthworm Compost):**\n• Faster — ready in 30–40 days\n• Needs red wiggler worms (available at nurseries in Bistupur)\n• Perfect for apartment dwellers with small bins\n\n**✅ Add to Compost:**\nVegetable/fruit peels, tea leaves, eggshells, coffee grounds, dry leaves\n\n**❌ Never Compost:**\nMeat, fish, dairy, oily food, diseased plants\n\n🏆 Use the compost in your terrace/balcony garden — reduces chemical fertilizer need by 80%!`
  },
  // ── SWACHH BHARAT ─────────────────────────────────────────────────────────
  {
    id: 'swachh_bharat',
    patterns: ['swachh bharat', 'swachh', 'clean india', 'cleanliness', 'sanitation mission', 'odf', 'open defecation'],
    response: `🇮🇳 **Swachh Bharat Mission & Jamshedpur**\n\nJamshedpur has been a **model city** under Swachh Bharat Mission, consistently ranking among the cleanest cities in Jharkhand.\n\n**Key Achievements:**\n• Open Defecation Free (ODF) status achieved\n• Wet/dry waste segregation at source initiative\n• Door-to-door collection expanded to 95%+ households\n• Community composting centers established\n\n**How EcoSync Contributes:**\n• Digital waste reporting replaces manual complaint systems\n• Real-time driver dispatch improves pickup efficiency\n• Citizen EcoPoints incentivize participation\n• Admin broadcast system for rapid public communication\n\n🌟 You — as an EcoSync user — are directly contributing to keeping Jamshedpur a Swachh city!`
  },
  // ── DRIVER / STATUS ───────────────────────────────────────────────────────
  {
    id: 'driver_status',
    patterns: ['driver', 'driver assigned', 'vehicle', 'truck', 'when will', 'status', 'my report', 'track', 'update', 'how long', 'pending'],
    response: `🚛 **Tracking Your Report Status**\n\nEvery waste report on EcoSync follows this pipeline:\n\n**1. 🕐 Pending** — Report submitted, awaiting driver assignment\n**2. 🚛 Assigned** — A JUSCO driver has been assigned to your location\n**3. 📸 Cleaned** — Driver has cleaned the site & uploaded photo proof\n**4. ✅ Verified** — Admin has verified the cleanup is complete\n\n📊 You can track status in real-time on your **Dashboard → Active Deployments** section.\n\n**Typical Resolution Times:**\n• Regular waste pile: 24–48 hours\n• Bulk/construction debris: 3–5 business days\n• Hazardous material: 1–2 business days (priority)\n\n💡 **Tip:** If your report stays "Pending" for more than 48 hours, use the Contact page to escalate.`
  },
  // ── SEGREGATION ───────────────────────────────────────────────────────────
  {
    id: 'segregation',
    patterns: ['segregate', 'segregation', 'separate', 'separation', 'which bin', 'color bin', 'green bin', 'blue bin', 'red bin', 'black bin', 'how to sort', 'sorting'],
    response: `🗑️ **Waste Segregation at Source**\n\nThe most important habit for a cleaner Jamshedpur!\n\n**The 3-Bin System (JNAC Standard):**\n\n🟢 **Green Bin — Wet/Organic Waste**\n• Food scraps, vegetable peels, flowers\n• Tea leaves, eggshells, garden waste\n\n🔵 **Blue Bin — Dry/Recyclable Waste**\n• Paper, cardboard, plastic bottles\n• Glass bottles, metal cans\n\n🔴 **Red Bin — Hazardous Waste**\n• Batteries, old medicines, chemical containers\n• CFL bulbs, paint cans\n\n**Why It Matters:**\n• Unsegregated waste → EVERYTHING goes to landfill\n• Segregated waste → up to 60% is recycled/composted\n• Keeps your neighborhood cleaner & safer\n\n🏆 Jamshedpur has achieved **70% segregation rate** in core areas. Let's push it to 100%!`
  },
  // ── BULK WASTE ────────────────────────────────────────────────────────────
  {
    id: 'bulk_waste',
    patterns: ['bulk', 'furniture', 'sofa', 'bed', 'mattress', 'construction', 'debris', 'renovation', 'rubble', 'bricks', 'sand', 'cement bags', 'large item'],
    response: `🏗️ **Bulk & Construction Waste**\n\nMoving? Renovating? Here's how to handle large waste:\n\n**Bulk Household Items (furniture, appliances):**\n• Book a special bulk pickup via "Schedule Pickup" on EcoSync\n• Select "Bulk/Furniture" as waste type\n• Processing time: 2–3 business days\n• Items in good condition may be redirected to community reuse centers!\n\n**Construction & Demolition (C&D) Debris:**\n• Sand, bricks, cement, tiles, glass — classified as **Inert Waste**\n• Never mix with household waste\n• JNAC requires a **permit** for large quantities (>500 kg)\n• Approved C&D recycling plants exist near Adityapur Industrial Area\n\n⚠️ **Illegal dumping of construction waste** carries fines under Jharkhand Solid Waste Rules. Always dispose properly!`
  },
  // ── PLASTIC BAN ───────────────────────────────────────────────────────────
  {
    id: 'plastic_ban',
    patterns: ['plastic ban', 'banned plastic', 'single use', 'single-use', 'ban', 'polythene ban', 'carry bag ban'],
    response: `🚫 **Plastic Ban in Jamshedpur**\n\nAs per JNAC notifications and national guidelines:\n\n**Banned Single-Use Plastics (since July 2022):**\n• Plastic carry bags under 75 microns\n• Plastic straws, stirrers\n• Plastic cutlery (spoons, forks, plates)\n• Thermocol (EPS) cups, plates\n• Plastic flags & balloons\n• Plastic sachets of less than 100ml\n\n**Penalties:**\n• First offense: Warning + confiscation\n• Second offense: Fine up to ₹5,000\n• Repeat commercial violations: Up to ₹25,000\n\n✅ **Alternatives:**\n• Cloth bags, jute bags, bamboo products\n• Stainless steel bottles, copper containers\n• Banana leaf / paper plates for events\n• Mud pots / terracotta for single-serve drinks\n\n🌿 Mango area has been declared a **plastic-free zone** — leading by example!`
  },
  // ── RECYCLING CENTERS ─────────────────────────────────────────────────────
  {
    id: 'recycling_centers',
    patterns: ['recycling center', 'drop off', 'drop-off', 'where to drop', 'collection center', 'center', 'where can i', 'disposal point', 'recycle center'],
    response: `📍 **Recycling & Drop-Off Centers in Jamshedpur**\n\n**JNAC Dry Waste Collection Centers (DWCCs):**\n• Bistupur — Near Municipal Market\n• Sakchi — Sakchi Bus Stand Road\n• Mango — Mango Chowk area\n• Jugsalai — Near JUSCO office\n• Adityapur — Industrial Zone gate\n\n**E-Waste Specific Drop-Off:**\n• Bistupur Municipal Complex\n• Adityapur ITRI center\n\n**Composting Centers (Organic):**\n• JNAC runs community composting pits in Bistupur, Sonari, and Kadma\n\n**Timings (General):**\n• Mon–Sat: 8:00 AM – 5:00 PM\n• Sundays: 9:00 AM – 1:00 PM\n\n💡 **Tip:** Call ahead for large volumes. Use the EcoSync Contact page to confirm current timings.`
  },
  // ── ABOUT ECOSYNC ─────────────────────────────────────────────────────────
  {
    id: 'about_ecosync',
    patterns: ['what is ecosync', 'about ecosync', 'ecosync', 'platform', 'how does ecosync work', 'who made', 'ecosystem', 'app features'],
    response: `🌍 **About EcoSync**\n\nEcoSync is Jamshedpur's digital waste management platform connecting **citizens, municipal drivers (JNAC/JUSCO), and city administrators** in one unified system.\n\n**Core Features:**\n\n📸 **Report Waste** — Snap & submit waste pile reports\n📅 **Schedule Pickup** — Book home waste collections\n🚛 **Driver Dashboard** — Real-time job dispatching for JUSCO drivers\n📊 **Admin Command** — City-wide analytics, announcements & oversight\n🌟 **EcoPoints** — Gamified civic engagement\n📢 **Live Broadcasts** — Admin alerts displayed across dashboards\n🤖 **EcoBot** — AI-powered waste guidance (that's me!)\n\n**Tech Stack:**\nReact + Node.js + MongoDB + Cloudinary\n\n🏙️ Built for **Steel City, Jamshedpur** — aiming to make it the cleanest industrial city in India!`
  },
  // ── WEATHER & WASTE ───────────────────────────────────────────────────────
  {
    id: 'monsoon',
    patterns: ['rain', 'monsoon', 'flood', 'waterlogging', 'rainy season', 'wet season', 'drainage', 'blocked drain'],
    response: `🌧️ **Monsoon & Waste Management Tips**\n\nJamshedpur's monsoon (June–September) brings extra waste challenges:\n\n**Before Monsoon:**\n• Clear household drains of debris and plastic\n• Don't dump waste near Subarnarekha/Kharkai riverbanks\n• Seal your compost bin to prevent soaking\n\n**During Rains:**\n• Never throw garbage in drainage channels — causes floods!\n• Report blocked drains + illegal dumping via EcoSync immediately\n• Keep waste bins covered to prevent rodent/mosquito breeding\n• Wet plastic bags block storm drains — use cloth bags!\n\n**After Floods:**\n• Debris & silt from flooding = bulk waste — schedule a special pickup\n• Damaged electronics after flooding = E-waste — do not dump in regular bins\n\n⚡ Flood-related waste reports get **Priority Status** on EcoSync during monsoon season!`
  },
  // ── ECO TIPS ──────────────────────────────────────────────────────────────
  {
    id: 'eco_tips',
    patterns: ['tip', 'tips', 'advice', 'suggest', 'eco friendly', 'green living', 'sustainable', 'environment', 'save environment', 'how to help', 'what can i do'],
    response: `💚 **Top 10 Eco Tips for Jamshedpur Citizens**\n\n1. 🗑️ **Segregate waste** at source — green & blue bins\n2. 🛍️ **Carry a cloth bag** — refuse plastic at shops\n3. 💧 **Fix leaking taps** — conserve water\n4. 🌱 **Start a kitchen compost** — turn peels into fertilizer\n5. 📸 **Report waste piles** on EcoSync — get them cleaned faster\n6. 🚶 **Walk or cycle** for short distances in Bistupur/Sakchi\n7. 📵 **Donate old electronics** — don't trash them\n8. 🌳 **Plant one tree** this monsoon — adopt a sapling\n9. 💡 **Switch to LED** bulbs — save electricity\n10. 📢 **Spread awareness** — share EcoSync with neighbors!\n\n🌟 Small actions × millions of citizens = massive impact for our Steel City!`
  },
  // ── HELP / CONTACT ────────────────────────────────────────────────────────
  {
    id: 'help',
    patterns: ['help', 'contact', 'support', 'helpline', 'phone number', 'email', 'office', 'complaint', 'how do i', 'who to contact', 'not working', 'issue', 'problem'],
    response: `📞 **Need Help? Contact EcoSync Support**\n\n**For Technical Issues (App/Website):**\n→ Use the **Contact** page on EcoSync for direct support\n\n**For Waste Collection Complaints:**\n→ File a report on EcoSync Dashboard — fastest resolution\n→ JUSCO Customer Care for urgent matters\n\n**For Policy / Permit Queries:**\n→ **JNAC Office:** Bistupur, Jamshedpur\n→ Government working hours: Mon–Sat, 10AM–5PM\n\n**On EcoSync, the Admin team monitors:**\n• Overdue reports (> 48 hours)\n• Escalated complaints\n• Emergency broadcasts\n\n💡 **Quick Tip:** Using EcoSync's built-in reporting system gets you a tracking ID and is officially logged — much faster than calling!`
  },
  // ── UNKNOWN FALLBACK ──────────────────────────────────────────────────────
];

// ─────────────────────────────────────────────────────────────────────────────
// MATCHING ENGINE
// ─────────────────────────────────────────────────────────────────────────────
const findBestResponse = (userInput) => {
  const input = userInput.toLowerCase().trim();
  
  // Try to find the best matching intent by counting pattern matches
  let bestMatch = null;
  let bestScore = 0;

  for (const intent of KNOWLEDGE_BASE) {
    let score = 0;
    for (const pattern of intent.patterns) {
      if (input.includes(pattern)) {
        // Longer patterns = more specific = higher score
        score += pattern.split(' ').length;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = intent;
    }
  }

  if (bestMatch && bestScore > 0) {
    return bestMatch.response;
  }

  // No match — fallback response with suggestions
  return `🤔 I'm not sure about that specific topic yet. Here are things I **do** know about:\n\n• 🗑️ **Waste types** — plastic, organic, e-waste, hazardous, dry waste\n• 📸 **How to report** garbage piles\n• 📅 **Pickup scheduling** in Jamshedpur\n• ♻️ **Composting & recycling tips**\n• 🏙️ **JNAC/JUSCO zones** and drop-off centers\n• 🌟 **EcoPoints** and rewards\n• 🌿 **Eco-friendly living** tips\n\nTry asking something like: *"how do I report waste?"* or *"where to drop e-waste?"*`;
};

// ─────────────────────────────────────────────────────────────────────────────
// QUICK SUGGESTION CHIPS
// ─────────────────────────────────────────────────────────────────────────────
const QUICK_CHIPS = [
  'How to report waste?',
  'Schedule a pickup',
  'Classify plastic waste',
  'E-waste drop-off',
  'Earn EcoPoints',
  'Composting tips',
];

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I am **EcoBot**, your AI waste management assistant in Jamshedpur 🌿\n\nHow can I help you keep our Steel City clean today? You can ask me how to classify waste, report piles, or schedule pickups!"
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const sendMessage = (text) => {
    const content = text || inputValue;
    if (!content.trim()) return;

    const userMessage = { role: 'user', content: content.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay for natural feel
    const delay = 400 + Math.random() * 600;
    setTimeout(() => {
      const reply = findBestResponse(content);
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
      setIsTyping(false);
    }, delay);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  const handleReset = () => {
    setMessages([
      {
        role: 'assistant',
        content: "Hello again! I'm **EcoBot** 🌿 What would you like to know about waste management in Jamshedpur?"
      }
    ]);
    setInputValue('');
    setIsTyping(false);
  };

  // Render markdown-style bold text
  const renderContent = (text) => {
    return text.split('\n').map((line, lineIdx) => {
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts = [];
      let lastIndex = 0;
      let match;

      while ((match = boldRegex.exec(line)) !== null) {
        if (match.index > lastIndex) parts.push(line.substring(lastIndex, match.index));
        parts.push(
          <strong key={match.index} className="font-black text-emerald-600 dark:text-emerald-400">
            {match[1]}
          </strong>
        );
        lastIndex = boldRegex.lastIndex;
      }
      if (lastIndex < line.length) parts.push(line.substring(lastIndex));

      return (
        <p key={lineIdx} className={line === '' ? 'h-2' : ''}>
          {parts.length > 0 ? parts : line}
        </p>
      );
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.2)] border border-white/20 relative hover:shadow-primary/40 transition-all duration-300"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center"
            >
              <MessageCircle className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-zinc-900 animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute bottom-20 right-0 w-[340px] sm:w-[390px] h-[540px] bg-white/90 dark:bg-[#0d0e0d]/90 backdrop-blur-2xl rounded-[2rem] border border-border/80 shadow-[0_20px_60px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-primary p-5 text-primary-foreground flex items-center justify-between border-b border-white/10 relative overflow-hidden flex-shrink-0">
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm leading-tight">EcoBot Assistant</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-widest opacity-80">Jamshedpur · Always Online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 relative z-10">
                <button
                  onClick={handleReset}
                  title="Reset chat"
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-4 py-3 text-[11px] leading-relaxed space-y-0.5 ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-tr-sm shadow-sm'
                        : 'bg-muted/80 text-foreground border border-border/50 rounded-tl-sm'
                    }`}
                  >
                    {renderContent(msg.content)}
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted/80 border border-border/50 rounded-2xl rounded-tl-sm px-5 py-3 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Chips */}
            {messages.length <= 2 && !isTyping && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5 flex-shrink-0">
                {QUICK_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => sendMessage(chip)}
                    className="text-[10px] font-bold px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-primary-foreground transition-all whitespace-nowrap"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="p-3 border-t border-border bg-white/60 dark:bg-[#0d0e0d]/60 flex items-center gap-2 flex-shrink-0"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about waste, pickups, recycling..."
                className="flex-1 bg-muted border border-border/60 rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-primary/50 placeholder:opacity-50"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="w-9 h-9 bg-primary text-primary-foreground rounded-xl flex items-center justify-center hover:scale-[1.05] active:scale-[0.95] transition-all disabled:opacity-40 flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatWidget;
