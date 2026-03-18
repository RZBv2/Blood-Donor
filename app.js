class BloodDonorApp {
    constructor() {
        this.donors = [];
        this.currentView = 'search';
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadDonorsFromLocalStorage();
    }
    
    setupEventListeners() {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchView(e.currentTarget.dataset.view);
            });
        });
        
        document.getElementById('searchBtn').addEventListener('click', () => {
            this.handleSearch();
        });
        
        document.getElementById('areaSelect').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSearch();
            }
        });
        
        document.getElementById('registerForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });
    }
    
    switchView(view) {
        this.currentView = view;
        
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });
        
        document.querySelectorAll('.view').forEach(v => {
            v.classList.toggle('active', v.id === `${view}View`);
        });
        
        const message = document.getElementById('registerMessage');
        if (message) {
            message.style.display = 'none';
        }
    }
    
    handleSearch() {
        const bloodGroup = document.getElementById('bloodGroupSelect').value;
        const area = document.getElementById('areaSelect').value;
        
        const resultsContent = document.getElementById('resultsContent');
        
        if (!bloodGroup && !area) {
            resultsContent.innerHTML = `
                <p class="no-results" data-en="Please select at least one filter" data-bn="অন্তত একটি ফিল্টার নির্বাচন করুন">
                    ${languageManager.getText('Please select at least one filter', 'অন্তত একটি ফিল্টার নির্বাচন করুন')}
                </p>
            `;
            languageManager.updatePageLanguage();
            return;
        }
        
        resultsContent.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                <p data-en="Searching for donors..." data-bn="রক্তদাতা খুঁজছি...">
                    ${languageManager.getText('Searching for donors...', 'রক্তদাতা খুঁজছি...')}
                </p>
            </div>
        `;
        
        setTimeout(() => {
            this.displayResults(bloodGroup, area);
        }, 500);
    }
    
    displayResults(bloodGroup, area) {
        const resultsContent = document.getElementById('resultsContent');
        
        let filtered = this.donors;
        
        if (bloodGroup) {
            filtered = filtered.filter(d => d.blood_group === bloodGroup);
        }
        
        if (area) {
            filtered = filtered.filter(d => d.city === area);
        }
        
        if (filtered.length === 0) {
            resultsContent.innerHTML = `
                <p class="no-results" data-en="No donors found matching your criteria. Consider registering as a donor!" data-bn="আপনার মানদণ্ড অনুযায়ী কোনো রক্তদাতা পাওয়া যাচ্ছে না। রক্তদাতা হিসেবে নিবন্ধন করার কথা বিবেচনা করুন!">
                    ${languageManager.getText('No donors found matching your criteria. Consider registering as a donor!', 'আপনার মানদণ্ড অনুযায়ী কোনো রক্তদাতা পাওয়া যাচ্ছে না। রক্তদাতা হিসেবে নিবন্ধন করার কথা বিবেচনা করুন!')}
                </p>
            `;
        } else {
            resultsContent.innerHTML = filtered.map(donor => this.createDonorCard(donor)).join('');
        }
        
        languageManager.updatePageLanguage();
    }
    
    createDonorCard(donor) {
        const lastDonated = donor.last_donated_date 
            ? new Date(donor.last_donated_date).toLocaleDateString(languageManager.currentLanguage === 'bn' ? 'bn-BD' : 'en-US')
            : languageManager.getText('N/A', 'তথ্য নেই');
        
        const statusText = donor.is_available 
            ? languageManager.getText('Available', 'সক্রিয়')
            : languageManager.getText('Unavailable', 'অনুপলব্ধ');
        
        const statusClass = donor.is_available ? 'available' : 'unavailable';
        
        return `
            <div class="donor-card">
                <div class="donor-header">
                    <div>
                        <div class="donor-name">${donor.name}</div>
                        <div class="donor-location">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                                <circle cx="12" cy="10" r="3"/>
                            </svg>
                            <span>${donor.area}, ${donor.city}</span>
                        </div>
                    </div>
                    <div class="blood-badge">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M19 14c1.49-1.46 3-3.46 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.04 1.51 4.04 3 5.5"/>
                        </svg>
                        ${donor.blood_group}
                    </div>
                </div>
                <div class="donor-details">
                    <div class="donor-detail">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                        </svg>
                        <span>${donor.phone}</span>
                    </div>
                    <div class="donor-detail">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                            <line x1="16" y1="2" x2="16" y2="6"/>
                            <line x1="8" y1="2" x2="8" y2="6"/>
                            <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                        <span>${languageManager.getText('Last: ' + lastDonated, 'সর্বশেষ: ' + lastDonated)}</span>
                    </div>
                </div>
                <div style="margin-top: 12px; display: flex; justify-content: flex-end;">
                    <span class="availability-badge ${statusClass}">${statusText}</span>
                </div>
            </div>
        `;
    }
    
    handleRegister() {
        const form = document.getElementById('registerForm');
        const messageEl = document.getElementById('registerMessage');
        
        const donor = {
            name: document.getElementById('donorName').value,
            phone: document.getElementById('donorPhone').value,
            blood_group: document.getElementById('donorBloodGroup').value,
            area: document.getElementById('donorArea').value,
            city: document.getElementById('donorCity').value,
            last_donated_date: document.getElementById('lastDonated').value || null,
            is_available: document.getElementById('isAvailable').checked
        };
        
        if (!donor.name || !donor.phone || !donor.blood_group || !donor.area || !donor.city) {
            messageEl.textContent = languageManager.getText(
                'Please fill all required fields',
                'দয়া করে সমস্ত প্রয়োজনীয় ক্ষেত্র পূরণ করুন'
            );
            messageEl.className = 'register-message error';
            messageEl.style.display = 'block';
            return;
        }
        
        this.donors.push(donor);
        localStorage.setItem('donors', JSON.stringify(this.donors));
        
        messageEl.textContent = languageManager.getText(
            '✓ Registration successful! Thank you for becoming a blood donor.',
            '✓ নিবন্ধন সফল! রক্তদাতা হওয়ার জন্য আপনাকে ধন্যবাদ।'
        );
        messageEl.className = 'register-message success';
        messageEl.style.display = 'block';
        
        form.reset();
        
        setTimeout(() => {
            this.switchView('search');
        }, 2000);
    }
    
    loadDonorsFromLocalStorage() {
        const sampleDonors = [
            {
                name: 'Ahmed Hassan',
                phone: '01712345678',
                blood_group: 'O+',
                area: 'Mirpur',
                city: 'Dhaka',
                last_donated_date: '2026-03-10',
                is_available: true
            },
            {
                name: 'রহিম আহমেদ',
                phone: '01812345678',
                blood_group: 'A+',
                area: 'চট্টগ্রাম সদর',
                city: 'Chittagong',
                last_donated_date: '2026-02-15',
                is_available: true
            },
            {
                name: 'Fatima Khan',
                phone: '01612345678',
                blood_group: 'B+',
                area: 'Dhanmondi',
                city: 'Dhaka',
                last_donated_date: '2026-01-20',
                is_available: false
            },
            {
                name: 'কবির হোসেন',
                phone: '01512345678',
                blood_group: 'O-',
                area: 'সিলেট সদর',
                city: 'Sylhet',
                last_donated_date: '2026-03-05',
                is_available: true
            },
            {
                name: 'Sarita Dey',
                phone: '01412345678',
                blood_group: 'AB+',
                area: 'Rajshahi',
                city: 'Rajshahi',
                last_donated_date: '2026-02-28',
                is_available: true
            },
            {
                name: 'নাজমুল হক',
                phone: '01912345678',
                blood_group: 'B-',
                area: 'খুলনা',
                city: 'Khulna',
                last_donated_date: null,
                is_available: true
            }
        ];
        
        const saved = localStorage.getItem('donors');
        if (!saved) {
            this.donors = sampleDonors;
            localStorage.setItem('donors', JSON.stringify(sampleDonors));
        } else {
            this.donors = JSON.parse(saved);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new BloodDonorApp();
});
