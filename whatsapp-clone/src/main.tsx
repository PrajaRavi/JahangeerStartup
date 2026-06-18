import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './Redux/Stores/Store.files.ts'
import {Bounce, ToastContainer} from "react-toastify"
import { ThemeProvider } from './context/theme.context.tsx'
createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
<ThemeProvider>
    <StrictMode>
    <App />

    </StrictMode>
<ToastContainer
position="top-right"
autoClose={3000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick={false}
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="dark"
transition={Bounce}
/>
</ThemeProvider>
    </Provider>
)
