const languageManager = {
    currentLanguage: localStorage.getItem('selectedLanguage') || 'bn',
    
    init() {
        this.setLanguage(this.currentLanguage);
        document.getElementById('languageSelect').addEventListener('change', (e) => {
            this.setLanguage(e.target.value);
        });
    },
    
    setLanguage(lang) {
        this.currentLanguage = lang;
        localStorage.setItem('selectedLanguage', lang);
        document.getElementById('languageSelect').value = lang;
        this.updatePageLanguage();
    },
    
    updatePageLanguage() {
        const elements = document.querySelectorAll('[data-en][data-bn]');
        elements.forEach(element => {
            const text = element.getAttribute(`data-${this.currentLanguage}`);
            if (text) {
                element.textContent = text;
            }
        });
        
        this.updateFormElements();
        
        document.documentElement.lang = this.currentLanguage;
        document.documentElement.dir = this.currentLanguage === 'bn' ? 'ltr' : 'ltr';
    },
    
    updateFormElements() {
        const options = document.querySelectorAll('option[data-en][data-bn]');
        options.forEach(option => {
            const text = option.getAttribute(`data-${this.currentLanguage}`);
            if (text) {
                option.textContent = text;
            }
        });
    },
    
    getText(enText, bnText) {
        return this.currentLanguage === 'bn' ? bnText : enText;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    languageManager.init();
});
