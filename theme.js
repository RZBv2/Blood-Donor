const themeManager = {
    themeName: 'light-theme',
    
    init() {
        const saved = localStorage.getItem('theme');
        if (saved) {
            this.themeName = saved;
        } else {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                this.themeName = 'dark-theme';
            }
        }
        
        this.apply();
        
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggle());
        }
        
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.themeName = e.matches ? 'dark-theme' : 'light-theme';
                this.apply();
            }
        });
    },
    
    apply() {
        document.body.className = this.themeName;
        localStorage.setItem('theme', this.themeName);
    },
    
    toggle() {
        this.themeName = this.themeName === 'light-theme' ? 'dark-theme' : 'light-theme';
        this.apply();
    },
    
    setTheme(theme) {
        this.themeName = theme;
        this.apply();
    },
    
    isDark() {
        return this.themeName === 'dark-theme';
    }
};

document.addEventListener('DOMContentLoaded', () => {
    themeManager.init();
});
