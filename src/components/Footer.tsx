// src/components/Footer.tsx - Updated without WhatsApp button
import React from 'react';
import { projects, getProjectCounts } from '../data/projects.js';
import logoImage from '../assets/projects/logo.webp';

const Footer: React.FC = () => {
  const projectCounts = getProjectCounts();
  const currentYear = new Date().getFullYear();
  const emaarProjects = projects.filter(p => p.location === 'Emaar');
  const hmrProjects = projects.filter(p => p.location === 'HMR');

  return (
    <>
      {/* Footer Separator - Updated gradient */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent"></div>
      
      <footer className="relative w-full bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 py-16">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%), 
                             radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%)`
          }}></div>
        </div>
        
        <div className="relative mx-auto w-full max-w-7xl px-8">
          
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-16">
            
            {/* Company Logo and Info */}
            <div className="lg:col-span-1">
              <div className="mb-8">
                <img 
                  src={logoImage.src} 
                  alt="BYG Logo" 
                  className="h-16 w-auto mb-4 filter brightness-0 invert"
                />
              </div>
            </div>

            {/* Pages Column - Updated with new structure */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-6 uppercase tracking-wider">
                PAGES
              </h3>
              <nav className="space-y-4">
                {/* Panorama */}
                <a 
                  href="/projects/panorama" 
                  className="block text-neutral-300 hover:text-white transition-colors duration-300 text-sm hover:translate-x-1 transform"
                >
                  Panorama
                </a>
                
                {/* The Views */}
                <a 
                  href="/projects/the-views" 
                  className="block text-neutral-300 hover:text-white transition-colors duration-300 text-sm hover:translate-x-1 transform"
                >
                  The Views
                </a>
                
                {/* AA Waterfront */}
                <a 
                  href="/projects/aa-waterfront" 
                  className="block text-neutral-300 hover:text-white transition-colors duration-300 text-sm hover:translate-x-1 transform"
                >
                  AA Waterfront
                </a>
                
                {/* About Us */}
                <a 
                  href="/about" 
                  className="block text-neutral-300 hover:text-white transition-colors duration-300 text-sm hover:translate-x-1 transform"
                >
                  About Us
                </a>
                
                {/* Privacy Policy */}
                <a 
                  href="/privacy-policy" 
                  className="block text-neutral-300 hover:text-white transition-colors duration-300 text-sm hover:translate-x-1 transform"
                >
                  Privacy Policy
                </a>
              </nav>
            </div>

            {/* Follow Us Column */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-6 uppercase tracking-wider">
                FOLLOW US
              </h3>
              <nav className="space-y-4">
                <a 
                  href="https://www.linkedin.com/company/bin-yousuf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-neutral-300 hover:text-blue-300 transition-colors duration-300 text-sm hover:translate-x-1 transform"
                >
                  LinkedIn
                </a>
                <a 
                  href="https://www.instagram.com/binyousuf.group" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-neutral-300 hover:text-blue-300 transition-colors duration-300 text-sm hover:translate-x-1 transform"
                >
                  Instagram
                </a>
                <a 
                  href="https://www.instagram.com/binyousuf.group" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-neutral-300 hover:text-blue-300 transition-colors duration-300 text-sm hover:translate-x-1 transform"
                >
                  Facebook
                </a>
                <a 
                  href="https://www.instagram.com/binyousuf.group" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-neutral-300 hover:text-blue-300 transition-colors duration-300 text-sm hover:translate-x-1 transform"
                >
                  YouTube
                </a>
                <a 
                  href="mailto:info@binyousufgroup.com"
                  className="block text-neutral-300 hover:text-blue-300 transition-colors duration-300 text-sm hover:translate-x-1 transform"
                >
                  info@binyousufgroup.com
                </a>
              </nav>
            </div>

            {/* Contact Information Column - Replaces WhatsApp button */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-6 uppercase tracking-wider">
                CONTACT
              </h3>
              <div className="space-y-4">
                <div className="text-neutral-300">
                  <p className="text-sm mb-2">Phone:</p>
                  <a 
                    href="tel:+923360878079"
                    className="text-white hover:text-blue-300 transition-colors duration-300 font-medium"
                  >
                    +92 336 0878079
                  </a>
                </div>
                <div className="text-neutral-300">
                  <p className="text-sm mb-2">Email:</p>
                  <a 
                    href="mailto:info@binyousufgroup.com"
                    className="text-white hover:text-blue-300 transition-colors duration-300 font-medium"
                  >
                    info@binyousufgroup.com
                  </a>
                </div>
                <div className="text-neutral-300">
                  <p className="text-sm mb-2">Location:</p>
                  <p className="text-white text-sm">
                    DHA Phase 8, Karachi
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
                      <div className="border-t border-blue-600 pt-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              
              {/* Copyright */}
              <div className="text-sm text-neutral-400">
                © {currentYear} Bin Yousuf Group™ — All Rights Reserved · With{' '}
                <span className="text-red-400">❤</span> from{' '}
                <a 
                  href="https://otherdev.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-neutral-300 hover:text-white transition-colors duration-300 underline hover:no-underline"
                >
                  The Other Dev
                </a>
              </div>

              {/* Social Media Icons - Enhanced */}
              <div className="flex gap-4">
                
                {/* Facebook */}
                <a 
                  href="https://www.instagram.com/binyousuf.group" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-blue-300 transition-all duration-300 p-2 rounded-none hover:bg-blue-400/10 hover:scale-110 transform"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>

                {/* LinkedIn */}
                <a 
                  href="https://www.linkedin.com/company/bin-yousuf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-blue-300 transition-all duration-300 p-2 rounded-none hover:bg-blue-400/10 hover:scale-110 transform"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>

                {/* Instagram */}
                <a href="https://www.instagram.com/binyousuf.group" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-blue-300 transition-all duration-300 p-2 rounded-none hover:bg-blue-400/10 hover:scale-110 transform"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>

                {/* YouTube */}
                <a 
                  href="https://www.instagram.com/binyousuf.group" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-blue-300 transition-all duration-300 p-2 rounded-none hover:bg-blue-400/10 hover:scale-110 transform"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;