class Slider {
    constructor(container) {
        this.container = container;
        this.slides = Array.from(container.querySelectorAll('.slide'));
        this.dots = Array.from(container.querySelectorAll('.slider-dot'));
        this.prevBtn = container.querySelector('.prev');
        this.nextBtn = container.querySelector('.next');
        this.currentSlide = 0;
        this.touchStartX = 0;
        this.touchEndX = 0;

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.showSlide(this.currentSlide);

        // Добавляем тач-обработчики
        this.container.addEventListener('touchstart', this.handleTouchStart.bind(this));
        this.container.addEventListener('touchend', this.handleTouchEnd.bind(this));
    }

    handleTouchStart(e) {
        this.touchStartX = e.changedTouches[0].screenX;
    }

    handleTouchEnd(e) {
        this.touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe();
    }

    handleSwipe() {
        const minSwipeDistance = 50;
        const swipeDistance = this.touchStartX - this.touchEndX;

        if (Math.abs(swipeDistance) < minSwipeDistance) return;

        if (swipeDistance > 0) {
            this.next();
        } else {
            this.prev();
        }
    }

    showSlide(index) {
        this.slides.forEach(slide => slide.classList.remove('active'));
        this.dots.forEach(dot => dot.classList.remove('active'));
        this.currentSlide = (index + this.slides.length) % this.slides.length;
        this.slides[this.currentSlide].classList.add('active');
        this.dots[this.currentSlide].classList.add('active');
    }

    next() {
        this.showSlide(this.currentSlide + 1);
    }

    prev() {
        this.showSlide(this.currentSlide - 1);
    }

    setupEventListeners() {
        this.nextBtn.addEventListener('click', () => this.next());
        this.prevBtn.addEventListener('click', () => this.prev());

        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.showSlide(index));
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const sliders = Array.from(document.querySelectorAll('.slider')).map(
        slider => new Slider(slider)
    );

    document.addEventListener('click', function(event) {
        const tabsContainer = event.target.closest('.tabs');
        if (!tabsContainer) return;

        const clickedElement = event.target.closest('[id]');
        if (!clickedElement || !clickedElement.id) return;

        document.querySelectorAll('.tab-content').forEach(element => {
            element.classList.remove('active');
        });

        document.querySelector(`[data-id="${clickedElement.id}"]`).classList.add('active');
    });

    document.addEventListener('click', e => {
        if (!e.target.closest('.modal-close')) return;
        const modal = e.target.closest('.modal');
        modalClose(modal);
    });
    function modalClose(e) {
        e.classList.remove('active');
        document.querySelector('.modal-bg').classList.remove('active');
    }
    function modalInit(e) {
        const modal = document.getElementById(e);
        modal.classList.add('active');
        document.querySelector('.modal-bg').classList.add('active');
    }

    const form = document.getElementById('action-form');
    const nameInput = form.querySelector('#name');
    const phoneInput = form.querySelector('#phone');
    const checkbox = form.querySelector('input[type="checkbox"]');

    function handlePhoneInput(event) {
        const selectionStart = phoneInput.selectionStart;

        let numbers = phoneInput.value.replace(/\D/g, '');
        if (numbers.startsWith('7') && numbers.length === 1) numbers = '7';
        if (!numbers.startsWith('7')) numbers = '7' + numbers;

        if (numbers.length > 11) numbers = numbers.substring(0, 11);

        let formatted = '+7';
        if (numbers.length > 1) {
            formatted += ' (' + numbers.substring(1, 4);
        }
        if (numbers.length >= 4) {
            formatted += ') ' + numbers.substring(4, 7);
        }
        if (numbers.length >= 7) {
            formatted += '-' + numbers.substring(7, 9);
        }
        if (numbers.length >= 9) {
            formatted += '-' + numbers.substring(9, 11);
        }

        phoneInput.value = formatted;

        const isAdding = (event.inputType &&
                event.inputType.includes('insert')) ||
            numbers.length < phoneInput.value.length;

        if (isAdding) {
            const newPosition = formatted.length;
            phoneInput.setSelectionRange(newPosition, newPosition);
        } else {
            phoneInput.setSelectionRange(selectionStart, selectionStart);
        }
    }

    phoneInput.addEventListener('input', handlePhoneInput);
    phoneInput.addEventListener('keydown', function(e) {
        // Блокируем удаление первых символов
        if ([8, 46].includes(e.keyCode) && phoneInput.selectionStart < 4) {
            e.preventDefault();
        }
    });
    document.getElementById('action-form').addEventListener('submit', async function(e) {
        e.preventDefault();

        function showError(errorElement) {
            errorElement.classList.add('error');
        }

        function hideError(errorElement) {
            errorElement.classList.remove('error');
        }

        function validateForm() {
            let isValid = true;

            const nameValue = nameInput.value.trim();
            if (!nameValue) {
                showError(nameInput);
                isValid = false;
            } else {
                hideError(nameInput);
            }

            const phoneValue = phoneInput.value.replace(/\D/g, '');
            if (phoneValue.length < 10) {
                showError(phoneInput);
                isValid = false;
            } else {
                hideError(phoneInput);
            }

            if (!checkbox.checked) {
                showError(checkbox.parentElement);
                isValid = false;
            } else {
                hideError(checkbox.parentElement);
            }

            return isValid;
        }

        if (validateForm()) {
            const formData = {
                name: nameInput.value.trim(),
                phone: phoneInput.value.replace(/\D/g, '')
            };

            console.log('Данные формы:', formData);

            form.reset();
            modalInit('form-modal')
        }
    });
});