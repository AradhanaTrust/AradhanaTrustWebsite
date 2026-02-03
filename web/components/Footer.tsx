export default function Footer() {
    return (
        <footer className="bg-primary-dark text-white border-t border-white/10 pt-16 pb-8">
            <div className="container mx-auto px-4 lg:px-12">
                <div className="grid md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-primary font-bold">A</div>
                            <h2 className="font-serif font-bold text-xl">ARADHANA</h2>
                        </div>
                        <p className="text-white/60 text-sm leading-relaxed max-w-md">
                            Preserving our heritage, promoting spiritual values, and serving humanity through Dharma.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="font-serif font-bold text-secondary tracking-widest text-sm">QUICK LINKS</h4>
                        <ul className="space-y-2 text-sm text-white/60">
                            <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Temple Activities</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Donate</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div className="space-y-4">
                        <h4 className="font-serif font-bold text-secondary tracking-widest text-sm">LEGAL</h4>
                        <ul className="space-y-2 text-sm text-white/60">
                            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Terms & Conditions</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Refund Policy</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/40">
                    <p>© 2026 Aradhana Dharmika Trust. All rights reserved.</p>
                    <p>Designed with Devotion.</p>
                </div>
            </div>
        </footer>
    );
}
