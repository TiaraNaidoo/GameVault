/* import Reacts developemnt helper
StrictMode id possible issues/problems/errors during dev
*/
import { StrictMode } from 'react'

/*
createRoot is imported to attach the react app to the client
what is the client? its the browser
*/
import { createRoot } from 'react-dom/client'

/*
BrowserRouter enables React Router - lets different URLs
(/games, /games/:id, /profile, etc.) render different pages
without a full page reload.
*/
import { BrowserRouter } from 'react-router-dom'

/*
index.css is GLOBAL styling file  -> any .css file is styling file but index.css is GLOBAL
*/
import './index.css'

/*
main gamevault frontend component
*/
import App from './App.jsx'

/*
find html element with the root id

Why important? so that gamevault knows where to point and what not to follow
according to App
=
places the complete gamevault interface inside this element
*/
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
        <App />
    </BrowserRouter>
  </StrictMode>,
)
