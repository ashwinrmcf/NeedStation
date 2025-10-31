# Worker Dashboard Hindi Translation - TODO

## 📋 Overview

The Worker Dashboard consists of 5 major pages that need Hindi translation:
1. Overview (Dashboard Home)
2. Upcoming Tasks
3. Completed Tasks
4. Earnings & Payment
5. Settings

## 🎯 Current Status

### ✅ Completed
- Hindi Worker Login page (`/hi/worker-login`)
- Route structure ready in `main.jsx`

### ⏳ Pending Translation
All Worker Dashboard pages need Hindi versions created.

---

## 📁 File Structure Needed

```
src/pages/Hindi/WorkerDashboard/
├── Overview.jsx          (Dashboard home with stats)
├── UpcomingTasks.jsx     (Active bookings list)
├── CompletedTasks.jsx    (Completed bookings history)
├── Earnings.jsx          (Payment and earnings info)
└── Settings.jsx          (Worker profile settings)
```

---

## 🔤 Key Translations Needed

### Common Terms
- **Dashboard** → डैशबोर्ड
- **Overview** → अवलोकन
- **Upcoming Tasks** → आगामी कार्य
- **Completed Tasks** → पूर्ण कार्य
- **Earnings** → कमाई
- **Payment** → भुगतान
- **Settings** → सेटिंग्स
- **Profile** → प्रोफ़ाइल
- **Logout** → लॉगआउट

### Status Terms
- **Pending** → लंबित
- **Accepted** → स्वीकृत
- **In Progress** → प्रगति में
- **Completed** → पूर्ण
- **Cancelled** → रद्द

### Action Buttons
- **Accept** → स्वीकार करें
- **Reject** → अस्वीकार करें
- **Start Task** → कार्य शुरू करें
- **Complete Task** → कार्य पूर्ण करें
- **View Details** → विवरण देखें
- **Contact Customer** → ग्राहक से संपर्क करें

### Stats & Metrics
- **Total Earnings** → कुल कमाई
- **Active Tasks** → सक्रिय कार्य
- **Completed Today** → आज पूर्ण
- **Rating** → रेटिंग
- **Reviews** → समीक्षाएं
- **This Month** → इस महीने
- **This Week** → इस सप्ताह

---

## 🚀 Implementation Approach

### Option 1: Full Translation (Recommended)
Create separate Hindi components for each dashboard page with complete translation.

**Pros:**
- Clean separation of concerns
- Better maintainability
- Proper Hindi UX

**Cons:**
- More files to create
- Takes more time

### Option 2: Translation Service
Use a translation context/service to translate existing pages dynamically.

**Pros:**
- Faster implementation
- Single codebase

**Cons:**
- May have layout issues with longer Hindi text
- Less control over UX

---

## 📝 Translation Priority

### High Priority (Core Functionality)
1. ✅ Worker Login
2. ⏳ Overview/Dashboard
3. ⏳ Upcoming Tasks
4. ⏳ Completed Tasks

### Medium Priority
5. ⏳ Earnings & Payment
6. ⏳ Settings

---

## 🔗 Routes Needed in main.jsx

```javascript
// Worker Dashboard Hindi Routes
{
  path: "/hi/helper",
  element: <WorkerDashboardLayout />,
  children: [
    { path: "overview", element: <HindiWorkerOverview /> },
    { path: "upcoming-tasks", element: <HindiUpcomingTasks /> },
    { path: "completed-tasks", element: <HindiCompletedTasks /> },
    { path: "earnings", element: <HindiEarnings /> },
    { path: "settings", element: <HindiSettings /> },
  ]
}
```

---

## 💡 Recommendations

### For Quick Implementation:
1. Start with Overview page (most important)
2. Then Upcoming Tasks (most used feature)
3. Reuse existing CSS modules
4. Focus on UI text translation first
5. Handle API responses in English (backend unchanged)

### For Best UX:
1. Create dedicated Hindi components
2. Adjust layouts for longer Hindi text
3. Test on mobile devices
4. Ensure proper font rendering (Devanagari)
5. Add proper date/time formatting for Hindi locale

---

## 🎨 Design Considerations

### Text Length
Hindi text is typically **20-30% longer** than English. Ensure:
- Buttons have `min-width` and `white-space: nowrap`
- Cards have flexible widths
- Tables have proper column sizing
- Mobile layouts handle text overflow

### Font Support
Ensure proper Devanagari font is loaded:
```css
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap');
```

---

## 📊 Estimated Effort

| Page | Lines of Code | Estimated Time |
|------|--------------|----------------|
| Overview | ~500 lines | 2-3 hours |
| Upcoming Tasks | ~600 lines | 3-4 hours |
| Completed Tasks | ~500 lines | 2-3 hours |
| Earnings | ~400 lines | 2-3 hours |
| Settings | ~600 lines | 3-4 hours |
| **Total** | **~2600 lines** | **12-17 hours** |

---

## 🔄 Next Steps

1. **Immediate**: Create Hindi Overview page
2. **Short-term**: Create Upcoming Tasks page
3. **Medium-term**: Complete remaining pages
4. **Testing**: Test all pages with real Hindi users
5. **Polish**: Fix layout issues and improve UX

---

## 📞 Current Implementation Status

### What's Working:
- ✅ Hindi homepage (`/hi`)
- ✅ Hindi services page (`/hi/services`)
- ✅ Hindi login/signup (`/hi/login`, `/hi/signup`)
- ✅ Hindi worker login (`/hi/worker-login`)
- ✅ Hindi footer pages (About, Contact, FAQ, etc.)

### What's Needed:
- ⏳ Worker Dashboard pages in Hindi
- ⏳ Worker Dashboard navigation in Hindi
- ⏳ Worker Dashboard sidebar in Hindi

---

## 🎯 Success Criteria

- [ ] All dashboard pages accessible via `/hi/helper/*` routes
- [ ] All UI text translated to Hindi
- [ ] Layouts work properly with Hindi text
- [ ] Navigation and sidebar in Hindi
- [ ] No text overflow or layout breaking
- [ ] Proper date/time/currency formatting
- [ ] Mobile responsive

---

**Note**: This is a substantial amount of work. Consider prioritizing the most critical pages first (Overview and Upcoming Tasks) and implementing the rest incrementally.
