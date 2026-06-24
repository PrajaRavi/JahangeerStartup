import { useTheme } from '../context/theme.context'
import logo from "../assets/logo.png"
import logo1 from "../assets/logo1.png"
import { CopyrightIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'


function Footer() {
  const {dark}=useTheme()
  const { t } =
      useTranslation();
  
  return (
    <footer id="Contact" className="border-t  border-white/10 mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid md:grid-cols-4 gap-8">
          <div>
                      <img src={dark?logo1:logo} className="md:h-25 h-15" />

            <p>{t("professional_solutions")}.</p>
          </div>

          <div>
            <h4 className="font-bold mb-4">{t('company')}</h4>
            <ul className="space-y-2">
              <li>{t("about")}</li>
              {/* <li>{t("pricing")}</li> */}
              <li>{t("contact")}</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">{t("services")}</h4>
            <ul className="space-y-2">
              <li>{t("wash_fold")}</li>
              <li>{t("wash_iron")}</li>
              <li>{t("bag_cleaning")}</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">{t("contact")}</h4>
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
