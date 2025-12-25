export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-4">ShowSphere</h3>
            <p className="text-primary-foreground/80 text-sm">
              Your ultimate destination for movies, events, and entertainment
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Browse</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>
                <a href="#" className="hover:text-accent transition">
                  Movies
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition">
                  Events
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition">
                  Activities
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>
                <a href="#" className="hover:text-accent transition">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition">
                  FAQs
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>
                <a href="#" className="hover:text-accent transition">
                  Terms
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition">
                  Cancellation
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-primary-foreground/20 pt-8 text-center text-sm text-primary-foreground/80">
          <p>&copy; 2025 ShowSphere. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
