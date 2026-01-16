function initPlanPage() {
    const toggleBtns = document.querySelectorAll('.toggle-btn');

    if (toggleBtns.length === 0) {
        return;
    }

    updatePrices('monthly');

    toggleBtns.forEach(btn => {
        btn.replaceWith(btn.cloneNode(true));
    });

    const newToggleBtns = document.querySelectorAll('.toggle-btn');
    newToggleBtns.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();

            newToggleBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const period = this.dataset.period;
            updatePrices(period);
        });
    });

    const planBtns = document.querySelectorAll('.card-btn[data-plan]');
    planBtns.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();

            const plan = this.dataset.plan;
            const activeToggle = document.querySelector('.toggle-btn.active');
            const period = activeToggle ? activeToggle.dataset.period : 'monthly';

            this.classList.add('loading');

            setTimeout(() => {
                this.classList.remove('loading');

                if (plan === 'enterprise') {
                    window.location.href = '/contact?plan=enterprise';
                } else {
                    window.location.href = `/checkout?plan=${plan}&period=${period}`;
                }
            }, 1000);
        });
    });
}

function updatePrices(period) {
    const priceUnits = document.querySelectorAll('.price-unit');
    priceUnits.forEach(unit => {
        if (unit) {
            unit.textContent = period === 'annual' ? '/year' : '/month';
        }
    });

    const originalPrices = document.querySelectorAll('.original-price');
    originalPrices.forEach(price => {
        if (price && price.dataset) {
            const periodPrice = price.dataset[period];
            if (periodPrice) {
                price.textContent = periodPrice;
                price.style.display = 'inline';
            } else {
                price.style.display = 'none';
            }
        }
    });

    const discountedPrices = document.querySelectorAll('.discounted-price');
    discountedPrices.forEach(price => {
        if (price && price.dataset) {
            const periodPrice = price.dataset[period];
            if (periodPrice) {
                price.textContent = periodPrice;
            }
        }
    });

    const cardOffers = document.querySelectorAll('.card-offer');
    cardOffers.forEach((offer, index) => {
        if (!offer) return;

        if (period === 'annual') {
            if (index === 0) {
                offer.textContent = 'Save up to 10% with annual billing';
            } else if (index === 1) {
                offer.textContent = 'Save up to 15% with annual billing';
            } else if (index === 2) {
                offer.textContent = 'Save up to 25% with annual billing';
            }
        } else {
            if (index === 0) {
                offer.textContent = 'Save up to 10% with offer';
            } else if (index === 1) {
                offer.textContent = 'Save up to 15% with offer';
            } else if (index === 2) {
                offer.textContent = 'Save up to 25% with offer';
            }
        }
    });
}

window.initPlanPage = initPlanPage;
