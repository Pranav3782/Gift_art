"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip"
import { Facebook, Instagram, Linkedin, Moon, Send, Sun, Twitter } from "lucide-react"

function Footerdemo() {
  const [isDarkMode, setIsDarkMode] = React.useState(false)

  // Sync state with document on mount to handle hydration and persisted themes
  React.useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark")
    setIsDarkMode(isDark)
  }, [])

  // Apply theme change
  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])

  return (
    <footer className="relative border-t bg-background text-foreground transition-colors duration-300">
      <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <h2 className="mb-4 text-3xl font-black tracking-tight">Stay Connected</h2>
            <p className="mb-6 text-muted-foreground font-medium">
              Join our newsletter for the latest updates and exclusive offers from GiftArtStudio.
            </p>
            <form className="relative" onSubmit={(e) => e.preventDefault()}>
              <Input
                type="email"
                placeholder="Enter your email"
                className="pr-12 backdrop-blur-sm rounded-xl h-12 border-2"
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-1 top-1 h-10 w-10 rounded-lg bg-primary-foreground text-white transition-transform hover:scale-105"
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Subscribe</span>
              </Button>
            </form>
            <div className="absolute -right-4 top-0 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
          </div>
          <div>
            <h3 className="mb-4 text-lg font-black uppercase tracking-widest">Quick Links</h3>
            <nav className="space-y-3 text-sm font-bold">
              <a href="/" className="block transition-colors hover:text-sky-600">
                Home
              </a>
              <a href="/about" className="block transition-colors hover:text-sky-600">
                About Us
              </a>
              <a href="/collections" className="block transition-colors hover:text-sky-600">
                Collections
              </a>
              <a href="/customization" className="block transition-colors hover:text-sky-600">
                Personalization
              </a>
              <a href="/contact" className="block transition-colors hover:text-sky-600">
                Contact
              </a>
            </nav>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-black uppercase tracking-widest">Contact Us</h3>
            <address className="space-y-3 text-sm not-italic font-bold text-slate-500">
              <p>42, Creative Hub, Sector 62</p>
              <p>Noida, UP - 201301</p>
              <p>Phone: +91 98765 43210</p>
              <p>Email: care@giftartstudio.com</p>
            </address>
          </div>
          <div className="relative">
            <h3 className="mb-4 text-lg font-black uppercase tracking-widest">Follow Us</h3>
            <div className="mb-6 flex space-x-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-xl border-2 hover:bg-sky-50">
                      <Facebook className="h-4 w-4" />
                      <span className="sr-only">Facebook</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Follow us on Facebook</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-xl border-2 hover:bg-sky-50">
                      <Twitter className="h-4 w-4" />
                      <span className="sr-only">Twitter</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Follow us on Twitter</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-xl border-2 hover:bg-sky-50">
                      <Instagram className="h-4 w-4" />
                      <span className="sr-only">Instagram</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Follow us on Instagram</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-xl border-2 hover:bg-sky-50">
                      <Linkedin className="h-4 w-4" />
                      <span className="sr-only">LinkedIn</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Connect with us on LinkedIn</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-center space-x-2">
              <Sun className="h-4 w-4 text-amber-500" />
              <Switch
                id="dark-mode"
                checked={isDarkMode}
                onCheckedChange={setIsDarkMode}
              />
              <Moon className="h-4 w-4 text-indigo-500" />
              <Label htmlFor="dark-mode" className="sr-only">
                Toggle dark mode
              </Label>
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 text-center md:flex-row">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            © 2024 GiftArtStudio. All rights reserved.
          </p>
          <nav className="flex gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <a href="/privacy-policy" className="transition-colors hover:text-sky-600">
              Privacy Policy
            </a>
            <a href="/terms-conditions" className="transition-colors hover:text-sky-600">
              Terms & Conditions
            </a>
            <a href="/faqs" className="transition-colors hover:text-sky-600">
              Help Center
            </a>
          </nav>
        </div>
      </div>
    </footer>
  )
}

export { Footerdemo }