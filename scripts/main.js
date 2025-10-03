(function(){
	const bySel = (s, r=document) => r.querySelector(s);
	const bySelAll = (s, r=document) => Array.from(r.querySelectorAll(s));

	// Current year
	const yearEl = bySel('#year');
	if (yearEl) yearEl.textContent = new Date().getFullYear();

	// Mobile nav toggle
	const toggle = bySel('.nav-toggle');
	const menu = bySel('#nav-menu');
	if (toggle && menu) {
		toggle.addEventListener('click', () => {
			const next = !(toggle.getAttribute('aria-expanded') === 'true');
			toggle.setAttribute('aria-expanded', String(next));
			menu.classList.toggle('open', next);
		});
	}

	// Theme toggle removed

	// Smooth anchor scroll fallback for browsers without CSS smooth-scroll (optional)
	bySelAll('a[href^="#"]').forEach(a => {
		a.addEventListener('click', e => {
			const id = a.getAttribute('href');
			if (!id || id === '#') return;
			const target = bySel(id);
			if (!target) return;
			// Let CSS handle if supported
			if ('scrollBehavior' in document.documentElement.style) return;
			e.preventDefault();
			window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 72, behavior: 'smooth' });
		});
	});

	// Filtering
	const filterButtons = bySelAll('.filter');
	const cards = bySelAll('#portfolio-grid .card');
	function applyFilter(key) {
		cards.forEach(card => {
			if (key === 'all') { card.style.display = ''; return; }
			const cats = (card.getAttribute('data-cats') || '').split(',').map(s => s.trim());
			card.style.display = cats.includes(key) ? '' : 'none';
		});
	}
	filterButtons.forEach(btn => {
		btn.addEventListener('click', () => {
			filterButtons.forEach(b => b.classList.remove('is-active'));
			btn.classList.add('is-active');
			applyFilter(btn.getAttribute('data-filter'));
		});
	});

	// Lightbox (very small)
	const links = bySelAll('a.lightbox');
	if (links.length) {
		const overlay = document.createElement('div');
		overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.75);display:none;align-items:center;justify-content:center;z-index:100;';
		const frame = document.createElement('div');
		frame.style.cssText = 'background:#fff;border-radius:12px;border:1px solid rgba(0,0,0,.08);box-shadow:0 20px 60px rgba(0,0,0,.35);padding:10px;max-width:92%;max-height:92%;display:flex;flex-direction:column;align-items:center;';
		const img = document.createElement('img');
		img.style.maxWidth = '100%';
		img.style.maxHeight = '76vh';
		const cap = document.createElement('div');
		cap.style.cssText = 'color:#1b1f24;margin-top:10px;text-align:center;';
		frame.appendChild(img); frame.appendChild(cap);
		overlay.appendChild(frame);
		document.body.appendChild(overlay);
		function close(){ overlay.style.display = 'none'; img.src = ''; cap.textContent=''; }
		overlay.addEventListener('click', close);
		links.forEach(a => {
			a.addEventListener('click', e => {
				e.preventDefault();
				img.src = a.getAttribute('href');
				cap.textContent = a.getAttribute('data-title') || '';
				overlay.style.display = 'flex';
			});
		});
	}

	// On-scroll reveal animations
	const revealables = [];
	function markRevealables(){
		['.hero .container', '.section .container', '#portfolio-grid .card'].forEach(sel => {
			bySelAll(sel).forEach(el => {
				if (!el.classList.contains('reveal')) el.classList.add('reveal');
				revealables.push(el);
			});
		});
	}
	markRevealables();

	const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	if (!prefersReduced && 'IntersectionObserver' in window) {
		const io = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					entry.target.classList.add('in');
					io.unobserve(entry.target);
				}
			});
		}, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
		revealables.forEach(el => io.observe(el));
	} else {
		// If reduced motion or no IO, show immediately
		revealables.forEach(el => el.classList.add('in'));
	}
})();
