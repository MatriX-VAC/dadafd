document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.getElementById('preloader');
    const introSection = document.getElementById('intro');
    const startBtn = document.getElementById('start-btn');
    const sections = document.querySelectorAll('section[id]');
    const contentSections = Array.from(sections).filter(section => section.id !== 'intro');

    // --- 1. Прелоадер ---
    setTimeout(() => {
        preloader.classList.add('hidden');
        introSection.classList.add('visible');
    }, 4000);

    // --- ФУНКЦИЯ АВТОМАТИЧЕСКОГО СКРОЛЛА ---
    function scrollToNextSection(targetElement) {
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    // --- 2. Обработка нажатия кнопки "Открыть" ---
    startBtn.addEventListener('click', () => {
        introSection.classList.remove('visible');
        startBtn.style.display = 'none';
        introSection.querySelector('.intro-subtitle').style.display = 'none';

        if (contentSections.length > 0) {
            const nextSection = contentSections[0];
            nextSection.classList.add('visible');

            setTimeout(() => {
                scrollToNextSection(nextSection);
            }, 500);
        }
    });

    // --- 3. Плавное появление остальных секций при скролле ---
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('visible')) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.2 });

    contentSections.forEach(section => {
        observer.observe(section);
    });

    // --- 4. Интерактивные круги ---
    const circlesContainer = document.querySelector('.interactive-circles-container');
    if (circlesContainer) {
        document.addEventListener('mousemove', (e) => {
            const circle = document.createElement('div');
            const size = Math.random() * 15 + 5;
            circle.style.width = `${size}px`;
            circle.style.height = `${size}px`;
            circle.style.left = `${e.clientX}px`;
            circle.style.top = `${e.clientY}px`;

            const colors = ['#FFB6C1', '#FF69B4', '#FFC0CB', '#FF1493', '#FFD1DC'];
            circle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

            circle.classList.add('circle-effect');
            circlesContainer.appendChild(circle);

            setTimeout(() => {
                if (circle.parentNode) {
                    circle.remove();
                }
            }, 1200);
        });
    }

    // --- 5. Анимация появления элементов в секции про киску ---
    function initKittySectionAnimation() {
        const kittySection = document.getElementById('kitty-love');
        if (!kittySection) return;
        
        const textParts = document.querySelectorAll('.kitty-text-part');
        const judges = document.querySelector('.tg-judges');
        
        const kittyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Показываем первую часть текста
                    setTimeout(() => {
                        if (textParts[0]) textParts[0].classList.add('visible');
                    }, 300);
                    
                    // Показываем судей
                    setTimeout(() => {
                        if (judges) judges.classList.add('visible');
                    }, 1000);
                    
                    // Показываем вторую часть текста
                    setTimeout(() => {
                        if (textParts[1]) textParts[1].classList.add('visible');
                    }, 1800);
                    
                    kittyObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        kittyObserver.observe(kittySection);
    }

    // --- 6. Анимация списка благодарностей ---
    function initThanksListAnimation() {
        const thanksSection = document.getElementById('friendship-thanks');
        if (!thanksSection) return;
        
        const listItems = document.querySelectorAll('.thanks-list li');
        
        const thanksObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    listItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateX(0)';
                        }, index * 300);
                    });
                    thanksObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        thanksObserver.observe(thanksSection);
    }

    // --- 7. Анимация для секции воспоминаний ---
    function initMemoryAnimation() {
        const memorySection = document.getElementById('new-year-memory');
        if (!memorySection) return;
        
        const memoryObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const items = entry.target.querySelectorAll('.atmosphere-item, .stat-box, .report-item, .next-item');
                    
                    items.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('visible');
                        }, index * 150);
                    });
                    
                    memoryObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        memoryObserver.observe(memorySection);
    }

    // --- 8. Инициализируем все анимации ---
    setTimeout(() => {
        initKittySectionAnimation();
        initThanksListAnimation();
        initMemoryAnimation();
    }, 1000);
    
    // --- 9. Управление видео в кругляшах ---
    document.querySelectorAll('.judge-video-circle').forEach(circle => {
        const video = circle.querySelector('video');
        const playBtn = circle.querySelector('.judge-play-btn');
        
        circle.addEventListener('click', (e) => {
            e.stopPropagation();
            
            if (video.paused) {
                video.play();
                playBtn.textContent = '⏸';
            } else {
                video.pause();
                playBtn.textContent = '▶';
            }
        });
        
        // Прячем кнопку при воспроизведении
        video.addEventListener('play', () => {
            playBtn.style.opacity = '0';
        });
        
        video.addEventListener('pause', () => {
            playBtn.style.opacity = '1';
        });
    });

    // --- 10. Увеличение скриншота при клике ---
    document.querySelectorAll('.judge-image-circle').forEach(circle => {
        circle.addEventListener('click', (e) => {
            e.stopPropagation();
            circle.classList.toggle('zoomed');
            
            // Если увеличили, добавляем обработчик для закрытия по клику вне
            if (circle.classList.contains('zoomed')) {
                setTimeout(() => {
                    const closeZoom = (e) => {
                        if (!circle.contains(e.target)) {
                            circle.classList.remove('zoomed');
                            document.removeEventListener('click', closeZoom);
                        }
                    };
                    document.addEventListener('click', closeZoom);
                }, 10);
            }
        });
    });

    // --- 11. Закрытие увеличенного скрина по ESC ---
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.judge-image-circle.zoomed').forEach(circle => {
                circle.classList.remove('zoomed');
            });
        }
    });

    // --- 12. Предзагрузка видео (опционально) ---
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        video.addEventListener('loadeddata', () => {
            video.style.opacity = '1';
        });
        
        // Устанавливаем начальную прозрачность
        video.style.opacity = '0';
        video.style.transition = 'opacity 0.5s ease';
    });
});