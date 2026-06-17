import { useTheme } from '../context/theme.context'
import logo from "../assets/logo.png"
import logo1 from "../assets/logo1.png"
import { CopyrightIcon } from 'lucide-react'


function Footer() {
  const {dark}=useTheme()
  return (
    <footer id="Contact" className="border-t  border-white/10 mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid md:grid-cols-4 gap-8">
          <div>
                      <img src={dark?logo1:logo} className="md:h-25 h-15" />

            <p>Professional laundry solutions.</p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2">
              <li>About</li>
              <li>Pricing</li>
              <li>Contact</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Services</h4>
            <ul className="space-y-2">
              <li>Dry Cleaning</li>
              <li>Ironing</li>
              <li>Wash & Fold</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <p>support@laundry.com</p>
          </div>
        </div>
        <div className='text-center flex items-center justify-center gap-1 pb-5'>
          <CopyrightIcon/> 2026 MyDhobi.com All rights reserved
        </div>
      </footer>
  )
}

export default Footer
