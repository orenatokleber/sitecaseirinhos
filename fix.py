import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]
new_menu = '''    <!-- Mobile Menu -->
    <div class="mobile-menu" id="mobileMenu">
        <div class="mobile-menu-overlay" id="mobileOverlay"></div>
        <div class="mobile-menu-panel">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                <img src="images/logo-DZPmG4Qm.png" alt="Caseirinhos" style="height: 40px; width: auto;">
                <button onclick="closeMobileMenu()" style="background:none; border:none; font-size:1.5rem; color:hsl(var(--foreground)); cursor:pointer;"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <a href="/" onclick="closeMobileMenu()"><i class="fa-solid fa-house" style="width:24px; color:hsl(var(--primary));"></i> Início</a>
            <a href="/nossa-historia" onclick="closeMobileMenu()"><i class="fa-solid fa-heart" style="width:24px; color:hsl(var(--primary));"></i> Nossa História</a>
            <a href="/cardapio" onclick="closeMobileMenu()"><i class="fa-solid fa-cake-candles" style="width:24px; color:hsl(var(--primary));"></i> Cardápio</a>
            <a href="/montar-pedido" onclick="closeMobileMenu()"><i class="fa-solid fa-shopping-bag" style="width:24px; color:hsl(var(--primary));"></i> Montar Pedido</a>
            <a href="/contato" onclick="closeMobileMenu()"><i class="fa-solid fa-envelope" style="width:24px; color:hsl(var(--primary));"></i> Contato</a>
        </div>
    </div>'''

for f in html_files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # 1. Remove nav-cta button
    content = re.sub(r'\s*<a href="/montar-pedido" class="nav-cta".*?</a>', '', content, flags=re.DOTALL)
    
    # 2. Replace Mobile Menu (only in plain html files, not montar-pedido because it is tailwind)
    if f != 'montar-pedido.html':
        content = re.sub(r'    <!-- Mobile Menu -->.*?</div>\n    </div>', new_menu, content, flags=re.DOTALL)
        # 3. Remove JS scroll shadow
        content = re.sub(r'\s*// Navbar scroll shadow.*?}\);', '', content, flags=re.DOTALL)
    
    # 4. If montar-pedido, remove its specific Tailwind CTAs
    if f == 'montar-pedido.html':
        # Remove desktop cta
        content = re.sub(r'\s*<a class="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold font-body transition-all duration-300 shadow-sm border bg-accent/10 text-accent border-accent/30 hover:bg-accent/20" href="/montar-pedido">.*?</a>', '', content, flags=re.DOTALL)
        # Remove mobile cta
        content = re.sub(r'\s*<a class="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold font-body bg-primary text-white shadow-md mt-2" href="/montar-pedido" onclick="toggleMobileNav\(\)">.*?</a>', '', content, flags=re.DOTALL)
        
    with open(f, 'w', encoding='utf-8', newline='\n') as file:
        file.write(content)
