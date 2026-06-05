public/js/script.js
(function() {
    'use strict';
    const API_BASE = '/api';

    // ============ THEME TOGGLE ============
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    const savedTheme = localStorage.getItem('anox-theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);
    themeToggle.addEventListener('click', () => {
        const current = html.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('anox-theme', next);
    });

    // ============ NAVIGATION ============
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    });
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // ============ HERO SPLIT ANIMATION ============
    const heroVisual = document.getElementById('heroVisual');
    const splitLeft = document.getElementById('splitLeft');
    const splitRight = document.getElementById('splitRight');
    const dividerLine = document.getElementById('dividerLine');
    const dividerHandle = document.getElementById('dividerHandle');
    let splitPosition = 50, isDraggingHero = false, autoAnimActive = true, autoAnimDirection = 1;

    function updateHeroSplit(pos) {
        splitPosition = Math.max(15, Math.min(85, pos));
        splitLeft.style.flex = splitPosition;
        splitRight.style.flex = (100 - splitPosition);
        dividerLine.style.left = splitPosition + '%';
        dividerHandle.style.left = splitPosition + '%';
    }
    function autoAnimateSplit() {
        if (!autoAnimActive || isDraggingHero) return;
        splitPosition += autoAnimDirection * 0.3;
        if (splitPosition >= 70 || splitPosition <= 30) autoAnimDirection *= -1;
        updateHeroSplit(splitPosition);
        requestAnimationFrame(() => setTimeout(autoAnimateSplit, 40));
    }
    autoAnimateSplit();
    dividerHandle.addEventListener('mousedown', (e) => { isDraggingHero = true; autoAnimActive = false; e.preventDefault(); });
    dividerHandle.addEventListener('touchstart', () => { isDraggingHero = true; autoAnimActive = false; });
    document.addEventListener('mousemove', (e) => { if(!isDraggingHero) return; const rect = heroVisual.getBoundingClientRect(); updateHeroSplit(((e.clientX - rect.left) / rect.width) * 100); });
    document.addEventListener('touchmove', (e) => { if(!isDraggingHero) return; const rect = heroVisual.getBoundingClientRect(); updateHeroSplit(((e.touches[0].clientX - rect.left) / rect.width) * 100); });
    document.addEventListener('mouseup', () => { if(isDraggingHero){ isDraggingHero = false; setTimeout(()=>{autoAnimActive=true; autoAnimateSplit();}, 2000); }});
    document.addEventListener('touchend', () => { if(isDraggingHero){ isDraggingHero = false; setTimeout(()=>{autoAnimActive=true; autoAnimateSplit();}, 2000); }});

    // ============ COMPARISON SLIDER ============
    const comparisonContainer = document.getElementById('comparisonContainer');
    const imgBefore = document.getElementById('imgBefore');
    const sliderHandle = document.getElementById('sliderHandle');
    const sliderKnob = document.getElementById('sliderKnob');
    let isDraggingComparison = false;
    function updateComparison(pos) { const c=Math.max(5,Math.min(95,pos)); imgBefore.style.clipPath=`inset(0 ${100-c}% 0 0)`; sliderHandle.style.left=c+'%'; sliderKnob.style.left=c+'%'; }
    comparisonContainer.addEventListener('mousedown', (e) => { isDraggingComparison=true; e.preventDefault(); updateComparison(((e.clientX-comparisonContainer.getBoundingClientRect().left)/comparisonContainer.getBoundingClientRect().width)*100); });
    comparisonContainer.addEventListener('touchstart', (e) => { isDraggingComparison=true; updateComparison(((e.touches[0].clientX-comparisonContainer.getBoundingClientRect().left)/comparisonContainer.getBoundingClientRect().width)*100); });
    document.addEventListener('mousemove', (e) => { if(!isDraggingComparison) return; updateComparison(((e.clientX-comparisonContainer.getBoundingClientRect().left)/comparisonContainer.getBoundingClientRect().width)*100); });
    document.addEventListener('touchmove', (e) => { if(!isDraggingComparison) return; updateComparison(((e.touches[0].clientX-comparisonContainer.getBoundingClientRect().left)/comparisonContainer.getBoundingClientRect().width)*100); });
    document.addEventListener('mouseup', ()=>{isDraggingComparison=false;});
    document.addEventListener('touchend', ()=>{isDraggingComparison=false;});
    updateComparison(50);

    // ============ STATS COUNTER ============
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if(entry.isIntersecting) { const el=entry.target; const target=parseInt(el.getAttribute('data-count')); const suffix=el.textContent.includes('%')?'%':(el.textContent.includes('+')?'+':''); let c=0; const d=1500, st=performance.now(); function anim(now){ const p=Math.min((now-st)/d,1); c=Math.round(target*(1-Math.pow(1-p,3))); el.textContent=c+suffix; if(p<1) requestAnimationFrame(anim); else el.textContent=target+suffix; } requestAnimationFrame(anim); statsObserver.unobserve(el); }});
    }, {threshold:0.5});
    statNumbers.forEach(el=>statsObserver.observe(el));

    // ============ FAQ ============
    document.querySelectorAll('.faq-question').forEach(q => { q.addEventListener('click', function(){ const item=this.parentElement; const wasOpen=item.classList.contains('open'); document.querySelectorAll('.faq-item.open').forEach(i=>i.classList.remove('open')); if(!wasOpen) item.classList.add('open'); }); });

    // ============ MODAL ============
    const modalOverlay = document.getElementById('modalOverlay');
    const modalClose = document.getElementById('modalClose');
    function openModal(type) { modalOverlay.classList.add('active'); document.body.style.overflow='hidden'; document.getElementById('modalTitle').textContent = type==='demo'?'Book a Demo':'Get Started'; }
    function closeModal() { modalOverlay.classList.remove('active'); document.body.style.overflow=''; document.getElementById('modalMessage').textContent=''; document.getElementById('modalForm').reset(); }
    document.getElementById('bookDemoBtn').addEventListener('click', ()=>openModal('demo'));
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e)=>{ if(e.target===modalOverlay) closeModal(); });
    document.addEventListener('keydown', (e)=>{ if(e.key==='Escape'&&modalOverlay.classList.contains('active')) closeModal(); });

    // ============ TOAST ============
    function showToast(message, type='info') { const container=document.getElementById('toastContainer'); const toast=document.createElement('div'); toast.className=`toast ${type}`; toast.textContent=message; container.appendChild(toast); setTimeout(()=>{toast.style.opacity='0'; toast.style.transition='opacity 0.3s'; setTimeout(()=>toast.remove(),300);},3500); }

    // ============ API CALLS ============
    async function apiCall(url, method='GET', data=null) {
        const opts = { method, headers:{'Content-Type':'application/json'} };
        if(data) opts.body = JSON.stringify(data);
        const res = await fetch(API_BASE + url, opts);
        const json = await res.json();
        if(!res.ok) throw new Error(json.message || 'Something went wrong');
        return json;
    }

    // Signup form
    document.getElementById('signupForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const msgEl = document.getElementById('signupMessage');
        const email = document.getElementById('signupEmail').value;
        msgEl.textContent = ''; msgEl.className = 'form-message';
        try {
            const res = await apiCall('/signup', 'POST', { email });
            msgEl.textContent = res.message || '✅ Welcome to ANOX!';
            msgEl.className = 'form-message success';
            this.reset();
            showToast('Welcome to ANOX! Check your email.','success');
        } catch(err) {
            msgEl.textContent = err.message;
            msgEl.className = 'form-message error';
            showToast(err.message,'error');
        }
    });

    // Contact form
    document.getElementById('contactForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const msgEl = document.getElementById('contactMessage');
        const data = {
            name: document.getElementById('contactName').value,
            email: document.getElementById('contactEmail').value,
            company: document.getElementById('contactCompany').value,
            message: document.getElementById('contactMessage').value
        };
        msgEl.textContent = ''; msgEl.className = 'form-message';
        try {
            const res = await apiCall('/contact', 'POST', data);
            msgEl.textContent = res.message || '✅ Message sent!';
            msgEl.className = 'form-message success';
            this.reset();
            showToast('Message sent successfully!','success');
        } catch(err) {
            msgEl.textContent = err.message;
            msgEl.className = 'form-message error';
            showToast(err.message,'error');
        }
    });

    // Modal form (demo)
    document.getElementById('modalForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const msgEl = document.getElementById('modalMessage');
        const data = {
            name: document.getElementById('modalName').value,
            email: document.getElementById('modalEmail').value,
            company: document.getElementById('modalCompany').value,
            message: 'Demo request from modal'
        };
        msgEl.textContent = ''; msgEl.className = 'form-message';
        try {
            const res = await apiCall('/contact', 'POST', data);
            msgEl.textContent = '✅ Demo booked! We\'ll reach out shortly.';
            msgEl.className = 'form-message success';
            showToast('Demo request submitted!','success');
            setTimeout(closeModal, 2000);
        } catch(err) {
            msgEl.textContent = err.message;
            msgEl.className = 'form-message error';
            showToast(err.message,'error');
        }
    });

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(a => { a.addEventListener('click', function(e){ const t=document.querySelector(this.getAttribute('href')); if(t){ e.preventDefault(); t.scrollIntoView({behavior:'smooth',block:'start'}); } }); });

    console.log('🚀 ANOX — AI Product Photography & Video Studio — Ready');
})();
