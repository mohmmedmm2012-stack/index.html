document.addEventListener('DOMContentLoaded', () => {
    // الحصول على جميع الأزرار التي تفتح النوافذ
    const modalTriggers = document.querySelectorAll('.modal-trigger');
    const searchInput = document.querySelector('#brand-search');
    const clearSearch = document.querySelector('.clear-search');
    const searchStatus = document.querySelector('.search-status');
    const searchResults = document.querySelector('.search-results');
    const buttonsContainer = document.querySelector('.buttons-container');
    const noResults = document.querySelector('.no-results');
    
    // الحصول على جميع أزرار الإغلاق
    const modalCloses = document.querySelectorAll('.modal-close');

    const closeModal = modal => {
        modal.classList.remove('is-open');
        document.body.classList.remove('modal-open');
    };

    const normalizeText = text => text.trim().toLocaleLowerCase('ar');

    const openModal = modal => {
        if (modal) {
            modal.classList.add('is-open');
            document.body.classList.add('modal-open');
        }
    };

    const createSnippet = (text, query) => {
        const cleanText = text.replace(/\s+/g, ' ').trim();
        const matchIndex = normalizeText(cleanText).indexOf(query);
        if (matchIndex < 0) {
            return cleanText.slice(0, 150);
        }

        const start = Math.max(0, matchIndex - 55);
        return `${start > 0 ? '... ' : ''}${cleanText.slice(start, start + 150)}${start + 150 < cleanText.length ? ' ...' : ''}`;
    };

    const searchScreens = () => {
        const query = normalizeText(searchInput.value);
        searchResults.replaceChildren();

        clearSearch.hidden = query.length === 0;
        buttonsContainer.hidden = query.length > 0;

        if (!query) {
            noResults.hidden = true;
            searchStatus.textContent = `إجمالي المنتجات: ${modalTriggers.length}`;
            return;
        }

        const matches = Array.from(modalTriggers).filter(trigger => {
            const modal = document.querySelector(trigger.dataset.modalTarget);
            return modal && normalizeText(modal.textContent).includes(query);
        });

        matches.forEach(trigger => {
            const modal = document.querySelector(trigger.dataset.modalTarget);
            const result = document.createElement('article');
            result.className = 'search-result';
            result.tabIndex = 0;
            result.innerHTML = `<span class="search-result-title">${trigger.textContent.trim()}</span><span class="search-result-snippet">${createSnippet(modal.textContent, query)}</span>`;
            result.addEventListener('click', () => openModal(modal));
            result.addEventListener('keydown', event => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    openModal(modal);
                }
            });
            searchResults.append(result);
        });

        noResults.hidden = matches.length !== 0;
        searchStatus.textContent = `تم العثور على ${matches.length} شاشة تحتوي على: ${searchInput.value.trim()}`;
    };

    searchInput.addEventListener('input', searchScreens);
    clearSearch.addEventListener('click', () => {
        searchInput.value = '';
        searchScreens();
        searchInput.focus();
    });
    searchScreens();

    // إضافة حدث النقر لكل زر لفتح النافذة المناسبة
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const modalId = trigger.getAttribute('data-modal-target');
            const modal = document.querySelector(modalId);
            openModal(modal);
        });
    });

    // إضافة حدث النقر لكل زر إغلاق
    modalCloses.forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            closeModal(closeBtn.closest('.modal'));
        });
    });

    // إغلاق النافذة عند النقر خارجها
    window.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal')) {
            closeModal(event.target);
        }
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
            const openModal = document.querySelector('.modal.is-open');
            if (openModal) {
                closeModal(openModal);
            }
        }
    });
});